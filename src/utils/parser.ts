export function BestEffortJsonParser(input: string) {
    const firstCurly = input.indexOf('{');
    const lastCurly = input.lastIndexOf('}');
    const json = input.substring(firstCurly, lastCurly + 1);
    return JSON.parse(json);
}
