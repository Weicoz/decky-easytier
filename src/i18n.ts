export type SupportedLang = "auto" | "en" | "zh" | "ja";
export type ResolvedLang = "en" | "zh" | "ja";

export const detectSystemLanguage = (): ResolvedLang => {
  try {
    let raw = "";
    if (typeof window !== "undefined" && window.navigator) {
      raw = window.navigator.languages?.[0] || window.navigator.language || "";
    }
    raw = raw.toLowerCase();
    if (raw.startsWith("zh")) return "zh";
    if (raw.startsWith("ja")) return "ja";
  } catch (e) {
    // fallback
  }
  return "en";
};

export const getEffectiveLanguage = (pref: SupportedLang): ResolvedLang => {
  if (pref === "auto") {
    return detectSystemLanguage();
  }
  return pref;
};

export const translations = {
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

export const createTranslator = (lang: ResolvedLang) => {
  const dict = translations[lang] || translations.en;
  const fallback = translations.en;
  return (key: keyof typeof translations.en): string => {
    return (dict as any)[key] || (fallback as any)[key] || key;
  };
};
