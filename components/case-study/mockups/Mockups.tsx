import { useTranslations } from "next-intl";

/**
 * Mock-ups recreated in HTML/SVG with SYNTHETIC data. They never reproduce the real platform
 * (which contains confidential information): names, figures and headlines are invented.
 */

const CYAN = "#3EE6C1";
const BLUE = "#5B8CFF";
const AMBER = "#F5B942";
const RED = "#FF6B6B";

export function MockupFrame({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("caseStudy");
  return (
    <figure className={`${className}`}>
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-xl border border-border bg-bg/90 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#FF6B6B]/70" />
          <span className="h-2 w-2 rounded-full bg-[#F5B942]/70" />
          <span className="h-2 w-2 rounded-full bg-[#3EE6C1]/70" />
          <span className="ml-2 font-mono text-[10px] text-muted">{title}</span>
        </div>
        <div className="p-3">{children}</div>
      </div>
      <figcaption className="mt-2 font-mono text-[10px] text-muted">
        {t("mockupNote")}
      </figcaption>
    </figure>
  );
}

function Donut({ value, color = CYAN, size = 76 }: { value: number; color?: string; size?: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#1C2742" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" fontSize="18" fontWeight="700" fill="#E7ECF7">
        {value}
      </text>
    </svg>
  );
}

function Bar({ value, color = BLUE }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-border">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/** Executive Committee: one global dashboard. */
export function ExecutiveMock() {
  const bars = [62, 78, 45, 88, 54];
  return (
    <MockupFrame title="global-dashboard">
      <div className="flex items-center gap-4">
        <Donut value={72} />
        <div className="grid flex-1 grid-cols-3 gap-2">
          {[
            ["Awareness", "68%", CYAN],
            ["Phishing", "14%", AMBER],
            ["Training", "81%", BLUE],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-md border border-border bg-surface/70 p-2">
              <p className="text-[9px] text-muted">{label}</p>
              <p className="font-display text-sm font-bold" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex h-16 items-end gap-2 border-b border-border">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `linear-gradient(${CYAN}, ${BLUE})`, opacity: 0.85 }} />
        ))}
      </div>
      <svg viewBox="0 0 200 40" className="mt-2 h-8 w-full">
        <polyline fill="none" stroke={CYAN} strokeWidth="1.5" points="0,30 30,26 60,28 90,18 120,20 150,10 200,8" />
      </svg>
    </MockupFrame>
  );
}

/** IT Security team: full console with an employee table. */
export function SecurityMock() {
  const rows: [string, number, string, string][] = [
    ["EMP-014", 82, "Critical", RED],
    ["EMP-087", 61, "High", AMBER],
    ["EMP-152", 35, "Medium", BLUE],
    ["EMP-203", 12, "Low", CYAN],
  ];
  return (
    <MockupFrame title="security-console">
      <div className="flex gap-3">
        <div className="flex w-6 flex-col gap-2 pt-1">
          {[CYAN, BLUE, BLUE, BLUE, BLUE].map((c, i) => (
            <span key={i} className="h-4 w-4 rounded" style={{ background: c, opacity: i === 0 ? 1 : 0.35 }} />
          ))}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-[1.2fr_2fr_1fr] gap-2 border-b border-border pb-1 text-[9px] text-muted">
            <span>Employee</span>
            <span>Vulnerability</span>
            <span>Risk</span>
          </div>
          {rows.map(([id, score, label, color]) => (
            <div key={id} className="grid grid-cols-[1.2fr_2fr_1fr] items-center gap-2 border-b border-border/60 py-1.5">
              <span className="font-mono text-[9px] text-text">{id}</span>
              <Bar value={score} color={color} />
              <span className="rounded-full px-1.5 py-0.5 text-center text-[8px] font-semibold text-bg" style={{ background: color }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

/** Cyber threat watch: a feed of (invented) headlines. */
export function WatchMock() {
  const items: [string, string][] = [
    ["Fake invoice emails reuse a legitimate sender name", "2 h ago"],
    ["New credential-harvesting kit imitates cloud login pages", "5 h ago"],
    ["Reminder: report suspicious attachments to the security team", "1 d ago"],
  ];
  return (
    <MockupFrame title="threat-watch">
      <ul className="flex flex-col gap-2">
        {items.map(([headline, time]) => (
          <li key={headline} className="flex gap-2 rounded-md border border-border bg-surface/70 p-2">
            <span className="mt-0.5 h-8 w-8 shrink-0 rounded" style={{ background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`, opacity: 0.7 }} />
            <span>
              <span className="block text-[10px] leading-snug text-text">{headline}</span>
              <span className="font-mono text-[8px] text-muted">{time}</span>
            </span>
          </li>
        ))}
      </ul>
    </MockupFrame>
  );
}

/** Detailed tracking of one (invented) employee. */
export function TrackingMock() {
  const axes: [string, number, string][] = [
    ["Quizzes", 75, CYAN],
    ["Trainings", 33, AMBER],
    ["Phishing", 60, BLUE],
  ];
  return (
    <MockupFrame title="employee / EMP-087">
      <div className="flex items-center gap-4">
        <Donut value={61} color={AMBER} />
        <div className="flex flex-1 flex-col gap-2">
          {axes.map(([label, value, color]) => (
            <div key={label}>
              <div className="mb-0.5 flex justify-between text-[9px] text-muted">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <Bar value={value} color={color} />
            </div>
          ))}
        </div>
      </div>
    </MockupFrame>
  );
}

/** Phishing risk prediction: semicircle gauge + two main factors. */
export function PredictionMock() {
  return (
    <MockupFrame title="risk-prediction">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 120 70" className="w-28 shrink-0">
          <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#1C2742" strokeWidth="10" strokeLinecap="round" />
          <path d="M10 60 A50 50 0 0 1 93 20" fill="none" stroke={AMBER} strokeWidth="10" strokeLinecap="round" />
          <text x="60" y="58" textAnchor="middle" fontSize="16" fontWeight="700" fill="#E7ECF7">
            High
          </text>
        </svg>
        <div className="flex flex-1 flex-col gap-2 text-[9px] text-muted">
          <div>
            <p>Past clicks</p>
            <Bar value={80} color={RED} />
          </div>
          <div>
            <p>Training gap</p>
            <Bar value={55} color={AMBER} />
          </div>
        </div>
      </div>
    </MockupFrame>
  );
}

/** CyberBot: a short, invented conversation. */
export function CyberBotMock() {
  return (
    <MockupFrame title="cyberbot">
      <div className="flex flex-col gap-2 text-[10px] leading-snug">
        <p className="ml-auto max-w-[80%] rounded-lg rounded-br-sm bg-secondary/30 px-2.5 py-1.5 text-text">
          How do I recognise a spoofed sender?
        </p>
        <p className="max-w-[85%] rounded-lg rounded-bl-sm border border-border bg-surface px-2.5 py-1.5 text-muted">
          Check the full address, not just the display name, then hover over any link before you click.
        </p>
        <p className="ml-auto max-w-[80%] rounded-lg rounded-br-sm bg-secondary/30 px-2.5 py-1.5 text-text">
          How many employees completed training?
        </p>
        <p className="max-w-[85%] rounded-lg rounded-bl-sm border border-border bg-surface px-2.5 py-1.5 text-muted">
          <span className="text-accent">188 of 250</span> (synthetic figure).
        </p>
      </div>
    </MockupFrame>
  );
}
