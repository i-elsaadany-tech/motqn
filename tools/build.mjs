// Builds the web app into ./dist (works with esbuild installed from npm, or the one found on this machine).
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

async function loadEsbuild() {
  try { return await import('esbuild'); } catch { /* fall back to a machine-wide install */ }
  for (const p of ['/opt/npm-tools/node_modules/esbuild/lib/main.js', '/opt/node-tools/node_modules/esbuild/lib/main.js']) {
    if (existsSync(p)) return import(pathToFileURL(p).href);
  }
  throw new Error('esbuild not found: run "npm install" first');
}
const esbuild = await loadEsbuild();

const nodePaths = ['/home/claude/.npm-global/lib/node_modules', '/opt/node22/lib/node_modules'].filter(existsSync);
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const version = pkg.version;

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await esbuild.build({
  entryPoints: [join(root, 'src/main.tsx')],
  outdir: dist,
  entryNames: 'app',
  bundle: true,
  minify: true,
  sourcemap: false,
  target: ['chrome90', 'safari15'],
  format: 'iife',
  jsx: 'automatic',
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"' },
  nodePaths,
  legalComments: 'none',
  logLevel: 'info',
});

await cp(join(root, 'public/static'), dist, { recursive: true });
let html = await readFile(join(root, 'public/index.html'), 'utf8');
html = html.replaceAll('__V__', version);
await writeFile(join(dist, 'index.html'), html);
let sw = await readFile(join(dist, 'sw.js'), 'utf8');
await writeFile(join(dist, 'sw.js'), sw.replaceAll('__V__', version + '-' + Date.now().toString(36)));
console.log('built dist/ v' + version);
