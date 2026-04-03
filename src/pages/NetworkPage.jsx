import { useState, useMemo } from "react";
import initialData from "../data/network_dataset.json"
import { useRealtimeNetwork } from "../hooks/useRealtime";
import SummaryCard from "../components/SummaryCard";
import { StatusDonutChart, BandwidthChart, LatencyLineChart, PacketLossChart} from "../components/Charts"
import FilterBar from "../components/FilterBar";
import NetworkTable from "../components/NetworkTable";

function SyncDot({ lastSync, tickCount }) {
    return (
        <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-[#3d5570] tracking-[0.08em]">
      <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full animate-blink" />
      LIVE · {lastSync.toLocaleTimeString()}
      <span className="text-[#1e3347]">· TICK #{tickCount}</span>
    </div>
    )
}

export default function NetworkPage() {
    const {data, lastSync, tickCount} = useRealtimeNetwork(initialData, 3000)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [siteFilter, setSiteFilter] = useState('all')

    const sites = useMemo(() => [...new Set(initialData.map(d => d.site))].sort(), [])
    const upCount = data.filter(d => d.status === 'up').length
    const downCount = data.filter(d => d.status === 'down').length
    const avgLatency = Math.round(data.reduce((s, d) => s + d.latency, 0)) / data.length
    const avgPacketLoss = (data.reduce((s, d) => s + d.packetLoss, 0) / data.length).toFixed(2)
    const avgBandwidth = Math.round(data.reduce((s, d) => s + d.bandwidth, 0) / data.length)

    const filtered = useMemo(() => data.filter(d => {
        const matchSearch = !search || d.name.toLowerCase().includes(search.toLocaleLowerCase()) || d.site.toLowerCase().includes(search.toLowerCase())
        return matchSearch && (statusFilter === 'all' || d.status === statusFilter) && (siteFilter === 'all' || d.site === siteFilter)        
    }), [data, search, statusFilter, siteFilter])

    const statusFilters = [
        { value: 'all', label: 'ALL', count: data.length },
        { value: 'up', label: 'UP', count: upCount },
        { value: 'down', label: 'DOWN', count: downCount },
    ]

    return (
    <div className="flex flex-col gap-5">
      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <SummaryCard label="Total Devices" value={data.length} sub={`${lastSync.toLocaleTimeString()}`} accent="green" icon="⬡" />
        <SummaryCard label="Online" value={upCount} sub={`${((upCount/data.length)*100).toFixed(0)}% operational`} accent="green" icon="▲" />
        <SummaryCard label="Offline" value={downCount} sub={downCount > 5 ? 'Requires attention' : 'Monitor'} accent={downCount > 5 ? 'red' : 'amber'} icon="▼" />
        <SummaryCard label="Avg Latency" value={`${avgLatency}ms`} sub={avgLatency > 60 ? 'High latency' : 'Within threshold'} accent={avgLatency > 60 ? 'amber' : 'cyan'} icon="◈" />
        <SummaryCard label="Avg Pkt Loss" value={`${avgPacketLoss}%`} sub={parseFloat(avgPacketLoss) > 3 ? 'Elevated' : 'Acceptable'} accent={parseFloat(avgPacketLoss) > 3 ? 'red' : 'green'} icon="⬦" />
        <SummaryCard label="Avg Bandwidth" value={avgBandwidth} sub="Mbps throughput" accent="cyan" icon="≋" />
      </div>
 
      {/* Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatusDonutChart data={data} upKey="up" downKey="down" />
        <BandwidthChart data={data} />
        <LatencyLineChart data={data} />
        <PacketLossChart data={data} />
      </div>
 
      {/* Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[0.72rem] text-[#7a99b8] tracking-[0.12em]">
            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full shadow-[0_0_6px_#00ff88]" />
            ROUTER INDEX
          </div>
          <SyncDot lastSync={lastSync} tickCount={tickCount} />
        </div>
 
        <div className="flex flex-col gap-2">
          <FilterBar search={search} onSearchChange={setSearch} filters={statusFilters} activeFilter={statusFilter} onFilterChange={setStatusFilter} resultCount={filtered.length} totalCount={data.length} />
          {/* Site filters */}
          <div className="flex gap-1 flex-wrap">
            {[{ value: 'all', label: 'ALL SITES' }, ...sites.map(s => ({ value: s, label: s.toUpperCase(), count: data.filter(d => d.site === s).length }))].map(f => (
              <button key={f.value} onClick={() => setSiteFilter(f.value)}
                className={[
                  'flex items-center gap-1.5 border rounded-sm font-mono text-[0.65rem] tracking-[0.08em] px-2.5 py-1 uppercase transition-all duration-150',
                  siteFilter === f.value
                    ? 'bg-[rgba(0,255,136,0.06)] border-[#007a40] text-[#00ff88]'
                    : 'bg-transparent border-[#1e2d3d] text-[#3d5570] hover:border-[#2a3f55] hover:text-[#7a99b8]'
                ].join(' ')}
              >
                {f.label}
                {f.count !== undefined && <span className="opacity-70">{f.count}</span>}
              </button>
            ))}
          </div>
        </div>
 
        <NetworkTable data={filtered} />
      </div>
    </div>
  )

}