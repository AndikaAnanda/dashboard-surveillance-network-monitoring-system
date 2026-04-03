import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const tooltipDefaults = {
  backgroundColor: '#0d1117',
  borderColor: '#2a3f55',
  borderWidth: 1,
  titleColor: '#00ff88',
  bodyColor: '#7a99b8',
  titleFont: { family: 'Share Tech Mono', size: 11 },
  bodyFont: { family: 'Share Tech Mono', size: 11 },
  padding: 10,
}

const scaleDefaults = {
  x: {
    ticks: { color: '#3d5570', font: { family: 'Share Tech Mono', size: 9 } },
    grid: { color: '#1e2d3d' },
    border: { color: '#1e2d3d' },
  },
  y: {
    ticks: { color: '#3d5570', font: { family: 'Share Tech Mono', size: 9 } },
    grid: { color: '#1e2d3d' },
    border: { color: '#1e2d3d' },
  },
}

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: tooltipDefaults },
  scales: scaleDefaults,
}

function ChartWrapper({ title, children }) {
  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded p-4 flex flex-col gap-3">
      <span className="font-mono text-[0.65rem] text-[#3d5570] tracking-[0.12em]">{title}</span>
      <div className="h-[180px] relative">{children}</div>
    </div>
  )
}

export function BandwidthChart({ data }) {
  const sites = [...new Set(data.map(d => d.site))].sort()
  const avgBw = sites.map(site => {
    const items = data.filter(d => d.site === site)
    return Math.round(items.reduce((s, d) => s + d.bandwidth, 0) / items.length)
  })
  return (
    <ChartWrapper title="AVG BANDWIDTH / SITE">
      <Bar options={baseOptions} data={{
        labels: sites,
        datasets: [{
          data: avgBw,
          backgroundColor: avgBw.map(v => v > 700 ? 'rgba(255,51,85,0.7)' : v > 400 ? 'rgba(255,170,0,0.7)' : 'rgba(0,255,136,0.7)'),
          borderColor: avgBw.map(v => v > 700 ? '#ff3355' : v > 400 ? '#ffaa00' : '#00ff88'),
          borderWidth: 1, borderRadius: 2,
        }],
      }} />
    </ChartWrapper>
  )
}

export function PacketLossChart({ data }) {
  const sorted = [...data].sort((a, b) => b.packetLoss - a.packetLoss).slice(0, 10)
  return (
    <ChartWrapper title="TOP 10 PACKET LOSS">
      <Bar options={baseOptions} data={{
        labels: sorted.map(d => d.name.replace('Router ', 'R')),
        datasets: [{
          data: sorted.map(d => d.packetLoss),
          backgroundColor: sorted.map(d => d.packetLoss > 4 ? 'rgba(255,51,85,0.7)' : d.packetLoss > 2.5 ? 'rgba(255,170,0,0.7)' : 'rgba(0,255,136,0.7)'),
          borderColor: sorted.map(d => d.packetLoss > 4 ? '#ff3355' : d.packetLoss > 2.5 ? '#ffaa00' : '#00ff88'),
          borderWidth: 1, borderRadius: 2,
        }],
      }} />
    </ChartWrapper>
  )
}

export function StatusDonutChart({ data, upKey = 'up', downKey = 'down' }) {
  const upCount = data.filter(d => d.status === upKey).length
  const downCount = data.filter(d => d.status === downKey).length
  const options = {
    responsive: true, maintainAspectRatio: false, cutout: '70%',
    plugins: {
      legend: {
        display: true, position: 'bottom',
        labels: { color: '#7a99b8', font: { family: 'Share Tech Mono', size: 10 }, padding: 12, boxWidth: 10, boxHeight: 10 },
      },
      tooltip: tooltipDefaults,
    },
  }
  return (
    <ChartWrapper title="STATUS RATIO">
      <div className="relative h-full">
        <Doughnut options={options} data={{
          labels: [upKey.toUpperCase(), downKey.toUpperCase()],
          datasets: [{
            data: [upCount, downCount],
            backgroundColor: ['rgba(0,255,136,0.8)', 'rgba(255,51,85,0.8)'],
            borderColor: ['#00ff88', '#ff3355'],
            borderWidth: 1, hoverOffset: 4,
          }],
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] text-center pointer-events-none">
          <span className="block font-cond text-[1.8rem] font-bold text-[#00ff88] leading-none">{upCount}</span>
          <span className="block font-mono text-[0.6rem] text-[#3d5570] tracking-[0.1em] mt-0.5">{upKey.toUpperCase()}</span>
        </div>
      </div>
    </ChartWrapper>
  )
}

export function LatencyLineChart({ data }) {
  const sorted = [...data].sort((a, b) => a.id - b.id).slice(0, 15)
  return (
    <ChartWrapper title="LATENCY PROFILE (R01–R15)">
      <Line options={baseOptions} data={{
        labels: sorted.map(d => d.name.replace('Router ', 'R')),
        datasets: [{
          data: sorted.map(d => d.latency),
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0,212,255,0.08)',
          pointBackgroundColor: sorted.map(d => d.latency > 80 ? '#ff3355' : d.latency > 50 ? '#ffaa00' : '#00d4ff'),
          pointRadius: 4, pointHoverRadius: 6,
          borderWidth: 1.5, fill: true, tension: 0.3,
        }],
      }} />
    </ChartWrapper>
  )
}

export function AlertsByLocationChart({ data }) {
  const locations = [...new Set(data.map(d => d.location))].sort()
  const totals = locations.map(loc => data.filter(d => d.location === loc).reduce((s, d) => s + d.alerts, 0))
  return (
    <ChartWrapper title="TOTAL ALERTS / LOCATION">
      <Bar options={baseOptions} data={{
        labels: locations,
        datasets: [{
          data: totals,
          backgroundColor: totals.map(v => v > 30 ? 'rgba(255,51,85,0.7)' : v > 15 ? 'rgba(255,170,0,0.7)' : 'rgba(0,255,136,0.7)'),
          borderColor: totals.map(v => v > 30 ? '#ff3355' : v > 15 ? '#ffaa00' : '#00ff88'),
          borderWidth: 1, borderRadius: 2,
        }],
      }} />
    </ChartWrapper>
  )
}