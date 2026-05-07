import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import logo from "../Assets/imgs/my.png";

const Footer = () => {
  const logoRef = useRef(null);
  const isInView = useInView(logoRef, { once: true, margin: "-100px" });

  return (
    <footer className="relative w-full h-[60vh] bg-trueno-gradient text-white border-t border-black px-6 py-12 font-Poppins overflow-hidden">
      {/* Cinematic Logo + Heading */}
      <div className="relative flex items-center justify-center z-0">
        <motion.h1
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-40 sm:top-20 sm:right-40 font-Space opacity-10 text-[20vw] uppercase tracking-wider text-white"
        >
          WiChain
        </motion.h1>

        <motion.img
          ref={logoRef}
          src={logo}
          alt="WiChain Logo"
          initial={{ rotate: 0, scale: 0.9, opacity: 0 }}
          animate={isInView ? { rotate: -25, scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: false }}
          className="absolute top-[-80px] right-[-100px] sm:top-[-190px] sm:right-[-240px] w-[900px] h-[900px] object-contain  pointer-events-none"
        />
      </div>
      {/* Footer Content: Left-Aligned */}
      <div className="relative z-10 ml-4 text-sm text-neutral-400 flex flex-col items-start gap-2">
        <p className="uppercase tracking-wide">Crafted in Mumbai</p>
        <p>© {new Date().getFullYear()} WiChain. All rights reserved.</p>
        <a
          href="mailto:contact@wichain.io"
          className="hover:text-white transition"
        >
          contact@wichain.io
        </a>

        <div className="w-[40vw] h-px bg-neutral-800 my-6" />
      </div>
    </footer>
  );
};

export default Footer;
