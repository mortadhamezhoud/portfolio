const ACCENT = "#3ee6c1";
const BLUE = "#5b8cff";
const LINE = "#1c2742";
const SURFACE = "#0e1528";

/** Neural network: 4 layers of nodes, fully connected, with a few lit nodes. */
function Neural() {
  const layers = [3, 5, 5, 2];
  const x = (l: number) => 40 + l * 80;
  const y = (l: number, i: number) => 80 + (i - (layers[l] - 1) / 2) * 26;
  const lit = new Set(["1-1", "1-3", "2-2", "3-0"]);
  return (
    <>
      {layers.slice(0, -1).flatMap((n, l) =>
        Array.from({ length: n }, (_, i) =>
          Array.from({ length: layers[l + 1] }, (_, j) => (
            <line
              key={`${l}-${i}-${j}`}
              x1={x(l)}
              y1={y(l, i)}
              x2={x(l + 1)}
              y2={y(l + 1, j)}
              stroke={BLUE}
              strokeOpacity="0.25"
            />
          )),
        ),
      )}
      {layers.flatMap((n, l) =>
        Array.from({ length: n }, (_, i) => (
          <circle
            key={`${l}-${i}`}
            cx={x(l)}
            cy={y(l, i)}
            r="6"
            fill={lit.has(`${l}-${i}`) ? ACCENT : SURFACE}
            stroke={lit.has(`${l}-${i}`) ? ACCENT : BLUE}
            strokeWidth="1.5"
          />
        )),
      )}
    </>
  );
}

/** Rising bar chart with a trend line. */
function Bars() {
  const heights = [34, 52, 44, 74, 62, 96, 118];
  return (
    <>
      <line x1="30" y1="140" x2="290" y2="140" stroke={LINE} strokeWidth="2" />
      {heights.map((h, i) => (
        <rect
          key={i}
          x={42 + i * 36}
          y={140 - h}
          width="22"
          height={h}
          rx="4"
          fill={i === heights.length - 1 ? ACCENT : BLUE}
          fillOpacity={i === heights.length - 1 ? 1 : 0.55}
        />
      ))}
      <polyline
        points={heights.map((h, i) => `${53 + i * 36},${140 - h - 12}`).join(" ")}
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

/** Architecture: client -> API -> database. */
function Architecture() {
  const box = (x: number, label: string, accent?: boolean) => (
    <g key={label}>
      <rect x={x} y="52" width="76" height="56" rx="10" fill={SURFACE} stroke={accent ? ACCENT : BLUE} strokeWidth="1.5" />
      <rect x={x + 12} y="66" width="52" height="6" rx="3" fill={accent ? ACCENT : BLUE} fillOpacity="0.7" />
      <rect x={x + 12} y="80" width="34" height="5" rx="2.5" fill={LINE} />
      <rect x={x + 12} y="92" width="42" height="5" rx="2.5" fill={LINE} />
      <text x={x + 38} y="128" textAnchor="middle" fontSize="11" fill="#8b97b3" fontFamily="monospace">
        {label}
      </text>
    </g>
  );
  const arrow = (x: number) => (
    <g key={x} stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1={x} y1="80" x2={x + 28} y2="80" />
      <polyline points={`${x + 22},74 ${x + 28},80 ${x + 22},86`} />
    </g>
  );
  return (
    <>
      {box(24, "React", true)}
      {arrow(104)}
      {box(122, "NestJS")}
      {arrow(202)}
      {box(220, "MySQL")}
    </>
  );
}

/** Two stacked browser windows with a text feed. */
function Browsers() {
  const win = (x: number, y: number, accent: boolean) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="170" height="100" rx="10" fill={SURFACE} stroke={accent ? ACCENT : BLUE} strokeWidth="1.5" />
      <line x1={x} y1={y + 20} x2={x + 170} y2={y + 20} stroke={LINE} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 14 + i * 12} cy={y + 10} r="3" fill={i === 0 && accent ? ACCENT : LINE} />
      ))}
      <rect x={x + 14} y={y + 32} width="90" height="7" rx="3.5" fill={accent ? ACCENT : BLUE} fillOpacity="0.7" />
      {[48, 60, 72, 84].map((o, i) => (
        <rect key={o} x={x + 14} y={y + o} width={140 - i * 22} height="5" rx="2.5" fill={LINE} />
      ))}
    </g>
  );
  return (
    <>
      {win(18, 40, false)}
      {win(132, 22, true)}
    </>
  );
}

const ART: Record<string, () => React.ReactNode> = {
  "neural-shield": Neural,
  bars: Bars,
  fullstack: Architecture,
  "news-feed": Browsers,
};

/** Small static illustration of a project's 3D shape, shown on phones where the 3D is off. */
export default function ProjectArt({ scene }: { scene: string }) {
  const Art = ART[scene];
  if (!Art) return null;
  return (
    <svg
      viewBox="0 0 320 160"
      role="img"
      aria-hidden="true"
      className="h-40 w-full rounded-xl border border-border bg-surface/60 lg:hidden"
    >
      <Art />
    </svg>
  );
}
