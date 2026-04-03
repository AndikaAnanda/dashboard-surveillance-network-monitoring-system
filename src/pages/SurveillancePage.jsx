import { useState, useMemo } from 'react'
import initialData from '../data/surveillance_dataset.json'
import { useRealtimeSurveillance } from '../hooks/useRealtime'
import SummaryCard from '../components/SummaryCard'
import FilterBar from '../components/FilterBar'
import SurveillanceTable from '../components/SurveillanceTable'
import { StatusDonutChart, AlertsByLocationChart } from '../components/Charts'

export default function SurveillancePage() {
  const { data, lastSync, tickCount } = useRealtimeSurveillance(initialData, 4000)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [aiFilter, setAiFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')

  const locations = useMemo(() => [...new Set(initialData.map(d => d.location))].sort(), [])
  const activeCount = data.filter(d => d.status === 'active').length
  const inactiveCount = data.filter(d => d.status === 'inactive').length
  const aiCount = data.filter(d => d.aiEnabled).length
  const totalAlerts = data.reduce((s, d) => s + d.alerts, 0)
  const criticalCams = data.filter(d => d.alerts >= 5).length

  const filtered = useMemo(() => data.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || d.status === statusFilter
    const matchAi = aiFilter === 'all' || (aiFilter === 'ai' && d.aiEnabled) || (aiFilter === 'std' && !d.aiEnabled)
    const matchLoc = locationFilter === 'all' || d.location === locationFilter
    return matchSearch && matchStatus && matchAi && matchLoc
  }), [data, search, statusFilter, aiFilter, locationFilter])

  const FilterRow = ({ options, active, onChange }) => (
    <div className="flex gap-1 flex-wrap">
      {options.map(f => (
        <button key={f.value} onClick={() => onChange(f.value)}
          className={[
            'flex items-center gap-1.5 border rounded-sm font-mono text-[0.65rem] tracking-[0.08em] px-2.5 py-1 uppercase transition-all duration-150',
            active === f.value
              ? 'bg-[rgba(0,255,136,0.06)] border-[#007a40] text-[#00ff88]'
              : 'bg-transparent border-[#1e2d3d] text-[#3d5570] hover:border-[#2a3f55] hover:text-[#7a99b8]'
          ].join(' ')}
        >
          {f.label}
          {f.count !== undefined && <span className="opacity-70">{f.count}</span>}
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <SummaryCard label="Total Cameras" value={data.length} sub={lastSync.toLocaleTimeString()} accent="green" icon="⬡" />
        <SummaryCard label="Active" value={activeCount} sub={`${((activeCount/data.length)*100).toFixed(0)}% operational`} accent="green" icon="◉" />
        <SummaryCard label="Inactive" value={inactiveCount} sub={inactiveCount > 15 ? 'High offline rate' : 'Reduced coverage'} accent={inactiveCount > 15 ? 'red' : 'amber'} icon="○" />
        <SummaryCard label="AI-Enabled" value={aiCount} sub={`${((aiCount/data.length)*100).toFixed(0)}% of fleet`} accent="cyan" icon="⬡" />
        <SummaryCard label="Total Alerts" value={totalAlerts} sub={`${criticalCams} cams at max level`} accent={totalAlerts > 80 ? 'red' : 'amber'} icon="⚠" />
        <SummaryCard label="Critical Cams" value={criticalCams} sub="Alert level 5/5" accent={criticalCams > 5 ? 'red' : 'amber'} icon="!" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatusDonutChart data={data} upKey="active" downKey="inactive" />
        <AlertsByLocationChart data={data} />
      </div>

      {/* Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[0.72rem] text-[#7a99b8] tracking-[0.12em]">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full shadow-[0_0_6px_#00ff88]" />
            CAMERA REGISTRY
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-[#3d5570] tracking-[0.08em]">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-blink" />
            LIVE · {lastSync.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FilterBar
            search={search} onSearchChange={setSearch}
            filters={[
              { value: 'all', label: 'ALL', count: data.length },
              { value: 'active', label: 'ACTIVE', count: activeCount },
              { value: 'inactive', label: 'INACTIVE', count: inactiveCount },
            ]}
            activeFilter={statusFilter} onFilterChange={setStatusFilter}
            resultCount={filtered.length} totalCount={data.length}
          />
          <FilterRow
            options={[
              { value: 'all', label: 'ALL' },
              { value: 'ai', label: 'AI-ENABLED', count: aiCount },
              { value: 'std', label: 'STANDARD', count: data.length - aiCount },
            ]}
            active={aiFilter} onChange={setAiFilter}
          />
          <FilterRow
            options={[
              { value: 'all', label: 'ALL SITES' },
              ...locations.map(l => ({ value: l, label: l.toUpperCase(), count: data.filter(d => d.location === l).length }))
            ]}
            active={locationFilter} onChange={setLocationFilter}
          />
        </div>

        <SurveillanceTable data={filtered} />
      </div>
    </div>
  )
}