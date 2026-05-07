import React, { useEffect, useState } from "react";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHover = () => setHovering(true);
    const handleUnhover = () => setHovering(false);

    const attachListeners = () => {
      document.querySelectorAll("button, a, .hover-target").forEach((el) => {
        el.addEventListener("mouseenter", handleHover);
        el.addEventListener("mouseleave", handleUnhover);
      });
    };

    const detachListeners = () => {
      document.querySelectorAll("button, a, .hover-target").forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleUnhover);
      });
    };

    window.addEventListener("mousemove", move);
    attachListeners();

    // Observe DOM changes
    const observer = new MutationObserver(() => {
      detachListeners();
      attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      detachListeners();
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        transformOrigin: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: hovering ? "auto" : "50px",
        height: hovering ? "auto" : "50px",
        padding: hovering ? "8px 12px" : "0",
        borderRadius: hovering ? "0" : "50%",
        backgroundColor: hovering ? "transparent" : "#fff",
        mixBlendMode: "difference",
        fontSize: hovering ? "16px" : "0px",
        fontWeight: "bold",
        color: "#fff",
        whiteSpace: "nowrap",
        transition:
          "all 0.2s ease, font-size 0.2s ease, padding 0.2s ease, background-color 0.2s ease",
      }}
    >
      {hovering && (
        <span
          style={{
            mixBlendMode: "normal",
          }}
          className="text-2xl z-50"
        >
          Click?
        </span>
      )}
    </div>
  );
};

export default Cursor;