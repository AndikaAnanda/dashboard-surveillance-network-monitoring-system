export default function StatusBadge({ status }) {
  const isPositive = status === 'up' || status === 'active'
  const label = status.toUpperCase()

  return (
    <span className={[
      'inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-widest px-2 py-0.5 rounded-sm border',
      isPositive
        ? 'text-[#00ff88] bg-[rgba(0,255,136,0.06)] border-[#007a40]'
        : 'text-[#ff3355] bg-[rgba(255,51,85,0.08)] border-[#cc2244]'
    ].join(' ')}>
      <span className={[
        'w-1.5 h-1.5 rounded-full flex-shrink-0',
        isPositive
          ? 'bg-[#00ff88] animate-pulse-green glow-green-sm'
          : 'bg-[#ff3355]'
      ].join(' ')} />
      {label}
    </span>
  )
}