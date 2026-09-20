# Decky EasyTier

[![Decky Plugin](https://img.shields.io/badge/Decky-Plugin-blue.svg)](https://github.com/SteamDeckHomebrew/decky-loader)
[![EasyTier](https://img.shields.io/badge/EasyTier-v2.6.4-green.svg)](https://github.com/EasyTier/EasyTier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Decky EasyTier** 是专为 Steam Deck 设计的 [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) 插件，用于在 SteamOS 游戏模式下无缝管理与监控 [EasyTier](https://github.com/EasyTier/EasyTier) 异地组网。

---

## 🌟 特性

- 🎮 **游戏模式原生支持**：深度适配 Steam Deck 快捷访问菜单（QAM）与手柄操作。
- 🟢 **实时状态监控**：直观展示本机虚拟 IP、节点 Hostname、NAT 打洞类型与 Peer ID。
- 🌐 **Peers 节点列表**：实时列出组网内所有设备，显示连接方式（P2P 直连 / 中继 Relay）、链路延时与丢包率。
- ⚡ **一键 Ping 测速**：在手柄界面内即时测试与对端节点的单向/往返通信延时。
- ⚙️ **后台服务守护**：支持一键启动、停止、重启 EasyTier，支持随系统开机自启（systemd 守护进程）。

---

## 📦 安装方法

### 方式一：配合已有的 EasyTier 部署
1. 确保 Steam Deck 上已放置 EasyTier 核心组件：
   - 二进制：`/home/deck/.local/bin/easytier-core` 与 `easytier-cli`
   - 配置文件：`/home/deck/.config/easytier/config.toml`
2. 将本插件克隆或解压至 `/home/deck/homebrew/plugins/Decky EasyTier`：
   ```bash
   git clone https://github.com/Weicoz/decky-easytier.git "/home/deck/homebrew/plugins/Decky EasyTier"
   ```
3. 在 Steam 游戏模式右侧菜单（`...`）的 Decky 插件列表中即可看到 **Decky EasyTier**。

### 方式二：手动构建
需要 Node.js (>= 18) 与 pnpm：
```bash
git clone https://github.com/Weicoz/decky-easytier.git
cd decky-easytier
pnpm install
pnpm run build
```
编译产物位于 `dist/index.js`。

---

## 🛠️ 技术架构

- **前端**：React 19 + TypeScript，使用 `@decky/ui` 与 `@decky/api`。
- **构建工具**：Rollup + `@decky/rollup`。
- **后端**：Python 3，通过 Decky Loader Root 权限与系统守护进程交互，直接调用 `easytier-cli`。

---

## 📄 开源许可

本项目基于 [MIT 许可证](LICENSE) 开源。
EasyTier 版权归其原作者所有。
