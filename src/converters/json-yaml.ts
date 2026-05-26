import yaml from 'js-yaml';

export function jsonToYaml(input: string): string {
  const parsed = JSON.parse(input);
  return yaml.dump(parsed, { indent: 2, noRefs: true, sortKeys: false });
}

export function yamlToJson(input: string): string {
  const parsed = yaml.load(input);
  return JSON.stringify(parsed, null, 2) + '\n';
}
