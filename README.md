# OPS//MONITOR — Dashboard Surveillance & Network Monitoring

Dashboard monitoring real-time untuk **Surveillance** dan **Network** berbasis React + Chart.js.

public url : https://ops-monitor.vercel.app/

## Tech Stack

- **React 19** + **Vite 8**
- **Chart.js 4** via `react-chartjs-2`
- TailwindCSS
- JavaScript

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build production
npm run build
```

Buka `http://localhost:5173` di browser.

## Struktur Project

```
src/
├── data/
│   ├── networkData.json          # Dataset router (30 items)
│   └── surveillanceData.json     # Dataset kamera (50 items)
├── hooks/
│   └── useRealtime.js            # Hook simulasi real-time update
├── components/
│   ├── StatusBadge.jsx/css       # Indikator status (up/down, active/inactive)
│   ├── SummaryCard.jsx/css       # Kartu ringkasan statistik
│   ├── FilterBar.jsx/css         # Search + filter interaktif
│   ├── NetworkTable.jsx          # Tabel router dengan sorting
│   ├── SurveillanceTable.jsx     # Tabel kamera dengan sorting
│   ├── DataTable.module.css      # Shared styles untuk tabel
│   └── Charts.jsx/css            # Semua Chart.js components
├── pages/
│   ├── NetworkPage.jsx           # Halaman Network Monitoring
│   ├── SurveillancePage.jsx      # Halaman Surveillance
│   └── Page.module.css           # Shared page layout
├── styles/
│   └── globals.css               # CSS variables & reset
├── App.jsx                       # Root shell + navigasi tab
├── App.module.css
└── main.jsx
```

## Fitur

### Network Monitoring
- **Summary Cards**: Total devices, online/offline count, avg latency, avg packet loss, avg bandwidth
- **Charts**: Status donut, avg bandwidth per site, latency line chart (R01–R15), top 10 packet loss
- **Table**: Sortable by semua kolom, bandwidth bar visual, color-coded latency & packet loss
- **Filter**: Search by name/site, filter by status (all/up/down), filter by site

### Surveillance Monitoring
- **Summary Cards**: Total cameras, active/inactive, AI-enabled count, total alerts, critical cameras
- **Charts**: Status donut, total alerts per location
- **Table**: Sortable, alert dots visualization, AI badge indicator
- **Filter**: Search, filter status, filter AI enabled/standard, filter per location

### Real-time Simulation
- Network data diupdate setiap **3 detik** (bandwidth, latency, packet loss fluctuate ±8–12%)
- Surveillance data diupdate setiap **4 detik** (alerts naik/turun, status sesekali flip)
- ~5% probabilitas status flip per device per tick

## Requirements Coverage

| Requirement | Status |
|---|---|
| Summary Cards | ✅ |
| Chart.js charts | ✅ (Bar, Line, Doughnut) |
| Data Table/List | ✅ (sortable) |
| Status Indicator | ✅ (badge + pulsing dot) |
| Real-time update | ✅ (interval simulation) |
| Interaksi (toggle/filter/search) | ✅ (search + multi-filter) |
| React + Component-based | ✅ |
| State management | ✅ (useState + useMemo) |
| Styling (CSS Modules) | ✅ |