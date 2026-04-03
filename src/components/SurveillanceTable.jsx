import { useState } from 'react'
import StatusBadge from './StatusBadge'

const COLUMNS = [
  { key: 'name', label: 'CAMERA', sortable: true },
  { key: 'type', label: 'TYPE', sortable: false },
  { key: 'location', label: 'LOCATION', sortable: true },
  { key: 'status', label: 'STATUS', sortable: true },
  { key: 'aiEnabled', label: 'AI', sortable: true },
  { key: 'alerts', label: 'ALERTS', sortable: true },
  { key: 'lastUpdate', label: 'LAST UPDATE', sortable: false },
]

function AlertsCell({ value }) {
  const color = value >= 5 ? '#ff3355' : value >= 3 ? '#ffaa00' : value > 0 ? '#e8f0f8' : '#3d5570'
  const dotColor = value >= 5 ? '#ff3355' : value >= 3 ? '#ffaa00' : '#00ff88'
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[0.75rem] w-3" style={{ color }}>{value}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full inline-block transition-colors duration-300"
            style={{ background: i < value ? dotColor : '#1a2332' }}
          />
        ))}
      </div>
    </div>
  )
}

function AiBadge({ enabled }) {
  return (
    <span className={[
      'font-mono text-[0.62rem] tracking-[0.08em] px-1.5 py-0.5 rounded-sm border',
      enabled
        ? 'text-[#00d4ff] bg-[rgba(0,212,255,0.06)] border-[#00aacc]'
        : 'text-[#3d5570] bg-transparent border-[#1e2d3d]'
    ].join(' ')}>
      {enabled ? 'AI ON' : 'STD'}
    </span>
  )
}

export default function SurveillanceTable({ data }) {
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = [...data].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey]
    if (typeof av === 'boolean') { av = av ? 1 : 0; bv = bv ? 1 : 0 }
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
                row.status === 'inactive' ? 'opacity-60' : ''
              ].join(' ')}
            >
              <td className="px-3.5 py-2.5 font-mono text-[0.75rem] text-[#e8f0f8] whitespace-nowrap">{row.name}</td>
              <td className="px-3.5 py-2.5 font-mono text-[0.7rem] text-[#7a99b8] whitespace-nowrap">{row.type}</td>
              <td className="px-3.5 py-2.5 font-mono text-[0.7rem] text-[#7a99b8] whitespace-nowrap">{row.location}</td>
              <td className="px-3.5 py-2.5 whitespace-nowrap"><StatusBadge status={row.status} /></td>
              <td className="px-3.5 py-2.5 whitespace-nowrap"><AiBadge enabled={row.aiEnabled} /></td>
              <td className="px-3.5 py-2.5 whitespace-nowrap"><AlertsCell value={row.alerts} /></td>
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