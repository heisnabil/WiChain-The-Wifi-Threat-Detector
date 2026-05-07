import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TiArrowDown } from "react-icons/ti";
import {
  FiLock,
  FiWifi,
  FiShield,
  FiAlertTriangle,
  FiActivity,
  FiDatabase,
  FiGlobe,
  FiClock,
  FiHash,
  FiTrendingUp,
  FiEye,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import shield from "../Assets/imgs/my.png";
import MoreInfo from "../components/MoreInfo";
import RevealParagraph from "./RevealParagraph";

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

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [blockchainRecords, setBlockchainRecords] = useState([]);
  const [showBlockchainRecords, setShowBlockchainRecords] = useState(false);
  const [blockchainStats, setBlockchainStats] = useState(null);
  const [activeTab, setActiveTab] = useState("scan");
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [showBlockchainInfo, setShowBlockchainInfo] = useState(false);
  const { text, scramble, stopScramble } = useScramble();

  useEffect(() => {
    setIsVisible(true);
    fetchBlockchainRecords();
    fetchBlockchainStats();
    fetchBlockchainInfo();
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  const fetchBlockchainRecords = async () => {
    try {
      const response = await fetch("http://localhost:5000/blockchain-records");
      const data = await response.json();

      if (response.ok && data.status === "success") {
        setBlockchainRecords(data.records);
      }
    } catch (error) {
      console.error("Failed to fetch blockchain records:", error);
    }
  };

  const fetchBlockchainStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/blockchain-stats");
      const data = await response.json();

      if (response.ok && data.status === "success") {
        setBlockchainStats(data.blockchain_stats);
      }
    } catch (error) {
      console.error("Failed to fetch blockchain stats:", error);
    }
  };

  const fetchBlockchainInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/blockchain-info");
      const data = await response.json();

      if (response.ok && data.status === "success") {
        setBlockchainInfo(data);
      }
    } catch (error) {
      console.error("Failed to fetch blockchain info:", error);
    }
  };

  const handleScanClick = async () => {
    setIsScanning(true);
    setScanError(null);
    setScanResults(null);

    try {
      const response = await fetch("http://localhost:5000/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scan failed");
      }

      setScanResults(data);
      setShowResults(true);
      setActiveTab("scan");

      // Refresh blockchain data
      await fetchBlockchainRecords();
      await fetchBlockchainStats();
      await fetchBlockchainInfo();
    } catch (error) {
      setScanError(error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleMineBlock = async () => {
    try {
      const response = await fetch("http://localhost:5000/mine-block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh all blockchain data
        await fetchBlockchainRecords();
        await fetchBlockchainStats();
        await fetchBlockchainInfo();
      } else {
        console.error("Mining failed:", data.error);
      }
    } catch (error) {
      console.error("Failed to mine block:", error);
    }
  };

  const getSignalStrength = (rssi) => {
    if (rssi >= -30)
      return { level: "Excellent", color: "text-green-400", bars: 4 };
    if (rssi >= -50) return { level: "Good", color: "text-green-400", bars: 3 };
    if (rssi >= -70)
      return { level: "Fair", color: "text-yellow-400", bars: 2 };
    return { level: "Poor", color: "text-red-400", bars: 1 };
  };

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

  const getSecurityIcon = (prediction) => {
    return prediction === "spoof" ? (
      <FiAlertTriangle className="text-red-400" />
    ) : (
      <FiShield className="text-green-400" />
    );
  };

  const getSecurityColor = (prediction) => {
    return prediction === "spoof" ? "text-red-400" : "text-green-400";
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateHash = (hash, length = 16) => {
    return hash
      ? `${hash.substring(0, length)}...${hash.substring(hash.length - 8)}`
      : "N/A";
  };

  const shieldOffset = {
    transform: `translate(-50%, -50%) translateX(${
      (mousePos.x -
        (typeof window !== "undefined" ? window.innerWidth : 0) / 2) *
      -0.01
    }px) translateY(${
      (mousePos.y -
        (typeof window !== "undefined" ? window.innerHeight : 0) / 2) *
      -0.01
    }px)`,
  };

  const para =
    "WICHAIN is your network's intelligent guardian — combining the precision of AI with the integrity of blockchain to detect threats before they strike. Our decentralized architecture ensures tamper-proof security, while real-time analytics empower you to act with confidence.";

  return (
    <div
      className="min-h-screen text-white bg-trueno-gradient relative overflow-x-hidden overflow-y-auto font-Poppins"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Shield Background with Parallax */}
      <div
        className="absolute top-[7%] left-1/2 z-0 opacity-10 pointer-events-none transition-transform duration-200 ease-out"
        style={shieldOffset}
      >
        <img src={shield} alt="Shield" className="w-[60vw] h-auto" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Hero Section */}
          <div className="flex-1 mt-16 sm:mt-24 lg:mt-[22%]">
            <div
              className={`text-center mb-16 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="group text-4xl sm:text-5xl lg:text-[9vw] font-BOLD mb-6 tracking-widest text-purple-400 text-stroke hover-effect">
                WICHAIN
              </h1>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl mx-auto px-4 text-center font-extrabold mb-6 tracking-widest uppercase font-Poppins">
                Detect. Protect. Trust.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-medium font-Poppins mx-auto max-w-xl text-center mb-6">
                Your network's first line of defense — powered by AI and
                blockchain.
              </p>

              {/* Blockchain Stats Dashboard */}
              {blockchainStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6 max-w-4xl mx-auto"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <FiDatabase className="text-cyan-400 mr-2" />
                        <span className="text-sm text-gray-400">Network</span>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          blockchainStats.connected
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {blockchainStats.connected ? "🟢 Online" : "🔴 Offline"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {blockchainStats.network}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <FiActivity className="text-purple-400 mr-2" />
                        <span className="text-sm text-gray-400">
                          Latest Block
                        </span>
                      </div>
                      <div className="text-lg font-semibold text-white">
                        #{blockchainStats.latest_block}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <FiAlertTriangle className="text-orange-400 mr-2" />
                        <span className="text-sm text-gray-400">Threats</span>
                      </div>
                      <div className="text-lg font-semibold text-orange-400">
                        {blockchainStats.total_detections}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <FiTrendingUp className="text-green-400 mr-2" />
                        <span className="text-sm text-gray-400">Recent</span>
                      </div>
                      <div className="text-lg font-semibold text-green-400">
                        {blockchainStats.recent_detections}
                      </div>
                      <div className="text-xs text-gray-500">Last hour</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {blockchainStats.chain_valid ? (
                          <FiCheckCircle className="text-green-400 mr-2" />
                        ) : (
                          <FiXCircle className="text-red-400 mr-2" />
                        )}
                        <span className="text-sm text-gray-400">Chain</span>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          blockchainStats.chain_valid
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {blockchainStats.chain_valid ? "Valid" : "Invalid"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Pending: {blockchainStats.pending_transactions}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                {/* SCAN Button */}
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onMouseEnter={scramble}
                  onMouseLeave={stopScramble}
                  onClick={handleScanClick}
                  disabled={isScanning}
                  className="group relative overflow-hidden rounded-[2rem] border border-zinc-500 bg-zinc-700 px-8 py-3 font-mono font-semibold uppercase text-white transition-colors hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>{text}</span>
                      </>
                    )}
                  </div>
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: "-100%" }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 1,
                      ease: "linear",
                    }}
                    className="absolute inset-0 z-0 scale-125 bg-gradient-to-t from-indigo-400/0 from-40% via-indigo-400/100 to-indigo-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </motion.button>

                {/* Blockchain Records Button */}
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={() => {
                    setShowBlockchainRecords(true);
                    setActiveTab("blockchain");
                    fetchBlockchainRecords();
                  }}
                  className="group relative overflow-hidden rounded-[2rem] border border-purple-500 bg-purple-700 px-8 py-3 font-mono font-semibold uppercase text-white transition-colors hover:text-purple-300"
                >
                  <div className="relative z-10 flex items-center gap-2">
                    <FiDatabase />
                    <span>RECORDS</span>
                  </div>
                </motion.button>

                {/* Mine Block Button */}
                {blockchainStats?.pending_transactions > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.975 }}
                    onClick={handleMineBlock}
                    className="group relative overflow-hidden rounded-[2rem] border border-yellow-500 bg-yellow-700 px-8 py-3 font-mono font-semibold uppercase text-white transition-colors hover:text-yellow-300"
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      <FiActivity />
                      <span>MINE</span>
                    </div>
                  </motion.button>
                )}

                {/* Blockchain Info Button */}
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={() => {
                    setShowBlockchainInfo(true);
                    setActiveTab("info");
                    fetchBlockchainInfo();
                  }}
                  className="group relative overflow-hidden rounded-[2rem] border border-green-500 bg-green-700 px-8 py-3 font-mono font-semibold uppercase text-white transition-colors hover:text-green-300"
                >
                  <div className="relative z-10 flex items-center gap-2">
                    <FiHash />
                    <span>CHAIN</span>
                  </div>
                </motion.button>

                {/* Refresh Button */}
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  onClick={() => {
                    fetchBlockchainRecords();
                    fetchBlockchainStats();
                    fetchBlockchainInfo();
                  }}
                  className="group relative overflow-hidden rounded-[2rem] border border-gray-500 bg-gray-700 px-4 py-3 font-mono font-semibold uppercase text-white transition-colors hover:text-gray-300"
                >
                  <FiRefreshCw className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Tab Navigation */}
              {(showResults || showBlockchainRecords || showBlockchainInfo) && (
                <div className="flex justify-center mb-6">
                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-700 p-1">
                    <button
                      onClick={() => setActiveTab("scan")}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        activeTab === "scan"
                          ? "bg-cyan-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-zinc-700"
                      }`}
                    >
                      <FiWifi className="inline mr-2" />
                      Network Scan
                    </button>
                    <button
                      onClick={() => setActiveTab("blockchain")}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        activeTab === "blockchain"
                          ? "bg-purple-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-zinc-700"
                      }`}
                    >
                      <FiDatabase className="inline mr-2" />
                      Threat Records
                    </button>
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        activeTab === "info"
                          ? "bg-green-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white hover:bg-zinc-700"
                      }`}
                    >
                      <FiHash className="inline mr-2" />
                      Blockchain Info
                    </button>
                  </div>
                </div>
              )}

              {/* Scan Error Display */}
              {scanError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <FiAlertTriangle />
                    <span>Scan Failed: {scanError}</span>
                  </div>
                </motion.div>
              )}

              {/* Scan Results Display */}
              {showResults && scanResults && activeTab === "scan" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 max-w-6xl mx-auto"
                >
                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FiWifi className="text-cyan-400" />
                        Network Scan Results
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          {scanResults.total_scanned} networks found
                        </span>
                        <span
                          className={`font-semibold ${
                            scanResults.threats_detected > 0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {scanResults.threats_detected} threats detected
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4  overflow-y-auto">
                      {scanResults.networks.map((network, index) => {
                        const signal = getSignalStrength(network.RSSI);

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-xl border-2 ${getRiskLevelColor(
                              network.risk_level
                            )} transition-all hover:shadow-lg`}
                          >
                            {/* Network Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  {getSecurityIcon(network.prediction)}
                                  {network.prediction === "spoof" && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                    {network.SSID}
                                    {network.blockchain_stored && (
                                      <FiDatabase
                                        className="text-purple-400 w-4 h-4"
                                        title="Stored on blockchain"
                                      />
                                    )}
                                  </h4>
                                  <p className="text-sm text-gray-400">
                                    {network.BSSID} • {network.Vendors}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div
                                  className={`text-lg font-bold uppercase ${getSecurityColor(
                                    network.prediction
                                  )}`}
                                >
                                  {network.prediction}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {(network.score * 100).toFixed(1)}% confidence
                                </div>
                                <div
                                  className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(
                                    network.risk_level
                                  )} mt-1`}
                                >
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
                                <div className="text-sm text-gray-400">
                                  Signal
                                </div>
                                <div className="text-white font-semibold">
                                  {network.RSSI} dBm
                                </div>
                                <div className={`text-xs ${signal.color}`}>
                                  {signal.level}
                                </div>
                              </div>

                              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                                <div className="flex items-center justify-center mb-1">
                                  <FiShield className="text-blue-400" />
                                </div>
                                <div className="text-sm text-gray-400">
                                  Security
                                </div>
                                <div className="text-white font-semibold">
                                  {network.Encryption}
                                </div>
                              </div>

                              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                                <div className="flex items-center justify-center mb-1">
                                  <FiGlobe className="text-green-400" />
                                </div>
                                <div className="text-sm text-gray-400">
                                  Band
                                </div>
                                <div className="text-white font-semibold">
                                  {network.Band}
                                </div>
                              </div>

                              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                                <div className="flex items-center justify-center mb-1">
                                  <FiEye className="text-yellow-400" />
                                </div>
                                <div className="text-sm text-gray-400">
                                  Duplicates
                                </div>
                                <div className="text-white font-semibold">
                                  {network.Duplicate_Count}
                                </div>
                              </div>

                              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                                <div className="flex items-center justify-center mb-1">
                                  <FiGlobe
                                    className={
                                      network.Internet_Access
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }
                                  />
                                </div>
                                <div className="text-sm text-gray-400">
                                  Internet
                                </div>
                                <div className="text-white font-semibold">
                                  {network.Internet_Access ? "Yes" : "No"}
                                </div>
                              </div>
                            </div>

                            {/* Threat Indicators */}
                            {network.threat_indicators &&
                              network.threat_indicators.length > 0 && (
                                <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FiAlertTriangle className="text-red-400" />
                                    <span className="font-semibold text-red-400">
                                      Threat Indicators:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {network.threat_indicators.map(
                                      (indicator, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-red-800/30 text-red-300 text-xs rounded-full"
                                        >
                                          {indicator}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowResults(false)}
                        className="px-6 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                      >
                        Close Results
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Blockchain Records Display */}
              {showBlockchainRecords && activeTab === "blockchain" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 max-w-6xl mx-auto "
                >
                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border  border-zinc-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FiDatabase className="text-purple-400" />
                        Blockchain Threat Records
                      </h3>
                      <div className="text-sm text-gray-400">
                        {blockchainRecords.length} total records
                      </div>
                    </div>

                    {blockchainRecords.length === 0 ? (
                      <div className="text-center py-12">
                        <FiDatabase className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">
                          No Threat Records Found
                        </h3>
                        <p className="text-gray-500">
                          Run a scan to detect threats and store them on the
                          blockchain
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max overfl">
                        {blockchainRecords.map((record, index) => (
                          <motion.div
                            key={record.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl border-2 bg-purple-900/10 border-purple-500/30 transition-all hover:shadow-lg"
                          >
                            {/* Record Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <FiAlertTriangle className="text-red-400 text-xl" />
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold text-white">
                                    {record.ssid}
                                  </h4>
                                  <p className="text-sm text-gray-400">
                                    Block #{record.block_index} •{" "}
                                    {record.vendor}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-sm font-semibold text-red-400 uppercase">
                                  {record.status}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {record.confidence}% confidence
                                </div>
                                <div
                                  className={`text-xs px-2 py-1 rounded-full mt-1 ${getRiskLevelColor(
                                    record.risk_level
                                  )}`}
                                >
                                  {record.risk_level.toUpperCase()} RISK
                                </div>
                              </div>
                            </div>

                            {/* Blockchain Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <FiClock className="text-cyan-400" />
                                  <span className="text-sm text-gray-400">
                                    Detection Time:
                                  </span>
                                  <span className="text-white text-sm">
                                    {formatTimestamp(record.timestamp)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiWifi className="text-green-400" />
                                  <span className="text-sm text-gray-400">
                                    BSSID:
                                  </span>
                                  <span className="text-white text-sm font-mono">
                                    {record.bssid}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiActivity className="text-yellow-400" />
                                  <span className="text-sm text-gray-400">
                                    Signal:
                                  </span>
                                  <span className="text-white text-sm">
                                    {record.rssi} dBm
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <FiHash className="text-purple-400" />
                                  <span className="text-sm text-gray-400">
                                    Block Hash:
                                  </span>
                                  <span className="text-white text-xs font-mono">
                                    {truncateHash(record.block_hash)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiHash className="text-blue-400" />
                                  <span className="text-sm text-gray-400">
                                    Tx Hash:
                                  </span>
                                  <span className="text-white text-xs font-mono">
                                    {truncateHash(record.transaction_hash)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiTrendingUp className="text-orange-400" />
                                  <span className="text-sm text-gray-400">
                                    Gas Used:
                                  </span>
                                  <span className="text-white text-sm">
                                    {record.gas_used.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Threat Indicators */}
                            {record.threat_indicators &&
                              record.threat_indicators.length > 0 && (
                                <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FiAlertTriangle className="text-red-400" />
                                    <span className="font-semibold text-red-400">
                                      Threat Indicators:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {record.threat_indicators.map(
                                      (indicator, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-red-800/30 text-red-300 text-xs rounded-full"
                                        >
                                          {indicator}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Network Badge */}
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-purple-800/30 text-purple-300 text-xs rounded-full border border-purple-500/30">
                                  🔗 {record.network}
                                </span>
                                <span className="px-3 py-1 bg-red-800/30 text-red-300 text-xs rounded-full border border-red-500/30">
                                  🚨 THREAT DETECTED
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Encryption: {record.encryption}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowBlockchainRecords(false)}
                        className="px-6 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                      >
                        Close Records
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Blockchain Info Display */}
              {showBlockchainInfo && activeTab === "info" && blockchainInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 max-w-6xl mx-auto"
                >
                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FiHash className="text-green-400" />
                        Blockchain Information
                      </h3>
                      <div className="text-sm text-gray-400">
                        Chain Length: {blockchainInfo.chain_length} blocks
                      </div>
                    </div>

                    {/* Blockchain Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <FiDatabase className="text-cyan-400 mr-2" />
                          <span className="text-sm text-gray-400">
                            Total Blocks
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {blockchainInfo.chain_length}
                        </div>
                      </div>

                      <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <FiActivity className="text-purple-400 mr-2" />
                          <span className="text-sm text-gray-400">
                            Total Transactions
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {blockchainInfo.stats.total_transactions}
                        </div>
                      </div>

                      <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <FiAlertTriangle className="text-orange-400 mr-2" />
                          <span className="text-sm text-gray-400">
                            Threat Detections
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-orange-400">
                          {blockchainInfo.stats.threat_detections}
                        </div>
                      </div>

                      <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          {blockchainInfo.is_valid ? (
                            <FiCheckCircle className="text-green-400 mr-2" />
                          ) : (
                            <FiXCircle className="text-red-400 mr-2" />
                          )}
                          <span className="text-sm text-gray-400">
                            Chain Status
                          </span>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            blockchainInfo.is_valid
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {blockchainInfo.is_valid ? "VALID" : "INVALID"}
                        </div>
                      </div>
                    </div>

                    {/* Block List */}
                    <div className="space-y-4  overflow-y-auto">
                      {blockchainInfo.chain.map((block, index) => (
                        <motion.div
                          key={block.index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                            block.index === 0
                              ? "bg-blue-900/10 border-blue-500/30"
                              : "bg-green-900/10 border-green-500/30"
                          }`}
                        >
                          {/* Block Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <FiHash
                                  className={`text-xl ${
                                    block.index === 0
                                      ? "text-blue-400"
                                      : "text-green-400"
                                  }`}
                                />
                                {block.index === 0 && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-white">
                                  Block #{block.index}
                                  {block.index === 0 && (
                                    <span className="ml-2 text-blue-400 text-sm">
                                      (Genesis)
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {formatTimestamp(block.timestamp)}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-400">
                                Nonce: {block.nonce}
                              </div>
                              <div className="text-xs text-gray-500">
                                {block.data && block.data.transactions
                                  ? `${block.data.transactions.length} transactions`
                                  : "Genesis block"}
                              </div>
                            </div>
                          </div>

                          {/* Block Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FiHash className="text-cyan-400" />
                                <span className="text-sm text-gray-400">
                                  Block Hash:
                                </span>
                              </div>
                              <div className="text-white text-xs font-mono bg-zinc-800/50 p-2 rounded">
                                {block.hash}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FiHash className="text-purple-400" />
                                <span className="text-sm text-gray-400">
                                  Previous Hash:
                                </span>
                              </div>
                              <div className="text-white text-xs font-mono bg-zinc-800/50 p-2 rounded">
                                {block.previous_hash || "Genesis Block"}
                              </div>
                            </div>
                          </div>

                          {/* Block Data */}
                          {block.data && typeof block.data === "object" && (
                            <div className="mt-4 p-3 bg-zinc-800/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <FiDatabase className="text-green-400" />
                                <span className="font-semibold text-green-400">
                                  Block Data:
                                </span>
                              </div>
                              {block.index === 0 ? (
                                <div className="text-sm text-gray-300">
                                  {block.data.message ||
                                    "Genesis block initialization"}
                                </div>
                              ) : (
                                block.data.transactions && (
                                  <div className="space-y-2">
                                    {block.data.transactions
                                      .slice(0, 3)
                                      .map((tx, txIndex) => (
                                        <div
                                          key={txIndex}
                                          className="text-sm p-2 bg-zinc-700/50 rounded"
                                        >
                                          <div className="flex justify-between items-center">
                                            <span className="text-gray-300">
                                              {tx.type === "threat_detection"
                                                ? "🚨 Threat Detection"
                                                : tx.type === "mining_reward"
                                                ? "⛏️ Mining Reward"
                                                : tx.type}
                                            </span>
                                            {tx.type === "threat_detection" && (
                                              <span className="text-red-400 text-xs">
                                                {tx.ssid}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    {block.data.transactions.length > 3 && (
                                      <div className="text-xs text-gray-500 text-center">
                                        ... and{" "}
                                        {block.data.transactions.length - 3}{" "}
                                        more transactions
                                      </div>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowBlockchainInfo(false)}
                        className="px-6 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
                      >
                        Close Blockchain Info
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Scroll Prompt Fixed at Bottom */}
            {!showResults && !showBlockchainRecords && !showBlockchainInfo && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-2">
                  Scroll for more info
                </p>
                <a href="#more-info">
                  <TiArrowDown className="text-cyan-400 w-6 h-6 animate-bounce" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text Animation Section */}
      <div className="flex justify-center items-center">
        <motion.div
          className="flex justify-center items-center rounded-t-2xl bg-[#d6d6c9] text-black w-full mt-20 min-h-screen px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <RevealParagraph
            className="text-xl sm:text-5xl text-center mx-auto max-w-7xl leading-relaxed font-semibold flex flex-wrap justify-center"
            text={para}
          />
        </motion.div>
      </div>

      {/* More Info Section */}
      <MoreInfo />

      {/* Custom Grid Background */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default Home;
