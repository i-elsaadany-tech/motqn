/** Thin bridge to Capacitor (Android). Everything degrades gracefully on the plain web. */
interface CapPlugins {
  Filesystem?: {
    writeFile(o: { path: string; data: string; directory: string; recursive?: boolean }): Promise<{ uri: string }>;
  };
  Share?: { share(o: { title?: string; text?: string; url?: string; dialogTitle?: string }): Promise<unknown> };
}
interface CapacitorGlobal { isNativePlatform?: () => boolean; Plugins?: CapPlugins }

const cap = (): CapacitorGlobal | undefined => (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
export const isNative = () => !!cap()?.isNativePlatform?.();

function blobToBase64(b: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] || '');
    r.onerror = () => rej(r.error);
    r.readAsDataURL(b);
  });
}

/** Save/share a file: share sheet on Android, normal download on the web. */
export async function saveBlob(name: string, blob: Blob, title = name): Promise<void> {
  const p = cap()?.Plugins;
  if (isNative() && p?.Filesystem && p?.Share) {
    const data = await blobToBase64(blob);
    const { uri } = await p.Filesystem.writeFile({ path: name, data, directory: 'CACHE', recursive: true });
    await p.Share.share({ title, url: uri, dialogTitle: title });
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export const textBlob = (s: string, mime = 'text/plain') => new Blob([s], { type: mime + ';charset=utf-8' });
export const csvBlob = (s: string) => new Blob(['﻿' + s], { type: 'text/csv;charset=utf-8' });
