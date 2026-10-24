import { useEffect, useState, type ReactNode } from 'react';
import type { Lang, Status } from '../core/types';
import { tl } from '../i18n/strings';
import { getDB } from '../store';

export const curLang = (): Lang => getDB().settings.lang;
export const t = (key: string, vars?: Record<string, string | number>) => tl(curLang(), key, vars);

/* -------------------------------------------------------------------- icons */
const P: Record<string, string> = {
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  users: 'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM3 21c0-4 4-6 9-6s9 2 9 6',
  book: 'M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h12',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 1-2-1-.5-2.2h-4L9 8 7 9 5 8 3 12l2 1v2l-2 1 2 4 2-1 2 1 .5 2.2h4L15 20l2-1 2 1 2-4-2-1z',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  edit: 'M4 20h4L20 8l-4-4L4 16zM14 6l4 4',
  download: 'M12 4v11m0 0l-4-4m4 4l4-4M5 20h14',
  upload: 'M12 16V5m0 0L8 9m4-4l4 4M5 20h14',
  print: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z',
  share: 'M12 3v12m0-12L8 7m4-4l4 4M5 12v8h14v-8',
  check: 'M5 13l4 4L19 7',
  x: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',
  copy: 'M9 9h11v11H9zM5 15V4h11',
  chart: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4',
  back: 'M15 5l-7 7 7 7',
  tag: 'M3 12V4h8l10 10-8 8zM7.5 8.5h.01',
  alert: 'M12 4l10 17H2zM12 10v5M12 18h.01',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5h.01',
};
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] || P.info} />
    </svg>
  );
}

/* ------------------------------------------------------------------ widgets */
type BtnProps = {
  kind?: 'primary' | 'ghost' | 'danger' | 'soft'; icon?: string; small?: boolean; children?: ReactNode;
  onClick?: () => void; disabled?: boolean; title?: string; type?: 'button' | 'submit'; className?: string;
};
export function Btn({ kind = 'ghost', icon, small, children, className = '', ...r }: BtnProps) {
  return (
    <button type="button" className={`btn ${kind} ${small ? 'sm' : ''} ${className}`} {...r}>
      {icon && <Icon name={icon} size={small ? 16 : 18} />}
      {children && <span>{children}</span>}
    </button>
  );
}

export function Modal({ title, onClose, children, footer, wide }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('close')}><Icon name="x" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="lbl">{label}</span>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

export function Empty({ icon = 'info', title, text, children }: { icon?: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-ico"><Icon name={icon} size={28} /></div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children && <div className="row center">{children}</div>}
    </div>
  );
}

export function StatusBadge({ status, lang }: { status: Status; lang: Lang }) {
  return <span className={`badge ${status}`}>{tl(lang, 'st_' + status)}</span>;
}

export const STATUS_COLOR: Record<Status, string> = { mastered: 'var(--ok)', developing: 'var(--warn)', non: 'var(--bad)' };

/* -------------------------------------------------------------------- toast */
let pushToast: (m: string) => void = () => {};
export const toast = (m: string) => pushToast(m);
export function Toaster() {
  const [list, setList] = useState<{ id: number; m: string }[]>([]);
  useEffect(() => {
    pushToast = (m) => {
      const id = Date.now() + Math.random();
      setList((l) => [...l, { id, m }]);
      setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 3200);
    };
    return () => { pushToast = () => {}; };
  }, []);
  return <div className="toasts" aria-live="polite">{list.map((x) => <div key={x.id} className="toast">{x.m}</div>)}</div>;
}

/* -------------------------------------------------------------------- router */
export function useHash(): string {
  const [h, setH] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const f = () => setH(location.hash.slice(1) || '/');
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return h;
}
export const go = (path: string) => { location.hash = '#' + path; };

export const fmt = (n: number, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toString();
export const today = () => new Date().toISOString().slice(0, 10);
