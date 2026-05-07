import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const RevealParagraph = ({ text, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const words = text.split(" ");

  return (
    <p ref={ref} className={` ${className}`}>
      {words.map((word, index) => (
        <motion.span
          initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
          animate={
            isInView
              ? { filter: "blur(0px)", opacity: 1, y: 0 }
              : { filter: "blur(10px)", opacity: 0, y: 12 }
          }
          transition={{ duration: 0.1, delay: 0.1 * index }}
          key={index}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

export default RevealParagraph;
