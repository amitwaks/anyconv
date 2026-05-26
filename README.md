# anyconv

Convert anything from the command line. Replace 50+ ad-ridden converter websites with one CLI command.

```bash
npx anyconv json yaml package.json
npx anyconv ts 1748226460
npx anyconv color ff0000
npx anyconv bytes 1048576
```

## Install

```bash
npm install -g anyconv
# or run without installing:
npx anyconv --help
```

## Usage

```
anyconv json yaml [file]       Convert JSON to YAML
anyconv yaml json [file]       Convert YAML to JSON
anyconv ts <timestamp|now>     Convert Unix timestamp to human date
anyconv b64 encode <string>    Base64 encode
anyconv b64 decode <string>    Base64 decode
anyconv color <color>          Auto-detect color format (hex, rgb)
anyconv bytes <number>         Convert bytes to KB, MB, GB
anyconv number <value>         Convert between number bases
```

## Examples

### JSON ↔ YAML
```bash
echo '{"name":"anyconv","version":1}' | anyconv json yaml
anyconv json yaml package.json     # from file
anyconv yaml json package.yaml     # YAML to JSON
```

### Timestamps
```bash
anyconv ts 1748226460              # Unix seconds → all formats
anyconv ts now                     # current time
```

### Colors
```bash
anyconv color ff0000               # auto-detect → hex, rgb, hsl
anyconv color rgb 100 200 50       # explicit RGB input
```

### File sizes
```bash
anyconv bytes 1048576              # 1.0 MB
anyconv bytes 1073741824            # 1.0 GiB
```

### Number bases
```bash
anyconv number 255                 # → hex 0xFF, bin 0b11111111, oct 0o377
anyconv number hex ff              # parse as hex
anyconv number bin 1010            # parse as binary
```

## License

MIT
