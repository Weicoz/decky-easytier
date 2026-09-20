import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  ToggleField,
  Field,
  TextField,
  Focusable,
  staticClasses,
  Spinner,
} from "@decky/ui";
import { callable, definePlugin, toaster } from "@decky/api";
import { FC, useEffect, useState, useMemo } from "react";
import { FaNetworkWired, FaPlay, FaStop, FaRedo, FaGlobe } from "react-icons/fa";
import { SupportedLang, getEffectiveLanguage, createTranslator } from "./i18n";

interface ServiceStatus {
  installed: boolean;
  core_installed?: boolean;
  config_exists?: boolean;
  core_version?: string;
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
const installEasyTier = callable<[], { success: boolean; message?: string; version?: string }>("install_easytier");
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
  const [langPref, setLangPref] = useState<SupportedLang>(() => {
    try {
      const saved = localStorage.getItem("decky_easytier_lang_pref");
      if (saved === "en" || saved === "zh" || saved === "ja" || saved === "auto") {
        return saved;
      }
    } catch (e) {}
    return "auto";
  });

  const resolvedLang = useMemo(() => getEffectiveLanguage(langPref), [langPref]);
  const t = useMemo(() => createTranslator(resolvedLang), [resolvedLang]);

  const handleSetLang = (lang: SupportedLang) => {
    setLangPref(lang);
    try {
      localStorage.setItem("decky_easytier_lang_pref", lang);
    } catch (e) {}
  };

  const [activeTab, setActiveTab] = useState<string>("status");
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(null);
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [pingResults, setPingResults] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [installingCore, setInstallingCore] = useState<boolean>(false);

  // 配置表单状态
  const [netName, setNetName] = useState<string>("" );
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

  const handleInstallCore = async () => {
    setInstallingCore(true);
    toaster.toast({ title: "EasyTier", body: t("toast_install_start") });
    try {
      const res = await installEasyTier();
      if (res && res.success) {
        toaster.toast({ title: "EasyTier", body: res.message || t("toast_install_ok") });
        await loadData();
        await loadConfigData();
      } else {
        toaster.toast({ title: "EasyTier", body: `${t("toast_install_fail")}${res?.message || ""}` });
      }
    } catch (e: any) {
      toaster.toast({ title: "EasyTier", body: `${t("toast_install_fail")}${e?.message || e}` });
    } finally {
      setInstallingCore(false);
    }
  };

  const handleStart = async () => {
    setActionLoading(true);
    const ok = await startService();
    if (ok) {
      toaster.toast({ title: "EasyTier", body: t("toast_start_ok") });
      await loadData();
    } else {
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
    } else {
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
    } else {
      toaster.toast({ title: "EasyTier", body: t("toast_restart_fail") });
    }
    setActionLoading(false);
  };

  const handleToggleEnable = async (val: boolean) => {
    const ok = await toggleAutostart(val);
    if (ok) {
      toaster.toast({ title: "EasyTier", body: val ? t("toast_autostart_on") : t("toast_autostart_off") });
      await loadData();
    }
  };

