const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

export function convertBytes(input: string): string {
  const num = Number(input);
  if (isNaN(num) || num < 0) {
    throw new Error(`Invalid byte value: "${input}". Provide a positive number.`);
  }

  const results: string[] = [];

  if (num >= 0) {
    results.push(`Bytes:           ${num.toLocaleString()} B`);
    results.push(`Kilobytes (1000): ${(num / 1e3).toFixed(2)} KB`);
    results.push(`Kibibytes (1024): ${(num / 1024).toFixed(2)} KiB`);
    results.push(`Megabytes (1000): ${(num / 1e6).toFixed(2)} MB`);
    results.push(`Mebibytes (1024): ${(num / 1024 / 1024).toFixed(2)} MiB`);
    results.push(`Gigabytes (1000): ${(num / 1e9).toFixed(2)} GB`);
    results.push(`Gibibytes (1024): ${(num / 1024 / 1024 / 1024).toFixed(2)} GiB`);

    let n = num;
    let unitIdx = 0;
    while (n >= 1024 && unitIdx < UNITS.length - 1) {
      n /= 1024;
      unitIdx++;
    }
    results.push(`\nHuman readable: ${n.toFixed(1)} ${UNITS[unitIdx]}`);
  }

  return results.join('\n');
}
