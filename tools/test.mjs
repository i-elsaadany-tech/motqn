import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
let esbuild;
try { esbuild = await import('esbuild'); } catch { esbuild = await import(pathToFileURL('/opt/npm-tools/node_modules/esbuild/lib/main.js').href); }
const files = readdirSync('test').filter((f) => f.endsWith('.test.ts')).map((f) => 'test/' + f);
await esbuild.build({ entryPoints: files, outdir: '.test-out', bundle: true, platform: 'node', format: 'esm', outExtension: { '.js': '.mjs' }, logLevel: 'error' });
const r = spawnSync('node', ['--test', ...readdirSync('.test-out').map((f) => '.test-out/' + f)], { stdio: 'inherit' });
process.exit(r.status ?? 1);
