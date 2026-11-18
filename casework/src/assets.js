// Normal web builds use relative files. A self-contained review build may supply
// the same finished assets as data URLs, without changing investigative logic.
export function asset(path) {
  return globalThis.CASEWORK_ASSETS?.[path] || path;
}
export function assetMarkup(html) {
  if (!globalThis.CASEWORK_ASSETS) return html;
  return html
    .replace(/(src|poster)="(assets\/[^\"]+)"/g, (_, attribute, path) => `${attribute}="${asset(path)}"`)
    .replace(
      /url\(['"]?(assets\/[^'"\)]+)['"]?\)/g,
      (_, path) => `url('${asset(path)}')`,
    );
}
