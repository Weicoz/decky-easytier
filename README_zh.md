# Decky EasyTier

<p align="center">
  <img src="./assets/banner.png" alt="Decky EasyTier Banner" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/SteamDeckHomebrew/decky-loader"><img src="https://img.shields.io/badge/Decky-Plugin-blue.svg" alt="Decky Plugin" /></a>
  <a href="https://github.com/EasyTier/EasyTier"><img src="https://img.shields.io/badge/EasyTier-v2.6.4-green.svg" alt="EasyTier" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <b>简体中文</b> | <a href="README_ja.md">日本語</a>
</p>

---

**Decky EasyTier** 是专为 Steam Deck 设计的 [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) 插件，用于在 SteamOS 游戏模式下无缝管理与监控 [EasyTier](https://github.com/EasyTier/EasyTier) 异地组网。

---

## 🌟 核心特性

- 🎮 **游戏模式深度适配**：完美贴合 SteamOS 快速访问菜单（QAM `...` 键），全手柄无障碍操作。
- 🚀 **极简零门槛安装**：支持**一键终端脚本**或在**插件内一键在线自动安装官方核心**，彻底告别繁琐的手动下载配置。
- 📱 **独立 Web 管理控制台**：内置轻量 Web 服务（默认端口 `21010`），同一 Wi-Fi 下使用手机或 PC 浏览器扫码/直接输入即可可视化管理配置。
- 🟢 **实时组网状态监控**：直观展示虚拟 IP、主机名、NAT 打洞类型（FullCone / Symmetric 等）与 Peer ID。
- 🌐 **Peers 对端列表与流量**：实时展示所有联机节点状态、连接模式（P2P 直连 / 中继 Relay）、链路往返延时与收发流量。
- ⚡ **一键 Ping 延迟测速**：在手柄界面内即时测试与任意节点的真实单向/往返通信延迟。
- ⚙️ **系统服务自动守护**：支持一键启动、停止、重启 EasyTier，开机自启（systemd）守护进程。

---

## 📦 安装方法

### 方案一：终端极速一键安装（推荐首选 ⚡）
切换至 Steam Deck **桌面模式**，打开终端 **Konsole**，直接粘贴运行以下命令即可：

```bash
curl -fsSL https://raw.githubusercontent.com/Weicoz/decky-easytier/main/install.sh | bash
```

> **国内用户加速源**（如遇 GitHub 连通缓慢）：
> ```bash
> curl -fsSL https://ghfast.top/https://raw.githubusercontent.com/Weicoz/decky-easytier/main/install.sh | bash
> ```

> 💡 **该脚本会自动完成：**
> 1. 检测系统架构（x86_64）并自动下载 EasyTier 官方最新发布版本；
> 2. 提取 `easytier-core`、`easytier-cli` 并配置 Linux 特权网络能力（`cap_net_admin`）；
> 3. 初始化默认组网配置并注册 `systemd` 开机守护服务；
> 4. 安装/更新 `decky-easytier` 插件并自动重载 Decky Loader。

---

### 方案二：插件内一键安装（免命令行 🎮）
如果您已通过 Decky Loader 插件商店或解压安装了本插件：

1. 进入 Steam 游戏模式，按下右侧快捷键（`...`），打开 Decky Loader 菜单。
2. 找到并打开 **EasyTier 管理器**。
3. 界面将弹出 **【🚀 核心组件一键安装】** 提示，直接点击 **【一键在线下载并安装 EasyTier 核心】**。
4. 插件将自动利用 Root 特权下载官方最新核心、写入系统守护服务并完成初始化，**全程无需进入桌面模式或输入任何 Linux 命令**！

---

### 方案三：手动安装与本地构建（进阶开发者 🛠️）
1. 克隆代码仓库：
   ```bash
   git clone https://github.com/Weicoz/decky-easytier.git /home/deck/homebrew/plugins/decky-easytier
   ```
2. 本地编译构建（需 Node.js >= 18 与 pnpm）：
   ```bash
   cd /home/deck/homebrew/plugins/decky-easytier
   pnpm install
   pnpm run build
   ```
3. 放置 EasyTier 二进制：
   - 核心文件：`/home/deck/.local/bin/easytier-core` 与 `easytier-cli`（需赋权 `chmod +x`）
   - 配置文件：`/home/deck/.config/easytier/config.toml`
   - 服务文件：`/etc/systemd/system/easytier.service`

---

## 🌐 Web 控制台使用

插件内置独立 HTTP 服务，默认监听 `http://127.0.0.1:21010`。
- **本地打开**：在游戏模式插件主页点击 **【打开 Web 管理】** 即可直接调起 Steam 浏览器。
- **手机/电脑管理**：在插件主页查看 **局域网访问地址**（例如 `http://192.168.10.x:21010`），手机连接同一 Wi-Fi 后即可在浏览器中快速输入网络名称、密钥与公共节点，免去手柄打字烦恼。

---

## 📄 开源许可

本项目基于 [MIT 许可证](LICENSE) 开源。
EasyTier 版权归其原作者所有。
