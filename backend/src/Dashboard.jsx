import React, { useEffect } from "react";

const Dashboard = ({ riskLevel, forecast, alerts, modelStatus }) => {
  useEffect(() => {
    console.log("✅ Dashboard rendered!");
  }, []);

  return (
    <main className="min-h-screen bg-blue-100 text-black p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-800">
          FloodLens Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-blue-200 p-4 rounded">
            <h2 className="font-semibold">Current Risk Level</h2>
            <p className="text-blue-800">{riskLevel}</p>
          </div>
          <div className="bg-teal-200 p-4 rounded">
            <h2 className="font-semibold">Forecast</h2>
            <p className="text-teal-800">{forecast}</p>
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="font-semibold">Recent Alerts</h2>
          <ul className="list-disc list-inside text-sm">
            {alerts.map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold">Model Status</h2>
          <p>{modelStatus}</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;import React from "react";

const Dashboard = ({ riskLevel, forecast, alerts, modelStatus }) => {
  return (
    <main className="min-h-screen bg-blue-100 p-6 text-black">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-blue-900">
          FloodLens Dashboard
        </h1>

        {/* Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Risk Level */}
          <div className="bg-blue-200 text-blue-900 rounded-lg p-5 shadow-md">
            <h2 className="font-semibold text-lg">Current Risk Level</h2>
            <p className="text-xl">{riskLevel}</p>
          </div>

          {/* Forecast */}
          <div className="bg-teal-200 text-teal-900 rounded-lg p-5 shadow-md">
            <h2 className="font-semibold text-lg">Forecast</h2>
            <p className="text-xl">{forecast}</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-5 shadow-md">
          <h2 className="font-semibold text-lg">Recent Alerts</h2>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert, idx) => <li key={idx}>{alert}</li>)
            ) : (
              <li>No alerts at this time.</li>
            )}
          </ul>
        </div>

        {/* Model Status */}
        <div className="bg-gray-100 text-gray-900 rounded-lg p-5 shadow-md">
          <h2 className="font-semibold text-lg">Model Status</h2>
          <p className="text-sm mt-1">{modelStatus}</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

