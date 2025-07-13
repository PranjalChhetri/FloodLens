import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import jsPDF from "jspdf";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import './index.css';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const getMockElevation = () => Math.floor(Math.random() * 150);
const getMockRainfall = () => Array(7).fill(0).map(() => Math.floor(Math.random() * 60));

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [location, setLocation] = useState(null);
  const [elevation, setElevation] = useState(null);
  const [rainfall, setRainfall] = useState(null);
  const [rainfallArray, setRainfallArray] = useState([]);
  const [locationName, setLocationName] = useState("Unknown");
  const [risk, setRisk] = useState("🟡 Unknown");
  const [reason, setReason] = useState("");
  const [forecast, setForecast] = useState("Loading...");
  const [alerts, setAlerts] = useState([
    "⚠ River Ganga may rise near Patna - 16 July",
    "⚠ Unusual rainfall spotted near Assam - 12 July"
  ]);
  const [modelStatus, setModelStatus] = useState("Model loading...");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLocation = (lat, lng) => {
    const elev = getMockElevation();
    const rainArr = getMockRainfall();
    const rain = rainArr[0];

    let riskLevel = "✅ Low Risk";
    let reasonText = "Safe elevation and manageable rainfall.";
    let alertList = [];

    if (elev < 50 && rain > 50) {
      riskLevel = "🚨 High Risk";
      reasonText = "Low elevation + heavy rainfall.";
      alertList.push("⚠ Flood risk in your area.");
    }

    setLocation({ lat, lng });
    setElevation(elev);
    setRainfall(rain);
    setRainfallArray(rainArr);
    setLocationName("User Selected Location");
    setRisk(riskLevel);
    setReason(reasonText);
    setForecast(rain > 50 ? "Likely rain next 3 days" : "Low Risk (3 days)");
    setAlerts(alertList);
    setModelStatus("FloodLens AI running with GPT CoT.");
  };

  const trackUser = () => {
    navigator.geolocation?.getCurrentPosition((pos) =>
      handleLocation(pos.coords.latitude, pos.coords.longitude)
    );
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text("FloodLens Report", 10, 10);
    doc.text(`Location: ${locationName}`, 10, 20);
    doc.text(`Lat, Lng: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}`, 10, 30);
    doc.text(`Elevation: ${elevation} m`, 10, 40);
    doc.text(`Rainfall: ${rainfall} mm`, 10, 50);
    doc.text(`Risk: ${risk}`, 10, 60);
    doc.text(`Reason: ${reason}`, 10, 70);
    doc.save("flood_report.pdf");
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        handleLocation(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 px-6 py-10">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-8">

          {/* Header */}
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/floodlens-logo.png" alt="FloodLens Logo" className="h-12" />
              <h1 className="text-3xl font-extrabold text-blue-800 dark:text-blue-300">FloodLens Dashboard</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 dark:bg-gray-700 text-sm px-4 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </header>

          {/* Dashboard */}
          <Dashboard
            riskLevel={risk}
            forecast={forecast}
            alerts={alerts ?? []}
            modelStatus={modelStatus}
          />

          {/* Location Button */}
          <button
            onClick={trackUser}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow"
          >
            📍 Use My Current Location
          </button>

          {/* Map */}
          <div className="h-[60vh] min-h-[400px] w-full rounded-lg overflow-hidden shadow border dark:border-gray-700">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={6}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
              {location && (
                <Marker position={[location.lat, location.lng]} icon={customIcon}>
                  <Popup>
                    <div className="text-sm space-y-1">
                      <p>📌 {locationName}</p>
                      <p>🌍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                      <p>🏔 Elevation: {elevation} m</p>
                      <p>🌧 Rainfall: {rainfall} mm</p>
                      <p>📆 7-Day: [{rainfallArray.join(", ")}] mm</p>
                      <p>🚨 Risk: {risk}</p>
                      <p>💡 {reason}</p>
                      <button
                        onClick={downloadReport}
                        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        📄 Download PDF
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Chart */}
          {rainfallArray.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">📊 7‑Day Rainfall Chart</h3>
              <Line
                data={{
                  labels: ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
                  datasets: [
                    {
                      label: "Rain (mm)",
                      data: rainfallArray,
                      borderColor: "blue",
                      backgroundColor: "rgba(30, 144, 255, 0.3)",
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </div>
          )}

          {/* Emergency Contacts */}
          <div className="p-6 bg-gradient-to-tr from-red-100 to-pink-200 dark:from-red-900 dark:to-pink-900 border border-red-300 dark:border-red-700 rounded-xl shadow-md">
            <h3 className="font-bold text-red-800 dark:text-red-300 text-lg">🚨 Emergency Contacts</h3>
            <ul className="mt-3 text-red-700 dark:text-red-100 space-y-2 text-sm">
              <li>📞 NDRF: <a href="tel:9711077372" className="underline">9711077372</a></li>
              <li>📞 Uttarakhand Helpline: <a href="tel:1070" className="underline">1070</a></li>
              <li>📞 State Emergency: <a href="tel:112" className="underline">112</a></li>
              <li>📞 Ambulance: <a href="tel:102" className="underline">102</a></li>
            </ul>
          </div>

          {/* Footer */}
          <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            © 2025 FloodLens. Built for disaster resilience with ❤
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
