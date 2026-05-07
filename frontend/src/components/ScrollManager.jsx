// ScrollManager.jsx
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

const ScrollManager = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4, // Try 1.2–1.6 for natural feel
      easing: (t) => t, // Linear easing is often smoother for Lenis
      smooth: true,
      smoothTouch: true,
      direction: "vertical",
      gestureDirection: "vertical",
    });

    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

export default ScrollManager;
