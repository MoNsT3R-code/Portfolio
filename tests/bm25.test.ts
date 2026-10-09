import { describe, expect, it } from 'vitest';
import { BM25, THRESHOLD, stem, tokenize } from '../src/lib/bm25';
import { buildPassages } from '../src/lib/searchIndex';

const index = new BM25(buildPassages());
const top = (q: string) => index.search(q).hits[0];

describe('tokenizer', () => {
  it('stems common inflections to the same root', () => {
    expect(stem('chunking')).toBe(stem('chunks'));
    expect(stem('retrieves')).toBe(stem('retrieve'));
    expect(stem('strategies')).toBe('strategy');
    expect(stem('built')).toBe(stem('build'));
    expect(stem('issues')).toBe(stem('issue'));
  });
  it('drops stop words and the owner’s name', () => {
    expect(tokenize('What has Musfira built with LangGraph?')).toEqual(['build', 'langgraph']);
  });
});

describe('retrieval', () => {
  it('never indexes placeholders', () => {
    expect(buildPassages().some((p) => p.text.includes('[TODO'))).toBe(false);
  });

  const grounded: [string, RegExp][] = [
    ['What has Musfira built with LangGraph?', /BreachMirror/],
    ['Which chunking strategy is the baseline?', /Chunking|Field note · Chunking/],
    ['What security labs has she done?', /Web security|Security and community|Cyber security labs|PortSwigger/],
    ['Who was on the openness report team?', /Openness|Recognition/],
    ['How did the token optimizer results change?', /Claude Code skills/],
    ['Where does she study?', /About|Forman/],
    ['What is A2UI?', /Agentic UI/],
    ['How is sensitive data handled?', /BreachMirror|How I work/],
  ];
  for (const [q, source] of grounded) {
    it(`answers: ${q}`, () => {
      const hit = top(q);
      expect(hit, q).toBeDefined();
      expect(hit.score, `${q} -> ${hit.passage.source} ${hit.score.toFixed(2)}`).toBeGreaterThanOrEqual(THRESHOLD);
      expect(hit.passage.source).toMatch(source);
    });
  }

  const ungrounded = ['Does Musfira have a favourite film?', 'What is her salary?', 'weather in Lahore tomorrow', 'pizza'];
  for (const q of ungrounded) {
    it(`abstains: ${q}`, () => {
      const hit = top(q);
      expect(!hit || hit.score < THRESHOLD, `${q} -> ${hit?.passage.source} ${hit?.score.toFixed(2)}`).toBe(true);
    });
  }
});
