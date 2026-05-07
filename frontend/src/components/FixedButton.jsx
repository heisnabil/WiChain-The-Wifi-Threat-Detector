import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiLock } from "react-icons/fi";

// Scramble Hook
const useScramble = (targetText, cyclesPerLetter = 2, shuffleTime = 50) => {
  const [text, setText] = useState(targetText);
  const intervalRef = useRef(null);
  const CHARS = "!@#$%^&*():{};|,.<>/?";

  const scramble = () => {
    let pos = 0;
    intervalRef.current = setInterval(() => {
      const scrambled = targetText
        .split("")
        .map((char, index) => {
          if (pos / cyclesPerLetter > index) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      setText(scrambled);
      pos++;
      if (pos >= targetText.length * cyclesPerLetter) stopScramble();
    }, shuffleTime);
  };

  const stopScramble = () => {
    clearInterval(intervalRef.current || undefined);
    setText(targetText);
  };

  return { text, scramble, stopScramble };
};

const FixedButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { text, scramble, stopScramble } = useScramble("SCAN");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isHomePage =
      location.pathname === "/" || location.pathname === "/home";

    if (isHomePage) {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        setVisible(scrollY > 100); // Show button after scrolling 100px
      };

      window.addEventListener("scroll", handleScroll);

      // Initial check in case already scrolled
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // Show with delay on other pages for entering animation
      setVisible(false);
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="fixed-button"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center hover-target"
        >
          <motion.button
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            onMouseEnter={scramble}
            onMouseLeave={stopScramble}
            onClick={() => navigate("/predict")}
            className="group fixed hover-target bottom-4 right- hover-target z-50 overflow-hidden rounded-[2rem] border-2 border-black bg-white px-6 py-2 font-mono font-semibold uppercase text-black transition-colors hover:text-indigo-300"
          >
            <div className="relative z-10 flex items-center hover-target gap-2">
              <FiLock />
              <span>{text}</span>
            </div>
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: "-100%" }}
              exit={{ y: "100%" }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1,
                ease: "linear",
              }}
              className="absolute hover-target inset-0 z-0 scale-125 bg-gradient-to-t from-indigo-400/0 from-40% via-indigo-400/100 to-indigo-400/0 to-60% opacity-0 transition-opacity group-hover:opacity-100"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FixedButton;
