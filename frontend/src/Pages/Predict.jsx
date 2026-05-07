import React, { useState, useEffect } from "react";
import {
  Brain,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader,
  Wifi,
  Database,
  Eye,
} from "lucide-react";

// Flask backend prediction function
const fetchPrediction = async (formData) => {
  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        SSID: formData.ssid,
        RSSI: parseFloat(formData.rssi),
        Channel_Frequency: parseInt(formData.channelFrequency),
        Duplicate_Count: parseInt(formData.duplicateCount),
        Hour: parseInt(formData.hour),
        Encryption: formData.encryption,
        Internet_Access: formData.internetAccess,
        Vendors: formData.vendors,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Add additional metadata for UI display
    return {
      ...result,
      networkId: `NET_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      networkInfo: {
        ssid: formData.ssid,
        rssi: formData.rssi,
        encryption: formData.encryption,
        channelFrequency: formData.channelFrequency,
        duplicateCount: formData.duplicateCount,
        vendors: formData.vendors,
        internetAccess: formData.internetAccess,
        hour: formData.hour,
      },
    };
  } catch (error) {
    console.error("Prediction request failed:", error);
    throw error;
  }
};

const PredictionCard = ({ result, onReset, error }) => {
  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 shadow-xl shadow-red-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400">
                Prediction Error
              </h3>
              <p className="text-gray-400 text-sm">
                Failed to get prediction from backend
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>

        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <h4 className="font-medium mb-2 text-red-400">Error Details</h4>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Handle different possible response formats from Flask backend
  const isSpoof =
    result.prediction === 1 || result.prediction === true || result.isSpoof;
  const confidence = result.confidence || result.probability || 85;
  const riskFactors = result.risk_factors || result.riskFactors || [];
  const { timestamp, networkId } = result;

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-all duration-500 ${
        isSpoof
          ? "border-red-500/50 shadow-red-500/20"
          : "border-green-500/50 shadow-green-500/20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isSpoof ? (
            <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          )}
          <div>
            <h3
              className={`text-xl font-bold ${
                isSpoof ? "text-red-400" : "text-green-400"
              }`}
            >
              {isSpoof ? "Spoof Detected" : "Network Safe"}
            </h3>
            <p className="text-gray-400 text-sm">Network ID: {networkId}</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-200"
        >
          New Prediction
        </button>
      </div>

      {/* Confidence Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-medium">Confidence Score</span>
          <span
            className={`font-bold ${
              isSpoof ? "text-red-400" : "text-green-400"
            }`}
          >
            {confidence}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              isSpoof
                ? "bg-gradient-to-r from-red-500 to-red-400"
                : "bg-gradient-to-r from-green-500 to-green-400"
            }`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>

      {/* Risk Factors */}
      {isSpoof && riskFactors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-red-400 font-medium mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Risk Factors Detected
          </h4>
          <div className="space-y-2">
            {riskFactors.map((factor, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 text-gray-300"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div
        className={`p-4 rounded-lg ${
          isSpoof
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-green-500/10 border border-green-500/20"
        }`}
      >
        <h4
          className={`font-medium mb-2 ${
            isSpoof ? "text-red-400" : "text-green-400"
          }`}
        >
          Recommendation
        </h4>
        <p className="text-gray-300 text-sm">
          {isSpoof
            ? "This network shows signs of potential spoofing. Avoid connecting and report to network administrator."
            : "This network appears legitimate and safe to connect to."}
        </p>
      </div>

      {/* Timestamp */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">
          Analyzed at: {new Date(timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const Predict = () => {
  const [formData, setFormData] = useState({
    ssid: "",
    rssi: "",
    encryption: "WPA2",
    channelFrequency: "",
    duplicateCount: "",
    hour: "",
    vendors: "",
    internetAccess: "Yes",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const encryptionOptions = ["WPA3", "WPA2", "WPA", "WEP", "None"];
  const internetAccessOptions = ["Yes", "No", "Unknown"];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ssid.trim()) newErrors.ssid = "SSID is required";
    if (!formData.rssi || isNaN(formData.rssi))
      newErrors.rssi = "Valid RSSI value is required";
    if (!formData.channelFrequency || isNaN(formData.channelFrequency))
      newErrors.channelFrequency = "Valid channel frequency is required";
    if (!formData.duplicateCount || isNaN(formData.duplicateCount))
      newErrors.duplicateCount = "Valid duplicate count is required";
    if (
      !formData.hour ||
      isNaN(formData.hour) ||
      formData.hour < 0 ||
      formData.hour > 23
    )
      newErrors.hour = "Valid hour (0-23) is required";
    if (!formData.vendors.trim())
      newErrors.vendors = "Vendor information is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const result = await fetchPrediction(formData);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      setApiError(
        error.message ||
          "Failed to connect to prediction service. Please check if the Flask backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetPrediction = () => {
    setPrediction(null);
    setApiError(null);
    setFormData({
      ssid: "",
      rssi: "",
      encryption: "WPA2",
      channelFrequency: "",
      duplicateCount: "",
      hour: "",
      vendors: "",
      internetAccess: "Yes",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-trueno-gradient text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center mt-10  ">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 ">
            WiFi Spoof Detection
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Analyze network characteristics using our advanced ML model
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {prediction ? (
            <PredictionCard
              result={prediction}
              onReset={resetPrediction}
              error={apiError}
            />
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm border mb-40 border-gray-700/50 rounded-xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 ">
                <Database className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">
                  Network Analysis Form
                </h2>
              </div>

              <div className="space-y-6">
                {/* SSID and RSSI Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SSID (Network Name) *
                    </label>
                    <input
                      type="text"
                      name="ssid"
                      value={formData.ssid}
                      onChange={handleInputChange}
                      placeholder="Enter network SSID"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.ssid
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:ring-purple-500"
                      }`}
                    />
                    {errors.ssid && (
                      <p className="text-red-400 text-sm mt-1">{errors.ssid}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      RSSI (Signal Strength) *
                    </label>
                    <input
                      type="number"
                      name="rssi"
                      value={formData.rssi}
                      onChange={handleInputChange}
                      placeholder="-70"
                      min="-100"
                      max="0"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.rssi
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:ring-purple-500"
                      }`}
                    />
                    {errors.rssi && (
                      <p className="text-red-400 text-sm mt-1">{errors.rssi}</p>
                    )}
                  </div>
                </div>

                {/* Channel Frequency and Duplicate Count Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Channel Frequency (MHz) *
                    </label>
                    <input
                      type="number"
                      name="channelFrequency"
                      value={formData.channelFrequency}
                      onChange={handleInputChange}
                      placeholder="2412"
                      min="2400"
                      max="5900"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.channelFrequency
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:ring-purple-500"
                      }`}
                    />
                    {errors.channelFrequency && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.channelFrequency}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duplicate Count *
                    </label>
                    <input
                      type="number"
                      name="duplicateCount"
                      value={formData.duplicateCount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.duplicateCount
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:ring-purple-500"
                      }`}
                    />
                    {errors.duplicateCount && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.duplicateCount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Encryption and Duplicate Count Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Encryption Type *
                    </label>
                    <select
                      name="encryption"
                      value={formData.encryption}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      {encryptionOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-gray-700"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duplicate Count *
                    </label>
                    <input
                      type="number"
                      name="duplicateCount"
                      value={formData.duplicateCount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.duplicateCount
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:ring-purple-500"
                      }`}
                    />
                    {errors.duplicateCount && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.duplicateCount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hour and Internet Access Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hour (0-23) *
                    </label>
                    <input
                      type="number"
                      name="hour"
                      value={formData.hour}
                      onChange={handleInputChange}
                      placeholder="14"
                      min="0"
                      max="23"
                      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.hour
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-600 focus:ring-purple-500"
                      }`}
                    />
                    {errors.hour && (
                      <p className="text-red-400 text-sm mt-1">{errors.hour}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Internet Access *
                    </label>
                    <select
                      name="internetAccess"
                      value={formData.internetAccess}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      {internetAccessOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-gray-700"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vendors Row */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vendor Information *
                  </label>
                  <input
                    type="text"
                    name="vendors"
                    value={formData.vendors}
                    onChange={handleInputChange}
                    placeholder="e.g., Cisco, Netgear, TP-Link"
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.vendors
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-purple-500"
                    }`}
                  />
                  {errors.vendors && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.vendors}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="group hover-target  bg-zinc-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 h disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <span className="flex items-center space-x-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Analyzing Network...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 group-hover:animate-pulse" />
                        <span>Predict Network Safety</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Display API Error if any */}
                {apiError && !isLoading && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium">
                        Connection Error
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{apiError}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
