const NODES = [
  { top: '12%', left: '8%', size: 46, delay: 0, dur: 15 },
  { top: '22%', left: '82%', size: 30, delay: 2, dur: 18 },
  { top: '64%', left: '14%', size: 34, delay: 1, dur: 17 },
  { top: '74%', left: '72%', size: 52, delay: 3, dur: 20 },
  { top: '42%', left: '46%', size: 22, delay: 1.5, dur: 14 },
  { top: '8%', left: '58%', size: 26, delay: 2.5, dur: 19 },
  { top: '88%', left: '40%', size: 30, delay: 0.5, dur: 16 },
]

/**
 * Decorative, non-interactive field of drifting "molecule" nodes.
 * Each node is a ringed dot with two small bonds, echoing the brand's
 * peptide-structure motif. Purely aesthetic, hidden from assistive tech.
 */
export function FloatingMolecules({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {NODES.map((n, i) => (
        <span
          key={i}
          className="animate-float-drift absolute block"
          style={{
            top: n.top,
            left: n.left,
            width: n.size,
            height: n.size,
            animationDelay: `${n.delay}s`,
            animationDuration: `${n.dur}s`,
          }}
        >
          <span className="absolute inset-0 rounded-full border border-accent/30" />
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/50" />
          <span className="absolute left-full top-1/2 h-px w-3 -translate-y-1/2 bg-accent/25" />
          <span className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-accent/25" />
        </span>
      ))}
    </div>
  )
}
