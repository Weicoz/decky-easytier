import asyncio
import os
import re
import socket
import subprocess
from typing import Any, Dict, List, Optional

try:
    import decky
except ImportError:
    class DeckyMock:
        logger = None
        DECKY_USER_HOME = "/home/deck"
        DECKY_PLUGIN_DIR = "/home/deck/homebrew/plugins/decky-easytier"
    decky = DeckyMock()


EASYTIER_CORE = "/home/deck/.local/bin/easytier-core"
EASYTIER_CLI = "/home/deck/.local/bin/easytier-cli"
CONFIG_PATH = "/home/deck/.config/easytier/config.toml"
WEB_PORT = 21010

SYSTEMCTL = "/usr/bin/systemctl"
PGREP = "/usr/bin/pgrep"
PYTHON3 = "/usr/bin/python3"
ENV = dict(os.environ, PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin")


class Plugin:
    def __init__(self):
        self.web_process: Optional[subprocess.Popen] = None

    async def _main(self):
        # 确保二进制执行权限
        if os.path.exists(EASYTIER_CORE):
            os.system(f"chmod 4755 {EASYTIER_CORE} 2>/dev/null")
            os.system(f"setcap cap_net_admin,cap_net_bind_service+ep {EASYTIER_CORE} 2>/dev/null")

        # 开启 Linux 内核 IPv4 转发 (游戏广播/出口节点必备)
        try:
            subprocess.run(["/usr/bin/sysctl", "-w", "net.ipv4.ip_forward=1"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=ENV)
        except Exception:
            pass

        # 启动独立的 Web Dashboard 进程 (通过系统原生 Python3)
        self._start_web_server()

    async def _unload(self):
        self._stop_web_server()

    def _start_web_server(self):
        try:
            web_script = os.path.join(decky.DECKY_PLUGIN_DIR, "web_server.py")
            if not os.path.exists(web_script):
                web_script = "/home/deck/homebrew/plugins/decky-easytier/web_server.py"

            if os.path.exists(web_script):
                res = subprocess.run([PGREP, "-f", "web_server.py"], capture_output=True, env=ENV)
                if res.returncode != 0:
                    self.web_process = subprocess.Popen(
                        [PYTHON3, web_script],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                        env=ENV
                    )
        except Exception:
            pass

    def _stop_web_server(self):
        if self.web_process:
            try:
                self.web_process.terminate()
            except Exception:
                pass
            self.web_process = None
        try:
            subprocess.run(["pkill", "-f", "web_server.py"], env=ENV)
        except Exception:
            pass

    def _sync_get_service_status(self) -> Dict[str, Any]:
        active_status = ""
        is_active = False
        is_enabled = False

        try:
            res = subprocess.run([SYSTEMCTL, "is-active", "easytier"], capture_output=True, text=True, env=ENV)
            active_status = res.stdout.strip()
            is_active = (active_status == "active")
        except Exception:
            pass

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

        # 若服务激活但 web_server 异常退出，自愈拉起
        if is_active:
            try:
                res_w = subprocess.run([PGREP, "-f", "web_server.py"], capture_output=True, env=ENV)
                if res_w.returncode != 0:
                    self._start_web_server()
            except Exception:
                pass

        return {
            "installed": os.path.exists(EASYTIER_CORE) and os.path.exists(CONFIG_PATH),
            "active": is_active,
            "status": active_status,
            "enabled": is_enabled,
        }

    async def get_service_status(self) -> Dict[str, Any]:
        return await asyncio.to_thread(self._sync_get_service_status)

    async def start_service(self) -> bool:
        def _run():
            return subprocess.run([SYSTEMCTL, "start", "easytier"], env=ENV).returncode == 0
        try:
            return await asyncio.to_thread(_run)
        except Exception:
            return False

    async def stop_service(self) -> bool:
        def _run():
            return subprocess.run([SYSTEMCTL, "stop", "easytier"], env=ENV).returncode == 0
        try:
            return await asyncio.to_thread(_run)
        except Exception:
            return False

    async def restart_service(self) -> bool:
        def _run():
            return subprocess.run([SYSTEMCTL, "restart", "easytier"], env=ENV).returncode == 0
        try:
            return await asyncio.to_thread(_run)
        except Exception:
            return False

    async def toggle_autostart(self, enable: bool) -> bool:
        action = "enable" if enable else "disable"
        def _run():
            return subprocess.run([SYSTEMCTL, action, "easytier"], env=ENV).returncode == 0
        try:
            return await asyncio.to_thread(_run)
        except Exception:
            return False

    def _sync_get_node_info(self) -> Dict[str, Any]:
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
                    if "Virtual IP" in k: data["virtual_ip"] = v
                    elif "Hostname" in k: data["hostname"] = v
                    elif "Peer ID" in k: data["peer_id"] = v
                    elif "Public IPv4" in k: data["public_ipv4"] = v
                    elif "UDP Stun Type" in k: data["nat_type"] = v
                    elif "Listener" in k: data["listeners"].append(v)
            return data
        except Exception as e:
            return {"error": str(e)}

    async def get_node_info(self) -> Dict[str, Any]:
        return await asyncio.to_thread(self._sync_get_node_info)

    def _sync_get_peers(self) -> List[Dict[str, Any]]:
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
            for line in lines[2:]:
                parts = [p.strip() for p in line.split("|")[1:-1]]
                if len(parts) >= 10:
                    ipv4, hostname, cost, lat, loss, rx, tx, tunnel, nat, version = parts[:10]
                    if ipv4 == "ipv4" or "---" in ipv4:
                        continue
                    peers.append({
                        "ipv4": ipv4, "hostname": hostname, "cost": cost,
                        "latency": lat, "loss": loss, "rx": rx, "tx": tx,
                        "tunnel": tunnel, "nat": nat, "version": version
                    })
            return peers
        except Exception:
            return []

    async def get_peers(self) -> List[Dict[str, Any]]:
        return await asyncio.to_thread(self._sync_get_peers)

    def _sync_ping_target(self, target_ip: str) -> Dict[str, Any]:
        if not re.match(r"^(\d{1,3}\.){3}\d{1,3}$", target_ip):
            return {"success": False, "error": "Invalid IP format"}
        try:
            res = subprocess.run(
                ["ping", "-c", "3", "-W", "2", target_ip],
                capture_output=True, text=True, timeout=5, env=ENV
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

    async def ping_target(self, target_ip: str) -> Dict[str, Any]:
        return await asyncio.to_thread(self._sync_ping_target, target_ip)

    def _sync_get_config(self) -> str:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return f.read()
        return ""

    async def get_config(self) -> str:
        return await asyncio.to_thread(self._sync_get_config)

    def _sync_save_config(self, content: str) -> bool:
        try:
            os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
            with open(CONFIG_PATH, "w", encoding="utf-8") as f:
                f.write(content)
            subprocess.run([SYSTEMCTL, "restart", "easytier"], env=ENV)
            return True
        except Exception:
            return False

    async def save_config(self, content: str) -> bool:
        return await asyncio.to_thread(self._sync_save_config, content)

    async def get_quick_config(self) -> Dict[str, Any]:
        """解析并返回结构化核心配置"""
        content = await self.get_config()
        data = {
            "network_name": "",
            "network_secret": "",
            "hostname": "steamdeck",
            "ipv4": "",
            "dhcp": False,
            "peers": [],
            "latency_first": True,
            "enable_udp_broadcast_relay": True,
            "use_smoltcp": True,
            "enable_exit_node": True,
            "disable_quic_input": True,
            "disable_kcp_input": True
        }

        m_name = re.search(r'^\s*network_name\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
        if m_name:
            data["network_name"] = m_name.group(1)

        m_sec = re.search(r'^\s*network_secret\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
        if m_sec:
            data["network_secret"] = m_sec.group(1)

        m_host = re.search(r'^\s*hostname\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
        if m_host:
            data["hostname"] = m_host.group(1)

        m_ip = re.search(r'^\s*ipv4\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
        if m_ip:
            data["ipv4"] = m_ip.group(1)

        m_dhcp = re.search(r'^\s*dhcp\s*=\s*(true|false)', content, re.MULTILINE | re.IGNORECASE)
        if m_dhcp:
            data["dhcp"] = (m_dhcp.group(1).lower() == "true")

        peers = re.findall(r'\[\[peer\]\][\s\S]*?uri\s*=\s*["\']([^"\']+)["\']', content)
        data["peers"] = peers

        for flag in ["latency_first", "enable_udp_broadcast_relay", "use_smoltcp", "enable_exit_node", "disable_quic_input", "disable_kcp_input"]:
            m_f = re.search(rf'^\s*{flag}\s*=\s*(true|false)', content, re.MULTILINE | re.IGNORECASE)
            if m_f:
                data[flag] = (m_f.group(1).lower() == "true")

        return data

    async def save_quick_config(self, cfg: Dict[str, Any]) -> bool:
        """根据结构化参数保存为标准 config.toml 并重载服务"""
        net_name = cfg.get("network_name", "").strip()
        net_secret = cfg.get("network_secret", "").strip()
        hostname = cfg.get("hostname", "steamdeck").strip() or "steamdeck"
        ipv4 = cfg.get("ipv4", "").strip()
        peers = cfg.get("peers", [])

        if not isinstance(peers, list):
            peers = [p.strip() for p in str(peers).splitlines() if p.strip()]

        if not peers:
            peers = [
                "tcp://public.easytier.top:11010",
                "tcp://39.108.52.138:11010"
            ]

        lines = [
            f'hostname = "{hostname}"',
            f'ipv6_public_addr_auto = true',
            f'dhcp = false' if ipv4 else 'dhcp = true',
            f'listeners = ["tcp://0.0.0.0:11010", "udp://0.0.0.0:11010", "wg://0.0.0.0:11011"]',
        ]
        if ipv4:
            lines.append(f'ipv4 = "{ipv4}"')

        lines.extend([
            "",
            "[network_identity]",
            f'network_name = "{net_name}"',
            f'network_secret = "{net_secret}"',
            ""
        ])

        for p in peers:
            if p:
                lines.append("[[peer]]")
                lines.append(f'uri = "{p}"')

        lines.extend([
            "",
            "[flags]",
            f'latency_first = {"true" if cfg.get("latency_first", True) else "false"}',
            f'enable_udp_broadcast_relay = {"true" if cfg.get("enable_udp_broadcast_relay", True) else "false"}',
            f'use_smoltcp = {"true" if cfg.get("use_smoltcp", True) else "false"}',
            f'enable_exit_node = {"true" if cfg.get("enable_exit_node", True) else "false"}',
            f'disable_quic_input = {"true" if cfg.get("disable_quic_input", True) else "false"}',
            f'disable_kcp_input = {"true" if cfg.get("disable_kcp_input", True) else "false"}',
            'proxy_forward_by_system = true',
            'relay_all_peer_rpc = true',
            'accept_dns = true',
            ""
        ])

        return await self.save_config("\n".join(lines))

    async def open_web_ui(self) -> bool:
        """在 SteamOS 中唤起 WebUI 浏览器"""
        self._start_web_server()
        url = f"http://127.0.0.1:{WEB_PORT}"
        try:
            subprocess.Popen(["steam", f"steam://openurl/{url}"], env=ENV)
            return True
        except Exception:
            pass

        try:
            subprocess.Popen(["/usr/bin/xdg-open", url], env=ENV)
            return True
        except Exception:
            return False

    async def get_web_info(self) -> Dict[str, Any]:
        """获取 WebUI 服务信息与智能分类局域网 IP"""
        wifi_ips = []
        tun_ips = []
        other_ips = []

        try:
            res = subprocess.run(["/usr/bin/ip", "-4", "-o", "addr", "show"], capture_output=True, text=True, env=ENV)
            if res.returncode == 0:
                for line in res.stdout.splitlines():
                    parts = line.strip().split()
                    if len(parts) >= 4:
                        iface = parts[1]
                        ip = parts[3].split("/")[0]
                        if ip.startswith("127.") or ip.startswith("198.18."):
                            continue
                        if iface.startswith(("wlan", "eth", "enp", "wlp")):
                            wifi_ips.append(ip)
                        elif iface.startswith(("tun", "easytier")):
                            tun_ips.append(ip)
                        else:
                            other_ips.append(ip)
        except Exception:
            pass

        if not wifi_ips:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(("1.1.1.1", 80))
                sock_ip = s.getsockname()[0]
                s.close()
                if sock_ip and not sock_ip.startswith("127.") and not sock_ip.startswith("198.18."):
                    wifi_ips.append(sock_ip)
            except Exception:
                pass

        primary_lan = wifi_ips[0] if wifi_ips else (other_ips[0] if other_ips else "")
        easytier_ip = tun_ips[0] if tun_ips else ""

        all_urls = [f"http://127.0.0.1:{WEB_PORT}"]
        if primary_lan:
            all_urls.append(f"http://{primary_lan}:{WEB_PORT}")
        if easytier_ip:
            all_urls.append(f"http://{easytier_ip}:{WEB_PORT}")

        return {
            "port": WEB_PORT,
            "url_local": f"http://127.0.0.1:{WEB_PORT}",
            "primary_lan": primary_lan,
            "url_lan": f"http://{primary_lan}:{WEB_PORT}" if primary_lan else "",
            "easytier_ip": easytier_ip,
            "url_easytier": f"http://{easytier_ip}:{WEB_PORT}" if easytier_ip else "",
            "urls": all_urls
        }
