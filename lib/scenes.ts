// No three.js import here: safe to use from server components.

/** Shape indices, in the order used by the shader. */
export const SHAPE = { globe: 0, bars: 1, neural: 2, web: 3, news: 4 } as const;

/** Scene names used in data/projects.json ("scene") -> shape index. */
export const SCENE_SHAPE: Record<string, number> = {
  globe: SHAPE.globe,
  bars: SHAPE.bars,
  "neural-shield": SHAPE.neural,
  fullstack: SHAPE.web,
  "news-feed": SHAPE.news,
};

/** Height of the scrolling text area of a news window (must match the shader). */
export const NEWS_SCROLL_HEIGHT = 0.8;
