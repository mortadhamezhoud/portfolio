import { existsSync } from "node:fs";
import { join } from "node:path";
import { CV_URL } from "./cv";

/** Server only (build time): true when the CV PDF has been added to public/cv/. */
export function cvExists(): boolean {
  return existsSync(join(process.cwd(), "public", CV_URL));
}
