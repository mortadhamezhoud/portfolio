/** Scrolls to a section by id. Instant when the user prefers reduced motion. */
export function scrollToSection(id: string, reducedMotion: boolean): void {
  document.getElementById(id)?.scrollIntoView({
    behavior: reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
