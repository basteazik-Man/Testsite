// Utility to find service by keywords or tags from pricelist
export default function findServiceFromText(text, pricelist) {
  const t = text.toLowerCase();
  // try exact tags
  for (const s of pricelist.services) {
    if (t.includes(s.id) || s.title && t.includes(s.title.toLowerCase())) return s;
    if (s.tags && s.tags.some(tag=> t.includes(tag))) return s;
  }
  // fallback mapping
  const mapping = {
    "экран": "screen",
    "разбит": "screen",
    "не включ": "power",
    "не заря": "battery",
    "заряд": "battery",
    "камера": "camera",
    "звук": "audio"
  };
  for (const k in mapping) if (t.includes(k)) {
    return pricelist.services.find(s=> s.id === mapping[k]) || null;
  }
  return null;
}
