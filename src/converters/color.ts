function parseHex(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace(/^#/, '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`Invalid hex color: "${hex}". Use format like "ff0000" or "#ff0000".`);
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function parseRgb(r: number, g: number, b: number): { r: number; g: number; b: number } {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error(`RGB values must be 0-255. Got (${r}, ${g}, ${b}).`);
  }
  return { r, g, b };
}

function parseHsl(h: number, s: number, l: number): { r: number; g: number; b: number } {
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
    throw new Error(`HSL values out of range. Got (${h}, ${s}%, ${l}%).`);
  }
  const sNorm = s / 100, lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = lNorm - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60) { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function toRgb(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

function toHsl(r: number, g: number, b: number): string {
  let rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rr: h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6; break;
      case gg: h = ((bb - rr) / d + 2) / 6; break;
      case bb: h = ((rr - gg) / d + 4) / 6; break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function autoDetect(input: string): { r: number; g: number; b: number } {
  if (!input) {
    throw new Error('No color input provided. Use formats like "ff0000", "#ff0000", "rgb(255,0,0)", or "hsl(0,100%,50%)".');
  }

  const cleaned = input.trim();

  if (/^#?[0-9a-fA-F]{3,8}$/.test(cleaned)) {
    return parseHex(cleaned);
  }

  const rgbMatch = cleaned.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return parseRgb(parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3]));
  }

  const hslMatch = cleaned.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/);
  if (hslMatch) {
    return parseHsl(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
  }

  if (/^\d{1,3}$/.test(cleaned)) {
    return parseHex(cleaned.padStart(6, '0'));
  }

  throw new Error(`Could not detect color format: "${input}". Use hex ("ff0000"), rgb ("rgb(255,0,0)"), or hsl ("hsl(0,100%,50%)").`);
}

export function convertColor(input: string, format?: string, ...args: string[]): string {
  let rgb: { r: number; g: number; b: number };

  if (format === 'hex') {
    rgb = parseHex(args[0] || input);
  } else if (format === 'rgb') {
    const r = parseInt(args[0] || input), g = parseInt(args[1]), b = parseInt(args[2]);
    rgb = parseRgb(r, g, b);
  } else if (format === 'hsl') {
    const h = parseInt(args[0] || input), s = parseInt(args[1]), l = parseInt(args[2]);
    rgb = parseHsl(h, s, l);
  } else if (format) {
    throw new Error(`Unknown color format: "${format}". Use "hex", "rgb", "hsl", or omit for auto-detect.`);
  } else {
    rgb = autoDetect(input);
  }

  return [
    `HEX:  ${toHex(rgb.r, rgb.g, rgb.b)}`,
    `RGB:  ${toRgb(rgb.r, rgb.g, rgb.b)}`,
    `HSL:  ${toHsl(rgb.r, rgb.g, rgb.b)}`,
  ].join('\n');
}
