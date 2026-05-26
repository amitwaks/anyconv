export function convertNumber(input: string, fromBase?: string): string {
  let num: number;

  const cleaned = input.trim().toLowerCase();

  if (fromBase === 'hex' || cleaned.startsWith('0x')) {
    num = parseInt(cleaned.replace(/^0x/, ''), 16);
  } else if (fromBase === 'bin' || cleaned.startsWith('0b')) {
    num = parseInt(cleaned.replace(/^0b/, ''), 2);
  } else if (fromBase === 'oct' || cleaned.startsWith('0o')) {
    num = parseInt(cleaned.replace(/^0o/, ''), 8);
  } else {
    num = parseInt(cleaned, 10);
  }

  if (isNaN(num)) {
    throw new Error(`Invalid number: "${input}".`);
  }

  return [
    `Decimal:     ${num.toLocaleString()}`,
    `Hexadecimal: 0x${num.toString(16).toUpperCase()}`,
    `Binary:      0b${num.toString(2)}`,
    `Octal:       0o${num.toString(8)}`,
  ].join('\n');
}
