"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { CaseStudy } from "@/lib/case-study-types";

const CYAN = "#3EE6C1";
const BLUE = "#5B8CFF";
const AMBER = "#F5B942";
const RED = "#FF6B6B";

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm ${className}`}
    >
      <h3 className="font-display text-lg font-bold text-text">{title}</h3>
      {children}
    </article>
  );
}

/** Bar that grows from 0 to `pct` when it scrolls into view (static with reduced motion). */
function GrowBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className="h-full"
      style={{ background: color }}
      initial={reduced ? false : { width: 0 }}
      whileInView={{ width: `${pct}%` }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1, ease: "easeOut", delay }}
    />
  );
}

/** Constellation schema: 4 fact tables sharing dimensions. Order of the JSON arrays is meaningful. */
function ConstellationSchema({ model }: { model: CaseStudy["bi"]["model"] }) {
  const factX = [90, 240, 390, 540];
  const sharedX = [210, 420]; // Employees, Departments
  const ownX: (number | null)[] = [90, 240, 390, null]; // Quizzes, Trainings, Campaigns (index = fact)
  const ownDim = [model.dimensions[2], model.dimensions[3], model.dimensions[4], null];
  return (
    <svg viewBox="0 0 630 250" className="mt-5 w-full" role="img" aria-label={model.title}>
      {/* links: every fact -> both shared dimensions, plus its own dimension */}
      {factX.map((fx, i) => (
        <g key={i} stroke="#2A3A63" strokeWidth="1.2">
          {sharedX.map((sx) => (
            <line key={sx} x1={fx} y1={118} x2={sx} y2={46} />
          ))}
          {ownX[i] !== null && <line x1={fx} y1={150} x2={ownX[i]!} y2={206} />}
        </g>
      ))}
      {/* shared dimensions */}
      {sharedX.map((sx, i) => (
        <g key={sx}>
          <rect x={sx - 62} y={22} width={124} height={34} rx={8} fill="#0E1528" stroke={BLUE} />
          <text x={sx} y={44} textAnchor="middle" fontSize="12" fill="#E7ECF7">
            {model.dimensions[i]}
          </text>
        </g>
      ))}
      {/* fact tables */}
      {factX.map((fx, i) => (
        <g key={fx}>
          <rect x={fx - 52} y={118} width={104} height={32} rx={8} fill="#0E1528" stroke={CYAN} />
          <text x={fx} y={139} textAnchor="middle" fontSize="12" fontWeight="600" fill={CYAN}>
            {model.facts[i]}
          </text>
        </g>
      ))}
      {/* own dimensions */}
      {ownDim.map((label, i) =>
        label && ownX[i] !== null ? (
          <g key={label}>
            <rect x={ownX[i]! - 52} y={206} width={104} height={30} rx={8} fill="#0E1528" stroke="#2A3A63" />
            <text x={ownX[i]!} y={226} textAnchor="middle" fontSize="11" fill="#8B97B3">
              {label}
            </text>
          </g>
        ) : null,
      )}
    </svg>
  );
}

export function BiSection({ study }: { study: CaseStudy }) {
  const { bi } = study;
  const colors = [CYAN, BLUE, AMBER];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title={bi.model.title} className="lg:col-span-2">
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">{bi.model.text}</p>
        <ConstellationSchema model={bi.model} />
        <p className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
          <span>
            <span style={{ color: CYAN }}>■</span> {bi.model.factsLabel}
          </span>
          <span>
            <span style={{ color: BLUE }}>■</span> {bi.model.dimensionsLabel}
          </span>
        </p>
      </Card>

      <Card title={bi.etl.title}>
        <p className="mt-2 leading-relaxed text-muted">{bi.etl.text}</p>
        <ol className="mt-5 flex flex-wrap items-center gap-2" aria-label={bi.etl.title}>
          {bi.etl.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-bg px-3 py-1.5 font-mono text-xs text-text">
                {step}
              </span>
              {i < bi.etl.steps.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 font-mono text-xs text-accent">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          {bi.etl.refreshLabel}
        </p>
      </Card>

      <Card title={bi.score.title}>
        <p className="mt-2 leading-relaxed text-muted">{bi.score.text}</p>
        <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-border" role="img" aria-label={bi.score.parts.map((p) => `${p.label} ${p.points}`).join(" · ")}>
          {bi.score.parts.map((part, i) => (
            <div key={part.label} className="h-full" style={{ width: `${part.points}%` }}>
              <GrowBar pct={100} color={colors[i]} delay={i * 0.25} />
            </div>
          ))}
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-2">
          {bi.score.parts.map((part, i) => (
            <li key={part.label}>
              <p className="font-display text-2xl font-bold" style={{ color: colors[i] }}>
                {part.points}
              </p>
              <p className="text-xs text-muted">
                {part.label} · {bi.score.totalLabel}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={bi.dax.title} className="lg:col-span-2">
        <p className="mt-2 max-w-3xl leading-relaxed text-muted">{bi.dax.text}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {bi.dax.chips.map((chip) => (
            <li key={chip} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-text">
              {chip}
            </li>
          ))}
        </ul>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
          <code>{bi.dax.snippet.join("\n")}</code>
        </pre>
        <p className="mt-2 font-mono text-[10px] text-muted">{bi.dax.snippetNote}</p>
      </Card>
    </div>
  );
}

/** Illustrative ROC curve (not the real one): a smooth curve with AUC around 0.9. */
function RocCurve({ note }: { note: string }) {
  return (
    <figure className="mt-4">
      <svg viewBox="0 0 120 100" className="w-full max-w-[220px]" role="img" aria-label={note}>
        <rect x="10" y="5" width="100" height="85" fill="none" stroke="#1C2742" />
        <line x1="10" y1="90" x2="110" y2="5" stroke="#2A3A63" strokeDasharray="3 3" />
        <path d="M10 90 C 18 40, 30 18, 110 5" fill="none" stroke={CYAN} strokeWidth="2" />
        <path d="M10 90 C 18 40, 30 18, 110 5 L110 90 Z" fill={CYAN} opacity="0.1" />
      </svg>
      <figcaption className="font-mono text-[10px] text-muted">{note}</figcaption>
    </figure>
  );
}

/** Time split: features from the years up to N, target in year N+1. */
function TemporalSplit({ labels }: { labels: CaseStudy["ml"]["split"]["labels"] }) {
  return (
    <div className="mt-5" role="img" aria-label={`${labels.features} → ${labels.target}`}>
      <div className="grid grid-cols-4 gap-1">
        {labels.years.map((year, i) => (
          <div
            key={year}
            className={`rounded-md py-2 text-center font-mono text-xs ${
              i < 3 ? "border border-secondary/40 bg-secondary/15 text-text" : "border border-accent/60 bg-accent/15 text-accent"
            }`}
          >
            {year}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1 text-[11px] text-muted">
        <span className="col-span-3 border-t-2 border-secondary/60 pt-1">{labels.features}</span>
        <span className="border-t-2 border-accent pt-1 text-accent">{labels.target}</span>
      </div>
    </div>
  );
}

/** SHAP-style bars for one flagged (invented) employee: red pushes the risk up, blue pulls it down. */
function ShapBars({ study }: { study: CaseStudy }) {
  const rows: [string, number][] = [
    [study.demo.factors.clicks, 0.42],
    [study.demo.factors.days, 0.27],
    [study.demo.factors.trainings, 0.12],
    [study.demo.factors.quizzes, -0.18],
  ];
  return (
    <figure className="mt-4">
      <ul className="flex flex-col gap-2" aria-label={study.ml.shap.note}>
        {rows.map(([label, value]) => (
          <li key={label} className="grid grid-cols-[8.5rem_1fr] items-center gap-3 text-xs text-muted">
            <span className="truncate">{label}</span>
            <span className="relative block h-3">
              <span className="absolute inset-y-0 left-1/2 w-px bg-border" />
              <span
                className="absolute inset-y-0 rounded-sm"
                style={{
                  background: value > 0 ? RED : BLUE,
                  width: `${Math.abs(value) * 100}%`,
                  left: value > 0 ? "50%" : `${50 - Math.abs(value) * 100}%`,
                  opacity: 0.85,
                }}
              />
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 font-mono text-[10px] text-muted">{study.ml.shap.note}</figcaption>
    </figure>
  );
}

export function MlSection({ study }: { study: CaseStudy }) {
  const { ml } = study;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title={ml.method.label} className="lg:col-span-2">
        <p className="mt-2 font-display text-2xl font-bold text-accent">{ml.method.value}</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ml.method.phases.map((phase, i) => (
            <li key={phase} className="rounded-lg border border-border bg-bg p-3 text-xs text-muted">
              <span className="block font-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
              {phase}
            </li>
          ))}
        </ol>
      </Card>

      <Card title={ml.model.title}>
        <p className="mt-2 leading-relaxed text-muted">{ml.model.text}</p>
        <ul className="mt-4 flex gap-8">
          {ml.model.metrics.map((metric) => (
            <li key={metric.label}>
              <p className="font-display text-4xl font-bold text-text">{metric.value}</p>
              <p className="text-xs uppercase tracking-wider text-muted">{metric.label}</p>
            </li>
          ))}
        </ul>
        <RocCurve note={ml.model.rocNote} />
      </Card>

      <div className="flex flex-col gap-4">
        <Card title={ml.split.title}>
          <p className="mt-2 leading-relaxed text-muted">{ml.split.text}</p>
          <TemporalSplit labels={ml.split.labels} />
        </Card>
        <Card title={ml.shap.title}>
          <p className="mt-2 leading-relaxed text-muted">{ml.shap.text}</p>
          <ShapBars study={study} />
        </Card>
      </div>

      <article className="rounded-2xl border border-amber-400/40 bg-amber-400/5 p-6 lg:col-span-2">
        <h3 className="flex items-center gap-3 font-display text-lg font-bold text-text">
          <AlertTriangle className="h-5 w-5 text-[#F5B942]" aria-hidden="true" />
          {ml.lesson.title}
        </h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-text">{ml.lesson.text}</p>
        <p className="mt-4 flex items-center gap-4 font-display text-3xl font-bold">
          <span className="text-muted line-through decoration-[#FF6B6B]">{ml.lesson.before}</span>
          <ArrowRight className="h-5 w-5 text-muted" aria-hidden="true" />
          <span className="text-accent">{ml.lesson.after}</span>
        </p>
      </article>
    </div>
  );
}