  const handlePing = async (ipWithMask: string) => {
    const rawIp = ipWithMask.split("/")[0].trim();
    if (!rawIp) return;
    setPingResults((prev) => ({ ...prev, [rawIp]: t("peers_pinging") }));
    const res = await pingTarget(rawIp);
    if (res.success) {
      setPingResults((prev) => ({ ...prev, [rawIp]: `${res.avg_ms} ms` }));
    } else {
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
    } else {
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
    } else {
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
    return (
      <PanelSection>
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <Spinner />
        </div>
      </PanelSection>
    );
  }

  // 语言设置模块 (置于底部，方便切换)
  const languageSection = (
    <PanelSection title={t("lang_title")}>
      <PanelSectionRow>
        <Field
          label={t("lang_label")}
          description={
            langPref === "auto"
              ? `${t("lang_auto")} → ${resolvedLang.toUpperCase()}`
              : resolvedLang.toUpperCase()
          }
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {[
            { id: "auto", label: "自动 (Auto)", icon: <FaGlobe style={{ marginRight: 4 }} /> },
            { id: "zh", label: "简体中文" },
            { id: "en", label: "English" },
            { id: "ja", label: "日本語" },
          ].map((item) => {
            const isSel = langPref === item.id;
            return (
              <Focusable
                key={item.id}
                style={{
                  width: "100%",
                  minWidth: 0,
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px",
                  borderRadius: "5px",
                  border: isSel
                    ? "2px solid #1a9fff"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  background: isSel
                    ? "rgba(26, 159, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.06)",
                  color: isSel ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                  fontWeight: isSel ? "bold" : "normal",
                  fontSize: "12px",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: "all 0.15s ease",
                }}
                onClick={() => handleSetLang(item.id as any)}
                onOKButton={() => handleSetLang(item.id as any)}
              >
                {item.icon}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {isSel ? "✓ " : ""}{item.label}
                </span>
              </Focusable>
            );
          })}
        </div>
      </PanelSectionRow>
    </PanelSection>
  );

  // Tab 1: 运行状态
  const statusContent = (
    <div>
      {status && !status.installed && (
        <PanelSection title={t("core_install_title")}>
          <PanelSectionRow>
            <Field
              label={t("core_install_not_found")}
              description={t("core_install_desc")}
            />
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem
              layout="below"
              onClick={handleInstallCore}
              disabled={installingCore || actionLoading}
            >
              {installingCore ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Spinner /> {t("core_installing")}
                </div>
              ) : (
                t("core_install_btn")
              )}
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      )}

      <PanelSection title={t("status_title")}>
        {status?.core_installed && (
          <>
            <PanelSectionRow>
              <Field
                label={t("status_core_ver")}
                description={status.core_version ? `v${status.core_version}` : t("core_ready")}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem
                layout="below"
                onClick={handleInstallCore}
                disabled={installingCore || actionLoading}
              >
                {installingCore ? t("core_updating") : t("core_reinstall")}
              </ButtonItem>
            </PanelSectionRow>
          </>
        )}

        <PanelSectionRow>
          <Field label={t("status_service")} description={status?.active ? t("status_running") : t("status_stopped")}>
            <span style={{ color: status?.active ? "#4caf50" : "#f44336", fontWeight: "bold" }}>
              {status?.active ? "● ACTIVE" : "● STOPPED"}
            </span>
          </Field>
        </PanelSectionRow>

        {status?.active && nodeInfo && (
          <>
            <PanelSectionRow>
              <Field label={t("status_vip")} description={nodeInfo.virtual_ip || t("status_fetching")} />
            </PanelSectionRow>
            <PanelSectionRow>
              <Field label={t("status_hostname")} description={nodeInfo.hostname || "steamdeck"} />
            </PanelSectionRow>
            <PanelSectionRow>
              <Field label={t("status_nat")} description={nodeInfo.nat_type || t("status_unknown")} />
            </PanelSectionRow>
            <PanelSectionRow>
              <Field label={t("status_peer_id")} description={nodeInfo.peer_id || "-"} />
            </PanelSectionRow>
          </>
        )}
      </PanelSection>

      <PanelSection title={t("ctrl_title")}>
        <PanelSectionRow>
          <ToggleField
            label={t("ctrl_autostart")}
            description={t("ctrl_autostart_desc")}
            checked={status?.enabled ?? false}
            onChange={handleToggleEnable}
            disabled={actionLoading}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {!status?.active ? (
              <Focusable
                style={{
                  width: "100%",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px",
                  background: actionLoading ? "rgba(46, 125, 50, 0.4)" : "#2e7d32",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  boxSizing: "border-box",
                  transition: "all 0.15s ease",
                }}
                onClick={() => !actionLoading && handleStart()}
                onOKButton={() => !actionLoading && handleStart()}
              >
                <FaPlay style={{ marginRight: 8 }} /> {t("ctrl_start")}
              </Focusable>
            ) : (
              <Focusable
                style={{
                  width: "100%",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "5px",
                  background: actionLoading ? "rgba(198, 40, 40, 0.4)" : "#c62828",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  boxSizing: "border-box",
                  transition: "all 0.15s ease",
                }}
                onClick={() => !actionLoading && handleStop()}
                onOKButton={() => !actionLoading && handleStop()}
              >
                <FaStop style={{ marginRight: 8 }} /> {t("ctrl_stop")}
              </Focusable>
            )}

            <Focusable
              style={{
                width: "100%",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                background: actionLoading ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: actionLoading ? "rgba(255, 255, 255, 0.4)" : "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
                cursor: actionLoading ? "not-allowed" : "pointer",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
              }}
              onClick={() => !actionLoading && handleRestart()}
              onOKButton={() => !actionLoading && handleRestart()}
            >
              <FaRedo style={{ marginRight: 8 }} /> {t("ctrl_restart")}
            </Focusable>

            <Focusable
              style={{
                width: "100%",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                background: actionLoading ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: actionLoading ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.85)",
                fontSize: "12px",
                cursor: actionLoading ? "not-allowed" : "pointer",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
              }}
              onClick={() => !actionLoading && loadData()}
              onOKButton={() => !actionLoading && loadData()}
            >
              {t("ctrl_refresh")}
            </Focusable>
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={`${t("peers_title")} (${peers.length})`}>
        {peers.length === 0 ? (
          <PanelSectionRow>
            <Field
              label={t("peers_none")}
              description={status?.active ? t("peers_none_desc_active") : t("peers_none_desc_stopped")}
            />
          </PanelSectionRow>
        ) : (
          peers.map((peer, idx) => {
            const isLocal = peer.cost.toLowerCase() === "local";
            const isP2P = peer.cost.toLowerCase().includes("p2p");
            const rawIp = peer.ipv4.split("/")[0].trim();
            const pingText = pingResults[rawIp];
            const traffic = `${peer.rx || "0 B"} / ${peer.tx || "0 B"}`;

            return (
              <PanelSectionRow key={idx}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                    padding: "8px 10px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    overflow: "hidden",
                  }}
                >
                  {/* 上部：节点信息展示 */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "#ffffff",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "180px",
                      }}
                    >
                      {peer.hostname || (isLocal ? t("peers_local_host") : t("peers_unknown_host"))}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: isLocal
                          ? "rgba(139, 195, 74, 0.2)"
                          : isP2P
                          ? "rgba(76, 175, 80, 0.2)"
                          : "rgba(255, 152, 0, 0.2)",
                        color: isLocal ? "#8bc34a" : isP2P ? "#4caf50" : "#ff9800",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {peer.cost.toUpperCase()}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#dcdedf",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                      wordBreak: "break-all",
                    }}
                  >
                    <div>
                      IP: <span style={{ fontFamily: "monospace", color: "#66c0f4" }}>{peer.ipv4}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", color: "#8b949e", fontSize: "11px" }}>
                      <span>{t("peers_lat")}: {peer.latency || "-"}</span>
                      <span>{t("peers_loss")}: {peer.loss || "0%"}</span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#8b949e" }}>
                      {t("peers_traffic")}: {traffic}
                    </div>
                    {pingText && (
                      <div style={{ fontSize: "11px", color: "#00e5ff", fontWeight: "bold", marginTop: "2px" }}>
                        Ping: {pingText}
                      </div>
                    )}
                  </div>

