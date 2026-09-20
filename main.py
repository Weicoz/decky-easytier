import asyncio
import os
import re
import subprocess
from typing import Any, Dict, List, Optional

try:
    import decky
except ImportError:
    class DeckyMock:
        logger = None
        DECKY_USER_HOME = "/home/deck"
        DECKY_PLUGIN_DIR = "/home/deck/homebrew/plugins/Decky EasyTier"
    decky = DeckyMock()


EASYTIER_CORE = "/home/deck/.local/bin/easytier-core"
EASYTIER_CLI = "/home/deck/.local/bin/easytier-cli"
CONFIG_PATH = "/home/deck/.config/easytier/config.toml"


SYSTEMCTL = "/usr/bin/systemctl"
PGREP = "/usr/bin/pgrep"
ENV = dict(os.environ, PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin")


class Plugin:
    async def _main(self):
        # 确保权限
        if os.path.exists(EASYTIER_CORE):
            os.system(f"chmod 4755 {EASYTIER_CORE} 2>/dev/null")
            os.system(f"setcap cap_net_admin,cap_net_bind_service+ep {EASYTIER_CORE} 2>/dev/null")

    async def _unload(self):
        pass

    async def get_service_status(self) -> Dict[str, Any]:
        """获取 systemd 服务与进程状态"""
        active_status = ""
        is_active = False
        is_enabled = False

        try:
            res = subprocess.run([SYSTEMCTL, "is-active", "easytier"], capture_output=True, text=True, env=ENV)
            active_status = res.stdout.strip()
            is_active = (active_status == "active")
        except Exception:
            pass

        # 进程检测兜底
        if not is_active:
            try:
                res_p = subprocess.run([PGREP, "-f", "easytier-core"], capture_output=True, env=ENV)
                if res_p.returncode == 0:
                    is_active = True
                    active_status = "active (process)"
            except Exception:
                pass

        try:
            res_enabled = subprocess.run([SYSTEMCTL, "is-enabled", "easytier"], capture_output=True, text=True, env=ENV)
            is_enabled = (res_enabled.stdout.strip() == "enabled")
        except Exception:
            pass

        return {
            "installed": os.path.exists(EASYTIER_CORE) and os.path.exists(CONFIG_PATH),
            "active": is_active,
            "status": active_status,
            "enabled": is_enabled,
        }

    async def start_service(self) -> bool:
        try:
            res = subprocess.run([SYSTEMCTL, "start", "easytier"], env=ENV)
            return res.returncode == 0
        except Exception:
            return False

    async def stop_service(self) -> bool:
        try:
            res = subprocess.run([SYSTEMCTL, "stop", "easytier"], env=ENV)
            return res.returncode == 0
        except Exception:
            return False

    async def restart_service(self) -> bool:
        try:
            res = subprocess.run([SYSTEMCTL, "restart", "easytier"], env=ENV)
            return res.returncode == 0
        except Exception:
            return False

    async def toggle_autostart(self, enable: bool) -> bool:
        action = "enable" if enable else "disable"
        try:
            res = subprocess.run([SYSTEMCTL, action, "easytier"], env=ENV)
            return res.returncode == 0
        except Exception:
            return False

    async def get_node_info(self) -> Dict[str, Any]:
        """获取本机 EasyTier 节点详细信息"""
        if not os.path.exists(EASYTIER_CLI):
            return {"error": "easytier-cli not found"}

        try:
            res = subprocess.run([EASYTIER_CLI, "node"], capture_output=True, text=True, timeout=3, env=ENV)
            if res.returncode != 0:
                return {"error": res.stderr.strip() or "Failed to run node command"}

            data: Dict[str, Any] = {
                "virtual_ip": "",
                "hostname": "",
                "peer_id": "",
                "public_ipv4": "",
                "nat_type": "",
                "listeners": []
            }

            for line in res.stdout.splitlines():
                parts = [p.strip() for p in line.split("|") if p.strip()]
                if len(parts) >= 2:
                    k, v = parts[0], parts[1]
                    if "Virtual IP" in k:
                        data["virtual_ip"] = v
                    elif "Hostname" in k:
                        data["hostname"] = v
                    elif "Peer ID" in k:
                        data["peer_id"] = v
                    elif "Public IPv4" in k:
                        data["public_ipv4"] = v
                    elif "UDP Stun Type" in k:
                        data["nat_type"] = v
                    elif "Listener" in k:
                        data["listeners"].append(v)

            return data
        except Exception as e:
            return {"error": str(e)}

    async def get_peers(self) -> List[Dict[str, Any]]:
        """获取对端 Peers 节点列表"""
        if not os.path.exists(EASYTIER_CLI):
            return []

        try:
            res = subprocess.run([EASYTIER_CLI, "peer"], capture_output=True, text=True, timeout=3, env=ENV)
            if res.returncode != 0:
                return []

            peers = []
            lines = res.stdout.strip().splitlines()
            if len(lines) < 3:
                return []

            # 表头及分隔线略过
            for line in lines[2:]:
                parts = [p.strip() for p in line.split("|")[1:-1]]
                if len(parts) >= 10:
                    ipv4, hostname, cost, lat, loss, rx, tx, tunnel, nat, version = parts[:10]
                    # 过滤掉表头行或纯分隔行
                    if ipv4 == "ipv4" or "---" in ipv4:
                        continue
                    peers.append({
                        "ipv4": ipv4,
                        "hostname": hostname,
                        "cost": cost,
                        "latency": lat,
                        "loss": loss,
                        "rx": rx,
                        "tx": tx,
                        "tunnel": tunnel,
                        "nat": nat,
                        "version": version
                    })

            return peers
        except Exception:
            return []

    async def ping_target(self, target_ip: str) -> Dict[str, Any]:
        """执行快速 ping 测试"""
        # 安全校验 IPv4 地址格式
        if not re.match(r"^(\d{1,3}\.){3}\d{1,3}$", target_ip):
            return {"success": False, "error": "Invalid IP format"}

        try:
            res = subprocess.run(
                ["ping", "-c", "3", "-W", "2", target_ip],
                capture_output=True,
                text=True,
                timeout=5,
                env=ENV
            )
            out = res.stdout
            if res.returncode == 0:
                m = re.search(r"min/avg/max/[a-z]+ = [\d.]+/([\d.]+)/", out)
                avg = m.group(1) if m else "OK"
                return {"success": True, "avg_ms": avg, "output": out}
            else:
                return {"success": False, "output": res.stderr or out}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_config(self) -> str:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return f.read()
        return ""

    async def save_config(self, content: str) -> bool:
        try:
            os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
            with open(CONFIG_PATH, "w", encoding="utf-8") as f:
                f.write(content)
            # 重启服务使配置生效
            subprocess.run(["systemctl", "restart", "easytier"])
            return True
        except Exception:
            return False
