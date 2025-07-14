import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  GeoJSON
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import jsPDF from "jspdf";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Menu } from "lucide-react";
import "./index.css";

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
  const [isLoading, setIsLoading] = useState(false);
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
    "⚠ Unusual rainfall spotted near Assam - 12 July",
  ]);
  const handleSidebarAction = (action) => {
    switch (action) {
      case "use-location":
        trackUser();
        break;
      case "run-ai":
        runMistralExplanation();
        break;
      case "toggle-dark":
        setDarkMode((prev) => !prev);
        break;
      case "dashboard":
        document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "map":
        document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "reports":
        document.getElementById("reports-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "settings":
        document.getElementById("settings-section")?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        console.log("Unknown sidebar action:", action);
    }
  };

  const [modelStatus, setModelStatus] = useState("Model loading...");
  const [aiExplanation, setAiExplanation] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/status");
        const data = await res.json();
        setModelStatus(data.status || "Model running");
      } catch {
        setModelStatus("Model offline");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
    setAiExplanation("");
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

  const runMistralExplanation = async () => {
    try {
      const res = await fetch("http://localhost:5000/explain-flood-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elevation, rainfall }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation);
    } catch (error) {
      setAiExplanation("Error fetching explanation.");
    }
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
        onAction={handleSidebarAction}
      />

      <main className="flex-1 relative bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 px-6 py-10">
        <button
          className="sm:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 space-y-10">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/floodlens-logo.png" alt="Logo" className="h-12" />
              <h1 className="text-3xl font-extrabold text-blue-800 dark:text-blue-300">FloodLens</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 dark:bg-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </header>

          <div id="dashboard-section">
            <Dashboard riskLevel={risk} forecast={forecast} alerts={alerts} modelStatus={modelStatus} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={trackUser}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow w-full sm:w-auto"
            >
              📍 Use My Location
            </button>
            <button
              onClick={runMistralExplanation}
              disabled={!elevation || !rainfall || isLoading}
              className={`flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow w-full sm:w-auto disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 00-12 12h4z" />
                  </svg>
                  Loading...
                </>
              ) : (
                "🤖 Run Mistral AI"
              )}
            </button>
          </div>

          {aiExplanation && (
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur-md p-6 rounded-xl shadow border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">AI Explanation:</h3>
              <p className="text-sm text-blue-900 dark:text-blue-100 whitespace-pre-wrap">{aiExplanation}</p>
            </div>
          )}

          <div id="map-section" className="h-[60vh] min-h-[400px] w-full rounded-xl overflow-hidden shadow border dark:border-gray-700 relative">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={6}
              scrollWheelZoom={true}
              className="h-full w-full z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <GeoJSON
                data={null}
                ref={(layer) => {
                  if (!layer) return;
                  fetch("/india_flood.geojson")
                    .then((res) => res.json())
                    .then((data) => {
                      layer.clearLayers();
                      layer.addData(data);
                      layer.setStyle((feature) => {
                        const risk = feature.properties.flood_risk;
                        return {
                          color: risk > 7 ? "#dc2626" : risk > 4 ? "#facc15" : "#16a34a",
                          weight: 1,
                          fillOpacity: 0.5,
                        };
                      });
                      layer.eachLayer((layer) => {
                        const props = layer.feature.properties;
                        const popupContent = `
                          <div style="font-size: 14px">
                            <strong>📍 ${props.district}</strong><br/>
                            🌊 Flood Risk: <b>${props.flood_risk}</b><br/>
                            🌧 Rainfall: ${props.rainfall} mm
                          </div>
                        `;
                        layer.bindPopup(popupContent);
                        layer.on({
                          mouseover: (e) => {
                            e.target.setStyle({ weight: 3, fillOpacity: 0.6 });
                            e.target.openPopup();
                          },
                          mouseout: (e) => {
                            e.target.setStyle({ weight: 1, fillOpacity: 0.5 });
                            e.target.closePopup();
                          },
                        });
                      });
                    });
                }}
              />
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
                        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        📄 Download PDF
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>

            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 border dark:border-gray-700 p-3 rounded shadow text-sm space-y-1 z-[1000]">
              <div><span className="inline-block w-4 h-4 bg-green-600 mr-2"></span> Low Risk</div>
              <div><span className="inline-block w-4 h-4 bg-yellow-400 mr-2"></span> Moderate Risk</div>
              <div><span className="inline-block w-4 h-4 bg-red-600 mr-2"></span> High Risk</div>
            </div>
          </div>

          {selectedDistrict && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-blue-300 dark:border-blue-700">
              <h3 className="text-lg font-bold mb-2">📍 District Info</h3>
              <p><strong>District:</strong> {selectedDistrict.district}</p>
              <p><strong>Flood Risk:</strong> {selectedDistrict.risk}</p>
              <p><strong>Rainfall:</strong> {selectedDistrict.rainfall} mm</p>
              <button
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={() => setSelectedDistrict(null)}
              >
                Close
              </button>
            </div>
          )}

          {rainfallArray.length > 0 && (
            <div id="reports-section" className="bg-white dark:bg-gray-800 p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">📊 7-Day Rainfall</h3>
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

          <div id="settings-section" className="p-6 bg-gradient-to-tr from-red-100 to-pink-200 dark:from-red-900 dark:to-pink-900 border border-red-300 dark:border-red-700 rounded-xl shadow-md">
            <h3 className="font-bold text-red-800 dark:text-red-300 text-lg">🚨 Emergency Contacts</h3>
            <ul className="mt-3 text-red-700 dark:text-red-100 space-y-2 text-sm">
              <li>📞 NDRF: <a href="tel:9711077372" className="underline">9711077372</a></li>
              <li>📞 Uttarakhand Helpline: <a href="tel:1070" className="underline">1070</a></li>
              <li>📞 State Emergency: <a href="tel:112" className="underline">112</a></li>
              <li>📞 Ambulance: <a href="tel:102" className="underline">102</a></li>
            </ul>
          </div>
          <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            © 2025 FloodLens. Built for disaster resilience with ❤
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
