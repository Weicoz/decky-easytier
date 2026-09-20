const manifest = {"name":"decky-easytier"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
const callable = api.callable;
const toaster = api.toaster;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaStop (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"},"child":[]}]})(props);
}function FaRedo (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"},"child":[]}]})(props);
}function FaPlay (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"},"child":[]}]})(props);
}function FaNetworkWired (props) {
  return GenIcon({"attr":{"viewBox":"0 0 640 512"},"child":[{"tag":"path","attr":{"d":"M640 264v-16c0-8.84-7.16-16-16-16H344v-40h72c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32H224c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h72v40H16c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h104v40H64c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h304v40h-56c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h104c8.84 0 16-7.16 16-16zM256 128V64h128v64H256zm-64 320H96v-64h96v64zm352 0h-96v-64h96v64z"},"child":[]}]})(props);
}function FaGlobe (props) {
  return GenIcon({"attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"},"child":[]}]})(props);
}

const detectSystemLanguage = () => {
    try {
        let raw = "";
        if (typeof window !== "undefined" && window.navigator) {
            raw = window.navigator.languages?.[0] || window.navigator.language || "";
        }
        raw = raw.toLowerCase();
        if (raw.startsWith("zh"))
            return "zh";
        if (raw.startsWith("ja"))
            return "ja";
    }
    catch (e) {
        // fallback
    }
    return "en";
};
const getEffectiveLanguage = (pref) => {
    if (pref === "auto") {
        return detectSystemLanguage();
    }
    return pref;
};
const translations = {
    en: {
        plugin_title: "EasyTier Manager",
        tab_status: "Status",
        tab_config: "Config",
        tab_web: "WebUI",
        // One-click core setup
        core_install_title: "🚀 One-Click Core Setup",
        core_install_not_found: "EasyTier Core Not Detected",
        core_install_desc: "The system does not have easytier-core installed. Click below to automatically download the official x86_64 binary and configure system daemon services without using terminal commands.",
        core_install_btn: "🚀 Download & Install EasyTier Core",
        core_installing: "Downloading & deploying core...",
        core_reinstall: "Reinstall / Update",
        core_updating: "Updating...",
        core_ready: "Ready",
        // Runtime Status
        status_title: "Runtime Status",
        status_core_ver: "Core Version",
        status_service: "Service Status",
        status_running: "Running",
        status_stopped: "Stopped",
        status_vip: "Virtual IP",
        status_fetching: "Fetching...",
        status_hostname: "Hostname",
        status_nat: "NAT Traversal Type",
        status_unknown: "Unknown",
        status_peer_id: "Peer ID",
        // Service Controls
        ctrl_title: "Service Controls",
        ctrl_autostart: "Auto-start on Boot",
        ctrl_autostart_desc: "Automatically start EasyTier with system boot",
        ctrl_start: "Start",
        ctrl_stop: "Stop",
        ctrl_restart: "Restart",
        ctrl_refresh: "Refresh Peers & Status",
        // Peers
        peers_title: "Network Peers",
        peers_none: "No Connected Peers",
        peers_none_desc_active: "Waiting for peer handshakes...",
        peers_none_desc_stopped: "Start the service to connect",
        peers_local_host: "Local Machine",
        peers_unknown_host: "Unknown Node",
        peers_mode: "Mode",
        peers_lat: "Latency",
        peers_loss: "Loss",
        peers_traffic: "Traffic (RX/TX)",
        peers_ping_btn: "Ping",
        peers_pinging: "Pinging...",
        peers_ping_fail: "Timeout/Fail",
        // Quick Config
        cfg_title: "Quick Configuration",
        cfg_net_name: "Network Name",
        cfg_net_name_desc: "Name of the network to create or join",
        cfg_net_secret: "Network Secret",
        cfg_net_secret_desc: "Shared password for mutual encryption & auth",
        cfg_show_secret: "Show Secret",
        cfg_vip: "Virtual IPv4 (Optional)",
        cfg_vip_desc: "e.g. 10.144.144.202/24, leave blank for DHCP",
        cfg_hostname: "Hostname",
        cfg_hostname_desc: "Identifier displayed to other peers",
        // Gaming & Optimization
        opt_title: "Gaming & Performance Tuning",
        opt_udp: "UDP Broadcast Relay",
        opt_udp_desc: "Crucial for LAN room discovery (Palworld, L4D2, MC, etc.)",
        opt_latency: "Latency-First Routing",
        opt_latency_desc: "Prioritize lowest RTT route, recommended for multiplayer games",
        opt_smoltcp: "SmolTCP Stack Acceleration",
        opt_smoltcp_desc: "Enable high-performance user-space network stack",
        opt_exit: "Allow Exit Node",
        opt_exit_desc: "Support routing outbound internet traffic through designated nodes",
        // Peer Endpoints
        peer_cfg_title: "Peer Endpoints (Public Nodes)",
        peer_cfg_hint: "One peer URI per line (e.g. tcp://public.easytier.top:11010):",
        peer_cfg_add_public: "➕ Add Official Public Peers",
        peer_cfg_save: "💾 Save Config & Restart Service",
        // Advanced TOML
        adv_title: "Advanced Configuration",
        adv_toml_toggle: "Edit raw config.toml",
        adv_toml_desc: "Directly view and modify complete TOML config file",
        adv_toml_save: "Save Raw TOML Config",
        // Web Console Tab
        web_title: "Embedded Web Console",
        web_status: "Web Management Service",
        web_status_listening: "Listening on port",
        web_open_btn: "🚀 Open Web Console in Steam Browser",
        web_remote_title: "Remote & Mobile Management",
        web_local: "On-Device (Steam Deck)",
        web_lan: "📱 Local Wi-Fi Access (Recommended for Phone/PC)",
        web_easytier: "🌐 Access via EasyTier Mesh IP",
        web_hint: "Tip: Connect your phone or PC to the same Wi-Fi network and open the Local Wi-Fi URL in your browser to effortlessly configure network names and passwords using a physical keyboard!",
        web_cloud_title: "Official Cloud Portal",
        web_cloud_service: "Visual Cloud Management Dashboard",
        web_cloud_desc: "EasyTier provides an official cloud portal for managing multiple devices and visual network topologies.",
        // Language Selector
        lang_title: "Interface Language",
        lang_label: "Language Preference",
        lang_auto: "Auto (Follow SteamOS)",
        lang_en: "English",
        lang_zh: "简体中文 (Chinese)",
        lang_ja: "日本語 (Japanese)",
        // Toasts
        toast_install_start: "Downloading official EasyTier core, please wait...",
        toast_install_ok: "Core installed and service running!",
        toast_install_fail: "Installation failed: ",
        toast_start_ok: "EasyTier service started",
        toast_start_fail: "Failed to start service",
        toast_stop_ok: "EasyTier service stopped",
        toast_stop_fail: "Failed to stop service",
        toast_restart_ok: "EasyTier service restarted",
        toast_restart_fail: "Failed to restart service",
        toast_autostart_on: "Auto-start enabled",
        toast_autostart_off: "Auto-start disabled",
        toast_added_public: "Appended official public peers",
        toast_enter_net_name: "Please enter a network name",
        toast_save_ok: "Config saved and service reloaded",
        toast_save_fail: "Failed to save config",
        toast_save_raw_ok: "Raw TOML config saved",
        toast_open_web: "Opening Web Console in browser...",
    },
    zh: {
        plugin_title: "EasyTier 管理器",
        tab_status: "状态",
        tab_config: "配置",
        tab_web: "WebUI",
        // 一键安装
        core_install_title: "🚀 核心组件一键安装",
        core_install_not_found: "未检测到 EasyTier 核心",
        core_install_desc: "系统尚未安装或未检测到 easytier-core。点击下方按钮即可一键在线下载官方最新 x86_64 核心并自动初始化系统守护服务，免去终端命令行操作。",
        core_install_btn: "🚀 一键在线下载并安装 EasyTier 核心",
        core_installing: "正在下载与部署核心组件...",
        core_reinstall: "重新安装/更新",
        core_updating: "更新中...",
        core_ready: "已就绪",
        // 运行状态
        status_title: "运行状态",
        status_core_ver: "核心版本",
        status_service: "服务状态",
        status_running: "正在运行中",
        status_stopped: "已停止",
        status_vip: "虚拟 IP",
        status_fetching: "获取中...",
        status_hostname: "主机名",
        status_nat: "NAT 打洞类型",
        status_unknown: "未知",
        status_peer_id: "Peer ID",
        // 服务控制
        ctrl_title: "服务控制",
        ctrl_autostart: "开机自启",
        ctrl_autostart_desc: "随系统启动自动守护 EasyTier",
        ctrl_start: "启动",
        ctrl_stop: "停止",
        ctrl_restart: "重启",
        ctrl_refresh: "刷新节点与状态",
        // Peers
        peers_title: "组网 Peers",
        peers_none: "暂无对端节点",
        peers_none_desc_active: "等待连接 Peers...",
        peers_none_desc_stopped: "请先启动服务",
        peers_local_host: "本机",
        peers_unknown_host: "未知主机",
        peers_mode: "模式",
        peers_lat: "延时",
        peers_loss: "丢包",
        peers_traffic: "流量(收/发)",
        peers_ping_btn: "测速",
        peers_pinging: "测速中...",
        peers_ping_fail: "超时/失败",
        // 快捷配置
        cfg_title: "快捷组网配置",
        cfg_net_name: "网络名称 (Network Name)",
        cfg_net_name_desc: "加入或创建的异地组网名称",
        cfg_net_secret: "网络密码 (Network Secret)",
        cfg_net_secret_desc: "用于组网节点间通信认证与加密",
        cfg_show_secret: "显示密码",
        cfg_vip: "虚拟 IPv4 (可选)",
        cfg_vip_desc: "如 10.144.144.202/24，留空则由网络自动分配",
        cfg_hostname: "主机名称 (Hostname)",
        cfg_hostname_desc: "在组网 Peers 中展示的设备名",
        // 联机优化
        opt_title: "联机与性能优化",
        opt_udp: "UDP 广播转发",
        opt_udp_desc: "局域网联机搜房必备 (帕鲁/求生之路/MC等)",
        opt_latency: "延迟优先传输",
        opt_latency_desc: "自动探测物理最优路线，联机对战首选",
        opt_smoltcp: "SmolTCP 协议栈加速",
        opt_smoltcp_desc: "启用独立高性能用户态 TCP/IP 栈",
        opt_exit: "允许出口节点 (Exit Node)",
        opt_exit_desc: "支持将流量通过指定节点转发出口",
        // 对端 Peers
        peer_cfg_title: "对端 Peers 节点配置",
        peer_cfg_hint: "每行一个对端 URI（如 tcp://public.easytier.top:11010）:",
        peer_cfg_add_public: "➕ 一键追加官方公共节点",
        peer_cfg_save: "💾 保存配置并应用重启",
        // 高级 TOML
        adv_title: "高级配置",
        adv_toml_toggle: "编辑原始 config.toml",
        adv_toml_desc: "展开直接查看与编辑完整的 TOML 文件",
        adv_toml_save: "保存原始 TOML 配置",
        // Web 控制台
        web_title: "内置 Web 控制台",
        web_status: "Web 管理服务",
        web_status_listening: "正在监听端口",
        web_open_btn: "🚀 在 Steam 浏览器中打开 Web 仪表盘",
        web_remote_title: "远程与移动端管理",
        web_local: "本机访问 (Steam Deck)",
        web_lan: "📱 局域网 Wi-Fi 访问 (推荐手机/PC)",
        web_easytier: "🌐 EasyTier 异地组网内访问",
        web_hint: "提示：只要手机或电脑连接同一个 Wi-Fi，在浏览器中输入上述「局域网 Wi-Fi 访问」地址，即可免除手柄输入、用键盘鼠标惬意管理组网与配置！",
        web_cloud_title: "官方云端控制台",
        web_cloud_service: "官方可视化管理平台",
        web_cloud_desc: "EasyTier 官方提供了统一的多设备云端配置与状态服务。可在 PC 端登录官方平台，统筹下发网络拓扑。",
        // 语言选择
        lang_title: "界面语言设置",
        lang_label: "语言偏好",
        lang_auto: "自动 (跟随 SteamOS)",
        lang_en: "English (英语)",
        lang_zh: "简体中文",
        lang_ja: "日本語 (日语)",
        // Toasts
        toast_install_start: "正在在线下载官方核心组件，请稍候...",
        toast_install_ok: "核心安装成功并就绪！",
        toast_install_fail: "安装失败: ",
        toast_start_ok: "服务已启动",
        toast_start_fail: "启动失败",
        toast_stop_ok: "服务已停止",
        toast_stop_fail: "停止失败",
        toast_restart_ok: "服务已重启",
        toast_restart_fail: "重启失败",
        toast_autostart_on: "已开启开机自启",
        toast_autostart_off: "已关闭开机自启",
        toast_added_public: "已追加官方公共节点",
        toast_enter_net_name: "请填写网络名称",
        toast_save_ok: "配置已保存并重载",
        toast_save_fail: "配置保存失败",
        toast_save_raw_ok: "原始配置已保存",
        toast_open_web: "正在打开 Web 控制台...",
    },
    ja: {
        plugin_title: "EasyTier 管理",
        tab_status: "ステータス",
        tab_config: "設定",
        tab_web: "WebUI",
        // コア導入
        core_install_title: "🚀 コアワンクリック導入",
        core_install_not_found: "EasyTier コアが見つかりません",
        core_install_desc: "easytier-core が未導入です。下のボタンを押すと公式の最新 x86_64 コアを自動ダウンロードし、デーモンを初期化します。端末コマンドの入力は一切不要です。",
        core_install_btn: "🚀 EasyTier コアを自動取得・インストール",
        core_installing: "コアのダウンロードと配置を実行中...",
        core_reinstall: "再インストール / 更新",
        core_updating: "更新中...",
        core_ready: "準備完了",
        // 実行ステータス
        status_title: "実行ステータス",
        status_core_ver: "コアバージョン",
        status_service: "サービス状態",
        status_running: "実行中",
        status_stopped: "停止中",
        status_vip: "仮想 IP",
        status_fetching: "取得中...",
        status_hostname: "ホスト名",
        status_nat: "NAT タイプ",
        status_unknown: "不明",
        status_peer_id: "Peer ID",
        // サービス制御
        ctrl_title: "サービス制御",
        ctrl_autostart: "OS起動時に自動起動",
        ctrl_autostart_desc: "SteamOS 起動時に EasyTier をバックグラウンド実行",
        ctrl_start: "起動",
        ctrl_stop: "停止",
        ctrl_restart: "再起動",
        ctrl_refresh: "ピアと状態を更新",
        // ピア一覧
        peers_title: "ピア一覧",
        peers_none: "接続中のピアはありません",
        peers_none_desc_active: "ピアの接続待機中...",
        peers_none_desc_stopped: "サービスを起動してください",
        peers_local_host: "本体",
        peers_unknown_host: "不明なホスト",
        peers_mode: "モード",
        peers_lat: "遅延",
        peers_loss: "パケロス",
        peers_traffic: "通信量(受信/送信)",
        peers_ping_btn: "測定",
        peers_pinging: "測定中...",
        peers_ping_fail: "タイムアウト/失敗",
        // 簡易設定
        cfg_title: "簡易ネットワーク設定",
        cfg_net_name: "ネットワーク名 (Network Name)",
        cfg_net_name_desc: "参加または新規作成する仮想ネットワーク名",
        cfg_net_secret: "パスワード (Network Secret)",
        cfg_net_secret_desc: "ノード間の認証と暗号化に使用する秘密鍵",
        cfg_show_secret: "パスワードを表示",
        cfg_vip: "仮想 IPv4 (任意)",
        cfg_vip_desc: "例: 10.144.144.202/24、空欄時は自動割り当て",
        cfg_hostname: "ホスト名 (Hostname)",
        cfg_hostname_desc: "ピア一覧に表示されるデバイス名",
        // 通信最適化
        opt_title: "マルチプレイ通信最適化",
        opt_udp: "UDP ブロードキャスト転送",
        opt_udp_desc: "LAN サーバー検索に必須 (パルワールド/L4D2/マイクラなど)",
        opt_latency: "遅延優先ルーティング",
        opt_latency_desc: "物理的な最短経路を優先探索。対戦プレイ推奨",
        opt_smoltcp: "SmolTCP スタック高速化",
        opt_smoltcp_desc: "高性能なユーザー空間 TCP/IP スタックを有効化",
        opt_exit: "出口ノード許可 (Exit Node)",
        opt_exit_desc: "指定したノードを経由してインターネットに接続可能",
        // 接続ピア
        peer_cfg_title: "接続ピア (公開ノード) 設定",
        peer_cfg_hint: "1行に1つのピア URI を入力 (例: tcp://public.easytier.top:11010):",
        peer_cfg_add_public: "➕ 公式パブリックピアを追加",
        peer_cfg_save: "💾 設定を保存して再起動",
        // 詳細 TOML
        adv_title: "高度な設定",
        adv_toml_toggle: "生の config.toml を直接編集",
        adv_toml_desc: "TOML 設定ファイル全文を直接確認・編集",
        adv_toml_save: "TOML 設定を保存",
        // Web コンソール
        web_title: "内蔵 Web コンソール",
        web_status: "Web サーバー状態",
        web_status_listening: "リッスン中のポート",
        web_open_btn: "🚀 Steam ブラウザで Web コンソールを開く",
        web_remote_title: "リモート・スマートフォン管理",
        web_local: "本体アクセス (Steam Deck)",
        web_lan: "📱 LAN Wi-Fi アクセス (スマホ・PC 推奨)",
        web_easytier: "🌐 EasyTier 仮想ネットワーク経由",
        web_hint: "ヒント: 同一 Wi-Fi に接続したスマホや PC のブラウザから上記の「LAN Wi-Fi アクセス」を開くと、キーボードを使って長いパスワードも快適に入力できます！",
        web_cloud_title: "公式クラウドダッシュボード",
        web_cloud_service: "公式クラウド管理プラットフォーム",
        web_cloud_desc: "EasyTier 公式が提供するクラウド一元管理サービスです。PC からネットワークトポロジを一括管理できます。",
        // 言語設定
        lang_title: "言語設定 (Language)",
        lang_label: "表示言語",
        lang_auto: "自動 (SteamOS に連動)",
        lang_en: "English (英語)",
        lang_zh: "简体中文 (中国語)",
        lang_ja: "日本語",
        // Toasts
        toast_install_start: "EasyTier 公式コアをダウンロード中...",
        toast_install_ok: "コアのインストールが完了し、起動しました！",
        toast_install_fail: "インストール失敗: ",
        toast_start_ok: "サービスを開始しました",
        toast_start_fail: "サービスの開始に失敗しました",
        toast_stop_ok: "サービスを停止しました",
        toast_stop_fail: "サービスの停止に失敗しました",
        toast_restart_ok: "サービスを再起動しました",
        toast_restart_fail: "サービスの再起動に失败しました",
        toast_autostart_on: "自動起動を有効にしました",
        toast_autostart_off: "自動起動を無効にしました",
        toast_added_public: "公式パブリックピアを追加しました",
        toast_enter_net_name: "ネットワーク名を入力してください",
        toast_save_ok: "設定を保存し、再読み込みしました",
        toast_save_fail: "設定の保存に失敗しました",
        toast_save_raw_ok: "TOML 設定を保存しました",
        toast_open_web: "Web コンソールを開いています...",
    },
};
const createTranslator = (lang) => {
    const dict = translations[lang] || translations.en;
    const fallback = translations.en;
    return (key) => {
        return dict[key] || fallback[key] || key;
    };
};

