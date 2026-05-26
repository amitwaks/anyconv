export function convertTimestamp(input: string): string {
  if (input === 'now') {
    return `${Date.now()}\n${new Date().toISOString()}`;
  }

  const num = Number(input);
  if (isNaN(num)) {
    throw new Error(`Invalid timestamp: "${input}". Provide a Unix timestamp in seconds or milliseconds, or "now".`);
  }

  const isSeconds = num < 1e12;
  const date = new Date(isSeconds ? num * 1000 : num);
  if (isNaN(date.getTime())) {
    throw new Error(`Could not parse "${input}" as a valid date.`);
  }

  const results: string[] = [
    `Unix (seconds):  ${Math.floor(date.getTime() / 1000)}`,
    `Unix (ms):       ${date.getTime()}`,
    `ISO 8601:        ${date.toISOString()}`,
    `Locale string:   ${date.toLocaleString()}`,
    `UTC string:      ${date.toUTCString()}`,
  ];

  if (isSeconds) {
    results.unshift(`Input detected:  seconds (value < 1e12)`);
  } else {
    results.unshift(`Input detected:  milliseconds (value >= 1e12)`);
  }

  return results.join('\n');
}
