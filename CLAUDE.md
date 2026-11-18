# Portfolio de Mortadha Mazhoud
Portfolio d'un ingénieur BI, Data et Full-Stack (diplômé d'ESPRIT, Tunisie).
Il vise des recruteurs en Tunisie et à l'international (sur place, remote ou relocalisation).
Contenu du site en anglais par défaut, puis français et arabe.

## Stack
Next.js App Router, TypeScript, Tailwind CSS, React Three Fiber + Drei, Framer Motion,
next-intl (en, fr, ar), Fuse.js pour le chatbot statique. Export statique (output: "export", sans cacheComponents ni PPR), déployé sur Vercel.

## Design
- Thème sombre « data & cyber », sobre et professionnel.
- Couleurs : fond #05070D, surfaces #0E1528, bordures #1C2742, texte #E7ECF7,
  texte secondaire #8B97B3, accent #3EE6C1 (cyan), secondaire #5B8CFF (bleu).
- Polices : Space Grotesk (titres), Inter (texte), JetBrains Mono (labels, dates, tags).
- Coins arrondis 12 à 16 px, bordures fines, pas d'ombres lourdes, un seul accent fort par écran.

## Règles
- Tout le contenu vient de data/{en,fr}/*.json et messages/{en,fr}.json, jamais écrit en dur dans les composants. Toute modification de texte se fait dans les deux langues.
- Les composants 3D sont des Client Components chargés avec next/dynamic et ssr: false.
- Le texte reste en HTML, jamais en 3D.
- Mobile : moins de particules, pas de postprocessing. Respecter prefers-reduced-motion.
- Version arabe en RTL (dir="rtl", police Cairo).
- Code propre et typé, composants courts et réutilisables.
- Après chaque étape qui fonctionne : un commit Git avec un message clair.
