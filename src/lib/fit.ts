import type { CSSProperties } from 'react';

/** Advance widths of the display face (Syne 800, with its letter-spacing) in em, measured in Chrome. */
const EM: Record<string, number> = {"0":1.03,"1":0.49,"2":0.97,"3":1.02,"4":1.06,"5":0.98,"6":1.1,"7":1.12,"8":1.05,"9":1.12,"a":1.03,"b":1.06,"c":0.96,"d":1.06,"e":0.96,"f":0.64,"g":0.93,"h":0.97,"i":0.33,"j":0.33,"k":0.91,"l":0.33,"m":1.62,"n":0.96,"o":0.98,"p":1.03,"q":1.06,"r":0.53,"s":0.81,"t":0.59,"u":0.96,"v":0.88,"w":1.43,"x":0.95,"y":0.9,"z":0.86,"A":1.13,"B":1.11,"C":1.28,"D":1.27,"E":1.11,"F":1.09,"G":1.31,"H":1.25,"I":0.39,"J":0.97,"K":1.18,"L":0.91,"M":1.55,"N":1.27,"O":1.3,"P":1.14,"Q":1.3,"R":1.2,"S":1.02,"T":1.07,"U":1.25,"V":1.13,"W":1.85,"X":1.11,"Y":1.04,"Z":1.17,"-":0.56,"’":0.27,"'":0.27,"?":0.83,".":0.32,",":0.27,"&":1.19,":":0.32,"+":0.75,"/":0.59,"(":0.37,")":0.37};

/** Width of the longest word of `text` in em, so a heading can be capped before that word has to break. */
export function longestWordEm(text: string) {
  return Math.max(...text.split(/\s+/).map((w) => [...w].reduce((sum, c) => sum + (EM[c] ?? 1.1), 0)));
}

/**
 * Style for a `.fit` heading: `size` is its normal font-size, and the heading shrinks below that
 * only when its longest word would otherwise be wider than the content column.
 * `extra` is anything else on the same line, in em (e.g. a trailing arrow).
 */
export function fitStyle(text: string, size: string, extra = 0): CSSProperties {
  return { '--fs': size, '--fit': ((longestWordEm(text) + extra) * 1.06).toFixed(2) } as CSSProperties;
}
