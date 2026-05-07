import React, { useState, useEffect, useRef } from "react";
import {
  Database,
  Filter,
  BarChart3,
  PieChart,
  Download,
  Eye,
  Zap,
  Shield,
  Wifi,
  Brain,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as PieChartContainer,
  Pie,
  Cell,
} from "recharts";

// Scramble Logic (same as home component)
const TARGET_TEXT = "Dataset Status: Active & Verified";
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

const DatasetSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { text, scramble, stopScramble } = useScramble();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  // Mock dataset sample
  const sampleData = [
    {
      id: 1,
      duration: 0.12,
      protocol_type: "tcp",
      service: "http",
      flag: "SF",
      src_bytes: 1024,
      dst_bytes: 2048,
      count: 5,
      srv_count: 3,
      label: "normal",
    },
    {
      id: 2,
      duration: 0.05,
      protocol_type: "udp",
      service: "dns",
      flag: "SF",
      src_bytes: 512,
      dst_bytes: 256,
      count: 1,
      srv_count: 1,
      label: "normal",
    },
    {
      id: 3,
      duration: 2.45,
      protocol_type: "tcp",
      service: "ftp",
      flag: "REJ",
      src_bytes: 0,
      dst_bytes: 0,
      count: 15,
      srv_count: 8,
      label: "spoof",
    },
    {
      id: 4,
      duration: 0.01,
      protocol_type: "icmp",
      service: "eco_i",
      flag: "SF",
      src_bytes: 64,
      dst_bytes: 64,
      count: 1,
      srv_count: 1,
      label: "normal",
    },
    {
      id: 5,
      duration: 120.0,
      protocol_type: "tcp",
      service: "telnet",
      flag: "S0",
      src_bytes: 0,
      dst_bytes: 0,
      count: 25,
      srv_count: 12,
      label: "spoof",
    },
  ];

  // Dataset features
  const features = [
    {
      name: "duration",
      description: "Connection duration in seconds",
      type: "Continuous",
    },
    {
      name: "protocol_type",
      description: "WiFi protocol (tcp, udp, icmp)",
      type: "Categorical",
    },
    {
      name: "service",
      description: "Network service destination",
      type: "Categorical",
    },
    {
      name: "flag",
      description: "Connection status flag",
      type: "Categorical",
    },
    {
      name: "src_bytes",
      description: "Bytes transmitted from source",
      type: "Continuous",
    },
    {
      name: "dst_bytes",
      description: "Bytes received at destination",
      type: "Continuous",
    },
    {
      name: "count",
      description: "Connections to same host",
      type: "Discrete",
    },
    {
      name: "srv_count",
      description: "Connections to same service",
      type: "Discrete",
    },
    {
      name: "label",
      description: "Classification (normal/spoof)",
      type: "Binary",
    },
  ];

  // Chart data
  const protocolDistribution = [
    { name: "TCP", value: 65, count: 6500 },
    { name: "UDP", value: 25, count: 2500 },
    { name: "ICMP", value: 10, count: 1000 },
  ];

  const labelDistribution = [
    { name: "Normal", value: 60, count: 6000 },
    { name: "Spoofed", value: 40, count: 4000 },
  ];

  const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b"];

  const tools = [
    {
      name: "Wireshark",
      description: "WiFi packet capture and deep analysis",
      icon: <Wifi className="w-6 h-6 text-cyan-400" />,
    },
    {
      name: "Scapy",
      description: "Python packet manipulation & crafting",
      icon: <Brain className="w-6 h-6 text-purple-400" />,
    },
    {
      name: "tcpdump",
      description: "Command-line network analyzer",
      icon: <Shield className="w-6 h-6 text-green-400" />,
    },
    {
      name: "NetworkX",
      description: "Network topology & graph analysis",
      icon: <Database className="w-6 h-6 text-blue-400" />,
    },
  ];

  const preprocessingSteps = [
    {
      step: "Data Cleaning",
      description:
        "Removed duplicate WiFi sessions and handled missing beacon frames",
    },
    {
      step: "Feature Encoding",
      description:
        "One-hot encoded categorical WiFi parameters (SSID, MAC, encryption)",
    },
    {
      step: "Normalization",
      description:
        "Min-max scaling applied to signal strength and timing features",
    },
    {
      step: "Feature Selection",
      description:
        "Selected top 20 WiFi-specific features using correlation analysis",
    },
    {
      step: "Data Balancing",
      description:
        "Applied SMOTE to balance legitimate vs spoofed WiFi samples",
    },
  ];

  return (
    <div
      className="min-h-screen text-white bg-trueno-gradient relative overflow-x-hidden overflow-y-auto font-Poppins"
      onMouseMove={handleMouseMove}
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center mb-8">
            <div className="relative mt-10">
              <div className="w-16 h-16 bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] flex items-center justify-center shadow-2xl">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center animate-bounce">
                <Wifi className="w-3 h-3 text-gray-900" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl relative sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-widest uppercase font-Poppins">
            DATASET
          </h1>

          <p className="text-sm lg:text-lg text-gray-300 font-medium font-Poppins mx-auto max-w-xl text-center mb-8">
            Blockchain-verified WiFi spoofing dataset engineered for AI-driven
            threat detection and network integrity.
          </p>

          {/* Status Indicator with Scramble Effect */}
          <div
            onMouseEnter={scramble}
            onMouseLeave={stopScramble}
            className="inline-flex items-center px-6 py-2 bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] text-green-400 text-sm font-medium font-mono cursor-pointer transition-colors hover:text-indigo-300"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            {text}
          </div>
        </div>

        {/* Dataset Creation Section */}
        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-15">
          {/* Protocol Distribution */}
          <div className="flex-1 bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center font-Poppins">
              <PieChart className="w-5 h-5 mr-2" />
              Protocol Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChartContainer>
                <Pie
                  data={protocolDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {protocolDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChartContainer>
            </ResponsiveContainer>
          </div>

          {/* Label Distribution */}
          <div className="flex-1 bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center font-Poppins">
              <BarChart3 className="w-5 h-5 mr-2" />
              Label Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={labelDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Tools & Technologies */}
        <div
          className={`bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] p-8 mb-16  transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-cyan-400 bg-clip-text mb-6 font-Poppins">
            Tools & Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-zinc-800 rounded-[1rem] border border-zinc-600 hover:border-cyan-500 transition-all duration-300"
              >
                <div className="mr-4">{tool.icon}</div>
                <div>
                  <h3 className="font-semibold text-white font-Poppins">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-Poppins">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WiFi Dataset Features Table */}
        <div
          className={`bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] p-8 mb-16  transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-400 via-cyan-500 to-purple-400 bg-clip-text mb-6 flex items-center font-Poppins">
            <Filter className="w-6 h-6 mr-3" />
            WiFi Dataset Features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-800">
                  <th className="border border-zinc-600 px-4 py-3 text-left font-semibold text-cyan-400 font-Poppins">
                    Feature Name
                  </th>
                  <th className="border border-zinc-600 px-4 py-3 text-left font-semibold text-cyan-400 font-Poppins">
                    Description
                  </th>
                  <th className="border border-zinc-600 px-4 py-3 text-left font-semibold text-cyan-400 font-Poppins">
                    Data Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className=" transition-colors">
                    <td className="border border-zinc-600 px-4 py-3 font-mono text-sm text-purple-400">
                      {feature.name}
                    </td>
                    <td className="border border-zinc-600 px-4 py-3 text-gray-300 font-Poppins">
                      {feature.description}
                    </td>
                    <td className="border border-zinc-600 px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          feature.type === "Continuous"
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500"
                            : feature.type === "Categorical"
                            ? "bg-green-500/20 text-green-400 border-green-500"
                            : feature.type === "Discrete"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500"
                            : "bg-purple-500/20 text-purple-400 border-purple-500"
                        } font-Poppins`}
                      >
                        {feature.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sample Data Table */}
        <div
          className={`bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] p-8 mb-16  transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-cyan-400 bg-clip-text flex items-center font-Poppins">
              <Eye className="w-6 h-6 mr-3" />
              Sample WiFi Traffic Data (Top 5 Rows)
            </h2>
            <button className="group flex items-center px-6 py-2 bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] text-white font-mono font-semibold uppercase transition-colors hover:text-indigo-300">
              <Download className="w-4 h-4 mr-2 group-hover:animate-pulse" />
              Export Dataset
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-800">
                  {[
                    "ID",
                    "Duration",
                    "Protocol",
                    "Service",
                    "Flag",
                    "Src Bytes",
                    "Dst Bytes",
                    "Count",
                    "Srv Count",
                    "Label",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="border border-zinc-600 px-3 py-2 text-left font-semibold text-cyan-400 font-Poppins"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row) => (
                  <tr key={row.id} className=" transition-colors">
                    <td className="border border-zinc-600 px-3 py-2 text-gray-300 font-mono">
                      {row.id}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 font-mono text-gray-300">
                      {row.duration}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 font-mono text-gray-300">
                      {row.protocol_type}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 font-mono text-gray-300">
                      {row.service}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 font-mono text-gray-300">
                      {row.flag}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 text-right text-gray-300 font-mono">
                      {row.src_bytes.toLocaleString()}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 text-right text-gray-300 font-mono">
                      {row.dst_bytes.toLocaleString()}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 text-right text-gray-300 font-mono">
                      {row.count}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2 text-right text-gray-300 font-mono">
                      {row.srv_count}
                    </td>
                    <td className="border border-zinc-600 px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border font-Poppins ${
                          row.label === "normal"
                            ? "bg-green-500/20 text-green-400 border-green-500"
                            : "bg-red-500/20 text-red-400 border-red-500"
                        }`}
                      >
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preprocessing Steps */}
        <div
          className={`bg-[#1c1c1d] border border-zinc-500 rounded-[2rem] p-8  transform transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center font-Poppins">
            <Filter className="w-6 h-6 mr-3" />
            Data Preprocessing Pipeline
          </h2>
          <div className="space-y-4">
            {preprocessingSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-zinc-800 rounded-[1rem] border border-zinc-600 hover:border-purple-500 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 font-Poppins">
                    {step.step}
                  </h3>
                  <p className="text-gray-400 font-Poppins">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

export default DatasetSection;
