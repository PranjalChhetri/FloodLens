import React, { useEffect } from "react";

const Dashboard = ({ riskLevel, forecast, alerts, modelStatus }) => {
  useEffect(() => {
    console.log("✅ Dashboard rendered!");
  }, []);
  
  return (
    <section className="space-y-6">
      {/* Row 1: Risk & Forecast */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Current Risk Level */}
        <div className="bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100 p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2">
            🛡️ Current Risk Level
          </div>
          <p className="text-base">{riskLevel}</p>
        </div>

        {/* Forecast */}
        <div className="bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100 p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-lg font-semibold mb-2">
            📅 Forecast
          </div>
          <p className="text-base">{forecast}</p>
        </div>
      </div>

      {/* Row 2: Alerts */}
      <div className="bg-yellow-100 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100 p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-2 text-lg font-semibold mb-2">
          🔔 Recent Alerts
        </div>
        {alerts.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {alerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">No active alerts.</p>
        )}
      </div>

      {/* Row 3: Model Status */}
      <div className="bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-2 text-lg font-semibold mb-2">
          🤖 Model Status
        </div>
        <p className="text-sm">{modelStatus}</p>
      </div>
    </section>
  );
};

export default Dashboard;
