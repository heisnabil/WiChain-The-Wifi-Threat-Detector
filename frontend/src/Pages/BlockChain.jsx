import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiDatabase,
  FiAlertTriangle,
  FiClock,
  FiHash,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiWifi,
  FiShield,
  FiActivity,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiArrowLeft,
  FiLock,
  FiGlobe,
  FiTrendingUp,
  FiPlay,
  FiPause,
  FiSettings,
  FiMonitor,
} from "react-icons/fi";

// Scramble Logic for SCAN button
const TARGET_TEXT = "SCAN";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const useScramble = () => {
  const [text, setText] = useState(TARGET_TEXT);
  const intervalRef = useRef(null);

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = TARGET_TEXT.split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) stopScramble();
    }, SHUFFLE_TIME);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(TARGET_TEXT);
  };

  return { text, scramble, stopScramble };
};

const NetworkSecurityDashboard = () => {
  // Core state
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  
  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanError, setScanError] = useState(null);
  
  // Blockchain records state
  const [blockchainRecords, setBlockchainRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Blockchain info state
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [blockchainStats, setBlockchainStats] = useState(null);
  
  // Real-time monitoring
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [liveThreats, setLiveThreats] = useState(0);
  
  const { text, scramble, stopScramble } = useScramble();

  // Mock data
  const mockScanResults = {
    total_scanned: 12,
    threats_detected: 3,
    scan_duration: 2.4,
    networks: [
      {
        SSID: "FreeWiFi_Suspicious",
        BSSID: "00:11:22:33:44:55",
        RSSI: -45,
        Encryption: "Open",
        Band: "2.4GHz",
        Vendors: "Unknown",
        prediction: "spoof",
        score: 0.94,
        risk_level: "high",
        Duplicate_Count: 3,
        Internet_Access: false,
        threat_indicators: ["Signal Spoofing", "MAC Randomization", "Evil Twin"],
        blockchain_stored: true
      },
      {
        SSID: "Starbucks",
        BSSID: "00:aa:bb:cc:dd:ee",
        RSSI: -52,
        Encryption: "WPA2",
        Band: "5GHz",
        Vendors: "Cisco Systems",
        prediction: "spoof",
        score: 0.87,
        risk_level: "medium",
        Duplicate_Count: 1,
        Internet_Access: true,
        threat_indicators: ["Duplicate SSID"],
        blockchain_stored: true
      },
      {
        SSID: "Home_Network_5G",
        BSSID: "00:ff:ee:dd:cc:bb",
        RSSI: -38,
        Encryption: "WPA3",
        Band: "5GHz",
        Vendors: "TP-Link",
        prediction: "legitimate",
        score: 0.98,
        risk_level: "low",
        Duplicate_Count: 0,
        Internet_Access: true,
        threat_indicators: [],
        blockchain_stored: false
      }
    ]
  };

  const mockBlockchainRecords = [
    {
      id: 1,
      ssid: "FreeWiFi_Spoof",
      block_index: 245,
      vendor: "Unknown Vendor",
      status: "malicious",
      confidence: 94.5,
      risk_level: "high",
      timestamp: 1640995200,
      bssid: "00:11:22:33:44:55",
      rssi: -45,
      block_hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      transaction_hash: "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
      gas_used: 21000,
      threat_indicators: ["Signal Spoofing", "MAC Randomization", "Evil Twin"],
      network: "Ethereum Testnet",
      encryption: "WPA2"
    },
    {
      id: 2,
      ssid: "Starbucks_Free",
      block_index: 244,
      vendor: "Cisco Systems",
      status: "spoof",
      confidence: 87.2,
      risk_level: "medium",
      timestamp: 1640991600,
      bssid: "00:aa:bb:cc:dd:ee",
      rssi: -52,
      block_hash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
      transaction_hash: "0xb2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1",
      gas_used: 18500,
      threat_indicators: ["Duplicate SSID", "Signal Anomaly"],
      network: "Ethereum Testnet",
      encryption: "Open"
    }
  ];

  const mockBlockchainStats = {
    connected: true,
    network: "Ethereum Testnet",
    latest_block: 245,
    total_detections: 47,
    recent_detections: 8,
    chain_valid: true,
    pending_transactions: 3
  };

  const mockBlockchainInfo = {
    chain_length: 246,
    is_valid: true,
    stats: {
      total_transactions: 189,
      threat_detections: 47
    },
    chain: [
      {
        index: 0,
        timestamp: 1640980000,
        hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        previous_hash: null,
        nonce: 0,
        data: { message: "Genesis Block - WICHAIN Network Security Blockchain" }
      },
      {
        index: 245,
        timestamp: 1640995200,
        hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
        previous_hash: "0x0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z",
        nonce: 12847,
        data: {
          transactions: [
            { type: "threat_detection", ssid: "FreeWiFi_Spoof" },
            { type: "mining_reward", amount: 1.5 }
          ]
        }
      }
    ]
  };

  useEffect(() => {
    // Initialize data
    setBlockchainRecords(mockBlockchainRecords);
    setFilteredRecords(mockBlockchainRecords);
    setBlockchainStats(mockBlockchainStats);
    setBlockchainInfo(mockBlockchainInfo);
  }, []);

  // Filter logic for blockchain records
  useEffect(() => {
    let filtered = blockchainRecords;

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.ssid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bssid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vendor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter(record => record.risk_level === riskFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "timestamp") {
        return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      }
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    setFilteredRecords(filtered);
  }, [blockchainRecords, searchTerm, riskFilter, statusFilter, sortBy, sortOrder]);

  // Utility functions
  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      case "medium":
        return "text-orange-400 bg-orange-900/20 border-orange-500/30";
      case "low":
        return "text-green-400 bg-green-900/20 border-green-500/30";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "malicious":
        return "bg-red-900/30 text-red-300 border-red-500/50";
      case "spoof":
        return "bg-orange-900/30 text-orange-300 border-orange-500/50";
      case "legitimate":
        return "bg-green-900/30 text-green-300 border-green-500/50";
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-500/50";
    }
  };

  const getSignalStrength = (rssi) => {
    if (rssi >= -30) return { level: "Excellent", color: "text-green-400", bars: 4 };
    if (rssi >= -50) return { level: "Good", color: "text-green-400", bars: 3 };
    if (rssi >= -70) return { level: "Fair", color: "text-yellow-400", bars: 2 };
    return { level: "Poor", color: "text-red-400", bars: 1 };
  };

  const getSecurityIcon = (prediction) => {
    return prediction === "spoof" || prediction === "malicious" ? (
      <FiAlertTriangle className="text-red-400" />
    ) : (
      <FiShield className="text-green-400" />
    );
  };

  const getSecurityColor = (prediction) => {
    return prediction === "spoof" || prediction === "malicious" ? "text-red-400" : "text-green-400";
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateHash = (hash, length = 16) => {
    return hash
      ? `${hash.substring(0, length)}...${hash.substring(hash.length - 8)}`
      : "N/A";
  };

  // Action handlers
  const handleScanClick = async () => {
    setIsScanning(true);
    setScanError(null);
    setScanResults(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setScanResults(mockScanResults);
      setActiveTab("scan");
    } catch (error) {
      setScanError(error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleMineBlock = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate mining success
      setBlockchainStats(prev => ({
        ...prev,
        latest_block: prev.latest_block + 1,
        pending_transactions: 0
      }));
    } catch (error) {
      console.error("Mining failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Refresh all data
    setBlockchainRecords(mockBlockchainRecords);
    setBlockchainStats(mockBlockchainStats);
    setBlockchainInfo(mockBlockchainInfo);
    setLoading(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredRecords, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wichain-security-report.json';
    link.click();
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      // Start live monitoring simulation
      const interval = setInterval(() => {
        setLiveThreats(prev => prev + Math.floor(Math.random() * 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  };

  const getStatsFromRecords = () => {
    const total = filteredRecords.length;
    const threats = filteredRecords.filter(r => r.status !== "legitimate").length;
    const highRisk = filteredRecords.filter(r => r.risk_level === "high").length;
    const avgConfidence = filteredRecords.length > 0 
      ? (filteredRecords.reduce((sum, r) => sum + r.confidence, 0) / filteredRecords.length).toFixed(1)
      : 0;

    return { total, threats, highRisk, avgConfidence };
  };

  const stats = getStatsFromRecords();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <FiShield className="text-purple-400 w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    WICHAIN Security Dashboard
                  </h1>
                  <p className="text-sm text-gray-400">
                    AI-Powered Network Threat Detection & Blockchain Security
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${blockchainStats?.connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                <span className="text-gray-400">
                  {blockchainStats?.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50"
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-1">
            {[
              { id: "overview", label: "Overview", icon: FiMonitor },
              { id: "scan", label: "Network Scan", icon: FiWifi },
              { id: "records", label: "Threat Records", icon: FiDatabase },
              { id: "blockchain", label: "Blockchain Info", icon: FiHash },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-zinc-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* System Status */}
            {blockchainStats && (
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiActivity className="text-cyan-400" />
                  System Status
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <FiDatabase className="text-cyan-400 mr-2" />
                      <span className="text-sm text-gray-400">Network</span>
                    </div>
                    <div className={`text-lg font-semibold ${blockchainStats.connected ? "text-green-400" : "text-red-400"}`}>
                      {blockchainStats.connected ? "🟢 Online" : "🔴 Offline"}
                    </div>
                    <div className="text-xs text-gray-500">{blockchainStats.network}</div>
                  </div>

                  <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <FiActivity className="text-purple-400 mr-2" />
                      <span className="text-sm text-gray-400">Latest Block</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      #{blockchainStats.latest_block}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <FiAlertTriangle className="text-orange-400 mr-2" />
                      <span className="text-sm text-gray-400">Threats</span>
                    </div>
                    <div className="text-lg font-semibold text-orange-400">
                      {blockchainStats.total_detections}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <FiTrendingUp className="text-green-400 mr-2" />
                      <span className="text-sm text-gray-400">Recent</span>
                    </div>
                    <div className="text-lg font-semibold text-green-400">
                      {blockchainStats.recent_detections}
                    </div>
                    <div className="text-xs text-gray-500">Last hour</div>
                  </div>

                  <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      {blockchainStats.chain_valid ? (
                        <FiCheckCircle className="text-green-400 mr-2" />
                      ) : (
                        <FiXCircle className="text-red-400 mr-2" />
                      )}
                      <span className="text-sm text-gray-400">Chain</span>
                    </div>
                    <div className={`text-lg font-semibold ${blockchainStats.chain_valid ? "text-green-400" : "text-red-400"}`}>
                      {blockchainStats.chain_valid ? "Valid" : "Invalid"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Pending: {blockchainStats.pending_transactions}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiSettings className="text-purple-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onMouseEnter={scramble}
                  onMouseLeave={stopScramble}
                  onClick={handleScanClick}
                  disabled={isScanning}
                  className="group relative overflow-hidden rounded-xl border border-zinc-500 bg-zinc-700 px-6 py-4 font-mono font-semibold uppercase text-white transition-colors hover:text-indigo-300 disabled:opacity-50"
                >
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    {isScanning ? (
                      <>
                        <FiWifi className="animate-pulse w-6 h-6" />
                        <span>SCANNING...</span>
                      </>
                    ) : (
                      <>
                        <FiLock className="w-6 h-6" />
                        <span>{text}</span>
                      </>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={() => setActiveTab("records")}
                  className="group relative overflow-hidden rounded-xl border border-purple-500 bg-purple-700 px-6 py-4 font-mono font-semibold uppercase text-white transition-colors hover:text-purple-300"
                >
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <FiDatabase className="w-6 h-6" />
                    <span>RECORDS</span>
                  </div>
                </motion.button>

                {blockchainStats?.pending_transactions > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.975 }}
                    onClick={handleMineBlock}
                    disabled={loading}
                    className="group relative overflow-hidden rounded-xl border border-yellow-500 bg-yellow-700 px-6 py-4 font-mono font-semibold uppercase text-white transition-colors hover:text-yellow-300 disabled:opacity-50"
                  >
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <FiActivity className="w-6 h-6" />
                      <span>MINE</span>
                    </div>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={toggleMonitoring}
                  className={`group relative overflow-hidden rounded-xl border px-6 py-4 font-mono font-semibold uppercase text-white transition-colors ${
                    isMonitoring 
                      ? "border-red-500 bg-red-700 hover:text-red-300" 
                      : "border-green-500 bg-green-700 hover:text-green-300"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    {isMonitoring ? (
                      <>
                        <FiPause className="w-6 h-6" />
                        <span>STOP</span>
                      </>
                    ) : (
                      <>
                        <FiPlay className="w-6 h-6" />
                        <span>MONITOR</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Live Monitoring */}
            {isMonitoring && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-green-700/50 p-6"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiEye className="text-green-400 animate-pulse" />
                  Live Monitoring Active
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">{liveThreats}</div>
                    <div className="text-sm text-gray-400">Live Threats</div>
                  </div>
                  <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">24/7</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">Real-time</div>
                    <div className="text-sm text-gray-400">Protection</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Network Scan Tab */}
        {activeTab === "scan" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Scan Controls */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FiWifi className="text-cyan-400" />
                  Network Scanner
                </h3>
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={handleScanClick}
                  disabled={isScanning}
                  className="group relative overflow-hidden rounded-xl border border-cyan-500 bg-cyan-700 px-8 py-3 font-mono font-semibold uppercase text-white transition-colors hover:text-cyan-300 disabled:opacity-50"
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {isScanning ? (
                      <>
                        <FiWifi className="animate-pulse" />
                        <span>SCANNING...</span>
                      </>
                    ) : (
                      <>
                        <FiLock />
                        <span>START SCAN</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>

              {/* Scan Error */}
              {scanError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-900/20 border border-red-500 rounded-lg mb-6"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <FiAlertTriangle />
                    <span>Scan Failed: {scanError}</span>
                  </div>
                </motion.div>
              )}

              {/* Scan Results */}
              {scanResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        {scanResults.total_scanned} networks found
                      </span>
                      <span className={`font-semibold ${scanResults.threats_detected > 0 ? "text-red-400" : "text-green-400"}`}>
                        {scanResults.threats_detected} threats detected
                      </span>
                      <span className="text-gray-400">
                        Scan completed in {scanResults.scan_duration}s
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {scanResults.networks.map((network, index) => {
                      const signal = getSignalStrength(network.RSSI);

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-xl border-2 ${getRiskLevelColor(network.risk_level)} transition-all hover:shadow-lg`}
                        >
                          {/* Network Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                {getSecurityIcon(network.prediction)}
                                {network.prediction !== "legitimate" && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                  {network.SSID}
                                  {network.blockchain_stored && (
                                    <FiDatabase className="text-purple-400 w-4 h-4" title="Stored on blockchain" />
                                  )}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {network.BSSID} • {network.Vendors}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className={`text-lg font-bold uppercase ${getSecurityColor(network.prediction)}`}>
                                {network.prediction}
                              </div>
                              <div className="text-sm text-gray-400">
                                {(network.score * 100).toFixed(1)}% confidence
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(network.risk_level)} mt-1`}>
                                {network.risk_level.toUpperCase()} RISK
                              </div>
                            </div>
                          </div>

                          {/* Network Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <FiActivity className={signal.color} />
                              </div>
                              <div className="text-sm text-gray-400">Signal</div>
                              <div className="text-white font-semibold">{network.RSSI} dBm</div>
                              <div className={`text-xs ${signal.color}`}>{signal.level}</div>
                            </div>

                            <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <FiShield className="text-blue-400" />
                              </div>
                              <div className="text-sm text-gray-400">Security</div>
                              <div className="text-white font-semibold">{network.Encryption}</div>
                            </div>

                            <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <FiGlobe className="text-green-400" />
                              </div>
                              <div className="text-sm text-gray-400">Band</div>
                              <div className="text-white font-semibold">{network.Band}</div>
                            </div>

                            <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <FiEye className="text-yellow-400" />
                              </div>
                              <div className="text-sm text-gray-400">Duplicates</div>
                              <div className="text-white font-semibold">{network.Duplicate_Count}</div>
                            </div>

                            <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                              <div className="flex items-center justify-center mb-1">
                                <FiGlobe className={network.Internet_Access ? "text-green-400" : "text-red-400"} />
                              </div>
                              <div className="text-sm text-gray-400">Internet</div>
                              <div className="text-white font-semibold">{network.Internet_Access ? "Yes" : "No"}</div>
                            </div>
                          </div>

                          {/* Threat Indicators */}
                          {network.threat_indicators && network.threat_indicators.length > 0 && (
                            <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                              <div className="flex items-center gap-2 mb-2">
                                <FiAlertTriangle className="text-red-400" />
                                <span className="font-semibold text-red-400">Threat Indicators:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {network.threat_indicators.map((indicator, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-red-800/30 text-red-300 text-xs rounded-full"
                                  >
                                    {indicator}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Blockchain Records Tab */}
        {activeTab === "records" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Records</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <FiDatabase className="text-cyan-400 w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Threats Detected</p>
                    <p className="text-2xl font-bold text-red-400">{stats.threats}</p>
                  </div>
                  <FiAlertTriangle className="text-red-400 w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">High Risk</p>
                    <p className="text-2xl font-bold text-orange-400">{stats.highRisk}</p>
                  </div>
                  <FiShield className="text-orange-400 w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg Confidence</p>
                    <p className="text-2xl font-bold text-green-400">{stats.avgConfidence}%</p>
                  </div>
                  <FiActivity className="text-green-400 w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiFilter className="text-purple-400" />
                  Filters & Search
                </h4>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <FiDownload className="w-4 h-4" />
                  Export Records
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by SSID, BSSID, or vendor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Risk Filter */}
                <div>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="malicious">Malicious</option>
                    <option value="spoof">Spoof</option>
                    <option value="legitimate">Legitimate</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="timestamp-desc">Newest First</option>
                    <option value="timestamp-asc">Oldest First</option>
                    <option value="confidence-desc">Highest Confidence</option>
                    <option value="risk_level-desc">Highest Risk</option>
                    <option value="ssid-asc">SSID A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Threat Records Tab */}
        {activeTab === "records" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Records</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                  </div>
                  <FiDatabase className="text-cyan-400 w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Threats Detected</p>
                    <p className="text-2xl font-bold text-red-400">{stats.threats}</p>
                  </div>
                  <FiAlertTriangle className="text-red-400 w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">High Risk</p>
                    <p className="text-2xl font-bold text-orange-400">{stats.highRisk}</p>
                  </div>
                  <FiShield className="text-orange-400 w-8 h-8" />
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Avg Confidence</p>
                    <p className="text-2xl font-bold text-green-400">{stats.avgConfidence}%</p>
                  </div>
                  <FiActivity className="text-green-400 w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiFilter className="text-purple-400" />
                  Filters & Search
                </h4>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <FiDownload className="w-4 h-4" />
                  Export Records
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by SSID, BSSID, or vendor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="malicious">Malicious</option>
                    <option value="spoof">Spoof</option>
                    <option value="legitimate">Legitimate</option>
                  </select>
                </div>

                <div>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="timestamp-desc">Newest First</option>
                    <option value="timestamp-asc">Oldest First</option>
                    <option value="confidence-desc">Highest Confidence</option>
                    <option value="risk_level-desc">Highest Risk</option>
                    <option value="ssid-asc">SSID A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Records List */}
            {filteredRecords.length === 0 ? (
              <div className="text-center py-16">
                <FiSearch className="text-6xl text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-3">
                  No Records Found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search criteria or run a scan to detect new threats.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    {/* Record Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {record.status === "legitimate" ? (
                            <FiCheckCircle className="text-green-400 text-2xl" />
                          ) : (
                            <FiAlertTriangle className="text-red-400 text-2xl" />
                          )}
                          {record.status !== "legitimate" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-1">
                            {record.ssid}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Block #{record.block_index} • {record.vendor}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col lg:text-right gap-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-semibold uppercase px-3 py-1 rounded-full border ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                          <span className="text-xs text-gray-400 bg-zinc-800/50 px-2 py-1 rounded">
                            {record.confidence}% confidence
                          </span>
                        </div>
                        <div className={`text-xs px-3 py-1 rounded-full font-medium border ${getRiskLevelColor(record.risk_level)}`}>
                          {record.risk_level.toUpperCase()} RISK
                        </div>
                      </div>
                    </div>

                    {/* Network Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                      {/* Detection Details */}
                      <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                        <h5 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          Detection Details
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Time:</span>
                            <span className="text-xs text-white">
                              {formatTimestamp(record.timestamp)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">BSSID:</span>
                            <span className="text-xs text-white font-mono">
                              {record.bssid}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Signal:</span>
                            <span className="text-xs text-white">
                              {record.rssi} dBm
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Encryption:</span>
                            <span className="text-xs text-white">
                              {record.encryption}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Blockchain Data */}
                      <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                        <h5 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                          <FiHash className="w-4 h-4" />
                          Blockchain Data
                        </h5>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs text-gray-400 block mb-1">Block Hash:</span>
                            <span className="text-xs text-white font-mono bg-zinc-700/50 px-2 py-1 rounded block break-all">
                              {truncateHash(record.block_hash, 20)}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block mb-1">Tx Hash:</span>
                            <span className="text-xs text-white font-mono bg-zinc-700/50 px-2 py-1 rounded block break-all">
                              {truncateHash(record.transaction_hash, 20)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Gas Used:</span>
                            <span className="text-xs text-white">
                              {record.gas_used.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">Network:</span>
                            <span className="text-xs text-purple-300">
                              {record.network}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Threat Analysis */}
                      <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50 md:col-span-2 xl:col-span-1">
                        <h5 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
                          <FiAlertTriangle className="w-4 h-4" />
                          Threat Analysis
                        </h5>
                        {record.threat_indicators && record.threat_indicators.length > 0 ? (
                          <div className="space-y-2">
                            <div className="text-xs text-gray-400 mb-2">
                              Indicators Detected:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {record.threat_indicators.map((indicator, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-red-800/40 text-red-300 text-xs rounded-full border border-red-500/30 font-medium"
                                >
                                  🚨 {indicator}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-4">
                            <div className="text-center">
                              <FiCheckCircle className="text-green-400 w-6 h-6 mx-auto mb-2" />
                              <span className="text-xs text-green-400">
                                No threats detected
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge Row */}
                    <div className="flex flex-wrap justify-between items-center pt-4 border-t border-zinc-700/50">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 bg-purple-800/30 text-purple-300 text-xs rounded-full border border-purple-500/30 flex items-center gap-1">
                          🔗 {record.network}
                        </span>
                        {record.status !== "legitimate" && (
                          <span className="px-3 py-1 bg-red-800/30 text-red-300 text-xs rounded-full border border-red-500/30 flex items-center gap-1">
                            🚨 THREAT DETECTED
                          </span>
                        )}
                        {record.status === "legitimate" && (
                          <span className="px-3 py-1 bg-green-800/30 text-green-300 text-xs rounded-full border border-green-500/30 flex items-center gap-1">
                            ✅ VERIFIED SAFE
                          </span>
                        )}
                      </div>