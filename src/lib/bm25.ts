// BM25 (Okapi) over short passages, in the browser. No model, no network.

export interface Passage {
  id: string;
  source: string;
  href: string;
  text: string;
}

export interface Hit {
  passage: Passage;
  score: number;
  matched: string[];
}

const STOP = new Set(
  (
    'a an and are as at be been but by can could did do does doing done for from had has have having he her hers him his how i if in ' +
    'into is it its just me my of on or our she so than that the their them then there these they this those to too us was we were ' +
    'what when where which who whom why will with would you your about any all also more most much some such tell show give list ' +
    'musfira sehar musfiras someone anything something know work works worked'
  ).split(' '),
);

const IRREGULAR: Record<string, string> = { built: 'build', ran: 'run', wrote: 'write', written: 'write', taught: 'teach' };

export function stem(word: string): string {
  let w = IRREGULAR[word] ?? word;
  if (w.length > 4) {
    if (w.endsWith('ies')) w = w.slice(0, -3) + 'y';
    else if (/(ss|x|z|ch|sh)es$/.test(w)) w = w.slice(0, -2);
    else if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3);
    else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2);
    else if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && !w.endsWith('is')) w = w.slice(0, -1);
    if (/([b-df-hj-np-tv-z])\1$/.test(w) && !/(ll|ss|zz)$/.test(w)) w = w.slice(0, -1);
    if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
  }
  return w;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]s\b/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

export class BM25 {
  private readonly docs: string[][];
  private readonly df = new Map<string, number>();
  private readonly avgdl: number;

  constructor(
    readonly passages: Passage[],
    private readonly k1 = 1.2,
    private readonly b = 0.75,
  ) {
    this.docs = passages.map((p) => tokenize(p.source + ' ' + p.text));
    for (const doc of this.docs) for (const t of new Set(doc)) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    this.avgdl = this.docs.reduce((n, d) => n + d.length, 0) / Math.max(1, this.docs.length);
  }

  /** True when the term appears anywhere in the index. */
  knows(term: string): boolean {
    return this.df.has(term);
  }

  idf(term: string): number {
    const n = this.docs.length;
    const df = this.df.get(term) ?? 0;
    return Math.log(1 + (n - df + 0.5) / (df + 0.5));
  }

  search(query: string, limit = 5): { terms: string[]; hits: Hit[] } {
    const terms = [...new Set(tokenize(query))];
    const hits: Hit[] = [];
    this.docs.forEach((doc, i) => {
      let score = 0;
      const matched: string[] = [];
      for (const t of terms) {
        let tf = 0;
        for (const w of doc) if (w === t) tf++;
        if (!tf) continue;
        matched.push(t);
        score += this.idf(t) * ((tf * (this.k1 + 1)) / (tf + this.k1 * (1 - this.b + (this.b * doc.length) / this.avgdl)));
      }
      if (score > 0) hits.push({ passage: this.passages[i], score, matched });
    });
    hits.sort((a, b) => b.score - a.score);
    return { terms, hits: hits.slice(0, limit) };
  }
}

/** Below this score the assistant abstains instead of quoting a weak match. Tuned in tests/bm25.test.ts. */
export const THRESHOLD = 2.5;
