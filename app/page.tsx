import Hero from "@/components/hero/Hero";
import messages from "@/messages/en.json";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Temporary placeholder sections so the hero buttons have a target */}
      <section id="projects" className="flex min-h-screen items-center justify-center px-6">
        <h2 className="font-display text-4xl text-text">{messages.sections.projects}</h2>
      </section>
      <section id="contact" className="flex min-h-screen items-center justify-center px-6">
        <h2 className="font-display text-4xl text-text">{messages.sections.contact}</h2>
      </section>
    </>
  );
}
