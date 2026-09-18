const ALLOWED_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:']);

export function isAllowedPublicUrl(value: string): boolean {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  try {
    const url = new URL(trimmed);
    return ALLOWED_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
