# 🌊 FloodLens

FloodLens is an AI-powered flood risk prediction and visualization platform built for disaster resilience. It helps users visualize rainfall patterns, elevation-based flood risk, emergency alerts, and more — all in one dashboard.

🚧 *Note:* The project is currently *50% complete*. The remaining features, UI polish, and performance enhancements will be built collaboratively during the hackathon.

---

## 📍 Key Features

- 🌐 *Interactive Map View*
  - Click anywhere on the map to simulate flood data.
  - A popup appears showing:
    - 📌 *Selected Location*
    - 🏔 Elevation (mocked)
    - 🌧 Rainfall (mocked 7-day forecast)
    - 🚨 Flood Risk Status (Low / High)
    - 💡 Risk Reason
    - 📄 Option to *Download a PDF Report*

- 🧠 *AI-Powered Dashboard*
  - Live alerts, 7-day forecast & model status
  - Displays risk level, reason, and GPT-generated forecast logic

- 📊 *Rainfall Chart*
  - Line graph with simulated rainfall over 7 days

- 🌙 *Dark Mode Toggle*
  - User-friendly dark/light mode switch

- 📱 *Mobile Responsive*
  - Adaptive layout and collapsible sidebar

---

## ⚙ Tech Stack

- 🌐 *React + Vite* — Fast frontend development
- 🗺 *Leaflet.js + OpenStreetMap* — Interactive map view
- 📊 *Chart.js* — Rainfall visualization
- 📄 *jsPDF* — Export detailed flood reports as PDFs
- 🎨 *Tailwind CSS* — Responsive and dark-mode UI
- 🧠 *AI + LLM (GPT)* — Used for:
  - Chain-of-Thought (CoT) reasoning in risk explanation
  - Generating flood forecasts and justifications
  - Model status messaging with natural language

---

*Upcoming Features* (Post-hackathon)
	•	🌐 Live rainfall & flood data via APIs
	•	🔔 Push alerts for flood-prone zones
	•	📱 PWA for mobile offline support
	•	🌈 Themed map layers & animated overlays


## 🚀 Setup Instructions

1. *Clone the repository*
   ```bash
   git clone https://github.com/your-username/floodlens.git
   cd floodlens
