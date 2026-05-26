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
    return parseHex(cleaned); // fallback
  }
  if (/^\d+$/.test(cleaned) && cleaned.length <= 3) {
    return parseHex(cleaned.padStart(6, '0'));
  }
  return parseHex(cleaned.replace(/[^0-9a-fA-F]/g, ''));
}

export function convertColor(input: string, format?: string, ...args: string[]): string {
  let rgb: { r: number; g: number; b: number };

  if (format === 'hex') {
    rgb = parseHex(args[0] || input);
  } else if (format === 'rgb') {
    const r = parseInt(args[0] || input), g = parseInt(args[1]), b = parseInt(args[2]);
    rgb = parseRgb(r, g, b);
  } else if (format) {
    throw new Error(`Unknown color format: "${format}". Use "hex", "rgb", or omit for auto-detect.`);
  } else {
    rgb = autoDetect(input);
  }

  return [
    `HEX:  ${toHex(rgb.r, rgb.g, rgb.b)}`,
    `RGB:  ${toRgb(rgb.r, rgb.g, rgb.b)}`,
    `HSL:  ${toHsl(rgb.r, rgb.g, rgb.b)}`,
  ].join('\n');
}
