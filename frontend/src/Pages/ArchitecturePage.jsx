import React, { useState, useEffect, useRef } from "react";
import {
  Cpu,
  Brain,
  Shield,
  Database,
  Network,
  Zap,
  ArrowRight,
  ArrowDown,
  Settings,
  Eye,
  Lock,
  Globe,
  Activity,
  Server,
  Wifi,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Code,
  Hash,
} from "lucide-react";

// Scramble Logic (same as home component)
const TARGET_TEXT = "Architecture Overview";
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

const ArchitectureSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedPipeline, setSelectedPipeline] = useState("overview");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { text, scramble, stopScramble } = useScramble();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });
  };

  // Pipeline stages
  const pipelineStages = [
    {
      id: "capture",
      title: "WiFi Packet Capture",
      icon: <Wifi className="w-8 h-8" />,
      description:
        "Real-time monitoring and capture of WiFi beacon frames, management packets, and data frames",
      details: [
        "Monitor mode packet sniffing",
        "Multi-frequency band analysis (2.4GHz, 5GHz)",
        "Frame filtering and preprocessing",
        "Temporal feature extraction",
      ],
      color: "from-cyan-400 to-blue-600",
      position: { x: 10, y: 20 },
    },
    {
      id: "preprocessing",
      title: "Data Preprocessing",
      icon: <Settings className="w-8 h-8" />,
      description:
        "Feature extraction, normalization, and encoding of WiFi packet characteristics",
      details: [
        "Signal strength normalization",
        "Timing interval calculations",
        "MAC address pattern analysis",
        "Categorical encoding of protocols",
      ],
      color: "from-green-400 to-emerald-600",
      position: { x: 30, y: 20 },
    },
    {
      id: "ml-model",
      title: "ML Detection Engine",
      icon: <Brain className="w-8 h-8" />,
      description:
        "Advanced neural network trained to identify spoofing patterns and anomalies",
      details: [
        "Deep neural network architecture",
        "Real-time inference pipeline",
        "Confidence scoring system",
        "Adaptive learning mechanisms",
      ],
      color: "from-purple-400 to-indigo-600",
      position: { x: 50, y: 20 },
    },
    {
      id: "analysis",
      title: "Threat Analysis",
      icon: <Eye className="w-8 h-8" />,
      description:
        "Comprehensive analysis of detected threats with risk assessment and classification",
      details: [
        "Attack vector identification",
        "Risk severity scoring",
        "False positive filtering",
        "Contextual threat intelligence",
      ],
      color: "from-yellow-400 to-orange-600",
      position: { x: 70, y: 20 },
    },
    {
      id: "blockchain",
      title: "Blockchain Storage",
      icon: <Lock className="w-8 h-8" />,
      description:
        "Immutable storage of threat intelligence and security events on blockchain",
      details: [
        "Cryptographic hash verification",
        "Distributed ledger storage",
        "Smart contract automation",
        "Tamper-proof audit trails",
      ],
      color: "from-red-400 to-pink-600",
      position: { x: 90, y: 20 },
    },
  ];

  // System components
  const systemComponents = [
    {
      id: "input-layer",
      title: "Input Layer",
      description: "WiFi traffic ingestion and initial processing",
      icon: <Network className="w-6 h-6" />,
      specs: [
        "Throughput: 10Gbps",
        "Latency: <1ms",
        "Protocols: 802.11 a/b/g/n/ac/ax",
        "Channels: All 2.4/5GHz",
      ],
    },
    {
      id: "feature-engine",
      title: "Feature Extraction Engine",
      description: "Advanced signal processing and feature engineering",
      icon: <Cpu className="w-6 h-6" />,
      specs: [
        "Features: 41 engineered",
        "Processing: Real-time",
        "Algorithms: FFT, Wavelet",
        "Memory: 16GB RAM",
      ],
    },
    {
      id: "ml-inference",
      title: "ML Inference Engine",
      description: "Deep learning model for spoofing detection",
      icon: <Brain className="w-6 h-6" />,
      specs: [
        "Architecture: CNN-LSTM hybrid",
        "Accuracy: 98.7%",
        "Inference: 12ms avg",
        "Model size: 245MB",
      ],
    },
    {
      id: "blockchain-layer",
      title: "Blockchain Layer",
      description: "Decentralized security event storage",
      icon: <Hash className="w-6 h-6" />,
      specs: [
        "Consensus: Proof of Authority",
        "Block time: 15 seconds",
        "TPS: 1000 transactions",
        "Storage: IPFS integration",
      ],
    },
  ];

  // Detection logic flow
  const detectionFlow = [
    {
      step: 1,
      title: "Signal Acquisition",
      description: "Capture WiFi frames across all channels",
      icon: <Activity className="w-5 h-5" />,
      output: "Raw packet data",
    },
    {
      step: 2,
      title: "Feature Extraction",
      description: "Extract 41 key features from packet headers",
      icon: <Code className="w-5 h-5" />,
      output: "Feature vectors",
    },
    {
      step: 3,
      title: "ML Classification",
      description: "Neural network processes features",
      icon: <Brain className="w-5 h-5" />,
      output: "Probability scores",
    },
    {
      step: 4,
      title: "Threat Decision",
      description: "Binary classification with confidence",
      icon: <Shield className="w-5 h-5" />,
      output: "Legitimate/Spoofed",
    },
    {
      step: 5,
      title: "Blockchain Logging",
      description: "Immutable event recording",
      icon: <Lock className="w-5 h-5" />,
      output: "Verified transaction",
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
          <div className="flex items-center justify-center mb-8 mt-8">
            <div className="relative">
              <div className="w-16 h-16 bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] flex items-center justify-center shadow-2xl">
                <Server className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center animate-bounce">
                <Brain className="w-3 h-3 text-gray-900" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl relative sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-widest uppercase font-Poppins">
            ARCHITECTURE
          </h1>

          <p className="text-sm lg:text-lg text-gray-300 font-medium font-Poppins mx-auto max-w-xl text-center mb-8">
            Advanced ML-powered WiFi spoofing detection with blockchain-verified
            security intelligence
          </p>

          {/* Status Indicator with Scramble */}
          <div
            onMouseEnter={scramble}
            onMouseLeave={stopScramble}
            className="inline-flex items-center px-6 py-2 bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] text-purple-400 text-sm font-medium font-mono cursor-pointer transition-colors :text-indigo-300"
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
            {text}
          </div>
        </div>

        {/* Detection Logic Flow */}
        <div
          className={`mb-20 transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-purple-400 mb-12 font-Poppins">
            Spoof Detection Logic
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {detectionFlow.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] p-6  transition-all duration-300 :scale-105">
                  {/* Step Number */}
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-purple-400">{step.icon}</div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 font-Poppins">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed font-Poppins">
                    {step.description}
                  </p>

                  {/* Output */}
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <span className="text-xs text-cyan-400 font-medium font-Poppins">
                      Output:{" "}
                    </span>
                    <span className="text-xs text-gray-300 font-Poppins">
                      {step.output}
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                {index < detectionFlow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-purple-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Components */}
        <div
          className={`mb-20 transform transition-all duration-1000 delay-600 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-green-400 mb-12 font-Poppins">
            Core Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemComponents.map((component, index) => (
              <div
                key={component.id}
                className="bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] p-6 :bg-zinc-600 :border-green-500 transition-all duration-300 :scale-105"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-green-400">{component.icon}</div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 font-Poppins">
                  {component.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed font-Poppins">
                  {component.description}
                </p>

                {/* Specifications */}
                <div className="space-y-2">
                  {component.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-gray-500 font-Poppins">
                        {spec.split(":")[0]}:
                      </span>
                      <span className="text-green-400 font-medium font-Poppins">
                        {spec.split(":")[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Integration */}
        <div
          className={`mb-20 transform transition-all duration-1000 delay-800 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] p-8  transition-all duration-300">
            <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center font-Poppins">
              <Lock className="w-8 h-8 mr-3" />
              Blockchain Integration
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4 font-Poppins">
                  Security Event Storage
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="text-white font-medium font-Poppins">
                        Cryptographic Hashing
                      </h4>
                      <p className="text-gray-400 text-sm font-Poppins">
                        SHA-256 hashing ensures data integrity and tamper
                        detection
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Database className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="text-white font-medium font-Poppins">
                        Distributed Storage
                      </h4>
                      <p className="text-gray-400 text-sm font-Poppins">
                        IPFS integration for scalable, decentralized data
                        storage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="text-white font-medium font-Poppins">
                        Consensus Mechanism
                      </h4>
                      <p className="text-gray-400 text-sm font-Poppins">
                        Proof of Authority for fast, secure transaction
                        validation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-4 font-Poppins">
                  Smart Contract Logic
                </h3>
                <div className="bg-zinc-800 rounded-xl p-4 font-mono text-sm">
                  <div className="text-green-400 mb-2">
                    // Threat Detection Contract
                  </div>
                  <div className="text-gray-300 whitespace-pre-line">
                    {`function logThreat(
  bytes32 threatHash,
  uint256 timestamp,
  uint8 severity
) external {
  threats[threatHash] = ThreatEvent({
    hash: threatHash,
    timestamp: timestamp,
    severity: severity,
    verified: true
  });
}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div
          className={`transform transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] p-6 text-center :bg-zinc-600 :border-cyan-500 transition-all duration-300">
              <Activity className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-Poppins">
                Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">
                    Detection Speed:
                  </span>
                  <span className="text-cyan-400 font-Poppins">12ms avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">
                    Throughput:
                  </span>
                  <span className="text-cyan-400 font-Poppins">10Gbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">Uptime:</span>
                  <span className="text-cyan-400 font-Poppins">99.9%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] p-6 text-center  transition-all duration-300">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-Poppins">
                AI Model
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">Accuracy:</span>
                  <span className="text-purple-400 font-Poppins">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">Precision:</span>
                  <span className="text-purple-400 font-Poppins">97.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">Recall:</span>
                  <span className="text-purple-400 font-Poppins">98.2%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#2a2a2a]/40 border border-zinc-500 rounded-[2rem] p-6 text-center  transition-all duration-300">
              <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 font-Poppins">
                Security
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">
                    Block Time:
                  </span>
                  <span className="text-yellow-400 font-Poppins">15 sec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">Hash Rate:</span>
                  <span className="text-yellow-400 font-Poppins">256 bit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-Poppins">Integrity:</span>
                  <span className="text-yellow-400 font-Poppins">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
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

        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ArchitectureSection;
