import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { jsonToYaml, yamlToJson } from './converters/json-yaml.js';
import { convertTimestamp } from './converters/timestamp.js';
import { base64Encode, base64Decode } from './converters/base64.js';
import { convertColor } from './converters/color.js';
import { convertBytes } from './converters/bytes.js';
import { convertNumber } from './converters/number.js';

describe('json-yaml', () => {
  it('converts JSON to YAML', () => {
    const result = jsonToYaml('{"name":"test","version":1}');
    assert(result.includes('name: test'));
    assert(result.includes('version: 1'));
  });

  it('handles empty object', () => {
    assert.equal(jsonToYaml('{}'), '{}\n');
  });

  it('handles nested objects', () => {
    const result = jsonToYaml('{"a":{"b":{"c":1}}}');
    assert(result.includes('c: 1'));
  });

  it('handles arrays', () => {
    const result = jsonToYaml('[1,2,3]');
    assert(result.includes('- 1'));
    assert(result.includes('- 2'));
    assert(result.includes('- 3'));
  });

  it('handles null', () => {
    const result = jsonToYaml('{"a":null}');
    assert(result.includes('a: null') || result.includes('a:'));
  });

  it('handles boolean', () => {
    const result = jsonToYaml('{"a":true,"b":false}');
    assert(result.includes('a: true'));
    assert(result.includes('b: false'));
  });

  it('throws on invalid JSON', () => {
    assert.throws(() => jsonToYaml('not json'));
  });

  it('converts YAML to JSON', () => {
    const result = yamlToJson('name: test\nversion: 1\n');
    assert(result.includes('"name"'));
    assert(result.includes('"test"'));
  });

  it('round-trips JSON->YAML->JSON', () => {
    const original = '{"name":"test","arr":[1,2,3],"nested":{"a":1}}';
    const yaml = jsonToYaml(original);
    const json = yamlToJson(yaml);
    assert.equal(JSON.parse(json).name, 'test');
  });

  it('handles YAML with inline comments', () => {
    const result = yamlToJson('# this is a comment\nname: test\n');
    assert(result.includes('"test"'));
  });

  it('handles special characters in strings', () => {
    const result = jsonToYaml('{"msg":"hello\\nworld"}');
    assert(result.includes('hello'));
  });
});

describe('timestamp', () => {
  it('converts "now" to current time', () => {
    const result = convertTimestamp('now');
    assert(result.includes('Unix (seconds)'));
    assert(result.includes('ISO 8601'));
    assert(result.includes('Unix (ms)'));
  });

  it('converts Unix seconds', () => {
    const result = convertTimestamp('1748226460');
    assert(result.includes('2025'));
    assert(result.includes('seconds (value < 1e12)'));
  });

  it('converts Unix milliseconds', () => {
    const result = convertTimestamp('1748226460000');
    assert(result.includes('milliseconds (value >= 1e12)'));
  });

  it('handles zero timestamp', () => {
    const result = convertTimestamp('1');
    assert(result.includes('1970'));
  });

  it('handles string number input', () => {
    const result = convertTimestamp('1000000000');
    assert(result.includes('2001'));
  });

  it('handles future timestamp', () => {
    const result = convertTimestamp('2524608000');
    assert(result.includes('2049') || result.includes('2050'));
  });

  it('throws on invalid input', () => {
    assert.throws(() => convertTimestamp('abc'));
  });

  it('throws on empty input', () => {
    assert.throws(() => convertTimestamp(''));
  });

  it('throws on whitespace input', () => {
    assert.throws(() => convertTimestamp('   '));
  });
});

describe('base64', () => {
  it('encodes a string', () => {
    assert.equal(base64Encode('hello world'), 'aGVsbG8gd29ybGQ=');
  });

  it('decodes a base64 string', () => {
    assert.equal(base64Decode('aGVsbG8gd29ybGQ='), 'hello world');
  });

  it('handles empty string', () => {
    assert.equal(base64Encode(''), '');
    assert.equal(base64Decode(''), '');
  });

  it('handles unicode characters', () => {
    const encoded = base64Encode('héllo wörld');
    assert.equal(base64Decode(encoded), 'héllo wörld');
  });

  it('handles special characters', () => {
    const encoded = base64Encode('!@#$%^&*()');
    assert.equal(base64Decode(encoded), '!@#$%^&*()');
  });

  it('handles long strings', () => {
    const long = 'a'.repeat(10000);
    assert.equal(base64Decode(base64Encode(long)), long);
  });

  it('silently handles invalid base64 characters (Node.js Buffer behavior)', () => {
    const result = base64Decode('!!!invalid!!!');
    assert.equal(typeof result, 'string');
  });
});

