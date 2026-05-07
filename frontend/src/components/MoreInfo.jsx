import React, { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
import threat from "../Assets/imgs/threat detected.png";
import blkchn from "../Assets/imgs/blkchn.png";
import training from "../Assets/imgs/training1.png";
import RevealParagraph from "./RevealParagraph";
import { useNavigate } from "react-router-dom";
import ArchitectureCompo from "../components/ArchitectureCompo";
import inte from "../Assets/imgs/inte.png";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Real-Time Threat Detection",
    description:
      "WiChain uses advanced machine learning to detect WiFi spoofing attempts in milliseconds. Stay protected with instant alerts and proactive defense.",
    image: threat,
  },
  {
    title: "Blockchain-Backed Integrity",
    description:
      "Every security event is logged on an immutable blockchain ledger, ensuring transparency, traceability, and tamper-proof records.",
    image: blkchn,
  },
  {
    title: "Custom AI Training",
    description:
      "WiChain is trained on real-world WiFi traffic and attack vectors, making it highly adaptive to evolving threats and spoofing techniques.",
    image: training,
  },
  {
    title: "Seamless Integration",
    description:
      "Easily integrate WiChain into existing network infrastructure. Lightweight, scalable, and built for modern security ecosystems.",
    image: inte,
  },
];

const para = `WiChain’s dataset captures real-world WiFi threats—spoofing, rogue access points, and encrypted anomalies—missed by traditional sources. Blockchain-verified for integrity, it fuels adaptive AI that detects attacks in milliseconds. A living archive of wireless warfare, built for resilience.`;

const MoreInfo = () => {
  const refs = useRef([]);
  const datasetRef = useRef(null);

  useGSAP(() => {
    refs.current.forEach((el) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    });

    if (datasetRef.current) {
      gsap.fromTo(
        datasetRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: datasetRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div className="w-full h-auto bg-[#d6d6c9] px-4 sm:px-6 lg:px-8 py-16">
      {/* Overlapping Heading */}
      <div className="relative h-[120px] lg:h-[180px] mb-24">
        <div className="relative w-full mb-24">
          {/* Top Border */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            // viewport={{ once: true }}
            style={{ originX: 0.5 }}
            className="absolute top-0 left-0 h-[2px] w-full bg-black"
          />

          {/* Bottom Border */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            // viewport={{ once: true }}
            style={{ originX: 0.5 }}
            className="absolute bottom-0  left-0 h-[2px] w-full bg-black"
          />

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center font-Grotesk text-black text-5xl lg:text-[8vw] uppercase font-extrabold tracking-tight py-4"
          >
            features
          </motion.h1>
        </div>
      </div>

      {/* Feature List */}
      <div className="flex flex-col mt-56 gap-24">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => (refs.current[index] = el)}
            className="w-full max-w-4xl mx-auto"
          >
            <div
              className={`flex items-start gap-6 ${
                index % 1 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Image */}
              {feature.image && (
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Text Content */}
              <div className="flex-1">
                <h2 className="text-black text-3xl font-semibold mb-4">
                  {feature.title}
                </h2>
                <p className="text-black font-medium text-lg lg:text-xl leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Section */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div
          ref={datasetRef}
          className="mt-32 w-full min-h-screen rounded-[2rem] p-10"
        >
          <div className="relative w-full mb-24">
            {/* Top Border */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              // viewport={{ once: true }}
              style={{ originX: 0.5 }}
              className="absolute top-0 left-0 h-[2px] w-full bg-black"
            />

            {/* Bottom Border */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              // viewport={{ once: true }}
              style={{ originX: 0.5 }}
              className="absolute bottom-0 left-0 h-[2px] w-full bg-black"
            />

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center font-Grotesk text-black text-5xl lg:text-[8vw] uppercase font-extrabold tracking-tight py-4"
            >
              DATASET
            </motion.h1>
          </div>

          <div className="text-black mb-24">
            <img src="" alt="" />
            <RevealParagraph
              text={para}
              className="mt-2 text-xl sm:text-4xl text-center mx-auto max-w-5xl leading-relaxed font-semibold flex flex-wrap justify-center"
            />
          </div>
          <div className="text-black flex justify-center items-center flex-col">
            <h2 className="text-4xl bg-white p-4 rounded- border-zinc-600 border-2 font-bold  text-center mb-6 font-Poppins">
              Why Custom Dataset?
            </h2>
            <o className="space-y-6 text-2xl mt-8 mb-10 font-medium font-Poppins">
              <li>
                <strong>WiFi-Specific Focus:</strong>
                <br></br> Existing datasets lack comprehensive WiFi spoofing
                attack patterns and modern encryption bypass techniques.
              </li>
              <li>
                <strong>Balanced Representation:</strong>
                <br></br> Equal distribution of legitimate access points and
                sophisticated spoofing attempts.
              </li>
              <li>
                <strong>Real-World Scenarios:</strong>
                <br></br> Captured from actual enterprise and public WiFi
                environments with diverse attack vectors.
              </li>
              <li>
                <strong>Quality Assurance:</strong>
                <br></br> Blockchain-verified data integrity with minimal noise
                and high accuracy labels.
              </li>
            </o>

            <h1 className="mt-10 mb-2">for more info explore our dataset:</h1>
            <button
              onClick={() => navigate("/dataset")}
              className="bg-white border-2 border-zinc-700 px-5 py-2 rounded-4xl mt-2 hover:scale-105 active:scale-95 font-bold transition-transform ease hover-target "
            >
              Dataset
            </button>
          </div>
        </div>
      </div>
      <ArchitectureCompo />
    </div>
  );
};

export default MoreInfo;