// 后端 API 声明
const getServiceStatus = callable("get_service_status");
const installEasyTier = callable("install_easytier");
const startService = callable("start_service");
const stopService = callable("stop_service");
const restartService = callable("restart_service");
const toggleAutostart = callable("toggle_autostart");
const getNodeInfo = callable("get_node_info");
const getPeers = callable("get_peers");
const pingTarget = callable("ping_target");
const getQuickConfig = callable("get_quick_config");
const saveQuickConfig = callable("save_quick_config");
const getConfig = callable("get_config");
const saveConfig = callable("save_config");
const openWebUi = callable("open_web_ui");
const getWebInfo = callable("get_web_info");
const Content = () => {
    const [langPref, setLangPref] = SP_REACT.useState(() => {
        try {
            const saved = localStorage.getItem("decky_easytier_lang_pref");
            if (saved === "en" || saved === "zh" || saved === "ja" || saved === "auto") {
                return saved;
            }
        }
        catch (e) { }
        return "auto";
    });
    const resolvedLang = SP_REACT.useMemo(() => getEffectiveLanguage(langPref), [langPref]);
    const t = SP_REACT.useMemo(() => createTranslator(resolvedLang), [resolvedLang]);
    const handleSetLang = (lang) => {
        setLangPref(lang);
        try {
            localStorage.setItem("decky_easytier_lang_pref", lang);
        }
        catch (e) { }
    };
    const [activeTab, setActiveTab] = SP_REACT.useState("status");
    const [loading, setLoading] = SP_REACT.useState(true);
    const [status, setStatus] = SP_REACT.useState(null);
    const [nodeInfo, setNodeInfo] = SP_REACT.useState(null);
    const [peers, setPeers] = SP_REACT.useState([]);
    const [pingResults, setPingResults] = SP_REACT.useState({});
    const [actionLoading, setActionLoading] = SP_REACT.useState(false);
    const [installingCore, setInstallingCore] = SP_REACT.useState(false);
    // 配置表单状态
    const [netName, setNetName] = SP_REACT.useState("");
    const [netSecret, setNetSecret] = SP_REACT.useState("");
    const [hostname, setHostname] = SP_REACT.useState("steamdeck");
    const [ipv4, setIpv4] = SP_REACT.useState("");
    const [peersInput, setPeersInput] = SP_REACT.useState("");
    const [showSecret, setShowSecret] = SP_REACT.useState(false);
    const [udpRelay, setUdpRelay] = SP_REACT.useState(true);
    const [latencyFirst, setLatencyFirst] = SP_REACT.useState(true);
    const [useSmoltcp, setUseSmoltcp] = SP_REACT.useState(true);
    const [enableExitNode, setEnableExitNode] = SP_REACT.useState(true);
    const [rawToml, setRawToml] = SP_REACT.useState("");
    const [showRawToml, setShowRawToml] = SP_REACT.useState(false);
    // Web 管理信息
    const [webInfo, setWebInfo] = SP_REACT.useState(null);
    const loadData = async () => {
        try {
            const s = await getServiceStatus();
            setStatus(s);
            if (s.active) {
                const [node, p] = await Promise.all([getNodeInfo(), getPeers()]);
                setNodeInfo(node);
                setPeers(p);
            }
            else {
                setNodeInfo(null);
                setPeers([]);
            }
        }
        catch (e) {
            console.error("[EasyTier] Failed to fetch status:", e);
        }
        finally {
            setLoading(false);
        }
    };
    const loadConfigData = async () => {
        try {
            const [qc, raw] = await Promise.all([getQuickConfig(), getConfig()]);
            if (qc) {
                setNetName(qc.network_name || "");
                setNetSecret(qc.network_secret || "");
                setHostname(qc.hostname || "steamdeck");
                setIpv4(qc.ipv4 || "");
                setPeersInput((qc.peers || []).join("\n"));
                setUdpRelay(qc.enable_udp_broadcast_relay !== false);
                setLatencyFirst(qc.latency_first !== false);
                setUseSmoltcp(qc.use_smoltcp !== false);
                setEnableExitNode(qc.enable_exit_node !== false);
            }
            setRawToml(raw || "");
        }
        catch (e) {
            console.error("[EasyTier] Failed to fetch config:", e);
        }
    };
    const loadWebInfo = async () => {
        try {
            const info = await getWebInfo();
            setWebInfo(info);
        }
        catch (e) {
            console.error("[EasyTier] Failed to fetch web info:", e);
        }
    };
    SP_REACT.useEffect(() => {
        loadData();
        loadConfigData();
        loadWebInfo();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);
    const handleInstallCore = async () => {
        setInstallingCore(true);
        toaster.toast({ title: "EasyTier", body: t("toast_install_start") });
        try {
            const res = await installEasyTier();
            if (res && res.success) {
                toaster.toast({ title: "EasyTier", body: res.message || t("toast_install_ok") });
                await loadData();
                await loadConfigData();
            }
            else {
                toaster.toast({ title: "EasyTier", body: `${t("toast_install_fail")}${res?.message || ""}` });
            }
        }
        catch (e) {
            toaster.toast({ title: "EasyTier", body: `${t("toast_install_fail")}${e?.message || e}` });
        }
        finally {
            setInstallingCore(false);
        }
    };
    const handleStart = async () => {
        setActionLoading(true);
        const ok = await startService();
        if (ok) {
            toaster.toast({ title: "EasyTier", body: t("toast_start_ok") });
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: t("toast_start_fail") });
        }
        setActionLoading(false);
    };
    const handleStop = async () => {
        setActionLoading(true);
        const ok = await stopService();
        if (ok) {
            toaster.toast({ title: "EasyTier", body: t("toast_stop_ok") });
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: t("toast_stop_fail") });
        }
        setActionLoading(false);
    };
    const handleRestart = async () => {
        setActionLoading(true);
        const ok = await restartService();
        if (ok) {
            toaster.toast({ title: "EasyTier", body: t("toast_restart_ok") });
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: t("toast_restart_fail") });
        }
        setActionLoading(false);
    };
    const handleToggleEnable = async (val) => {
        const ok = await toggleAutostart(val);
        if (ok) {
            toaster.toast({ title: "EasyTier", body: val ? t("toast_autostart_on") : t("toast_autostart_off") });
            await loadData();
        }
    };
    const handlePing = async (ipWithMask) => {
        const rawIp = ipWithMask.split("/")[0].trim();
        if (!rawIp)
            return;
        setPingResults((prev) => ({ ...prev, [rawIp]: t("peers_pinging") }));
        const res = await pingTarget(rawIp);
        if (res.success) {
            setPingResults((prev) => ({ ...prev, [rawIp]: `${res.avg_ms} ms` }));
        }
        else {
            setPingResults((prev) => ({ ...prev, [rawIp]: t("peers_ping_fail") }));
        }
    };
    const handleFillPublicPeers = () => {
        const defaultPeers = [
            "tcp://public.easytier.top:11010",
            "tcp://39.108.52.138:11010"
        ].join("\n");
        setPeersInput((prev) => (prev.trim() ? `${prev.trim()}\n${defaultPeers}` : defaultPeers));
        toaster.toast({ title: "EasyTier", body: t("toast_added_public") });
    };
    const handleSaveQuickConfig = async () => {
        if (!netName.trim()) {
            toaster.toast({ title: "EasyTier", body: t("toast_enter_net_name") });
            return;
        }
        setActionLoading(true);
        const peersList = peersInput
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        const ok = await saveQuickConfig({
            network_name: netName.trim(),
            network_secret: netSecret.trim(),
            hostname: hostname.trim() || "steamdeck",
            ipv4: ipv4.trim(),
            peers: peersList.length > 0 ? peersList : ["tcp://public.easytier.top:11010", "tcp://39.108.52.138:11010"],
            enable_udp_broadcast_relay: udpRelay,
            latency_first: latencyFirst,
            use_smoltcp: useSmoltcp,
            enable_exit_node: enableExitNode,
            disable_quic_input: true,
            disable_kcp_input: true,
        });
        if (ok) {
            toaster.toast({ title: "EasyTier", body: t("toast_save_ok") });
            await loadConfigData();
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: t("toast_save_fail") });
        }
        setActionLoading(false);
    };
    const handleSaveRawToml = async () => {
        setActionLoading(true);
        const ok = await saveConfig(rawToml);
        if (ok) {
            toaster.toast({ title: "EasyTier", body: t("toast_save_raw_ok") });
            await loadConfigData();
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: t("toast_save_fail") });
        }
        setActionLoading(false);
    };
    const handleOpenWebUi = async () => {
        toaster.toast({ title: "EasyTier", body: t("toast_open_web") });
        const ok = await openWebUi();
        if (!ok) {
            toaster.toast({ title: "EasyTier", body: `http://127.0.0.1:${webInfo?.port || 21010}` });
        }
    };
    if (loading && !status) {
        return (SP_JSX.jsx(DFL.PanelSection, { children: SP_JSX.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "20px" }, children: SP_JSX.jsx(DFL.Spinner, {}) }) }));
    }
    // 语言设置模块 (置于底部，方便切换)
    const languageSection = (SP_JSX.jsxs(DFL.PanelSection, { title: t("lang_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("lang_label"), description: langPref === "auto"
                        ? `${t("lang_auto")} → ${resolvedLang.toUpperCase()}`
                        : resolvedLang.toUpperCase() }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", width: "100%" }, children: [SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: () => handleSetLang("auto"), children: [SP_JSX.jsx(FaGlobe, { style: { marginRight: 4 } }), " ", langPref === "auto" ? "✓ " : "", t("lang_auto")] }), SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: () => handleSetLang("en"), children: [langPref === "en" ? "✓ " : "", t("lang_en")] }), SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: () => handleSetLang("zh"), children: [langPref === "zh" ? "✓ " : "", t("lang_zh")] }), SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: () => handleSetLang("ja"), children: [langPref === "ja" ? "✓ " : "", t("lang_ja")] })] }) })] }));
    // Tab 1: 运行状态
    const statusContent = (SP_JSX.jsxs("div", { children: [status && !status.installed && (SP_JSX.jsxs(DFL.PanelSection, { title: t("core_install_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("core_install_not_found"), description: t("core_install_desc") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleInstallCore, disabled: installingCore || actionLoading, children: installingCore ? (SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }, children: [SP_JSX.jsx(DFL.Spinner, {}), " ", t("core_installing")] })) : (t("core_install_btn")) }) })] })), SP_JSX.jsxs(DFL.PanelSection, { title: t("status_title"), children: [status?.core_installed && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("status_core_ver"), description: status.core_version ? `v${status.core_version}` : t("core_ready"), children: SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: handleInstallCore, disabled: installingCore || actionLoading, children: installingCore ? t("core_updating") : t("core_reinstall") }) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("status_service"), description: status?.active ? t("status_running") : t("status_stopped"), children: SP_JSX.jsx("span", { style: { color: status?.active ? "#4caf50" : "#f44336", fontWeight: "bold" }, children: status?.active ? "● ACTIVE" : "● STOPPED" }) }) }), status?.active && nodeInfo && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("status_vip"), description: nodeInfo.virtual_ip || t("status_fetching") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("status_hostname"), description: nodeInfo.hostname || "steamdeck" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("status_nat"), description: nodeInfo.nat_type || t("status_unknown") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("status_peer_id"), description: nodeInfo.peer_id || "-" }) })] }))] }), SP_JSX.jsxs(DFL.PanelSection, { title: t("ctrl_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: t("ctrl_autostart"), description: t("ctrl_autostart_desc"), checked: status?.enabled ?? false, onChange: handleToggleEnable, disabled: actionLoading }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: [SP_JSX.jsx("div", { style: { flex: 1 }, children: !status?.active ? (SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: handleStart, disabled: actionLoading, children: [SP_JSX.jsx(FaPlay, { style: { marginRight: 6 } }), " ", t("ctrl_start")] })) : (SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: handleStop, disabled: actionLoading, children: [SP_JSX.jsx(FaStop, { style: { marginRight: 6 } }), " ", t("ctrl_stop")] })) }), SP_JSX.jsx("div", { style: { flex: 1 }, children: SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: handleRestart, disabled: actionLoading, children: [SP_JSX.jsx(FaRedo, { style: { marginRight: 6 } }), " ", t("ctrl_restart")] }) })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: loadData, disabled: actionLoading, children: t("ctrl_refresh") }) })] }), SP_JSX.jsx(DFL.PanelSection, { title: `${t("peers_title")} (${peers.length})`, children: peers.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("peers_none"), description: status?.active ? t("peers_none_desc_active") : t("peers_none_desc_stopped") }) })) : (peers.map((peer, idx) => {
                    const isLocal = peer.cost.toLowerCase() === "local";
                    const isP2P = peer.cost.toLowerCase().includes("p2p");
                    const rawIp = peer.ipv4.split("/")[0].trim();
                    const pingText = pingResults[rawIp];
                    const traffic = `${peer.rx || "0 B"} / ${peer.tx || "0 B"}`;
                    return (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: peer.hostname || (isLocal ? t("peers_local_host") : t("peers_unknown_host")), description: SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("div", { children: ["IP: ", peer.ipv4] }), SP_JSX.jsxs("div", { children: [t("peers_mode"), ":", " ", SP_JSX.jsx("span", { style: { color: isLocal ? "#8bc34a" : isP2P ? "#4caf50" : "#ff9800" }, children: peer.cost.toUpperCase() }), " | ", t("peers_lat"), ": ", peer.latency || "-", " | ", t("peers_loss"), ": ", peer.loss || "0%"] }), SP_JSX.jsxs("div", { style: { fontSize: "11px", color: "#8b949e", marginTop: "2px" }, children: [t("peers_traffic"), ": ", traffic] }), pingText && (SP_JSX.jsxs("div", { style: { color: "#00e5ff", marginTop: "2px" }, children: ["Ping: ", pingText] }))] }), children: !isLocal && rawIp && (SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: () => handlePing(peer.ipv4), disabled: actionLoading, children: t("peers_ping_btn") })) }) }, idx));
                })) }), languageSection] }));
    // Tab 2: 网络配置
    const configContent = (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs(DFL.PanelSection, { title: t("cfg_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: t("cfg_net_name"), description: t("cfg_net_name_desc"), value: netName, onChange: (e) => setNetName(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: t("cfg_net_secret"), description: t("cfg_net_secret_desc"), value: netSecret, bIsPassword: !showSecret, onChange: (e) => setNetSecret(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: t("cfg_show_secret"), checked: showSecret, onChange: setShowSecret }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: t("cfg_vip"), description: t("cfg_vip_desc"), value: ipv4, onChange: (e) => setIpv4(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: t("cfg_hostname"), description: t("cfg_hostname_desc"), value: hostname, onChange: (e) => setHostname(e.target.value) }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: t("opt_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: t("opt_udp"), description: t("opt_udp_desc"), checked: udpRelay, onChange: setUdpRelay }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: t("opt_latency"), description: t("opt_latency_desc"), checked: latencyFirst, onChange: setLatencyFirst }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: t("opt_smoltcp"), description: t("opt_smoltcp_desc"), checked: useSmoltcp, onChange: setUseSmoltcp }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: t("opt_exit"), description: t("opt_exit_desc"), checked: enableExitNode, onChange: setEnableExitNode }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: t("peer_cfg_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { width: "100%" }, children: [SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#8b949e", marginBottom: "6px" }, children: t("peer_cfg_hint") }), SP_JSX.jsx("textarea", { style: {
                                        width: "100%",
                                        height: "90px",
                                        background: "#0e141b",
                                        color: "#dcdedf",
                                        border: "1px solid rgba(255,255,255,0.25)",
                                        borderRadius: "6px",
                                        padding: "8px",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                        boxSizing: "border-box",
                                        resize: "vertical",
                                    }, tabIndex: 0, onFocus: () => {
                                        try {
                                            window.SteamClient?.System?.ShowVirtualKeyboard?.();
                                        }
                                        catch (e) { }
                                    }, value: peersInput, onChange: (e) => setPeersInput(e.target.value) })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleFillPublicPeers, children: t("peer_cfg_add_public") }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleSaveQuickConfig, disabled: actionLoading, children: t("peer_cfg_save") }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: t("adv_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: t("adv_toml_toggle"), description: t("adv_toml_desc"), checked: showRawToml, onChange: setShowRawToml }) }), showRawToml && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("textarea", { style: {
                                        width: "100%",
                                        height: "160px",
                                        background: "#0e141b",
                                        color: "#dcdedf",
                                        border: "1px solid rgba(255,255,255,0.25)",
                                        borderRadius: "6px",
                                        padding: "8px",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                        boxSizing: "border-box",
                                        resize: "vertical",
                                    }, tabIndex: 0, onFocus: () => {
                                        try {
                                            window.SteamClient?.System?.ShowVirtualKeyboard?.();
                                        }
                                        catch (e) { }
                                    }, value: rawToml, onChange: (e) => setRawToml(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleSaveRawToml, disabled: actionLoading, children: t("adv_toml_save") }) })] }))] })] }));
    // Tab 3: Web 端管理
    const webContent = (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs(DFL.PanelSection, { title: t("web_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("web_status"), description: `${t("web_status_listening")}: ${webInfo?.port || 21010}`, children: SP_JSX.jsx("span", { style: { color: "#4caf50", fontWeight: "bold" }, children: "\u25CF RUNNING" }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleOpenWebUi, children: t("web_open_btn") }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: t("web_remote_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("web_local"), description: webInfo?.url_local || "http://127.0.0.1:21010" }) }), webInfo?.url_lan && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("web_lan"), description: webInfo.url_lan }) })), webInfo?.url_easytier && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("web_easytier"), description: webInfo.url_easytier }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }, children: t("web_hint") }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: t("web_cloud_title"), children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: t("web_cloud_service"), description: "https://config-server.easytier.cn" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }, children: t("web_cloud_desc") }) })] })] }));
    const tabs = [
        {
            id: "status",
            title: t("tab_status"),
            content: statusContent,
        },
        {
            id: "config",
            title: t("tab_config"),
            content: configContent,
        },
        {
            id: "web",
            title: t("tab_web"),
            content: webContent,
        },
    ];
    const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsx(DFL.Tabs, { tabs: tabs, activeTab: activeTab, onShowTab: setActiveTab }), SP_JSX.jsx("div", { style: { marginTop: "10px" }, children: currentTab.content })] }));
};
var index = definePlugin(() => {
    return {
        name: "decky-easytier",
        titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "EasyTier" }),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaNetworkWired, {}),
        onDismount() { },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
