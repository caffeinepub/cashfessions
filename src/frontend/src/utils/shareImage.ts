import type { Confession } from "@/types";
import html2canvas from "html2canvas";

export interface ShareImageOptions {
  confession: Confession;
}

/**
 * Renders the hidden ShareCardCanvas element to a PNG data URL.
 * The element must be mounted in the DOM before calling this function.
 */
export async function generateConfessionImage(
  elementId: string,
): Promise<string> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error("Share card element not found in DOM");

  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    scale: 2, // retina quality
    logging: false,
    width: el.offsetWidth,
    height: el.offsetHeight,
  });

  return canvas.toDataURL("image/png");
}

/**
 * Triggers a browser download of the generated card image.
 */
export function downloadImage(
  dataUrl: string,
  filename = "gothicgarden-confession.png",
): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Builds the text shown alongside image shares on social platforms.
 * Includes a snippet of the confession text and top tags when available.
 */
export function buildSocialCaption(
  url: string,
  confession?: Pick<Confession, "text" | "tags">,
): string {
  if (!confession) {
    return `A confession from the gothicgarden community 🌿\n\nWhere investors heal together. #gothicgarden\n${url}`;
  }

  const snippet =
    confession.text.length > 120
      ? `"${confession.text.slice(0, 120)}…"`
      : `"${confession.text}"`;

  const topTags = confession.tags
    .slice(0, 2)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");

  const tagLine = topTags ? `${topTags} ` : "";

  return `${snippet}\n\n${tagLine}#gothicgarden — Where investors heal together.\n${url}`;
}

/**
 * Formats confession text for display on the share card.
 * Full text up to 500 chars, truncated to 300 if longer.
 */
export function formatShareText(text: string): string {
  if (text.length <= 500) return text;
  return `${text.slice(0, 300)}…`;
}
