import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
// import Predict from "./Pages/Predict";
import DatasetPage from "./Pages/DatasetSection";
import ResearchPage from "./Pages/ResearchPage";
import ArchitecturePage from "./Pages/ArchitecturePage";
import WifiLoader from "./Assets/vidgifs/wifigif.gif";
import { ReactLenis } from "lenis/react";
import Cursor from "./components/Cursor";
import Footer from "./components/Footer";
// import FloatingButton from "./components/FixedButton";
import ScrollToTop from "./components/ScrolToTop";
// import BlockchainRecords from "./Pages/BlockChain";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-trueno-gradient flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <img
            src={WifiLoader}
            alt="WiFi loading animation"
            className="w-24 h-24"
          />
          <p className="text-lg font-BOLD text-white">
            {Math.floor(progress)}%
          </p>
          <p className="text-gray-400 text-md">Is your network safe?</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Cursor />
        <ScrollToTop />
        <ReactLenis root>
          <Navbar />
          {/* <FloatingButton /> */}

          <main className="pt-0">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/predict" element={<Predict />} /> */}
              <Route path="/dataset" element={<DatasetPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              {/* <Route path="/blockchain" element={<BlockchainRecords />} /> */}
              {/* <Route path="/team" element={<TeamPage />} /> */}
            </Routes>
            <Footer />
          </main>
        </ReactLenis>
      </div>
    </Router>
  );
}

export default App;
