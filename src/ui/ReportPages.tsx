import { useMemo, useState } from 'react';
import { analyzeExam } from '../core/calc';
import { studentProgress } from '../core/progress';
import type { CalcMode, DB, Exam, ExamAnalysis, Lang, Student } from '../core/types';
import { isNative, saveBlob } from '../native';
import { thresholdsOf, useDB } from '../store';
import { Btn, Empty, Icon, curLang, go, t, toast } from './common';
import { reportsToPdf } from './exporter';
import { ClassReport, StudentReport } from './Report';

function useCtx(examId: string) {
  const db = useDB();
  const exam = db.exams.find((e) => e.id === examId);
  const cls = db.classes.find((c) => c.id === exam?.classId);
  const students = db.students.filter((s) => s.classId === cls?.id);
  const th = thresholdsOf(db);
  const an = useMemo(() => (exam ? analyzeExam(exam, students, th) : null), [exam, db.students, th.mastery, th.developing, th.minItems]);
  return { db, exam, cls, students, th, an };
}

const studentEl = (db: DB, exam: Exam, s: Student, an: ExamAnalysis, lang: Lang, mode: CalcMode) => {
  const cls = db.classes.find((c) => c.id === exam.classId)!;
  const th = thresholdsOf(db);
  return (
    <StudentReport key={s.id} db={db} lang={lang} exam={exam} student={s} cls={cls} result={an.results[s.id]} mode={mode}
      showBoth={db.settings.showBoth} th={th} progress={studentProgress(db.exams, exam, s.id, th)} classAvg={an.average} />
  );
};

function Toolbar({ lang, setLang, mode, setMode, onPdf, busy, children }: {
  lang: Lang; setLang: (l: Lang) => void; mode?: CalcMode; setMode?: (m: CalcMode) => void; onPdf: () => void; busy?: string; children?: React.ReactNode;
}) {
  return (
    <div className="toolbar no-print">
      <div className="seg" role="group" aria-label={t('report_language')}>
        <button type="button" className={lang === 'ar' ? 'on' : ''} onClick={() => setLang('ar')}>العربية</button>
        <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
      </div>
      {mode && setMode && (
        <div className="seg" role="group" aria-label={t('calc_mode')}>
          <button type="button" className={mode === 'M' ? 'on' : ''} onClick={() => setMode('M')}>M · {t('mode_M_short')}</button>
          <button type="button" className={mode === 'C' ? 'on' : ''} onClick={() => setMode('C')}>C · {t('mode_C_short')}</button>
        </div>
      )}
      {children}
      <Btn kind="primary" icon={isNative() ? 'share' : 'download'} onClick={onPdf} disabled={!!busy}>{busy || (isNative() ? t('share_pdf') : t('download_pdf'))}</Btn>
      {!isNative() && <Btn icon="print" onClick={() => window.print()}>{t('print')}</Btn>}
    </div>
  );
}

export function StudentReportPage({ examId, studentId }: { examId: string; studentId: string }) {
  const { db, exam, cls, students, an } = useCtx(examId);
  const student = students.find((s) => s.id === studentId);
  const [lang, setLang] = useState<Lang>(curLang());
  const [mode, setMode] = useState<CalcMode>(exam?.mode ?? 'M');
  const [busy, setBusy] = useState('');
  if (!exam || !cls || !an || !student) return <Empty title={t('not_found')} />;
  const assessed = students.filter((s) => an.results[s.id].assessed);
  const idx = assessed.findIndex((s) => s.id === studentId);
  const el = studentEl(db, exam, student, an, lang, mode);
  const pdf = async () => {
    try {
      setBusy(t('preparing'));
      const blob = await reportsToPdf([el]);
      await saveBlob(`${student.name}-${exam.title}.pdf`.replace(/[\\/:*?"<>|]/g, '_'), blob, student.name);
    } catch (e) { console.error(e); toast(t('pdf_failed')); } finally { setBusy(''); }
  };
  return (
    <div className="page wide">
      <div className="crumbs no-print"><a href={`#/exam/${examId}/results`}><Icon name="back" size={16} /> {exam.title}</a></div>
      <Toolbar lang={lang} setLang={setLang} mode={mode} setMode={setMode} onPdf={pdf} busy={busy}>
        <span className="row gap">
          <Btn small icon="back" disabled={idx <= 0} onClick={() => go(`/report/${examId}/${assessed[idx - 1].id}`)}>{t('prev')}</Btn>
          <Btn small disabled={idx < 0 || idx >= assessed.length - 1} onClick={() => go(`/report/${examId}/${assessed[idx + 1].id}`)}>{t('next')}</Btn>
        </span>
      </Toolbar>
      <div className="report-wrap">{el}</div>
    </div>
  );
}

export function ClassReportPage({ examId }: { examId: string }) {
  const { db, exam, cls, th, an } = useCtx(examId);
  const [lang, setLang] = useState<Lang>(curLang());
  const [busy, setBusy] = useState('');
  if (!exam || !cls || !an) return <Empty title={t('not_found')} />;
  const el = <ClassReport db={db} lang={lang} exam={exam} cls={cls} analysis={an} mode={exam.mode} th={th} />;
  const pdf = async () => {
    try { setBusy(t('preparing')); await saveBlob(`${cls.name}-${exam.title}.pdf`.replace(/[\\/:*?"<>|]/g, '_'), await reportsToPdf([el])); }
    catch (e) { console.error(e); toast(t('pdf_failed')); } finally { setBusy(''); }
  };
  return (
    <div className="page wide">
      <div className="crumbs no-print"><a href={`#/exam/${examId}/results`}><Icon name="back" size={16} /> {exam.title}</a></div>
      <Toolbar lang={lang} setLang={setLang} onPdf={pdf} busy={busy} />
      <div className="report-wrap">{el}</div>
    </div>
  );
}

export function AllReportsPage({ examId }: { examId: string }) {
  const { db, exam, cls, students, an } = useCtx(examId);
  const [lang, setLang] = useState<Lang>(curLang());
  const [mode, setMode] = useState<CalcMode>(exam?.mode ?? 'M');
  const [busy, setBusy] = useState('');
  if (!exam || !cls || !an) return <Empty title={t('not_found')} />;
  const list = students.filter((s) => an.results[s.id].assessed);
  const els = list.map((s) => studentEl(db, exam, s, an, lang, mode));
  const pdf = async () => {
    try {
      const blob = await reportsToPdf(els, (d, n) => setBusy(`${d}/${n}`));
      await saveBlob(`${cls.name}-${exam.title}-reports.pdf`.replace(/[\\/:*?"<>|]/g, '_'), blob);
    } catch (e) { console.error(e); toast(t('pdf_failed')); } finally { setBusy(''); }
  };
  return (
    <div className="page wide">
      <div className="crumbs no-print"><a href={`#/exam/${examId}/results`}><Icon name="back" size={16} /> {exam.title}</a></div>
      <Toolbar lang={lang} setLang={setLang} mode={mode} setMode={setMode} onPdf={pdf} busy={busy} />
      <p className="muted no-print">{t('all_reports_hint', { n: list.length })}</p>
      {els.map((e, i) => <div key={i} className="report-wrap break-after">{e}</div>)}
    </div>
  );
}