describe('color', () => {
  it('converts hex without #', () => {
    const result = convertColor('ff0000');
    assert(result.includes('#ff0000'));
    assert(result.includes('rgb(255, 0, 0)'));
  });

  it('converts hex with #', () => {
    const result = convertColor('#ff0000');
    assert(result.includes('#ff0000'));
  });

  it('converts short hex (3-digit)', () => {
    const result = convertColor('#fff');
    assert(result.includes('#ffffff'));
  });

  it('converts explicit hex format', () => {
    const result = convertColor('', 'hex', '00ff00');
    assert(result.includes('#00ff00'));
    assert(result.includes('rgb(0, 255, 0)'));
  });

  it('converts explicit RGB format', () => {
    const result = convertColor('', 'rgb', '100', '200', '50');
    assert(result.includes('#64c832'));
  });

  it('auto-detects rgb() format', () => {
    const result = convertColor('rgb(255, 0, 0)');
    assert(result.includes('#ff0000'));
  });

  it('auto-detects uppercase hex', () => {
    const result = convertColor('FF8800');
    assert(result.includes('#ff8800'));
  });

  it('handles color hex without prefix', () => {
    const result = convertColor('3498db');
    assert(result.includes('#3498db'));
  });

  it('throws on invalid hex', () => {
    assert.throws(() => convertColor('xyzxyz'));
  });

  it('throws on out-of-range RGB', () => {
    assert.throws(() => convertColor('', 'rgb', '999', '0', '0'));
  });

  it('throws on unknown format', () => {
    assert.throws(() => convertColor('', 'unknown', 'val'));
  });

  it('throws on empty input', () => {
    assert.throws(() => convertColor(''));
  });

  it('auto-detects hsl() format', () => {
    const result = convertColor('hsl(0, 100%, 50%)');
    assert(result.includes('#ff0000'));
    assert(result.includes('hsl(0, 100%, 50%)'));
  });

  it('converts explicit HSL format', () => {
    const result = convertColor('', 'hsl', '120', '100', '50');
    assert(result.includes('#00ff00'));
  });

  it('handles single hex digit', () => {
    const result = convertColor('0');
    assert(result.includes('#000000'));
  });

  it('handles 3-digit hex', () => {
    const result = convertColor('abc');
    assert(result.includes('#aabbcc'));
  });
});

describe('color - hsl', () => {
  it('converts hsl(0, 100%, 50%) to red', () => {
    const result = convertColor('', 'hsl', '0', '100', '50');
    assert(result.includes('#ff0000'));
  });

  it('converts hsl(120, 100%, 50%) to green', () => {
    const result = convertColor('', 'hsl', '120', '100', '50');
    assert(result.includes('#00ff00'));
  });

  it('converts hsl(240, 100%, 50%) to blue', () => {
    const result = convertColor('', 'hsl', '240', '100', '50');
    assert(result.includes('#0000ff'));
  });

  it('converts hsl(0, 0%, 0%) to black', () => {
    const result = convertColor('', 'hsl', '0', '0', '0');
    assert(result.includes('#000000'));
  });

  it('converts hsl(0, 0%, 100%) to white', () => {
    const result = convertColor('', 'hsl', '0', '0', '100');
    assert(result.includes('#ffffff'));
  });

  it('throws on out of range HSL hue', () => {
    assert.throws(() => convertColor('', 'hsl', '400', '50', '50'));
  });

  it('throws on out of range HSL saturation', () => {
    assert.throws(() => convertColor('', 'hsl', '0', '150', '50'));
  });
});

describe('bytes', () => {
  it('converts bytes to human-readable', () => {
    const result = convertBytes('1048576');
    assert(result.includes('1,048,576'));
    assert(result.includes('Mebibytes'));
    assert(result.includes('1.00 MiB'));
  });

  it('handles zero', () => {
    const result = convertBytes('0');
    assert(result.includes('0 B'));
  });

  it('handles one byte', () => {
    const result = convertBytes('1');
    assert(result.includes('1 B'));
  });

  it('handles gigabytes', () => {
    const result = convertBytes('1073741824');
    assert(result.includes('1.00 GiB'));
    assert(result.includes('1.07 GB'));
  });

  it('handles terabytes', () => {
    const result = convertBytes('1099511627776');
    assert(result.includes('TiB') || result.includes('TB'));
  });

  it('throws on negative numbers', () => {
    assert.throws(() => convertBytes('-1'));
  });

  it('throws on non-numeric input', () => {
    assert.throws(() => convertBytes('abc'));
  });
});

describe('timestamp - edge cases', () => {
  it('handles float timestamp', () => {
    const result = convertTimestamp('1748226460.5');
    assert(result.includes('2025'));
  });

  it('treats "0" as epoch', () => {
    const result = convertTimestamp('0');
    assert(result.includes('1970'));
  });
});

describe('number', () => {
  it('converts decimal to all bases', () => {
    const result = convertNumber('255');
    assert(result.includes('0xFF'));
    assert(result.includes('0b11111111'));
    assert(result.includes('0o377'));
  });

  it('handles zero', () => {
    const result = convertNumber('0');
    assert(result.includes('0x0'));
  });

  it('handles hex input with 0x prefix', () => {
    const result = convertNumber('0xFF');
    assert(result.includes('Decimal:'));
    assert(result.includes('255'));
  });

  it('handles binary input with 0b prefix', () => {
    const result = convertNumber('0b1010');
    assert(result.includes('10'));
  });

  it('handles explicit hex base', () => {
    const result = convertNumber('ff', 'hex');
    assert(result.includes('255'));
  });

  it('handles explicit binary base', () => {
    const result = convertNumber('1010', 'bin');
    assert(result.includes('10'));
  });

  it('handles explicit octal base', () => {
    const result = convertNumber('377', 'oct');
    assert(result.includes('255'));
  });

  it('handles 1-digit input', () => {
    const result = convertNumber('1');
    assert(result.includes('0x1'));
  });

  it('handles large numbers', () => {
    const result = convertNumber('123456789');
    assert(result.includes('0x75BCD15'));
  });

  it('throws on invalid input', () => {
    assert.throws(() => convertNumber('abc'));
  });

  it('throws on empty input', () => {
    assert.throws(() => convertNumber(''));
  });
});
