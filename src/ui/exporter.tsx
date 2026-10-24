import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { ReactElement } from 'react';
import { elementToPages, pagesToPdf, type PdfPage } from '../core/pdf';

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 30)));

/** Render report elements off-screen (A4 width) and bundle them into a single PDF. */
export async function reportsToPdf(items: ReactElement[], onProgress?: (done: number, total: number) => void): Promise<Blob> {
  const host = document.createElement('div');
  host.className = 'pdf-host';
  document.body.appendChild(host);
  const root = createRoot(host);
  const pages: PdfPage[] = [];
  try {
    for (let i = 0; i < items.length; i++) {
      flushSync(() => root.render(items[i]));
      await frame();
      const el = host.firstElementChild as HTMLElement;
      pages.push(...(await elementToPages(el, 2)));
      onProgress?.(i + 1, items.length);
    }
  } finally {
    root.unmount();
    host.remove();
  }
  return pagesToPdf(pages);
}
