// Lists every [TODO: ...] placeholder left in the content, with its line number.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(import.meta.dirname, '../src/content/portfolio.ts');
const lines = readFileSync(file, 'utf8').split('\n');
let count = 0;
lines.forEach((line, i) => {
  for (const m of line.matchAll(/\[TODO:[^\]]*\]/g)) {
    count++;
    console.log(`src/content/portfolio.ts:${i + 1}  ${m[0]}`);
  }
});
console.log(`\n${count} placeholder${count === 1 ? '' : 's'} left.`);
