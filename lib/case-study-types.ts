/** Content of a case study page (data/case-studies/{locale}/{slug}.json). */

export interface Kpi {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
}

export interface CaseStudy {
  slug: string;
  seo: { title: string; description: string };
  header: {
    title: string;
    tagline: string;
    role: string;
    company: string;
    period: string;
    badge: string;
    kpis: Kpi[];
  };
  problem: { title: string; text: string };
  solution: {
    title: string;
    pillars: { icon: "bi" | "ml" | "web" | "ai"; title: string; text: string }[];
  };
  audiences: {
    title: string;
    cards: { id: "executive" | "security"; title: string; text: string }[];
    note: string;
  };
  features: {
    title: string;
    items: {
      id: "watch" | "tracking" | "prediction" | "cyberbot";
      icon: "radar" | "users" | "gauge" | "bot";
      title: string;
      text: string;
    }[];
  };
  bi: {
    title: string;
    model: {
      title: string;
      text: string;
      facts: string[];
      dimensions: string[];
      factsLabel: string;
      dimensionsLabel: string;
    };
    etl: { title: string; text: string; steps: string[]; refreshLabel: string };
    score: {
      title: string;
      text: string;
      totalLabel: string;
      parts: { label: string; points: number }[];
    };
    dax: { title: string; text: string; snippet: string[]; snippetNote: string; chips: string[] };
  };
  ml: {
    title: string;
    method: { label: string; value: string; phases: string[] };
    model: {
      title: string;
      text: string;
      metrics: { label: string; value: string }[];
      rocNote: string;
    };
    split: {
      title: string;
      text: string;
      labels: { features: string; target: string; years: string[] };
    };
    shap: { title: string; text: string; note: string };
    lesson: { title: string; text: string; before: string; after: string };
  };
  demo: {
    title: string;
    intro: string;
    disclaimer: string;
    inputs: {
      id: "quizzes" | "trainings" | "clicks" | "days";
      label: string;
      min: number;
      max: number;
      step: number;
      value: number;
      unit: string;
    }[];
    levels: { low: string; medium: string; high: string; critical: string };
    gaugeLabel: string;
    factorsTitle: string;
    factors: Record<"quizzes" | "trainings" | "clicks" | "days", string>;
  };
  architecture: {
    title: string;
    nodes: Record<
      "react" | "nest" | "postgres" | "flask" | "groq" | "news" | "powerbi",
      { label: string; detail: string }
    >;
    powerbiNote: string;
    methodologiesLabel: string;
    methodologies: { label: string; scope: string }[];
    stackLabel: string;
    stack: string[];
  };
  results: { title: string; items: string[] };
  learned: { title: string; items: string[] };
}
