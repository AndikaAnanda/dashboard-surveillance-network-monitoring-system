export default function FilterBar({
  search, onSearchChange,
  filters = [], activeFilter, onFilterChange,
  resultCount, totalCount,
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5 flex-wrap flex-1">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="absolute left-2.5 text-[#3d5570] text-base pointer-events-none">⌕</span>
          <input
            type="text"
            placeholder="SEARCH..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            spellCheck={false}
            className="bg-[#111820] border border-[#1e2d3d] rounded text-[#e8f0f8] font-mono text-[0.75rem] tracking-[0.06em] py-1.5 pl-8 pr-8 w-52 focus:outline-none focus:border-[#007a40] focus:bg-[#151d27] placeholder-[#1e3347] transition-colors duration-150"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-[#3d5570] text-[0.65rem] hover:text-[#e8f0f8] transition-colors"
            >✕</button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={[
                'flex items-center gap-1.5 border rounded text-[0.68rem] font-mono tracking-[0.08em] px-3 py-1.5 uppercase transition-all duration-150',
                activeFilter === f.value
                  ? 'bg-[rgba(0,255,136,0.06)] border-[#007a40] text-[#00ff88]'
                  : 'bg-[#111820] border-[#1e2d3d] text-[#7a99b8] hover:border-[#2a3f55] hover:text-[#e8f0f8]'
              ].join(' ')}
            >
              {f.label}
              {f.count !== undefined && (
                <span className={[
                  'text-[0.6rem] px-1.5 py-0 rounded-full',
                  activeFilter === f.value
                    ? 'bg-[#007a40] text-[#00ff88]'
                    : 'bg-[#1a2332] text-[#7a99b8]'
                ].join(' ')}>{f.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <span className="font-mono text-[0.68rem] flex-shrink-0">
        <span className="text-[#00ff88]">{resultCount}</span>
        <span className="text-[#3d5570]"> / {totalCount}</span>
      </span>
    </div>
  )
}