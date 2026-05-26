<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/anyconv- CLI converter-6C5CE7?style=for-the-badge&logo=npm">
  <img alt="anyconv" src="https://img.shields.io/badge/anyconv- CLI converter-6C5CE7?style=for-the-badge&logo=npm">
</picture>

# anyconv

**The one CLI command that replaces 50+ ad-ridden converter websites.** Convert JSON, YAML, timestamps, colors, byte sizes, number bases, and base64 — all from your terminal. No browser. No ads. No CAPTCHAs. No data leaving your machine.

```bash
# One command. Any conversion. Instantly.
npx anyconv json yaml package.json
npx anyconv ts now
npx anyconv color "#ff8800"
npx anyconv bytes 1073741824
npx anyconv number 255
npx anyconv b64 encode "hello world"
```

[![npm](https://img.shields.io/npm/v/anyconv?color=6C5CE7&label=latest)](https://www.npmjs.com/package/anyconv)
[![npm downloads](https://img.shields.io/npm/dm/anyconv?color=6C5CE7)](https://www.npmjs.com/package/anyconv)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/anyconv?color=6C5CE7)](https://bundlephobia.com/package/anyconv)
[![GitHub stars](https://img.shields.io/github/stars/amitwaks/anyconv?color=6C5CE7&style=flat)](https://github.com/amitwaks/anyconv)
[![License: MIT](https://img.shields.io/badge/license-MIT-6C5CE7)](https://opensource.org/licenses/MIT)

---

## Why anyconv?

Every developer has been here: you need to convert a Unix timestamp, figure out a byte size, or switch between JSON and YAML. So you open a browser. Search. Click past SEO spam. Dodge 14 popups. Close a "before you leave" modal. Paste your data into a sketchy website that probably sells it. Copy the result. Close 8 tabs.

There's a better way.

**anyconv is a single npm package that lives in your terminal.** It works offline. It respects your privacy. It's pipeable, scriptable, and composable with the rest of your toolchain. And it's **5.5 kB gzipped** — smaller than a single JPEG on those ad-heavy converter sites.

## Features

- **JSON ↔ YAML** — convert files or piped data instantly
- **Unix timestamps** — seconds, milliseconds, ISO 8601, locale, UTC — all at once
- **Base64 encode/decode** — without opening a sketchy website
- **Color conversion** — auto-detect hex, RGB, HSL — see all formats at once
- **Byte size converter** — decimal (KB/MB/GB) and binary (KiB/MiB/GiB) side by side
- **Number base converter** — decimal, hex, binary, octal — any input format
- **Stdin support** — pipe data through anyconv from curl, cat, or any other command
- **Offline** — zero network requests after install
- **Private** — your data never leaves your machine

## Install

```bash
npm install -g anyconv
```

Or use instantly without installing:

```bash
npx anyconv --help
```

Requires **Node.js 18+**.

## Quick start

```bash
# JSON to YAML
anyconv json yaml package.json

# YAML to JSON (pipe or file)
cat config.yaml | anyconv yaml json

# What time is 1748226460?
anyconv ts 1748226460

# What color is #ff8800?
anyconv color "#ff8800"

# How big is 1 GB in bytes?
anyconv bytes 1073741824

# What is 255 in hex?
anyconv number 255
```

## Real-world examples

### Convert an API response to YAML
```bash
curl https://api.github.com/repos/amitwaks/anyconv | anyconv json yaml
```

### Pretty-print a JSON file
```bash
anyconv yaml json config.yaml  # round-trip: YAML → formatted JSON
```

### Decode a JWT payload (without the website)
```bash
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0" | anyconv b64 decode
```

### Figure out deployment sizes
```bash
anyconv bytes $(node -e "console.log(require('fs').statSync('dist/bundle.js').size)")
anyconv bytes $(wc -c < dist/bundle.js)     # macOS/Linux
```

### Quick color palette exploration
```bash
anyconv color "#3498db"
anyconv color "rgb(52, 152, 219)"
```

## Usage reference

| Command | Description |
|---|---|
| `anyconv json yaml [file]` | Convert JSON to YAML |
| `anyconv yaml json [file]` | Convert YAML to JSON |
| `anyconv ts <timestamp\|now>` | Unix timestamp to all date formats |
| `anyconv b64 encode <string>` | Base64 encode |
| `anyconv b64 decode <string>` | Base64 decode |
| `anyconv color <value>` | Auto-detect hex/RGB — show all formats |
| `anyconv color hex <hex>` | Explicit hex input |
| `anyconv color rgb <r> <g> <b>` | Explicit RGB input |
| `anyconv color hsl <h> <s> <l>` | Explicit HSL input |
| `anyconv bytes <number>` | Byte count to all units |
| `anyconv number <value>` | Decimal to hex, binary, octal |
| `anyconv number hex <value>` | Parse as hexadecimal |
| `anyconv number bin <value>` | Parse as binary |
| `anyconv number oct <value>` | Parse as octal |
| `anyconv --help` | Show help |
| `anyconv --version` | Show version |

## Roadmap

- URL encode/decode
- Hash generators (MD5, SHA-256)
- JWT decode and inspect
- HTML entity encode/decode
- String case conversion (camelCase, snake_case, kebab-case, PascalCase)
- Cron expression parser
- CSS unit converter (px, rem, em, %)

## Why not just use a website?

| | anyconv | Converter websites |
|---|---|---|
| Works offline | ✅ Yes | ❌ No |
| Private (data stays local) | ✅ Yes | ❌ Usually not |
| Pipeable / scriptable | ✅ Yes | ❌ No |
| Ad-free | ✅ Yes | ❌ 10-30 trackers per page |
| CAPTCHA-free | ✅ Yes | ❌ "Are you human?" |
| Bundle size | 5.5 kB | 2-5 MB of ads + tracking |
| Speed | ~50ms | 2-5s (load + popups) |

## License

MIT.

---

<p align="center">
  <a href="https://github.com/sponsors/amitwaks">Sponsor</a>
  ·
  <a href="https://github.com/amitwaks/anyconv/issues">Report a bug</a>
  ·
  <a href="https://github.com/amitwaks/anyconv/discussions">Request a converter</a>
</p>
