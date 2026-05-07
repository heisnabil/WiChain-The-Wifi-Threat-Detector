import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../Assets/imgs/my.png";

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRenderOverlay, setShouldRenderOverlay] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [previousLocation, setPreviousLocation] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (previousLocation && previousLocation !== location.pathname) {
      setShouldRenderOverlay(true);
      setShowContent(false);

      setTimeout(() => {
        setIsVisible(true);
      }, 50);

      const exitTimer = setTimeout(() => {
        setIsVisible(false);
      }, 800);

      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 1300); // Show content after overlay exits

      const removeTimer = setTimeout(() => {
        setShouldRenderOverlay(false);
      }, 1300);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(contentTimer);
        clearTimeout(removeTimer);
      };
    } else {
      setShowContent(true); // Initial load
    }

    setPreviousLocation(location.pathname);
  }, [location.pathname, previousLocation]);

  return (
    <>
      {/* Transition Overlay */}
      {shouldRenderOverlay && (
        <div
          className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-transform duration-500 ease-in-out ${
            isVisible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse"
          />
        </div>
      )}

      {/* Page Content */}
      {showContent && children}
    </>
  );
};

export default PageTransition;
