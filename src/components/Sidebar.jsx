import React from "react";
import {
  Home,
  MapPin,
  Activity,
  Settings,
  Sun,
  Moon,
  X,
} from "lucide-react";

const Sidebar = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => {
  const handleOptionClick = (label) => {
    console.log(`Clicked: ${label}`);

    // Example actions:
    if (label === "Dashboard") {
      document.getElementById("dashboard-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (label === "Map View") {
      document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (label === "Reports") {
      document.getElementById("reports-section")?.scrollIntoView({ behavior: "smooth" });
    } else if (label === "Settings") {
      document.getElementById("settings-section")?.scrollIntoView({ behavior: "smooth" });
    }

    // Close sidebar only on mobile
    if (window.innerWidth < 640 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 sm:static sm:h-screen sm:flex`}
    >
      <div className="flex flex-col h-full p-5 space-y-6 text-gray-900 dark:text-white">
        {/* Logo & Close */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/floodlens-logo.png" alt="Logo" className="h-9" />
            <h1 className="text-xl font-extrabold text-blue-700 dark:text-blue-300">
              FloodLens
            </h1>
          </div>
          <button
            className="sm:hidden p-1 hover:text-red-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-5 text-sm font-medium">
          <button
            onClick={() => handleOptionClick("Dashboard")}
            className="flex items-center gap-3 hover:text-blue-600 text-left"
          >
            <Home size={18} /> Dashboard
          </button>
          <button
            onClick={() => handleOptionClick("Map View")}
            className="flex items-center gap-3 hover:text-blue-600 text-left"
          >
            <MapPin size={18} /> Map View
          </button>
          <button
            onClick={() => handleOptionClick("Reports")}
            className="flex items-center gap-3 hover:text-blue-600 text-left"
          >
            <Activity size={18} /> Reports
          </button>
          <button
            onClick={() => handleOptionClick("Settings")}
            className="flex items-center gap-3 hover:text-blue-600 text-left"
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        {/* Toggle Button */}
        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-xl hover:from-gray-600 hover:to-gray-800 transition"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
