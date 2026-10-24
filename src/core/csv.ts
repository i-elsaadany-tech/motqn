/** Tiny CSV/TSV helpers (UTF-8 + BOM so Excel opens Arabic correctly). */

export function toCSV(rows: (string | number)[][]): string {
  return rows
    .map((r) =>
      r
        .map((c) => {
          const s = String(c ?? '');
          return /[",\n\r;\t]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
        })
        .join(','),
    )
    .join('\r\n');
}

/** Parse pasted Excel cells (tab), or CSV (comma / semicolon). Delimiter is auto-detected. */
export function parseTable(text: string): string[][] {
  const src = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').trim();
  if (!src) return [];
  const first = src.split('\n')[0];
  const delim = first.includes('\t') ? '\t' : (first.match(/;/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQ) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === delim) { row.push(cur.trim()); cur = ''; }
    else if (ch === '\n') { row.push(cur.trim()); rows.push(row); row = []; cur = ''; }
    else cur += ch;
  }
  row.push(cur.trim());
  rows.push(row);
  return rows.filter((r) => r.some((c) => c !== ''));
}

/** Arabic-Indic digits -> ASCII, Arabic decimal separator -> '.' */
export function toNumber(raw: string): number | null {
  if (raw == null) return null;
  const s = String(raw)
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x6f0))
    .replace(/[٫,]/g, '.')
    .trim();
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
