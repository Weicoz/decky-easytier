#!/usr/bin/env python3
import json
import os
import re
import socket
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

EASYTIER_CORE = "/home/deck/.local/bin/easytier-core"
EASYTIER_CLI = "/home/deck/.local/bin/easytier-cli"
CONFIG_PATH = "/home/deck/.config/easytier/config.toml"
WEB_PORT = 21010
SYSTEMCTL = "/usr/bin/systemctl"
PGREP = "/usr/bin/pgrep"
ENV = dict(os.environ, PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin")

WEB_HTML = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EasyTier Web Console - Steam Deck</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0c1017; color: #e6edf3; padding: 24px; min-height: 100vh; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #21262d; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 700; color: #58a6ff; display: flex; align-items: center; gap: 10px; }
    .badge { font-size: 12px; padding: 4px 10px; border-radius: 12px; font-weight: 600; }
    .badge-active { background: rgba(35, 134, 54, 0.2); color: #3fb950; border: 1px solid #238636; }
    .badge-stopped { background: rgba(218, 54, 51, 0.2); color: #f85149; border: 1px solid #da3633; }
    .btn-group { display: flex; gap: 8px; }
    button { background: #21262d; color: #c9d1d9; border: 1px solid #30363d; border-radius: 6px; padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s; }
    button:hover { background: #30363d; border-color: #8b949e; }
    button.primary { background: #238636; color: #fff; border-color: #2ea043; }
    button.primary:hover { background: #2ea043; }
    button.danger { background: #da3633; color: #fff; border-color: #f85149; }
    button.danger:hover { background: #b62324; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 18px; }
    .card-title { font-size: 16px; font-weight: 600; color: #8b949e; margin-bottom: 14px; display: flex; justify-content: space-between; }
    .kv { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
    .kv:last-child { border-bottom: none; }
    .kv-label { color: #8b949e; }
    .kv-val { font-weight: 500; color: #f0f6fc; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #21262d; }
    th { color: #8b949e; font-weight: 600; }
    tr:hover { background: rgba(255,255,255,0.02); }
    .form-group { margin-bottom: 14px; }
    label { display: block; font-size: 13px; color: #8b949e; margin-bottom: 6px; font-weight: 500; }
    input[type="text"], input[type="password"], textarea { width: 100%; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 8px 12px; color: #c9d1d9; font-size: 14px; }
    input:focus, textarea:focus { outline: none; border-color: #58a6ff; }
    textarea { font-family: monospace; resize: vertical; min-height: 140px; }
    .toast { position: fixed; bottom: 20px; right: 20px; background: #1f6feb; color: #fff; padding: 12px 20px; border-radius: 6px; font-size: 14px; display: none; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">
      <span>🌐 Decky EasyTier</span>
      <span id="status-badge" class="badge badge-stopped">检测中...</span>
    </div>
    <div class="btn-group">
      <button class="primary" onclick="doAction('start')">启动</button>
      <button class="danger" onclick="doAction('stop')">停止</button>
      <button onclick="doAction('restart')">重启</button>
      <button onclick="fetchData()">刷新</button>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">本机节点概览</div>
      <div class="kv"><span class="kv-label">虚拟 IPv4</span><span class="kv-val" id="node-ip">-</span></div>
      <div class="kv"><span class="kv-label">主机名</span><span class="kv-val" id="node-host">-</span></div>
      <div class="kv"><span class="kv-label">Peer ID</span><span class="kv-val" id="node-peer-id">-</span></div>
      <div class="kv"><span class="kv-label">公网 IPv4</span><span class="kv-val" id="node-public-ip">-</span></div>
      <div class="kv"><span class="kv-label">NAT 打洞类型</span><span class="kv-val" id="node-nat">-</span></div>
    </div>

    <div class="card">
      <div class="card-title">快捷网络配置</div>
      <div class="form-group">
        <label>网络名称 (Network Name)</label>
        <input type="text" id="cfg-net-name" placeholder="例如 my-game-net">
      </div>
      <div class="form-group">
        <label>网络密码 (Network Secret)</label>
        <input type="text" id="cfg-net-secret" placeholder="网络访问密钥">
      </div>
      <div class="form-group">
        <label>虚拟 IPv4 (留空自动分配)</label>
        <input type="text" id="cfg-ipv4" placeholder="例如 10.144.144.202/24">
      </div>
      <div class="form-group">
        <label>主机名 (Hostname)</label>
        <input type="text" id="cfg-hostname" placeholder="steamdeck">
      </div>
      <button class="primary" style="width: 100%;" onclick="saveQuickConfig()">保存并重载配置</button>
    </div>
  </div>

  <div class="card" style="margin-bottom: 24px;">
    <div class="card-title">组网 Peers 对端节点 (<span id="peer-count">0</span>)</div>
    <table>
      <thead>
        <tr>
          <th>主机名</th>
          <th>虚拟 IP</th>
          <th>连接类型</th>
          <th>链路延迟</th>
          <th>丢包率</th>
          <th>测速</th>
        </tr>
      </thead>
      <tbody id="peer-table-body">
        <tr><td colspan="6" style="text-align: center; color: #8b949e;">正在加载 Peers...</td></tr>
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title">
      <span>原始 TOML 配置文件</span>
      <button onclick="saveRawConfig()" style="padding: 4px 10px; font-size: 12px;">保存原始配置</button>
    </div>
    <textarea id="raw-toml" placeholder="# EasyTier config.toml"></textarea>
  </div>

  <div id="toast" class="toast"></div>

  <script>
    function showToast(msg) {
      const t = document.getElementById("toast");
      t.innerText = msg;
      t.style.display = "block";
      setTimeout(() => { t.style.display = "none"; }, 3000);
    }

    async function fetchData() {
      try {
        const res = await fetch("/api/status").then(r => r.json());
        const badge = document.getElementById("status-badge");
        if (res.status && res.status.active) {
          badge.className = "badge badge-active";
          badge.innerText = "● 运行中 (ACTIVE)";
        } else {
          badge.className = "badge badge-stopped";
          badge.innerText = "● 已停止 (STOPPED)";
        }

        if (res.node) {
          document.getElementById("node-ip").innerText = res.node.virtual_ip || "-";
          document.getElementById("node-host").innerText = res.node.hostname || "steamdeck";
          document.getElementById("node-peer-id").innerText = res.node.peer_id || "-";
          document.getElementById("node-public-ip").innerText = res.node.public_ipv4 || "-";
          document.getElementById("node-nat").innerText = res.node.nat_type || "-";
        }

        const peers = res.peers || [];
        document.getElementById("peer-count").innerText = peers.length;
        const tbody = document.getElementById("peer-table-body");
        if (peers.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #8b949e;">暂无对端节点</td></tr>';
        } else {
          tbody.innerHTML = peers.map(p => {
            const isLocal = (p.cost || "").toLowerCase() === "local";
            const isP2P = (p.cost || "").toLowerCase().includes("p2p");
            const color = isLocal ? "#3fb950" : (isP2P ? "#58a6ff" : "#d29922");
            const rawIp = (p.ipv4 || "").split("/")[0].trim();
            return `<tr>
              <td><strong>${p.hostname || (isLocal ? "本机" : "未知")}</strong></td>
              <td><code>${p.ipv4 || "-"}</code></td>
              <td><span style="color: ${color}; font-weight: 600;">${p.cost || "-"}</span></td>
              <td>${p.latency || "-"}</td>
              <td>${p.loss || "0%"}</td>
              <td>${(!isLocal && rawIp) ? `<button style="padding: 2px 8px; font-size: 12px;" onclick="pingPeer('${rawIp}', this)">Ping</button>` : "-"}</td>
            </tr>`;
          }).join("");
        }
      } catch(e) {
        console.error(e);
      }
    }

    async function loadConfig() {
      try {
        const res = await fetch("/api/config").then(r => r.json());
        if (res.raw) {
          document.getElementById("raw-toml").value = res.raw;
        }
        if (res.quick) {
          document.getElementById("cfg-net-name").value = res.quick.network_name || "";
          document.getElementById("cfg-net-secret").value = res.quick.network_secret || "";
          document.getElementById("cfg-ipv4").value = res.quick.ipv4 || "";
          document.getElementById("cfg-hostname").value = res.quick.hostname || "steamdeck";
        }
      } catch(e) {
        console.error(e);
      }
    }

    async function doAction(act) {
      showToast("正在执行: " + act + "...");
      const res = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: act })
      }).then(r => r.json());
      if (res.success) {
        showToast("操作成功");
      } else {
        showToast("操作失败");
      }
      setTimeout(fetchData, 1000);
    }

    async function saveQuickConfig() {
      const payload = {
        network_name: document.getElementById("cfg-net-name").value.trim(),
        network_secret: document.getElementById("cfg-net-secret").value.trim(),
        ipv4: document.getElementById("cfg-ipv4").value.trim(),
        hostname: document.getElementById("cfg-hostname").value.trim() || "steamdeck"
      };
      showToast("正在保存配置并重启服务...");
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quick: payload })
      }).then(r => r.json());
      if (res.success) {
        showToast("配置已生效，服务已重载");
        loadConfig();
        setTimeout(fetchData, 1500);
      } else {
        showToast("保存失败: " + (res.error || "未知错误"));
      }
    }

    async function saveRawConfig() {
      const raw = document.getElementById("raw-toml").value;
      showToast("正在保存原始 TOML 配置...");
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: raw })
      }).then(r => r.json());
      if (res.success) {
        showToast("配置已生效并重启服务");
        loadConfig();
        setTimeout(fetchData, 1500);
      } else {
        showToast("保存失败");
      }
    }

    async function pingPeer(ip, btn) {
      btn.innerText = "...";
      btn.disabled = true;
      try {
        const res = await fetch("/api/ping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip: ip })
        }).then(r => r.json());
        if (res.success) {
          btn.innerText = res.avg_ms + " ms";
        } else {
          btn.innerText = "超时";
        }
      } catch(e) {
        btn.innerText = "失败";
      } finally {
        setTimeout(() => { btn.disabled = false; }, 3000);
      }
    }

    fetchData();
    loadConfig();
    setInterval(fetchData, 5000);
  </script>
</body>
</html>
"""


def get_service_status():
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

    return {
        "installed": os.path.exists(EASYTIER_CORE) and os.path.exists(CONFIG_PATH),
        "active": is_active,
        "status": active_status,
        "enabled": is_enabled,
    }


def get_node_info():
    if not os.path.exists(EASYTIER_CLI):
        return {"error": "easytier-cli not found"}
    try:
        res = subprocess.run([EASYTIER_CLI, "node"], capture_output=True, text=True, timeout=3, env=ENV)
        if res.returncode != 0:
            return {"error": res.stderr.strip() or "Failed"}
        data = {
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


def get_peers():
    if not os.path.exists(EASYTIER_CLI):
        return []
    try:
        res = subprocess.run([EASYTIER_CLI, "peer"], capture_output=True, text=True, timeout=3, env=ENV)
        if res.returncode != 0: return []
        peers = []
        lines = res.stdout.strip().splitlines()
        if len(lines) < 3: return []
        for line in lines[2:]:
            parts = [p.strip() for p in line.split("|")[1:-1]]
            if len(parts) >= 10:
                ipv4, hostname, cost, lat, loss, rx, tx, tunnel, nat, version = parts[:10]
                if ipv4 == "ipv4" or "---" in ipv4: continue
                peers.append({
                    "ipv4": ipv4, "hostname": hostname, "cost": cost,
                    "latency": lat, "loss": loss, "rx": rx, "tx": tx,
                    "tunnel": tunnel, "nat": nat, "version": version
                })
        return peers
    except Exception:
        return []


def ping_target(target_ip: str):
    if not re.match(r"^(\d{1,3}\.){3}\d{1,3}$", target_ip):
        return {"success": False, "error": "Invalid IP"}
    try:
        res = subprocess.run(["ping", "-c", "3", "-W", "2", target_ip], capture_output=True, text=True, timeout=5, env=ENV)
        if res.returncode == 0:
            m = re.search(r"min/avg/max/[a-z]+ = [\d.]+/([\d.]+)/", res.stdout)
            avg = m.group(1) if m else "OK"
            return {"success": True, "avg_ms": avg}
        return {"success": False}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return f.read()
    return ""


def save_config(content: str):
    try:
        os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            f.write(content)
        subprocess.run([SYSTEMCTL, "restart", "easytier"], env=ENV)
        return True
    except Exception:
        return False


def get_quick_config():
    content = get_config()
    data = {
        "network_name": "", "network_secret": "",
        "hostname": "steamdeck", "ipv4": "", "peers": []
    }
    m = re.search(r'^\s*network_name\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
    if m: data["network_name"] = m.group(1)
    m = re.search(r'^\s*network_secret\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
    if m: data["network_secret"] = m.group(1)
    m = re.search(r'^\s*hostname\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
    if m: data["hostname"] = m.group(1)
    m = re.search(r'^\s*ipv4\s*=\s*["\']([^"\']+)["\']', content, re.MULTILINE)
    if m: data["ipv4"] = m.group(1)
    return data


def save_quick_config(cfg):
    net_name = cfg.get("network_name", "").strip()
    net_secret = cfg.get("network_secret", "").strip()
    hostname = cfg.get("hostname", "steamdeck").strip() or "steamdeck"
    ipv4 = cfg.get("ipv4", "").strip()
    peers = cfg.get("peers", ["tcp://public.easytier.top:11010", "tcp://39.108.52.138:11010"])

    lines = [f'hostname = "{hostname}"', f'network_name = "{net_name}"', f'network_secret = "{net_secret}"']
    if ipv4: lines.append(f'ipv4 = "{ipv4}"')
    lines.append("")
    for p in peers:
        lines.append("[[peer]]\nuri = \"" + p + "\"")
    lines.extend(["", "[flags]", "use_smoltcp = true", "latency_first = true", "enable_exit_node = true", "enable_udp_broadcast_relay = true", "proxy_forward_by_system = true", "relay_all_peer_rpc = true", ""])
    return save_config("\n".join(lines))


class WebHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args): pass

    def _send_json(self, data: Any, status: int = 200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ["/", "/index.html"]:
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(WEB_HTML.encode("utf-8"))
            return

        if path == "/api/status":
            st = get_service_status()
            node = get_node_info() if st.get("active") else {}
            peers = get_peers() if st.get("active") else []
            self._send_json({"status": st, "node": node, "peers": peers})
            return

        if path == "/api/config":
            self._send_json({"raw": get_config(), "quick": get_quick_config()})
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length > 0 else b"{}"
        try: payload = json.loads(body.decode("utf-8"))
        except Exception: payload = {}

        if path == "/api/action":
            act = payload.get("action")
            if act == "start": ok = subprocess.run([SYSTEMCTL, "start", "easytier"], env=ENV).returncode == 0
            elif act == "stop": ok = subprocess.run([SYSTEMCTL, "stop", "easytier"], env=ENV).returncode == 0
            elif act == "restart": ok = subprocess.run([SYSTEMCTL, "restart", "easytier"], env=ENV).returncode == 0
            else: self._send_json({"error": "Invalid action"}, 400); return
            self._send_json({"success": ok})
            return

        if path == "/api/config":
            if "raw" in payload: ok = save_config(payload["raw"])
            elif "quick" in payload: ok = save_quick_config(payload["quick"])
            else: self._send_json({"error": "Invalid"}, 400); return
            self._send_json({"success": ok})
            return

        if path == "/api/ping":
            self._send_json(ping_target(payload.get("ip", "")))
            return

        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", WEB_PORT), WebHandler)
    server.serve_forever()
