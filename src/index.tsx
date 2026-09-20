import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  ToggleField,
  Field,
  TextField,
  Tabs,
  staticClasses,
  Spinner,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { FC, useEffect, useState } from "react";
import { FaNetworkWired, FaPlay, FaStop, FaRedo } from "react-icons/fa";

interface ServiceStatus {
  installed: boolean;
  active: boolean;
  status: string;
  enabled: boolean;
}

interface NodeInfo {
  virtual_ip?: string;
  hostname?: string;
  peer_id?: string;
  public_ipv4?: string;
  nat_type?: string;
  listeners?: string[];
  error?: string;
}

interface PeerInfo {
  ipv4: string;
  hostname: string;
  cost: string;
  latency: string;
  loss: string;
  rx: string;
  tx: string;
  tunnel: string;
  nat: string;
  version: string;
}

interface QuickConfig {
  network_name: string;
  network_secret: string;
  hostname: string;
  ipv4: string;
  dhcp?: boolean;
  peers: string[];
  latency_first?: boolean;
  enable_udp_broadcast_relay?: boolean;
  use_smoltcp?: boolean;
  enable_exit_node?: boolean;
  disable_quic_input?: boolean;
  disable_kcp_input?: boolean;
}

interface WebInfo {
  port: number;
  url_local: string;
  primary_lan?: string;
  url_lan?: string;
  easytier_ip?: string;
  url_easytier?: string;
  urls: string[];
}

// 后端 API 声明
const getServiceStatus = callable<[], ServiceStatus>("get_service_status");
const startService = callable<[], boolean>("start_service");
const stopService = callable<[], boolean>("stop_service");
const restartService = callable<[], boolean>("restart_service");
const toggleAutostart = callable<[enable: boolean], boolean>("toggle_autostart");
const getNodeInfo = callable<[], NodeInfo>("get_node_info");
const getPeers = callable<[], PeerInfo[]>("get_peers");
const pingTarget = callable<[target_ip: string], { success: boolean; avg_ms?: string; error?: string }>("ping_target");
const getQuickConfig = callable<[], QuickConfig>("get_quick_config");
const saveQuickConfig = callable<[cfg: QuickConfig], boolean>("save_quick_config");
const getConfig = callable<[], string>("get_config");
const saveConfig = callable<[content: string], boolean>("save_config");
const openWebUi = callable<[], boolean>("open_web_ui");
const getWebInfo = callable<[], WebInfo>("get_web_info");

