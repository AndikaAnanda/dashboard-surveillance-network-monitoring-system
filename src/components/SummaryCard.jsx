const ACCENTS = {
  green: {
    bar: 'bg-[#00ff88]',
    value: 'text-[#00ff88]',
  },
  amber: {
    bar: 'bg-[#ffaa00]',
    value: 'text-[#ffaa00]',
  },
  red: {
    bar: 'bg-[#ff3355]',
    value: 'text-[#ff3355]',
  },
  cyan: {
    bar: 'bg-[#00d4ff]',
    value: 'text-[#00d4ff]',
  },
}

export default function SummaryCard({ label, value, sub, accent = 'green', icon }) {
  const a = ACCENTS[accent] || ACCENTS.green
  return (
    <div className="relative bg-[#0d1117] border border-[#1e2d3d] rounded overflow-hidden hover:border-[#2a3f55] transition-colors duration-150">
      {/* top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${a.bar}`} />
      <div className="p-4 pt-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[0.68rem] text-[#3d5570] tracking-[0.1em] uppercase">{label}</span>
          {icon && <span className="text-sm opacity-50">{icon}</span>}
        </div>
        <div className={`font-cond text-[2.4rem] font-bold leading-none tracking-tight ${a.value}`}>
          {value}
        </div>
        {sub && (
          <div className="mt-1.5 font-mono text-[0.65rem] text-[#3d5570] tracking-[0.04em]">
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}