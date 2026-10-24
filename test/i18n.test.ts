import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { STRINGS } from '../src/i18n/strings';

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const src = walk('src').filter((f) => /\.tsx?$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
const keys = new Set<string>();
for (const m of src.matchAll(/\b(?:t|L|tl)\((?:lang, |curLang\(\), )?'([a-z_A-Z0-9]+)'/g)) keys.add(m[1]);
['mode_M', 'mode_C', 'mode_M_desc', 'mode_C_desc', 'st_mastered', 'st_developing', 'st_non', 'tab_results', 'tab_setup', 'tab_scores', 'start_nav'].forEach((k) => keys.add(k));
keys.delete('st_');
const missing: string[] = [];
for (const k of keys) for (const l of ['ar', 'en'] as const) if (!STRINGS[l][k]) missing.push(`${l}:${k}`);
assert.deepEqual(missing, [], 'missing translations: ' + missing.join(', '));
assert.deepEqual(Object.keys(STRINGS.ar).sort(), Object.keys(STRINGS.en).sort(), 'ar/en key sets differ');
console.log('i18n ok,', keys.size, 'keys used');
