import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  ToggleField,
  Field,
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

// 后端 API 声明
const getServiceStatus = callable<[], ServiceStatus>("get_service_status");
const startService = callable<[], boolean>("start_service");
const stopService = callable<[], boolean>("stop_service");
const restartService = callable<[], boolean>("restart_service");
const toggleAutostart = callable<[enable: boolean], boolean>("toggle_autostart");
const getNodeInfo = callable<[], NodeInfo>("get_node_info");
const getPeers = callable<[], PeerInfo[]>("get_peers");
const pingTarget = callable<[target_ip: string], { success: boolean; avg_ms?: string; error?: string }>("ping_target");

const Content: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [pingResults, setPingResults] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<boolean>(false);

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
      console.error("[EasyTier] Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  if (loading && !status) {
    return (
      <PanelSection>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <Spinner />
        </div>
      </PanelSection>
    );
  }

  return (
    <div>
      {/* 节点运行状态 */}
      <PanelSection title="运行状态">
        <PanelSectionRow>
          <Field
            label="服务状态"
            description={status?.active ? "正在运行中" : "已停止"}
          >
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
              <Field label="NAT 类型" description={nodeInfo.nat_type || "未知"} />
            </PanelSectionRow>
            <PanelSectionRow>
              <Field label="Peer ID" description={nodeInfo.peer_id || "-"} />
            </PanelSectionRow>
          </>
        )}
      </PanelSection>

      {/* 服务操作 */}
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
                <ButtonItem
                  layout="inline"
                  onClick={handleStart}
                  disabled={actionLoading}
                >
                  <FaPlay style={{ marginRight: 6 }} /> 启动
                </ButtonItem>
              ) : (
                <ButtonItem
                  layout="inline"
                  onClick={handleStop}
                  disabled={actionLoading}
                >
                  <FaStop style={{ marginRight: 6 }} /> 停止
                </ButtonItem>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <ButtonItem
                layout="inline"
                onClick={handleRestart}
                disabled={actionLoading}
              >
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

      {/* 组网节点列表 */}
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
                    <ButtonItem
                      layout="inline"
                      onClick={() => handlePing(peer.ipv4)}
                      disabled={actionLoading}
                    >
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