const Content: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("status");
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [pingResults, setPingResults] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // 配置表单状态
  const [netName, setNetName] = useState<string>("");
  const [netSecret, setNetSecret] = useState<string>("");
  const [hostname, setHostname] = useState<string>("steamdeck");
  const [ipv4, setIpv4] = useState<string>("");
  const [peersInput, setPeersInput] = useState<string>("");
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [udpRelay, setUdpRelay] = useState<boolean>(true);
  const [latencyFirst, setLatencyFirst] = useState<boolean>(true);
  const [useSmoltcp, setUseSmoltcp] = useState<boolean>(true);
  const [enableExitNode, setEnableExitNode] = useState<boolean>(true);
  const [rawToml, setRawToml] = useState<string>("");
  const [showRawToml, setShowRawToml] = useState<boolean>(false);

  // Web 管理信息
  const [webInfo, setWebInfo] = useState<WebInfo | null>(null);

  const loadData = async () => {
    try {
      const s = await getServiceStatus();
      setStatus(s);
      if (s.active) {
        const [node, p] = await Promise.all([getNodeInfo(), getPeers()]);
        setNodeInfo(node);
        setPeers(p);
      } else {
        setNodeInfo(null);
        setPeers([]);
      }
    } catch (e) {
      console.error("[EasyTier] Failed to fetch status:", e);
    } finally {
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
    } catch (e) {
      console.error("[EasyTier] Failed to fetch config:", e);
    }
  };

  const loadWebInfo = async () => {
    try {
      const info = await getWebInfo();
      setWebInfo(info);
    } catch (e) {
      console.error("[EasyTier] Failed to fetch web info:", e);
    }
  };

  useEffect(() => {
    loadData();
    loadConfigData();
    loadWebInfo();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setActionLoading(true);
    const ok = await startService();
    if (ok) {
      toaster.toast({ title: "EasyTier", body: "服务已启动" });
      await loadData();
    } else {
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
    } else {
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
    } else {
      toaster.toast({ title: "EasyTier", body: "重启失败" });
    }
    setActionLoading(false);
  };

  const handleToggleEnable = async (val: boolean) => {
    const ok = await toggleAutostart(val);
    if (ok) {
      toaster.toast({ title: "EasyTier", body: val ? "已开启开机自启" : "已关闭开机自启" });
      await loadData();
    }
  };

  const handlePing = async (ipWithMask: string) => {
    const rawIp = ipWithMask.split("/")[0].trim();
    if (!rawIp) return;
    setPingResults((prev) => ({ ...prev, [rawIp]: "测速中..." }));
    const res = await pingTarget(rawIp);
    if (res.success) {
      setPingResults((prev) => ({ ...prev, [rawIp]: `${res.avg_ms} ms` }));
    } else {
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
    } else {
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
    } else {
      toaster.toast({ title: "EasyTier", body: "保存失败" });
    }
    setActionLoading(false);
  };

  const handleOpenWebUi = async () => {
    const ok = await openWebUi();
    if (ok) {
      toaster.toast({ title: "EasyTier", body: "正在打开 Web 控制台..." });
    } else {
      toaster.toast({ title: "EasyTier", body: `请在浏览器访问 http://127.0.0.1:${webInfo?.port || 21010}` });
    }
  };

  if (loading && !status) {
    return (
      <PanelSection>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <Spinner />
        </div>
      </PanelSection>
    );
  }

  // Tab 1: 运行状态
  const statusContent = (
    <div>
      <PanelSection title="运行状态">
        <PanelSectionRow>
          <Field label="服务状态" description={status?.active ? "正在运行中" : "已停止"}>
            <span style={{ color: status?.active ? "#4caf50" : "#f44336", fontWeight: "bold" }}>
              {status?.active ? "● ACTIVE" : "● STOPPED"}
            </span>
          </Field>
        </PanelSectionRow>

        {status?.active && nodeInfo && (
          <>
            <PanelSectionRow>
              <Field label="虚拟 IP" description={nodeInfo.virtual_ip || "获取中..."} />
            </PanelSectionRow>
            <PanelSectionRow>
              <Field label="主机名" description={nodeInfo.hostname || "steamdeck"} />
            </PanelSectionRow>
            <PanelSectionRow>
              <Field label="NAT 打洞类型" description={nodeInfo.nat_type || "未知"} />
            </PanelSectionRow>
            <PanelSectionRow>
              <Field label="Peer ID" description={nodeInfo.peer_id || "-"} />
            </PanelSectionRow>
          </>
        )}
      </PanelSection>

      <PanelSection title="服务控制">
        <PanelSectionRow>
          <ToggleField
            label="开机自启"
            description="随系统启动自动守护 EasyTier"
            checked={status?.enabled ?? false}
            onChange={handleToggleEnable}
            disabled={actionLoading}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <div style={{ flex: 1 }}>
              {!status?.active ? (
                <ButtonItem layout="inline" onClick={handleStart} disabled={actionLoading}>
                  <FaPlay style={{ marginRight: 6 }} /> 启动
                </ButtonItem>
              ) : (
                <ButtonItem layout="inline" onClick={handleStop} disabled={actionLoading}>
                  <FaStop style={{ marginRight: 6 }} /> 停止
                </ButtonItem>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <ButtonItem layout="inline" onClick={handleRestart} disabled={actionLoading}>
                <FaRedo style={{ marginRight: 6 }} /> 重启
              </ButtonItem>
            </div>
          </div>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={loadData} disabled={actionLoading}>
            刷新节点与状态
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={`组网 Peers (${peers.length})`}>
        {peers.length === 0 ? (
          <PanelSectionRow>
            <Field label="暂无对端节点" description={status?.active ? "等待连接 Peers..." : "请先启动服务"} />
          </PanelSectionRow>
        ) : (
          peers.map((peer, idx) => {
            const isLocal = peer.cost.toLowerCase() === "local";
            const isP2P = peer.cost.toLowerCase().includes("p2p");
            const rawIp = peer.ipv4.split("/")[0].trim();
            const pingText = pingResults[rawIp];

            return (
              <PanelSectionRow key={idx}>
                <Field
                  label={peer.hostname || (isLocal ? "本机" : "未知主机")}
                  description={
                    <div>
                      <div>IP: {peer.ipv4}</div>
                      <div>
                        模式:{" "}
                        <span style={{ color: isLocal ? "#8bc34a" : isP2P ? "#4caf50" : "#ff9800" }}>
                          {peer.cost.toUpperCase()}
                        </span>
                        {" | "}
                        延时: {peer.latency || "-"}
                        {" | "}
                        丢包: {peer.loss || "0%"}
                      </div>
                      {pingText && (
                        <div style={{ color: "#00e5ff", marginTop: "2px" }}>
                          Ping 测速: {pingText}
                        </div>
                      )}
                    </div>
                  }
                >
                  {!isLocal && rawIp && (
                    <ButtonItem layout="inline" onClick={() => handlePing(peer.ipv4)} disabled={actionLoading}>
                      测速
                    </ButtonItem>
                  )}
                </Field>
              </PanelSectionRow>
            );
          })
        )}
      </PanelSection>
    </div>
  );

  // Tab 2: 网络配置
  const configContent = (
    <div>
      <PanelSection title="快捷组网配置">
        <PanelSectionRow>
          <TextField
            label="网络名称 (Network Name)"
            description="加入或创建的异地组网名称"
            value={netName}
            onChange={(e) => setNetName(e.target.value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <TextField
            label="网络密码 (Network Secret)"
            description="用于组网节点间通信认证与加密"
            value={netSecret}
            bIsPassword={!showSecret}
            onChange={(e) => setNetSecret(e.target.value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label="显示密码"
            checked={showSecret}
            onChange={setShowSecret}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <TextField
            label="虚拟 IPv4 (可选)"
            description="如 10.144.144.202/24，留空则由网络自动分配"
            value={ipv4}
            onChange={(e) => setIpv4(e.target.value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <TextField
            label="主机名称 (Hostname)"
            description="在组网 Peers 中展示的设备名"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="联机与性能优化">
        <PanelSectionRow>
          <ToggleField
            label="UDP 广播转发"
            description="局域网联机搜房必备 (帕鲁/求生之路/MC等)"
            checked={udpRelay}
            onChange={setUdpRelay}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label="延迟优先传输"
            description="自动探测物理最优路线，联机对战首选"
            checked={latencyFirst}
            onChange={setLatencyFirst}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label="SmolTCP 协议栈加速"
            description="启用独立高性能用户态 TCP/IP 栈"
            checked={useSmoltcp}
            onChange={setUseSmoltcp}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label="允许出口节点 (Exit Node)"
            description="支持将流量通过指定节点转发出口"
            checked={enableExitNode}
            onChange={setEnableExitNode}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="对端 Peers 节点配置">
        <PanelSectionRow>
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "6px" }}>
              每行一个对端 URI（如 tcp://public.easytier.top:11010）:
            </div>
            <textarea
              style={{
                width: "100%",
                height: "90px",
                background: "#0e141b",
                color: "#dcdedf",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "4px",
                padding: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
              value={peersInput}
              onChange={(e) => setPeersInput(e.target.value)}
            />
          </div>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleFillPublicPeers}>
            ➕ 一键追加官方公共节点
          </ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleSaveQuickConfig} disabled={actionLoading}>
            💾 保存配置并应用重启
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="高级配置">
        <PanelSectionRow>
          <ToggleField
            label="编辑原始 config.toml"
            description="展开直接查看与编辑完整的 TOML 文件"
            checked={showRawToml}
            onChange={setShowRawToml}
          />
        </PanelSectionRow>

        {showRawToml && (
          <>
            <PanelSectionRow>
              <textarea
                style={{
                  width: "100%",
                  height: "160px",
                  background: "#0e141b",
                  color: "#dcdedf",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "4px",
                  padding: "8px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                }}
                value={rawToml}
                onChange={(e) => setRawToml(e.target.value)}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={handleSaveRawToml} disabled={actionLoading}>
                保存原始 TOML 配置
              </ButtonItem>
            </PanelSectionRow>
          </>
        )}
      </PanelSection>
    </div>
  );

  // Tab 3: Web 端管理
  const webContent = (
    <div>
      <PanelSection title="内置 Web 控制台">
        <PanelSectionRow>
          <Field
            label="Web 管理服务"
            description={`运行状态: 正在监听端口 ${webInfo?.port || 21010}`}
          >
            <span style={{ color: "#4caf50", fontWeight: "bold" }}>● RUNNING</span>
          </Field>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleOpenWebUi}>
            🚀 在 Steam 浏览器中打开 Web 仪表盘
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="远程与移动端管理">
        <PanelSectionRow>
          <Field
            label="本机访问 (Steam Deck)"
            description={webInfo?.url_local || "http://127.0.0.1:21010"}
          />
        </PanelSectionRow>

        {webInfo?.url_lan && (
          <PanelSectionRow>
            <Field
              label="📱 局域网 Wi-Fi 访问 (推荐手机/PC)"
              description={webInfo.url_lan}
            />
          </PanelSectionRow>
        )}

        {webInfo?.url_easytier && (
          <PanelSectionRow>
            <Field
              label="🌐 EasyTier 异地组网内访问"
              description={webInfo.url_easytier}
            />
          </PanelSectionRow>
        )}

        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }}>
            提示：只要手机或电脑连接同一个 Wi-Fi，在浏览器中输入上述「局域网 Wi-Fi 访问」地址，即可免除手柄输入、用键盘鼠标惬意管理组网与配置！
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title="官方云端控制台">
        <PanelSectionRow>
          <Field
            label="官方可视化管理平台"
            description="https://config-server.easytier.cn"
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }}>
            EasyTier 官方提供了统一的多设备云端配置与状态服务。可在 PC 端登录官方平台，统筹下发网络拓扑。
          </div>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );

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

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onShowTab={setActiveTab} />
    </div>
  );
};

export default definePlugin(() => {
  return {
    name: "Decky EasyTier",
    titleView: <div className={staticClasses.Title}>EasyTier 管理器</div>,
    content: <Content />,
    icon: <FaNetworkWired />,
    onDismount() {},
  };
});
