import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { jsonToYaml, yamlToJson } from './converters/json-yaml.js';
import { convertTimestamp } from './converters/timestamp.js';
import { base64Encode, base64Decode } from './converters/base64.js';
import { convertColor } from './converters/color.js';
import { convertBytes } from './converters/bytes.js';
import { convertNumber } from './converters/number.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const VERSION = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8')).version;

const HELP = `anyconv — Convert anything from the command line

Usage:
  anyconv <command> [args...]
  anyconv <from> <to> [file | < input]

Commands:
  Convert between formats:
    anyconv json yaml [file]       Convert JSON to YAML
    anyconv yaml json [file]       Convert YAML to JSON

  Developer utilities:
    anyconv ts <timestamp|now>     Convert Unix timestamp to dates
    anyconv b64 encode <string>    Base64 encode
    anyconv b64 decode <string>    Base64 decode

  Colors:
    anyconv color <color>          Auto-detect and show all formats
    anyconv color hex <hex>        Convert hex to RGB/HSL
    anyconv color rgb <r> <g> <b>  Convert RGB to hex/HSL
    anyconv color hsl <h> <s> <l>  Convert HSL to hex/RGB

  File sizes:
    anyconv bytes <number>         Convert bytes to all units

  Number bases:
    anyconv number <value>         Show decimal/hex/bin/oct
    anyconv number hex <value>     Parse as hexadecimal
    anyconv number bin <value>     Parse as binary
    anyconv number oct <value>     Parse as octal

Examples:
  anyconv json yaml package.json
  anyconv ts 1748226460
  anyconv b64 encode "hello world"
  anyconv color ff0000
  anyconv bytes 1048576
  anyconv number 255
  echo '{"a":1}' | anyconv json yaml
`;

export function run(argv: string[]): void {
  try {
    if (argv.length === 0) {
      console.log(HELP);
      return;
    }

    const [cmd, sub, ...rest] = argv;

    switch (cmd) {
      case 'json': {
        const input = rest.length > 0 ? readFile(rest[0]) : readStdin();
        if (!input.trim()) throw new Error('No input provided. Pipe JSON data or pass a file path.');
        console.log(jsonToYaml(input));
        break;
      }
      case 'yaml': {
        const input = rest.length > 0 ? readFile(rest[0]) : readStdin();
        if (!input.trim()) throw new Error('No input provided. Pipe YAML data or pass a file path.');
        console.log(yamlToJson(input));
        break;
      }
      case 'ts':
      case 'timestamp': {
        const input = rest[0] || sub || 'now';
        console.log(convertTimestamp(input));
        break;
      }
      case 'b64':
      case 'base64': {
        handleBase64(sub, rest);
        break;
      }
      case 'color': {
        const formatHints = new Set(['hex', 'rgb', 'hsl']);
        if (sub && formatHints.has(sub)) {
          console.log(convertColor('', sub, ...rest));
        } else {
          console.log(convertColor(sub || rest.join(' ')));
        }
        break;
      }
      case 'bytes':
      case 'byte': {
        const input = rest[0] || sub;
        if (!input) throw new Error('Provide a byte count.');
        console.log(convertBytes(input));
        break;
      }
      case 'number':
      case 'num': {
        const baseHints = new Set(['hex', 'bin', 'oct']);
        if (sub && baseHints.has(sub)) {
          console.log(convertNumber(rest[0] || '', sub));
        } else {
          console.log(convertNumber(sub || rest[0] || ''));
        }
        break;
      }
      case '--help':
      case '-h':
      case 'help': {
        console.log(HELP);
        break;
      }
      case '--version':
      case '-v':
      case 'version': {
        console.log(`anyconv v${VERSION}`);
        break;
      }
      default: {
        console.error(`Unknown command: "${cmd}"\n`);
        console.log(HELP);
        process.exit(1);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

function handleBase64(sub: string, rest: string[]): void {
  if (sub === 'encode' || sub === 'e') {
    const input = rest.join(' ');
    if (!input) throw new Error('Provide a string to encode.');
    console.log(base64Encode(input));
  } else if (sub === 'decode' || sub === 'd') {
    const input = rest.join(' ');
    if (!input) throw new Error('Provide a string to decode.');
    console.log(base64Decode(input));
  } else {
    throw new Error('Usage: anyconv b64 encode|decode <string>');
  }
}

function readFile(filePath: string): string {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    throw new Error(`Could not read file: "${filePath}"`);
  }
}

function readStdin(): string {
  try {
    const buffer = readFileSync(process.stdin.fd, { encoding: 'utf-8' });
    return buffer;
  } catch {
    throw new Error('No input provided. Pipe data or pass a file path.');
  }
}
