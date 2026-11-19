import {
  AppWindow,
  Bot,
  BrainCircuit,
  ChartColumn,
  Crown,
  Gauge,
  Radar,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CaseStudy } from "@/lib/case-study-types";
import {
  CyberBotMock,
  ExecutiveMock,
  PredictionMock,
  SecurityMock,
  TrackingMock,
  WatchMock,
} from "../mockups/Mockups";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  bi: ChartColumn,
  ml: BrainCircuit,
  web: AppWindow,
  ai: Bot,
};

const FEATURE_ICONS: Record<string, LucideIcon> = {
  radar: Radar,
  users: Users,
  gauge: Gauge,
  bot: Bot,
};

const FEATURE_MOCKS: Record<string, React.ReactNode> = {
  watch: <WatchMock />,
  tracking: <TrackingMock />,
  prediction: <PredictionMock />,
  cyberbot: <CyberBotMock />,
};

function IconBadge({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg text-accent">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

/** 4 pillars of the solution. */
export function SolutionSection({ study }: { study: CaseStudy }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {study.solution.pillars.map((pillar) => (
        <li
          key={pillar.title}
          className="rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm"
        >
          <IconBadge Icon={PILLAR_ICONS[pillar.icon]} />
          <h3 className="mt-4 font-display text-xl font-bold text-text">{pillar.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{pillar.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Two audiences side by side, each with a small mock-up. */
export function AudiencesSection({ study }: { study: CaseStudy }) {
  const mocks = { executive: <ExecutiveMock />, security: <SecurityMock /> };
  const icons = { executive: Crown, security: ShieldCheck };
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {study.audiences.cards.map((card) => (
          <article
            key={card.id}
            className="flex flex-col gap-5 rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <IconBadge Icon={icons[card.id]} />
              <h3 className="font-display text-xl font-bold text-text">{card.title}</h3>
            </div>
            <p className="leading-relaxed text-muted">{card.text}</p>
            <div className="mt-auto">{mocks[card.id]}</div>
          </article>
        ))}
      </div>
      <p className="mt-6 max-w-3xl border-l-2 border-accent pl-4 leading-relaxed text-text">
        {study.audiences.note}
      </p>
    </>
  );
}

/** Feature grid for the IT Security team. */
export function FeaturesSection({ study }: { study: CaseStudy }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {study.features.items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <IconBadge Icon={FEATURE_ICONS[item.icon]} />
            <h3 className="font-display text-lg font-bold text-text">{item.title}</h3>
          </div>
          <p className="leading-relaxed text-muted">{item.text}</p>
          <div className="mt-auto pt-2">{FEATURE_MOCKS[item.id]}</div>
        </li>
      ))}
    </ul>
  );
}
