import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Database,
  Settings,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const VerticalPipeline = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [visibleStages, setVisibleStages] = useState(new Set());
  const navigate = useNavigate();

  const pipelineStages = [
    {
      id: "data-ingestion",
      title: "Data Ingestion",
      description:
        "Collect and import data from various sources into the pipeline for processing.",
      icon: <Database className="w-4 h-4 text-white" />,
      color: "bg-black",
      details: [
        "Real-time streaming",
        "Batch processing",
        "API integrations",
        "File uploads",
      ],
    },
    {
      id: "data-processing",
      title: "Data Processing",
      description:
        "Transform, clean, and prepare data for analysis and modeling.",
      icon: <Settings className="w-4 h-4 text-white" />,
      color: "bg-black",
      details: [
        "Data cleaning",
        "Feature engineering",
        "Normalization",
        "Validation",
      ],
    },
    {
      id: "ml-training",
      title: "ML Training",
      description:
        "Train machine learning models using processed data and optimize performance.",
      icon: <Zap className="w-4 h-4 text-white" />,
      color: "bg-black",
      details: [
        "Model selection",
        "Hyperparameter tuning",
        "Cross-validation",
        "Performance metrics",
      ],
    },
    {
      id: "model-validation",
      title: "Model Validation",
      description:
        "Validate model performance and ensure reliability before deployment.",
      icon: <Shield className="w-4 h-4 text-white" />,
      color: "bg-black",
      details: [
        "A/B testing",
        "Performance monitoring",
        "Bias detection",
        "Quality assurance",
      ],
    },
    {
      id: "deployment",
      title: "Deployment",
      description:
        "Deploy models to production and monitor their performance in real-time.",
      icon: <BarChart3 className="w-4 h-4 text-white" />,
      color: "bg-black",
      details: [
        "Production deployment",
        "Monitoring dashboards",
        "Auto-scaling",
        "Performance tracking",
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const stages = document.querySelectorAll("[data-stage-id]");
      const newVisibleStages = new Set();

      stages.forEach((stage) => {
        const rect = stage.getBoundingClientRect();
        const isVisible =
          rect.top < window.innerHeight * 0.8 &&
          rect.bottom > window.innerHeight * 0.2;

        if (isVisible) {
          newVisibleStages.add(stage.getAttribute("data-stage-id"));
        }
      });

      setVisibleStages(newVisibleStages);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#d6d6c9] p-8">
      <div className="max-w- mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative w-full">
            {/* Top Border */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              // viewport={{ once: true }}
              style={{ originX: 0.5 }}
              className="absolute top-0 left-0 h-[2px] w-full bg-black"
            />

            {/* Bottom Border */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              // viewport={{ once: true }}
              style={{ originX: 0.5 }}
              className="absolute bottom-0 left-0 h-[2px] w-full bg-black"
            />

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center font-Grotesk text-black text-5xl lg:text-[8vw] uppercase font-extrabold tracking-tight py-4"
            >
              ARCHITECTURE
            </motion.h1>
          </div>
          <p className="text-xl bg-white p-4 border-2 border-black mt-10 text-black max-w-2xl mx-auto">
            Follow the data journey through our machine learning pipeline stages
          </p>
        </div>

        {/* Vertical Pipeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-black h-full opacity-30"></div>

          {pipelineStages.map((stage, index) => {
            const isVisible = visibleStages.has(stage.id);
            const isLeft = index % 2 === 0;

            return (
              <div
                key={stage.id}
                data-stage-id={stage.id}
                className={`relative mb-24 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-100 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Stage Content */}
                <div
                  className={`flex items-center ${
                    isLeft ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div className={`w-5/12 ${isLeft ? "pr-8" : "pl-8"}`}>
                    <div
                      className={`bg-[#fff] border-2 border-black rounded-2xl p-6 cursor-pointer transition-all duration-300  ${
                        activeComponent === stage.id ? "" : ""
                      }`}
                      onMouseEnter={() => setActiveComponent(stage.id)}
                      onMouseLeave={() => setActiveComponent(null)}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${stage.color} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          {stage.icon}
                        </div>
                        <h3 className="text-xl font-bold text-black">
                          {stage.title}
                        </h3>
                      </div>

                      <p className="text-black mb-4 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {stage.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-black text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Central Node */}
                  <div className="w-2/12 flex justify-center relative z-10">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isVisible
                          ? "bg-black shadow-2xl shadow-cyan-500/50 scale-100"
                          : "bg-zinc-700 scale-75"
                      }`}
                    >
                      <span className="text-white font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Spacer */}
                </div>

                {/* Connecting Arrow */}
                {index < pipelineStages.length - 1 && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-8">
                    <div
                      className={`w-0.5 h-12  transition-all duration-1000 ${
                        isVisible
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-0"
                      }`}
                      style={{
                        transformOrigin: "top",
                        transitionDelay: `${(index + 1) * 200}ms`,
                      }}
                    ></div>
                    <div
                      className={`w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent  mx-auto transition-all duration-1000 ${
                        isVisible ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ transitionDelay: `${(index + 1) * 300}ms` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex justify-center items-center z-20">
            <button
              onClick={() => navigate("/architecture")}
              className="px-4 py-3 hover:scale-105 z-40 active:scale-95 bg-white rounded-2xl text-black border-2 border-r-black font-bold transition-transform ease hover-target"
            >
              Architecture
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerticalPipeline;
