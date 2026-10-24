import { useEffect } from 'react';
import { useDB } from './store';
import { A } from './store';
import { Icon, Toaster, curLang, t, useHash } from './ui/common';
import { ClassDetail, Classes, Home } from './ui/Classes';
import { ExamPage } from './ui/Exam';
import { Settings, SkillsLibrary } from './ui/Library';
import { AllReportsPage, ClassReportPage, StudentReportPage } from './ui/ReportPages';
import logo from '../public/logo-mark.png';

const NAV: [string, string, string][] = [
  ['/', 'home', 'start_nav'],
  ['/classes', 'users', 'classes'],
  ['/skills', 'book', 'skills_library'],
  ['/settings', 'gear', 'settings'],
];

function Route({ hash }: { hash: string }) {
  const [path, qs = ''] = hash.split('?');
  const p = path.split('/').filter(Boolean);
  const query = new URLSearchParams(qs);
  switch (p[0]) {
    case undefined: return <Home />;
    case 'classes': return <Classes query={query} />;
    case 'class': return <ClassDetail id={p[1]} />;
    case 'exam': return <ExamPage id={p[1]} tab={p[2] || 'setup'} />;
    case 'report': return <StudentReportPage examId={p[1]} studentId={p[2]} />;
    case 'reports': return <AllReportsPage examId={p[1]} />;
    case 'class-report': return <ClassReportPage examId={p[1]} />;
    case 'skills': return <SkillsLibrary />;
    case 'settings': return <Settings />;
    default: return <Home />;
  }
}

export function App() {
  const db = useDB();
  const lang = curLang();
  const hash = useHash();

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar' ? 'متقن' : 'Motqn Assessment';
  }, [lang]);

  // keeps on-screen reports readable on narrow phones (PDF/print render at full A4 width)
  useEffect(() => {
    const f = () => document.documentElement.style.setProperty('--rscale', String(Math.min(1, (window.innerWidth - 24) / 794)));
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [hash.split('?')[0]]);

  const cur = '/' + (hash.split('?')[0].split('/')[1] || '');
  const active = (to: string) => (to === '/' ? cur === '/' : cur.startsWith(to) || (to === '/classes' && ['/class', '/exam', '/report', '/reports', '/class-report'].includes(cur)));

  return (
    <div className="shell">
      <header className="topbar no-print">
        <a href="#/" className="brand"><img src={logo} alt="" /><b>{t('app_name')}</b><small>Motqn Assessment</small></a>
        <nav className="nav-top">
          {NAV.map(([to, ico, label]) => (
            <a key={to} href={`#${to}`} className={active(to) ? 'on' : ''}><Icon name={ico} size={18} />{t(label)}</a>
          ))}
        </nav>
        <button type="button" className="lang-btn" onClick={() => A.setSettings({ lang: db.settings.lang === 'ar' ? 'en' : 'ar' })} aria-label={t('language')}>
          <Icon name="globe" size={18} />{lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </header>
      <main><Route hash={hash} /></main>
      <nav className="nav-bottom no-print">
        {NAV.map(([to, ico, label]) => (
          <a key={to} href={`#${to}`} className={active(to) ? 'on' : ''}><Icon name={ico} size={22} /><span>{t(label)}</span></a>
        ))}
      </nav>
      <Toaster />
    </div>
  );
}
