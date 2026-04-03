import { useState } from 'react'
import StatusBadge from './StatusBadge'

const COLUMNS = [
  { key: 'name', label: 'DEVICE', sortable: true },
  { key: 'site', label: 'SITE', sortable: true },
  { key: 'status', label: 'STATUS', sortable: true },
  { key: 'bandwidth', label: 'BW (Mbps)', sortable: true },
  { key: 'latency', label: 'LATENCY (ms)', sortable: true },
  { key: 'packetLoss', label: 'PKT LOSS (%)', sortable: true },
  { key: 'lastUpdate', label: 'LAST UPDATE', sortable: false },
]

function BandwidthBar({ value }) {
  const pct = Math.min(100, (value / 1000) * 100)
  const color = pct > 80 ? '#ff3355' : pct > 50 ? '#ffaa00' : '#00ff88'
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <span className="font-mono text-[0.72rem] text-[#e8f0f8] w-8 text-right flex-shrink-0">{value}</span>
      <div className="flex-1 h-1 bg-[#1a2332] rounded-sm overflow-hidden">
        <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function NetworkTable({ data }) {
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey]
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className="overflow-auto max-h-[420px] border border-[#1e2d3d] rounded">
      <table className="w-full border-collapse text-[0.8rem]">
        <thead>
          <tr>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                className={[
                  'sticky top-0 bg-[#111820] border-b border-[#2a3f55] font-mono text-[0.65rem] tracking-[0.1em] px-3.5 py-2.5 text-left whitespace-nowrap z-10 select-none',
                  col.sortable ? 'cursor-pointer hover:bg-[#151d27] hover:text-[#7a99b8]' : '',
                  sortKey === col.key ? 'text-[#00ff88]' : 'text-[#3d5570]'
                ].join(' ')}
              >
                {col.label}
                {col.sortable && (
                  <span className="opacity-60 text-[0.6rem] ml-0.5">
                    {sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr
              key={row.id}
              className={[
                'border-b border-[#1e2d3d] last:border-0 hover:bg-[#151d27] transition-colors duration-150',
                row.status === 'down' ? 'opacity-60' : ''
              ].join(' ')}
            >
              <td className="px-3.5 py-2.5 font-mono text-[0.75rem] text-[#e8f0f8] whitespace-nowrap">{row.name}</td>
              <td className="px-3.5 py-2.5 font-mono text-[0.7rem] text-[#7a99b8] whitespace-nowrap">{row.site}</td>
              <td className="px-3.5 py-2.5 whitespace-nowrap"><StatusBadge status={row.status} /></td>
              <td className="px-3.5 py-2.5 whitespace-nowrap"><BandwidthBar value={row.bandwidth} /></td>
              <td className="px-3.5 py-2.5 whitespace-nowrap">
                <span className="font-mono text-[0.75rem]" style={{ color: row.latency > 100 ? '#ff3355' : row.latency > 60 ? '#ffaa00' : '#e8f0f8' }}>
                  {row.latency}
                </span>
              </td>
              <td className="px-3.5 py-2.5 whitespace-nowrap">
                <span className="font-mono text-[0.75rem]" style={{ color: row.packetLoss > 4 ? '#ff3355' : row.packetLoss > 2 ? '#ffaa00' : '#00ff88' }}>
                  {row.packetLoss.toFixed(2)}
                </span>
              </td>
              <td className="px-3.5 py-2.5 font-mono text-[0.68rem] text-[#3d5570] whitespace-nowrap">
                {row.lastUpdate.slice(11, 19)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}