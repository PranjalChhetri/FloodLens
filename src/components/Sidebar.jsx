import React from "react";

const Sidebar = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen, risk, forecast, alerts, modelStatus }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-full w-64 bg-blue-600 text-white shadow-lg transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 sm:static sm:h-screen`}
    >
      <div className="flex flex-col h-full p-5 space-y-6">
        {/* Dashboard Summary Card */}
        <div className="bg-white text-gray-900 rounded-xl shadow p-4 mb-4">
          <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">FloodLens Dashboard</h2>
          <div className="mb-3">
            <div className="bg-blue-200 p-2 rounded mb-2">
              <span className="font-semibold">Current Risk Level: </span>
              <span className="text-blue-800 font-bold">{risk}</span>
            </div>
            <div className="bg-cyan-100 p-2 rounded mb-2">
              <span className="font-semibold">Forecast: </span>
              <span className="text-cyan-800 font-bold">{forecast}</span>
            </div>
            <div className="bg-yellow-100 p-2 rounded mb-2">
              <span className="font-semibold">Recent Alerts:</span>
              <ul className="list-disc list-inside text-yellow-900 text-sm ml-4 mt-1">
                {alerts && alerts.map((alert, i) => (
                  <li key={i}>{alert}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-100 p-2 rounded">
              <span className="font-semibold">Model Status: </span>
              <span className="text-blue-900 text-sm">{modelStatus}</span>
            </div>
          </div>
        </div>
        {/* Logo & Close */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/floodlens-logo.png" alt="Logo" className="h-8" />
            <h1 className="text-lg font-bold">FloodLens</h1>
          </div>
          <button
            className="sm:hidden p-1 hover:text-red-300"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-5 text-sm">
          <a href="#" className="flex items-center gap-2 hover:text-blue-200">
            🏠 Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-200">
            🗺 Map View
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-200">
            📊 Reports
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-blue-200">
            ⚙️ Settings
          </a>
        </nav>
        {/* Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-auto flex items-center gap-2 text-sm bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          {darkMode ? "☀" : "🌙"}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;