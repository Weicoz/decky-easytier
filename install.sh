#!/usr/bin/env bash
# ==============================================================================
# Decky EasyTier 一键安装与环境部署脚本
# 适用设备: Steam Deck (SteamOS 3+) / Linux x86_64
# 功能: 自动下载 EasyTier 官方核心 + 安装 Decky 插件 + 配置系统守护服务
# ==============================================================================

set -eo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "=============================================================="
echo "           🚀 Decky EasyTier 一键部署向导 (Steam Deck)        "
echo "=============================================================="
echo -e "${NC}"

# 1. 架构检测
ARCH=$(uname -m)
if [ "$ARCH" != "x86_64" ]; then
    echo -e "${RED}❌ 错误: 当前设备架构为 ${ARCH}，本插件与核心仅支持 x86_64 架构。${NC}"
    exit 1
fi

# 2. 定位用户主目录与路径
TARGET_USER="${SUDO_USER:-$USER}"
if [ "$TARGET_USER" = "root" ] && [ -d "/home/deck" ]; then
    TARGET_USER="deck"
fi

if [ -d "/home/$TARGET_USER" ]; then
    USER_HOME="/home/$TARGET_USER"
else
    USER_HOME="$HOME"
fi

BIN_DIR="${USER_HOME}/.local/bin"
CONFIG_DIR="${USER_HOME}/.config/easytier"
CONFIG_FILE="${CONFIG_DIR}/config.toml"
PLUGINS_BASE="${USER_HOME}/homebrew/plugins"
PLUGIN_DIR="${PLUGINS_BASE}/decky-easytier"
OLD_PLUGIN_DIR="${PLUGINS_BASE}/Decky EasyTier"
SERVICE_FILE="/etc/systemd/system/easytier.service"

mkdir -p "$BIN_DIR" "$CONFIG_DIR" "$PLUGINS_BASE"

# 清理旧的历史带空格目录
if [ -d "$OLD_PLUGIN_DIR" ]; then
    echo -e "${YELLOW}🧹 检测到旧目录结构，正在清理历史空格目录...${NC}"
    rm -rf "$OLD_PLUGIN_DIR" 2>/dev/null || sudo rm -rf "$OLD_PLUGIN_DIR" 2>/dev/null || true
fi

