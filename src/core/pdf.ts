/**
 * Dependency-free PDF export that keeps Arabic shaping / RTL exactly as the browser renders it:
 * the report DOM is drawn to a canvas through an SVG <foreignObject>, sliced into A4 pages
 * (never cutting through an element marked with class "pb"), JPEG-encoded and wrapped in a PDF.
 */

const A4_RATIO = 297 / 210;

function inlineStyles(src: Element, dst: Element) {
  if (src.nodeType !== 1) return;
  const cs = getComputedStyle(src);
  let s = '';
  for (let i = 0; i < cs.length; i++) s += `${cs[i]}:${cs.getPropertyValue(cs[i])};`;
  dst.setAttribute('style', s);
  dst.removeAttribute('class');
  const a = src.children, b = dst.children;
  for (let i = 0; i < a.length; i++) inlineStyles(a[i], b[i]);
}

async function render(el: HTMLElement, scale: number) {
  const w = Math.ceil(el.offsetWidth), h = Math.ceil(el.scrollHeight);
  const clone = el.cloneNode(true) as HTMLElement;
  inlineStyles(el, clone);
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  clone.style.margin = '0';
  const xhtml = new XMLSerializer().serializeToString(clone);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject x="0" y="0" width="${w}" height="${h}">${xhtml}</foreignObject></svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = w * scale; canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // y-ranges (css px) that must not be split across pages
  const top = el.getBoundingClientRect().top;
  const blocks = [...el.querySelectorAll('.pb')].map((n) => {
    const r = (n as HTMLElement).getBoundingClientRect();
    return [r.top - top, r.bottom - top] as [number, number];
  });
  return { canvas, w, h, blocks };
}

function pageStarts(h: number, pageH: number, blocks: [number, number][]): number[] {
  const starts = [0];
  let start = 0;
  const sorted = [...blocks].sort((a, b) => a[0] - b[0]);
  while (h - start > pageH + 1) {
    let cut = start + pageH;
    for (const [t, b] of sorted) {
      if (t < cut && b > cut && t > start + 40 && b - t < pageH) { cut = t; break; }
    }
    start = cut;
    starts.push(start);
  }
  return starts;
}

export interface PdfPage { jpeg: Uint8Array; w: number; h: number }

export async function elementToPages(el: HTMLElement, scale = 2): Promise<PdfPage[]> {
  const { canvas, w, h, blocks } = await render(el, scale);
  const pageH = w * A4_RATIO;
  const starts = pageStarts(h, pageH, blocks);
  const pages: PdfPage[] = [];
  for (let i = 0; i < starts.length; i++) {
    const pc = document.createElement('canvas');
    pc.width = Math.round(w * scale); pc.height = Math.round(pageH * scale);
    const ctx = pc.getContext('2d')!;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, pc.width, pc.height);
    const end = i + 1 < starts.length ? starts[i + 1] : h;
    ctx.drawImage(canvas, 0, starts[i] * scale, canvas.width, (end - starts[i]) * scale, 0, 0, canvas.width, (end - starts[i]) * scale);
    const blob: Blob = await new Promise((res) => pc.toBlob((b) => res(b!), 'image/jpeg', 0.92));
    pages.push({ jpeg: new Uint8Array(await blob.arrayBuffer()), w: pc.width, h: pc.height });
  }
  return pages;
}

export function pagesToPdf(pages: PdfPage[]): Blob {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let len = 0;
  const push = (b: Uint8Array | string) => {
    const u = typeof b === 'string' ? enc.encode(b) : b;
    chunks.push(u); len += u.length;
  };
  const obj = (n: number, body: string | (() => void)) => {
    offsets[n] = len;
    push(`${n} 0 obj\n`);
    if (typeof body === 'string') push(body); else body();
    push('\nendobj\n');
  };
  const W = 595.28, H = 841.89;
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, i) => `${3 + i * 3} 0 R`).join(' ')}] >>`);
  pages.forEach((p, i) => {
    const pg = 3 + i * 3, ct = pg + 1, im = pg + 2;
    obj(pg, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${im} 0 R >> >> /Contents ${ct} 0 R >>`);
    const content = `q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`;
    obj(ct, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    obj(im, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`);
      push(p.jpeg);
      push('\nendstream');
    });
  });
  const xref = len;
  const n = 3 + pages.length * 3;
  push(`xref\n0 ${n}\n0000000000 65535 f \n`);
  for (let i = 1; i < n; i++) push(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
  push(`trailer\n<< /Size ${n} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(chunks as BlobPart[], { type: 'application/pdf' });
}
