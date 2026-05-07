import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import RevealParagraph from '../components/RevealParagraph';
import grndRes1 from '../Assets/GrndRes/grndRes1.jpg';
import grndRes2 from '../Assets/GrndRes/grndRes2.jpg';
import grndRes3 from '../Assets/GrndRes/grndRes3.jpg';
import grndRes4 from '../Assets/GrndRes/grndRes4.jpg';

const GroundResearchSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const images = [grndRes1, grndRes2, grndRes3, grndRes4];

  const para =
    'As part of our dataset-building process for WiFi spoof detection, we embarked on a multi-location field study across Mumbai’s railway network. Starting at Dadar Station, we scanned and logged available WiFi networks, noting SSID patterns, signal strengths, and anomalies. We extended our research to Thane, Kurla, Vashi, and Panvel, capturing diverse network environments—from high-density urban hubs to quieter suburban terminals. This hands-on approach allowed us to gather real-time data on public WiFi behavior, rogue access points, and potential spoofing vectors. The variability across stations enriched our dataset, making it more robust and representative of real-world conditions.';

  const stationData = [
    {
      name: 'Dadar Station',
      entries: 42,
      insight: 'High network density with frequent SSID overlaps due to nearby commercial hotspots.',
    },
    {
      name: 'Thane Station',
      entries: 35,
      insight: 'Strong signal consistency, but multiple open networks with weak encryption.',
    },
    {
      name: 'Kurla Station',
      entries: 28,
      insight: 'Detected rogue access points mimicking railway WiFi SSIDs.',
    },
    {
      name: 'Vashi Station',
      entries: 31,
      insight: 'Suburban traffic showed fewer spoof attempts but inconsistent signal strength.',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#d6d6c9] text-white relative font-Poppins overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
         

          <h1 className="text-9xl mt-30 text-black relative sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-widest uppercase font-Space">
            GROUND RESEARCH
          </h1>
        </div>

        {/* Paragraph */}
        <div>
          <RevealParagraph
            className="text-xl text-center bg-white p-8 border-2 border-black text-black"
            text={para}
          />
        </div>

        {/* Alternating Image Blocks with Overlap */}
        <div className="flex flex-col gap-24 mt-24">
          {images.map((img, idx) => {
            const station = stationData[idx];
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center ${
                  !isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Large Number Label */}
                <motion.div
                  initial={{ x: isEven ? -200 : 200, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`absolute top-1/2 transform font-Space -translate-y-1/2 text-[10rem] font-extrabold z-0 pointer-events-none ${
                    isEven ? '-left-58 ml-[-2rem]' : '-right-58 mr-[-2rem]'
                  }`}
                >
                  {`0${idx + 1}`}
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`w-full md:w-1/2 z-10 ${isEven ? 'md:-mr-10' : 'md:-ml-10'}`}
                >
                  <img
                    src={img}
                    alt={`Ground Research ${idx + 1}`}
                    className={`w-full rounded-xl shadow-xl border-4 border-black ${
                      idx === 0 ? 'h-[32rem] object-contain' : 'h-96 object-cover'
                    }`}
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className={`w-full md:w-1/2 bg-white text-black p-6 rounded-xl shadow-lg z-20 ${
                    isEven ? 'md:-ml-10' : 'md:-mr-10'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{station.name}</h3>
                  <p className="text-md leading-relaxed mb-2">
                    <strong>Entries Collected:</strong> {station.entries}
                  </p>
                  <p className="text-md leading-relaxed">
                    <strong>Insight:</strong> {station.insight}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Final Note */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-32 text-center bg-white text-black p-8 rounded-xl shadow-xl border-2 border-black"
        >
          <h2 className="text-3xl font-bold mb-4 font-Space tracking-wide">
            ...and we’ve covered even more.
          </h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Beyond Dadar, Thane, Kurla, and Vashi, our team extended ground research to stations like Panvel, Chembur, Ghatkopar, and CST — each offering unique WiFi landscapes and spoofing challenges. From crowded junctions to quieter terminals, we’ve built a rich, location-diverse dataset that reflects the true complexity of Mumbai’s public network ecosystem.
          </p>
        </motion.div>
      </div>

      {/* Grid background pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default GroundResearchSection;