# 3. 获取 EasyTier 官方最新版本
echo -e "${CYAN}🔍 正在探测 EasyTier 官方最新版本...${NC}"
LATEST_TAG=$(curl -sI --connect-timeout 6 https://github.com/EasyTier/EasyTier/releases/latest 2>/dev/null | grep -i '^location:' | sed -E 's/.*\/tag\/([^\r\n]+).*/\1/' || true)
if [ -z "$LATEST_TAG" ]; then
    LATEST_TAG="v2.6.4"
fi
LATEST_TAG_CLEAN="${LATEST_TAG#v}"
echo -e "${GREEN}✓ 选定 EasyTier 版本: v${LATEST_TAG_CLEAN}${NC}"

# 4. 下载并安装 EasyTier 核心
ZIP_NAME="easytier-linux-x86_64-v${LATEST_TAG_CLEAN}.zip"
TMP_ZIP="/tmp/easytier-download.zip"
TMP_DIR="/tmp/easytier-extract"

URL_ORIGIN="https://github.com/EasyTier/EasyTier/releases/download/v${LATEST_TAG_CLEAN}/${ZIP_NAME}"
URL_MIRROR="https://ghfast.top/${URL_ORIGIN}"

echo -e "${CYAN}⬇️ 正在下载 EasyTier 核心组件...${NC}"
rm -f "$TMP_ZIP"
DOWNLOAD_SUCCESS=false

if curl -fL --connect-timeout 8 -m 180 "$URL_ORIGIN" -o "$TMP_ZIP" 2>/dev/null; then
    DOWNLOAD_SUCCESS=true
else
    echo -e "${YELLOW}⚡ 直连超时，正在切换国内加速源下载...${NC}"
    if curl -fL --connect-timeout 10 -m 180 "$URL_MIRROR" -o "$TMP_ZIP" 2>/dev/null; then
        DOWNLOAD_SUCCESS=true
    fi
fi

if [ "$DOWNLOAD_SUCCESS" = false ] || [ ! -f "$TMP_ZIP" ] || [ $(wc -c <"$TMP_ZIP") -lt 1000000 ]; then
    echo -e "${RED}❌ 核心包下载失败，请检查网络连接。${NC}"
    exit 1
fi

echo -e "${CYAN}📦 正在解压并部署核心二进制文件到 ${BIN_DIR}...${NC}"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
unzip -q -o "$TMP_ZIP" -d "$TMP_DIR"

CORE_SRC=$(find "$TMP_DIR" -type f -name "easytier-core" | head -n 1)
CLI_SRC=$(find "$TMP_DIR" -type f -name "easytier-cli" | head -n 1)
WEB_SRC=$(find "$TMP_DIR" -type f -name "easytier-web" | head -n 1)

if [ -z "$CORE_SRC" ] || [ -z "$CLI_SRC" ]; then
    echo -e "${RED}❌ 解压文件中未找到 easytier-core 或 easytier-cli。${NC}"
    rm -rf "$TMP_ZIP" "$TMP_DIR"
    exit 1
fi

# 暂停可能正在运行的服务，防止 Text file busy
sudo systemctl stop easytier 2>/dev/null || systemctl stop easytier 2>/dev/null || true

cp -f "$CORE_SRC" "${BIN_DIR}/easytier-core.new" && mv -f "${BIN_DIR}/easytier-core.new" "${BIN_DIR}/easytier-core"
cp -f "$CLI_SRC" "${BIN_DIR}/easytier-cli.new" && mv -f "${BIN_DIR}/easytier-cli.new" "${BIN_DIR}/easytier-cli"
if [ -n "$WEB_SRC" ]; then
    cp -f "$WEB_SRC" "${BIN_DIR}/easytier-web.new" && mv -f "${BIN_DIR}/easytier-web.new" "${BIN_DIR}/easytier-web" || true
fi

chmod +x "${BIN_DIR}"/easytier-*
chown "$TARGET_USER:$TARGET_USER" "${BIN_DIR}"/easytier-* 2>/dev/null || true

# 尝试赋予特权能力
if [ "$EUID" -eq 0 ]; then
    chmod 4755 "${BIN_DIR}/easytier-core" 2>/dev/null || true
    setcap cap_net_admin,cap_net_bind_service+ep "${BIN_DIR}/easytier-core" 2>/dev/null || true
elif sudo -n true 2>/dev/null; then
    sudo chmod 4755 "${BIN_DIR}/easytier-core" 2>/dev/null || true
    sudo setcap cap_net_admin,cap_net_bind_service+ep "${BIN_DIR}/easytier-core" 2>/dev/null || true
fi

rm -rf "$TMP_ZIP" "$TMP_DIR"
echo -e "${GREEN}✓ EasyTier 核心组件安装完成: $(${BIN_DIR}/easytier-core --version 2>/dev/null || echo 'OK')${NC}"

# 5. 初始化配置文件 (若不存在)
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${CYAN}📝 正在生成默认 EasyTier 配置文件...${NC}"
    cat <<'EOF' > "$CONFIG_FILE"
# EasyTier 基础配置文件 (由 Decky EasyTier 一键脚本生成)
hostname = "steamdeck"
ipv6_public_addr_auto = true
dhcp = true
listeners = ["tcp://0.0.0.0:11010", "udp://0.0.0.0:11010", "wg://0.0.0.0:11011"]

[network_identity]
network_name = ""
network_secret = ""

[[peer]]
uri = "tcp://public.easytier.top:11010"

[[peer]]
uri = "tcp://39.108.52.138:11010"

[flags]
latency_first = true
enable_udp_broadcast_relay = true
use_smoltcp = true
enable_exit_node = true
disable_quic_input = true
disable_kcp_input = true
proxy_forward_by_system = true
relay_all_peer_rpc = true
accept_dns = true
EOF
    chown "$TARGET_USER:$TARGET_USER" "$CONFIG_FILE" 2>/dev/null || true
    echo -e "${GREEN}✓ 默认配置已写入: ${CONFIG_FILE}${NC}"
fi

# 6. 配置 Systemd 系统守护服务
echo -e "${CYAN}⚙️ 正在检查并配置 systemd 守护服务...${NC}"
SERVICE_CONTENT="[Unit]
Description=EasyTier Service
After=network.target

[Service]
Type=simple
User=root
ExecStart=${BIN_DIR}/easytier-core -c ${CONFIG_FILE}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
"

WRITE_SVC=false
if [ "$EUID" -eq 0 ]; then
    echo "$SERVICE_CONTENT" > "$SERVICE_FILE"
    systemctl daemon-reload 2>/dev/null || true
    systemctl enable easytier 2>/dev/null || true
    WRITE_SVC=true
elif sudo -n true 2>/dev/null; then
    echo "$SERVICE_CONTENT" | sudo tee "$SERVICE_FILE" >/dev/null
    sudo systemctl daemon-reload 2>/dev/null || true
    sudo systemctl enable easytier 2>/dev/null || true
    WRITE_SVC=true
fi

if [ "$WRITE_SVC" = true ]; then
    echo -e "${GREEN}✓ 系统守护服务已成功注册并配置自启${NC}"
else
    echo -e "${YELLOW}ℹ️ 未能直接获取 root 权限写入 /etc/systemd/system/，无需担心：进入游戏模式打开 Decky 插件时将自动以 root 身份完成服务注册。${NC}"
fi

# 7. 安装或更新 Decky Loader 插件
echo -e "${CYAN}🧩 正在部署 Decky Loader 插件 (decky-easytier)...${NC}"
TMP_PLUGIN_DIR="/tmp/decky-easytier-git"
rm -rf "$TMP_PLUGIN_DIR"

CLONE_SUCCESS=false
if git clone --depth=1 https://github.com/Weicoz/decky-easytier.git "$TMP_PLUGIN_DIR" 2>/dev/null; then
    CLONE_SUCCESS=true
elif git clone --depth=1 https://ghfast.top/https://github.com/Weicoz/decky-easytier.git "$TMP_PLUGIN_DIR" 2>/dev/null; then
    CLONE_SUCCESS=true
fi

if [ "$CLONE_SUCCESS" = true ] && [ -d "$TMP_PLUGIN_DIR" ]; then
    mkdir -p "$PLUGIN_DIR"
    cp -rf "$TMP_PLUGIN_DIR"/* "$PLUGIN_DIR"/
    rm -rf "$TMP_PLUGIN_DIR"
else
    echo -e "${YELLOW}⚠️ Git 克隆失败，尝试直接下载归档包...${NC}"
    curl -fL --connect-timeout 8 "https://ghfast.top/https://github.com/Weicoz/decky-easytier/archive/refs/heads/main.tar.gz" -o /tmp/decky-easytier.tar.gz 2>/dev/null || \
    curl -fL --connect-timeout 8 "https://github.com/Weicoz/decky-easytier/archive/refs/heads/main.tar.gz" -o /tmp/decky-easytier.tar.gz
    mkdir -p "$PLUGIN_DIR"
    tar -xzf /tmp/decky-easytier.tar.gz -C "$PLUGIN_DIR" --strip-components=1
    rm -f /tmp/decky-easytier.tar.gz
fi

chmod -R 775 "$PLUGIN_DIR"
chmod +x "$PLUGIN_DIR/web_server.py" 2>/dev/null || true
chown -R "$TARGET_USER:$TARGET_USER" "$PLUGIN_DIR" 2>/dev/null || true

echo -e "${GREEN}✓ Decky 插件已就绪: ${PLUGIN_DIR}${NC}"

# 8. 触发 Decky Loader 重载
if systemctl is-active --quiet plugin_loader 2>/dev/null; then
    echo -e "${CYAN}🔄 正在重载 Decky Loader 服务...${NC}"
    if [ "$EUID" -eq 0 ]; then
        systemctl restart plugin_loader
    elif sudo -n true 2>/dev/null; then
        sudo systemctl restart plugin_loader
    fi
fi

# 9. 完成提示
echo ""
echo -e "${GREEN}${BOLD}==============================================================${NC}"
echo -e "${GREEN}${BOLD}🎉 恭喜！Decky EasyTier 全套组件与环境已安装完毕！${NC}"
echo -e "${GREEN}${BOLD}==============================================================${NC}"
echo -e "${BOLD}下一步使用方式:${NC}"
echo -e "  1. 【游戏模式】：按右侧快捷键（${CYAN}...${NC}）打开 Decky 菜单，即可看到 ${BOLD}EasyTier 管理器${NC}。"
echo -e "  2. 【免输命令】：在插件界面输入网络名称与密码，点击保存即可异地联机组网！"
echo -e "  3. 【手机/Web 控制台】：在手机或局域网电脑浏览器访问 ${CYAN}http://127.0.0.1:21010${NC}，免手柄可视化管理。"
echo ""
