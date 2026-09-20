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
}

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
        toaster.toast({ title: "EasyTier", body: "正在在线下载官方核心组件，请稍候..." });
        try {
            const res = await installEasyTier();
            if (res && res.success) {
                toaster.toast({ title: "EasyTier", body: res.message || "核心安装成功并就绪！" });
                await loadData();
                await loadConfigData();
            }
            else {
                toaster.toast({ title: "EasyTier", body: `安装失败: ${res?.message || "网络或解压异常"}` });
            }
        }
        catch (e) {
            toaster.toast({ title: "EasyTier", body: `安装异常: ${e?.message || e}` });
        }
        finally {
            setInstallingCore(false);
        }
    };
    const handleStart = async () => {
        setActionLoading(true);
        const ok = await startService();
        if (ok) {
            toaster.toast({ title: "EasyTier", body: "服务已启动" });
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: "启动失败" });
        }
        setActionLoading(false);
    };
    const handleStop = async () => {
        setActionLoading(true);
        const ok = await stopService();
        if (ok) {
            toaster.toast({ title: "EasyTier", body: "服务已停止" });
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: "停止失败" });
        }
        setActionLoading(false);
    };
    const handleRestart = async () => {
        setActionLoading(true);
        const ok = await restartService();
        if (ok) {
            toaster.toast({ title: "EasyTier", body: "服务已重启" });
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: "重启失败" });
        }
        setActionLoading(false);
    };
    const handleToggleEnable = async (val) => {
        const ok = await toggleAutostart(val);
        if (ok) {
            toaster.toast({ title: "EasyTier", body: val ? "已开启开机自启" : "已关闭开机自启" });
            await loadData();
        }
    };
    const handlePing = async (ipWithMask) => {
        const rawIp = ipWithMask.split("/")[0].trim();
        if (!rawIp)
            return;
        setPingResults((prev) => ({ ...prev, [rawIp]: "测速中..." }));
        const res = await pingTarget(rawIp);
        if (res.success) {
            setPingResults((prev) => ({ ...prev, [rawIp]: `${res.avg_ms} ms` }));
        }
        else {
            setPingResults((prev) => ({ ...prev, [rawIp]: "超时/失败" }));
        }
    };
    const handleFillPublicPeers = () => {
        const defaultPeers = [
            "tcp://public.easytier.top:11010",
            "tcp://39.108.52.138:11010"
        ].join("\n");
        setPeersInput((prev) => (prev.trim() ? `${prev.trim()}\n${defaultPeers}` : defaultPeers));
        toaster.toast({ title: "EasyTier", body: "已追加官方公共节点" });
    };
    const handleSaveQuickConfig = async () => {
        if (!netName.trim()) {
            toaster.toast({ title: "EasyTier", body: "请填写网络名称" });
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
            toaster.toast({ title: "EasyTier", body: "配置已保存并重载" });
            await loadConfigData();
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: "配置保存失败" });
        }
        setActionLoading(false);
    };
    const handleSaveRawToml = async () => {
        setActionLoading(true);
        const ok = await saveConfig(rawToml);
        if (ok) {
            toaster.toast({ title: "EasyTier", body: "原始配置已保存" });
            await loadConfigData();
            await loadData();
        }
        else {
            toaster.toast({ title: "EasyTier", body: "保存失败" });
        }
        setActionLoading(false);
    };
    const handleOpenWebUi = async () => {
        const ok = await openWebUi();
        if (ok) {
            toaster.toast({ title: "EasyTier", body: "正在打开 Web 控制台..." });
        }
        else {
            toaster.toast({ title: "EasyTier", body: `请在浏览器访问 http://127.0.0.1:${webInfo?.port || 21010}` });
        }
    };
    if (loading && !status) {
        return (SP_JSX.jsx(DFL.PanelSection, { children: SP_JSX.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "20px" }, children: SP_JSX.jsx(DFL.Spinner, {}) }) }));
    }
    // Tab 1: 运行状态
    const statusContent = (SP_JSX.jsxs("div", { children: [status && !status.installed && (SP_JSX.jsxs(DFL.PanelSection, { title: "\uD83D\uDE80 \u6838\u5FC3\u7EC4\u4EF6\u4E00\u952E\u5B89\u88C5", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u672A\u68C0\u6D4B\u5230 EasyTier \u6838\u5FC3", description: "\u7CFB\u7EDF\u5C1A\u672A\u5B89\u88C5\u6216\u672A\u68C0\u6D4B\u5230 easytier-core\u3002\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u5373\u53EF\u4E00\u952E\u5728\u7EBF\u4E0B\u8F7D\u5B98\u65B9\u6700\u65B0 x86_64 \u6838\u5FC3\u5E76\u81EA\u52A8\u521D\u59CB\u5316\u7CFB\u7EDF\u5B88\u62A4\u670D\u52A1\uFF0C\u514D\u53BB\u7EC8\u7AEF\u547D\u4EE4\u884C\u64CD\u4F5C\u3002" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleInstallCore, disabled: installingCore || actionLoading, children: installingCore ? (SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }, children: [SP_JSX.jsx(DFL.Spinner, {}), " \u6B63\u5728\u4E0B\u8F7D\u4E0E\u90E8\u7F72\u6838\u5FC3\u7EC4\u4EF6..."] })) : ("🚀 一键在线下载并安装 EasyTier 核心") }) })] })), SP_JSX.jsxs(DFL.PanelSection, { title: "\u8FD0\u884C\u72B6\u6001", children: [status?.core_installed && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u6838\u5FC3\u7248\u672C", description: status.core_version ? `v${status.core_version}` : "已就绪", children: SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: handleInstallCore, disabled: installingCore || actionLoading, children: installingCore ? "更新中..." : "重新安装/更新" }) }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u670D\u52A1\u72B6\u6001", description: status?.active ? "正在运行中" : "已停止", children: SP_JSX.jsx("span", { style: { color: status?.active ? "#4caf50" : "#f44336", fontWeight: "bold" }, children: status?.active ? "● ACTIVE" : "● STOPPED" }) }) }), status?.active && nodeInfo && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u865A\u62DF IP", description: nodeInfo.virtual_ip || "获取中..." }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u4E3B\u673A\u540D", description: nodeInfo.hostname || "steamdeck" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "NAT \u6253\u6D1E\u7C7B\u578B", description: nodeInfo.nat_type || "未知" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Peer ID", description: nodeInfo.peer_id || "-" }) })] }))] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u670D\u52A1\u63A7\u5236", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u5F00\u673A\u81EA\u542F", description: "\u968F\u7CFB\u7EDF\u542F\u52A8\u81EA\u52A8\u5B88\u62A4 EasyTier", checked: status?.enabled ?? false, onChange: handleToggleEnable, disabled: actionLoading }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { display: "flex", gap: "8px", width: "100%" }, children: [SP_JSX.jsx("div", { style: { flex: 1 }, children: !status?.active ? (SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: handleStart, disabled: actionLoading, children: [SP_JSX.jsx(FaPlay, { style: { marginRight: 6 } }), " \u542F\u52A8"] })) : (SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: handleStop, disabled: actionLoading, children: [SP_JSX.jsx(FaStop, { style: { marginRight: 6 } }), " \u505C\u6B62"] })) }), SP_JSX.jsx("div", { style: { flex: 1 }, children: SP_JSX.jsxs(DFL.ButtonItem, { layout: "inline", onClick: handleRestart, disabled: actionLoading, children: [SP_JSX.jsx(FaRedo, { style: { marginRight: 6 } }), " \u91CD\u542F"] }) })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: loadData, disabled: actionLoading, children: "\u5237\u65B0\u8282\u70B9\u4E0E\u72B6\u6001" }) })] }), SP_JSX.jsx(DFL.PanelSection, { title: `组网 Peers (${peers.length})`, children: peers.length === 0 ? (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u6682\u65E0\u5BF9\u7AEF\u8282\u70B9", description: status?.active ? "等待连接 Peers..." : "请先启动服务" }) })) : (peers.map((peer, idx) => {
                    const isLocal = peer.cost.toLowerCase() === "local";
                    const isP2P = peer.cost.toLowerCase().includes("p2p");
                    const rawIp = peer.ipv4.split("/")[0].trim();
                    const pingText = pingResults[rawIp];
                    const traffic = `${peer.rx || "0 B"} / ${peer.tx || "0 B"}`;
                    return (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: peer.hostname || (isLocal ? "本机" : "未知主机"), description: SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("div", { children: ["IP: ", peer.ipv4] }), SP_JSX.jsxs("div", { children: ["\u6A21\u5F0F:", " ", SP_JSX.jsx("span", { style: { color: isLocal ? "#8bc34a" : isP2P ? "#4caf50" : "#ff9800" }, children: peer.cost.toUpperCase() }), " | ", "\u5EF6\u65F6: ", peer.latency || "-", " | ", "\u4E22\u5305: ", peer.loss || "0%"] }), SP_JSX.jsxs("div", { style: { fontSize: "11px", color: "#8b949e", marginTop: "2px" }, children: ["\u6D41\u91CF(\u6536/\u53D1): ", traffic] }), pingText && (SP_JSX.jsxs("div", { style: { color: "#00e5ff", marginTop: "2px" }, children: ["Ping \u6D4B\u901F: ", pingText] }))] }), children: !isLocal && rawIp && (SP_JSX.jsx(DFL.ButtonItem, { layout: "inline", onClick: () => handlePing(peer.ipv4), disabled: actionLoading, children: "\u6D4B\u901F" })) }) }, idx));
                })) })] }));
    // Tab 2: 网络配置
    const configContent = (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs(DFL.PanelSection, { title: "\u5FEB\u6377\u7EC4\u7F51\u914D\u7F6E", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u7F51\u7EDC\u540D\u79F0 (Network Name)", description: "\u52A0\u5165\u6216\u521B\u5EFA\u7684\u5F02\u5730\u7EC4\u7F51\u540D\u79F0", value: netName, onChange: (e) => setNetName(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u7F51\u7EDC\u5BC6\u7801 (Network Secret)", description: "\u7528\u4E8E\u7EC4\u7F51\u8282\u70B9\u95F4\u901A\u4FE1\u8BA4\u8BC1\u4E0E\u52A0\u5BC6", value: netSecret, bIsPassword: !showSecret, onChange: (e) => setNetSecret(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u663E\u793A\u5BC6\u7801", checked: showSecret, onChange: setShowSecret }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u865A\u62DF IPv4 (\u53EF\u9009)", description: "\u5982 10.144.144.202/24\uFF0C\u7559\u7A7A\u5219\u7531\u7F51\u7EDC\u81EA\u52A8\u5206\u914D", value: ipv4, onChange: (e) => setIpv4(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.TextField, { label: "\u4E3B\u673A\u540D\u79F0 (Hostname)", description: "\u5728\u7EC4\u7F51 Peers \u4E2D\u5C55\u793A\u7684\u8BBE\u5907\u540D", value: hostname, onChange: (e) => setHostname(e.target.value) }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u8054\u673A\u4E0E\u6027\u80FD\u4F18\u5316", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "UDP \u5E7F\u64AD\u8F6C\u53D1", description: "\u5C40\u57DF\u7F51\u8054\u673A\u641C\u623F\u5FC5\u5907 (\u5E15\u9C81/\u6C42\u751F\u4E4B\u8DEF/MC\u7B49)", checked: udpRelay, onChange: setUdpRelay }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u5EF6\u8FDF\u4F18\u5148\u4F20\u8F93", description: "\u81EA\u52A8\u63A2\u6D4B\u7269\u7406\u6700\u4F18\u8DEF\u7EBF\uFF0C\u8054\u673A\u5BF9\u6218\u9996\u9009", checked: latencyFirst, onChange: setLatencyFirst }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "SmolTCP \u534F\u8BAE\u6808\u52A0\u901F", description: "\u542F\u7528\u72EC\u7ACB\u9AD8\u6027\u80FD\u7528\u6237\u6001 TCP/IP \u6808", checked: useSmoltcp, onChange: setUseSmoltcp }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u5141\u8BB8\u51FA\u53E3\u8282\u70B9 (Exit Node)", description: "\u652F\u6301\u5C06\u6D41\u91CF\u901A\u8FC7\u6307\u5B9A\u8282\u70B9\u8F6C\u53D1\u51FA\u53E3", checked: enableExitNode, onChange: setEnableExitNode }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u5BF9\u7AEF Peers \u8282\u70B9\u914D\u7F6E", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsxs("div", { style: { width: "100%" }, children: [SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#8b949e", marginBottom: "6px" }, children: "\u6BCF\u884C\u4E00\u4E2A\u5BF9\u7AEF URI\uFF08\u5982 tcp://public.easytier.top:11010\uFF09:" }), SP_JSX.jsx("textarea", { style: {
                                        width: "100%",
                                        height: "90px",
                                        background: "#0e141b",
                                        color: "#dcdedf",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: "4px",
                                        padding: "8px",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                    }, value: peersInput, onChange: (e) => setPeersInput(e.target.value) })] }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleFillPublicPeers, children: "\u2795 \u4E00\u952E\u8FFD\u52A0\u5B98\u65B9\u516C\u5171\u8282\u70B9" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleSaveQuickConfig, disabled: actionLoading, children: "\uD83D\uDCBE \u4FDD\u5B58\u914D\u7F6E\u5E76\u5E94\u7528\u91CD\u542F" }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u9AD8\u7EA7\u914D\u7F6E", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ToggleField, { label: "\u7F16\u8F91\u539F\u59CB config.toml", description: "\u5C55\u5F00\u76F4\u63A5\u67E5\u770B\u4E0E\u7F16\u8F91\u5B8C\u6574\u7684 TOML \u6587\u4EF6", checked: showRawToml, onChange: setShowRawToml }) }), showRawToml && (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("textarea", { style: {
                                        width: "100%",
                                        height: "160px",
                                        background: "#0e141b",
                                        color: "#dcdedf",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        borderRadius: "4px",
                                        padding: "8px",
                                        fontFamily: "monospace",
                                        fontSize: "12px",
                                    }, value: rawToml, onChange: (e) => setRawToml(e.target.value) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleSaveRawToml, disabled: actionLoading, children: "\u4FDD\u5B58\u539F\u59CB TOML \u914D\u7F6E" }) })] }))] })] }));
    // Tab 3: Web 端管理
    const webContent = (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs(DFL.PanelSection, { title: "\u5185\u7F6E Web \u63A7\u5236\u53F0", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "Web \u7BA1\u7406\u670D\u52A1", description: `运行状态: 正在监听端口 ${webInfo?.port || 21010}`, children: SP_JSX.jsx("span", { style: { color: "#4caf50", fontWeight: "bold" }, children: "\u25CF RUNNING" }) }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: handleOpenWebUi, children: "\uD83D\uDE80 \u5728 Steam \u6D4F\u89C8\u5668\u4E2D\u6253\u5F00 Web \u4EEA\u8868\u76D8" }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u8FDC\u7A0B\u4E0E\u79FB\u52A8\u7AEF\u7BA1\u7406", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u672C\u673A\u8BBF\u95EE (Steam Deck)", description: webInfo?.url_local || "http://127.0.0.1:21010" }) }), webInfo?.url_lan && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\uD83D\uDCF1 \u5C40\u57DF\u7F51 Wi-Fi \u8BBF\u95EE (\u63A8\u8350\u624B\u673A/PC)", description: webInfo.url_lan }) })), webInfo?.url_easytier && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\uD83C\uDF10 EasyTier \u5F02\u5730\u7EC4\u7F51\u5185\u8BBF\u95EE", description: webInfo.url_easytier }) })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }, children: "\u63D0\u793A\uFF1A\u53EA\u8981\u624B\u673A\u6216\u7535\u8111\u8FDE\u63A5\u540C\u4E00\u4E2A Wi-Fi\uFF0C\u5728\u6D4F\u89C8\u5668\u4E2D\u8F93\u5165\u4E0A\u8FF0\u300C\u5C40\u57DF\u7F51 Wi-Fi \u8BBF\u95EE\u300D\u5730\u5740\uFF0C\u5373\u53EF\u514D\u9664\u624B\u67C4\u8F93\u5165\u3001\u7528\u952E\u76D8\u9F20\u6807\u60EC\u610F\u7BA1\u7406\u7EC4\u7F51\u4E0E\u914D\u7F6E\uFF01" }) })] }), SP_JSX.jsxs(DFL.PanelSection, { title: "\u5B98\u65B9\u4E91\u7AEF\u63A7\u5236\u53F0", children: [SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.Field, { label: "\u5B98\u65B9\u53EF\u89C6\u5316\u7BA1\u7406\u5E73\u53F0", description: "https://config-server.easytier.cn" }) }), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx("div", { style: { fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }, children: "EasyTier \u5B98\u65B9\u63D0\u4F9B\u4E86\u7EDF\u4E00\u7684\u591A\u8BBE\u5907\u4E91\u7AEF\u914D\u7F6E\u4E0E\u72B6\u6001\u670D\u52A1\u3002\u53EF\u5728 PC \u7AEF\u767B\u5F55\u5B98\u65B9\u5E73\u53F0\uFF0C\u7EDF\u7B79\u4E0B\u53D1\u7F51\u7EDC\u62D3\u6251\u3002" }) })] })] }));
    const tabs = [
        {
            id: "status",
            title: "状态",
            content: statusContent,
        },
        {
            id: "config",
            title: "配置",
            content: configContent,
        },
        {
            id: "web",
            title: "WebUI",
            content: webContent,
        },
    ];
    return (SP_JSX.jsx("div", { children: SP_JSX.jsx(DFL.Tabs, { tabs: tabs, activeTab: activeTab, onShowTab: setActiveTab }) }));
};
var index = definePlugin(() => {
    return {
        name: "decky-easytier",
        titleView: SP_JSX.jsx("div", { className: DFL.staticClasses.Title, children: "EasyTier \u7BA1\u7406\u5668" }),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaNetworkWired, {}),
        onDismount() { },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
