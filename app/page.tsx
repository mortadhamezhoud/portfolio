import profile from "@/data/profile.json";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
      <p className="font-mono text-xs text-accent sm:text-sm">{profile.status}</p>
      <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-7xl lg:text-8xl">
        {profile.name}
      </h1>
      <p className="text-lg text-muted sm:text-2xl">{profile.title}</p>
      <button
        type="button"
        className="mt-4 rounded-xl bg-accent px-6 py-3 font-medium text-bg transition-opacity hover:opacity-90"
      >
        {profile.ctaLabel}
      </button>
    </main>
  );
}