                  {/* 下部：测试按钮整行居底且 100% 充满卡片 */}
                  {!isLocal && rawIp && (
                    <Focusable
                      style={{
                        width: "100%",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        background: actionLoading ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: actionLoading ? "rgba(255, 255, 255, 0.4)" : "#ffffff",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: actionLoading ? "not-allowed" : "pointer",
                        marginTop: "6px",
                        boxSizing: "border-box",
                        transition: "all 0.15s ease",
                      }}
                      onClick={() => !actionLoading && handlePing(peer.ipv4)}
                      onOKButton={() => !actionLoading && handlePing(peer.ipv4)}
                    >
                      {t("peers_ping_btn")}
                    </Focusable>
                  )}
                </div>
              </PanelSectionRow>
            );
          })
        )}
      </PanelSection>

      {languageSection}
    </div>
  );

  // Tab 2: 网络配置
  const configContent = (
    <div>
      <PanelSection title={t("cfg_title")}>
        <PanelSectionRow>
          <TextField
            label={t("cfg_net_name")}
            description={t("cfg_net_name_desc")}
            value={netName}
            onChange={(e) => setNetName(e.target.value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <TextField
            label={t("cfg_net_secret")}
            description={t("cfg_net_secret_desc")}
            value={netSecret}
            bIsPassword={!showSecret}
            onChange={(e) => setNetSecret(e.target.value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label={t("cfg_show_secret")}
            checked={showSecret}
            onChange={setShowSecret}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <TextField
            label={t("cfg_vip")}
            description={t("cfg_vip_desc")}
            value={ipv4}
            onChange={(e) => setIpv4(e.target.value)}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <TextField
            label={t("cfg_hostname")}
            description={t("cfg_hostname_desc")}
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t("opt_title")}>
        <PanelSectionRow>
          <ToggleField
            label={t("opt_udp")}
            description={t("opt_udp_desc")}
            checked={udpRelay}
            onChange={setUdpRelay}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label={t("opt_latency")}
            description={t("opt_latency_desc")}
            checked={latencyFirst}
            onChange={setLatencyFirst}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label={t("opt_smoltcp")}
            description={t("opt_smoltcp_desc")}
            checked={useSmoltcp}
            onChange={setUseSmoltcp}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <ToggleField
            label={t("opt_exit")}
            description={t("opt_exit_desc")}
            checked={enableExitNode}
            onChange={setEnableExitNode}
          />
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t("peer_cfg_title")}>
        <PanelSectionRow>
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: "12px", color: "#8b949e", marginBottom: "6px" }}>
              {t("peer_cfg_hint")}
            </div>
            <textarea
              style={{
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
              }}
              tabIndex={0}
              onFocus={() => {
                try { (window as any).SteamClient?.System?.ShowVirtualKeyboard?.(); } catch(e){}
              }}
              value={peersInput}
              onChange={(e) => setPeersInput(e.target.value)}
            />
          </div>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleFillPublicPeers}>
            {t("peer_cfg_add_public")}
          </ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleSaveQuickConfig} disabled={actionLoading}>
            {t("peer_cfg_save")}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t("adv_title")}>
        <PanelSectionRow>
          <ToggleField
            label={t("adv_toml_toggle")}
            description={t("adv_toml_desc")}
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
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "6px",
                  padding: "8px",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
                tabIndex={0}
                onFocus={() => {
                  try { (window as any).SteamClient?.System?.ShowVirtualKeyboard?.(); } catch(e){}
                }}
                value={rawToml}
                onChange={(e) => setRawToml(e.target.value)}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem layout="below" onClick={handleSaveRawToml} disabled={actionLoading}>
                {t("adv_toml_save")}
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
      <PanelSection title={t("web_title")}>
        <PanelSectionRow>
          <Field
            label={t("web_status")}
            description={`${t("web_status_listening")}: ${webInfo?.port || 21010}`}
          >
            <span style={{ color: "#4caf50", fontWeight: "bold" }}>● RUNNING</span>
          </Field>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below" onClick={handleOpenWebUi}>
            {t("web_open_btn")}
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t("web_remote_title")}>
        <PanelSectionRow>
          <Field
            label={t("web_local")}
            description={webInfo?.url_local || "http://127.0.0.1:21010"}
          />
        </PanelSectionRow>

        {webInfo?.url_lan && (
          <PanelSectionRow>
            <Field
              label={t("web_lan")}
              description={webInfo.url_lan}
            />
          </PanelSectionRow>
        )}

        {webInfo?.url_easytier && (
          <PanelSectionRow>
            <Field
              label={t("web_easytier")}
              description={webInfo.url_easytier}
            />
          </PanelSectionRow>
        )}

        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }}>
            {t("web_hint")}
          </div>
        </PanelSectionRow>
      </PanelSection>

      <PanelSection title={t("web_cloud_title")}>
        <PanelSectionRow>
          <Field
            label={t("web_cloud_service")}
            description="https://config-server.easytier.cn"
          />
        </PanelSectionRow>
        <PanelSectionRow>
          <div style={{ fontSize: "12px", color: "#8b949e", lineHeight: "1.5" }}>
            {t("web_cloud_desc")}
          </div>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );

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

  return (
    <div
      className="decky-easytier-container"
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        padding: "0 0 30px 0",
      }}
    >
      <style>{`
        .decky-easytier-container * {
          box-sizing: border-box !important;
          max-width: 100% !important;
        }
        .decky-easytier-container button {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .decky-easytier-container pre, .decky-easytier-container code {
          white-space: pre-wrap !important;
          word-break: break-all !important;
        }
      `}</style>
      {/* 顶部轻量级 Tab 胶囊切换栏：标准 Flex 宽度自适应、原生手柄焦点与防溢出 */}
      <Focusable
        style={{
          display: "flex",
          gap: "6px",
          padding: "4px 0 10px 0",
          marginBottom: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Focusable
              key={tab.id}
              style={{
                flex: 1,
                padding: "8px 0",
                textAlign: "center",
                borderRadius: "6px",
                border: isActive
                  ? "2px solid #1a9fff"
                  : "1px solid rgba(255, 255, 255, 0.12)",
                background: isActive
                  ? "rgba(26, 159, 255, 0.25)"
                  : "rgba(255, 255, 255, 0.05)",
                color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.75)",
                fontWeight: isActive ? "bold" : "normal",
                fontSize: "13px",
                cursor: "pointer",
                boxSizing: "border-box",
                transition: "all 0.15s ease",
              }}
              onClick={() => setActiveTab(tab.id)}
              onOKButton={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </Focusable>
          );
        })}
      </Focusable>

      {/* 当前 Tab 内容，自适应充满抽屉容器 */}
      <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}>
        {currentTab.content}
      </div>
    </div>
  );
};

export default definePlugin(() => {
  return {
    name: "Decky Easytier",
    titleView: <div className={staticClasses.Title}>Decky Easytier</div>,
    alwaysRender: true,
    content: <Content />,
    icon: <FaNetworkWired />,
    onDismount() {},
  };
});
