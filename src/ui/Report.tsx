import type { CalcMode, ClassRoom, DB, Exam, ExamAnalysis, Lang, Skill, Status, Student, StudentResult, Thresholds } from '../core/types';
import { buildFeedback } from '../core/feedback';
import type { ProgressRow } from '../core/progress';
import { findSubject, FRAMEWORKS, gradeName, TRACKS } from '../data/curriculum';
import { nm, skillMap } from '../store';
import { tl } from '../i18n/strings';
import { STATUS_COLOR, StatusBadge, fmt } from './common';
import logo from '../../public/logo-mark.png';

type SkillName = (id: string) => string;
export const skillNamer = (db: DB, lang: Lang): SkillName => {
  const m = skillMap(db);
  return (id) => nm(m.get(id)?.name, lang) || id;
};
const codeOf = (db: DB, id: string) => skillMap(db).get(id)?.code ?? id;

/* ------------------------------------------------------------------- charts */
export function Radar({ values, th, size = 300 }: { values: number[]; th: Thresholds; size?: number }) {
  const n = values.length;
  const c = size / 2, R = size / 2 - 38;
  const pt = (i: number, pct: number): [number, number] => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [c + Math.cos(a) * R * (pct / 100), c + Math.sin(a) * R * (pct / 100)];
  };
  const poly = (pct: number) => Array.from({ length: n }, (_, i) => pt(i, pct).join(',')).join(' ');
  const data = values.map((v, i) => pt(i, Math.max(2, v)).join(',')).join(' ');
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }} role="img" aria-label="radar">
      {[20, 40, 60, 80, 100].map((p) => <polygon key={p} points={poly(p)} fill="none" stroke="#d9dee6" strokeWidth="1" />)}
      <polygon points={poly(th.mastery)} fill="none" stroke="#1c8f5a" strokeWidth="1.2" strokeDasharray="4 3" />
      <polygon points={poly(th.developing)} fill="none" stroke="#d99a1b" strokeWidth="1.2" strokeDasharray="4 3" />
      {Array.from({ length: n }, (_, i) => { const [x, y] = pt(i, 100); return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#d9dee6" />; })}
      <polygon points={data} fill="rgba(11,93,59,.22)" stroke="#0b5d3b" strokeWidth="2.2" strokeLinejoin="round" />
      {values.map((v, i) => { const [x, y] = pt(i, Math.max(2, v)); return <circle key={i} cx={x} cy={y} r="3.6" fill="#1e2d4c" />; })}
      {values.map((_, i) => {
        const [x, y] = pt(i, 100);
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
        const lx = x + Math.cos(a) * 15, ly = y + Math.sin(a) * 15;
        return (
          <g key={i}>
            <circle cx={lx} cy={ly} r="10" fill="#1e2d4c" />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function MasteryBar({ pct, th, status, widthPct = 100 }: { pct: number; th: Thresholds; status: Status; widthPct?: number }) {
  return (
    <div className="mbar" style={{ width: `${widthPct}%` }}>
      <div className="mbar-fill" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: STATUS_COLOR[status] }} />
      <i className="mbar-tick" style={{ insetInlineStart: `${th.developing}%` }} />
      <i className="mbar-tick" style={{ insetInlineStart: `${th.mastery}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------ student report */
export interface StudentReportProps {
  db: DB; lang: Lang; exam: Exam; student: Student; cls: ClassRoom; result: StudentResult;
  mode: CalcMode; showBoth: boolean; th: Thresholds; progress: ProgressRow[]; classAvg?: number;
}

export function StudentReport(p: StudentReportProps) {
  const { db, lang, exam, student, cls, result, mode, th } = p;
  const L = (k: string, v?: Record<string, string | number>) => tl(lang, k, v);
  const name = skillNamer(db, lang);
  const subject = findSubject(exam.subjectId, db.customSubjects);
  const skills = result.skills;
  const maxShareTop = Math.max(1, ...skills.map((s) => s.maxShare));
  const feedback = buildFeedback({ lang, studentName: student.name, examTitle: exam.title, result, skillName: name, mode, th });
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const gname = gradeName(cls.grade)[lang];
  const trackName = cls.track ? ' - ' + TRACKS[cls.track]?.[lang] : '';
  const trend = (pts: { M: number }[]) => {
    const d = pts[pts.length - 1].M - pts[pts.length - 2].M;
    return d > 5 ? '▲' : d < -5 ? '▼' : '■';
  };
  const insufficient = skills.some((s) => s.insufficient);

  return (
    <article className="report" dir={dir} lang={lang}>
      <header className="rp-head pb">
        <img src={logo} alt="" className="rp-logo" />
        <div className="rp-titles">
          <div className="rp-app">{L('app_name')}</div>
          <h1>{L('rp_title')}</h1>
          <div className="rp-sub">{[db.settings.school, db.settings.teacher && `${L('teacher')}: ${db.settings.teacher}`].filter(Boolean).join(' · ')}</div>
        </div>
      </header>

      <section className="rp-info pb">
        <div><span>{L('student')}</span><b>{student.name}</b></div>
        <div><span>{L('student_no')}</span><b>{student.no || '—'}</b></div>
        <div><span>{L('class')}</span><b>{gname}{trackName} {cls.section && `/ ${cls.section}`}</b></div>
        <div><span>{L('subject')}</span><b>{nm(subject?.name, lang)}</b></div>
        <div><span>{L('exam')}</span><b>{exam.title}</b></div>
        <div><span>{L('date')}</span><b>{exam.date}</b></div>
        <div><span>{L('curriculum')}</span><b>{FRAMEWORKS[cls.framework][lang]}</b></div>
        <div><span>{L('calc_mode')}</span><b>{L(mode === 'M' ? 'mode_M_short' : 'mode_C_short')}</b></div>
      </section>

      {!result.assessed ? (
        <section className="rp-card pb"><p>{feedback[0]}</p></section>
      ) : (
        <>
          <section className="rp-summary pb">
            <div className="rp-score">
              <div className="big">{fmt(result.pct)}<small>%</small></div>
              <div className="muted">{fmt(result.total)} / {fmt(result.max)}</div>
            </div>
            {p.classAvg !== undefined && (
              <div className="rp-score alt">
                <div className="big">{fmt(p.classAvg)}<small>%</small></div>
                <div className="muted">{L('class_avg')}</div>
              </div>
            )}
            <div className="rp-counts">
              {(['mastered', 'developing', 'non'] as Status[]).map((s) => (
                <div key={s} className={`cnt ${s}`}><b>{skills.filter((k) => k.status === s).length}</b><span>{L('st_' + s)}</span></div>
              ))}
            </div>
          </section>

          <section className="rp-card pb">
            <h2>{L('rp_skills')}</h2>
            <table className="rp-table">
              <thead>
                <tr>
                  <th>#</th><th>{L('skill')}</th><th>{L('q_count')}</th><th>{L('score')}</th>
                  <th>{mode === 'M' ? L('mastery_pct') : L('contrib_pct')}</th><th>{L('status')}</th>
                  {p.showBoth && <th>{mode === 'M' ? L('contrib_pct') : L('mastery_pct')}</th>}
                </tr>
              </thead>
              <tbody>
                {skills.map((s, i) => (
                  <tr key={s.skillId}>
                    <td>{i + 1}</td>
                    <td><b>{name(s.skillId)}</b><div className="code">{codeOf(db, s.skillId)}</div></td>
                    <td>{s.items}{s.insufficient && <sup title={L('insufficient')}> *</sup>}</td>
                    <td>{fmt(s.earned)} / {fmt(s.maxW)}</td>
                    <td className="num">{mode === 'M' ? `${fmt(s.M)}%` : `${fmt(s.C)}% / ${fmt(s.maxShare)}%`}</td>
                    <td><StatusBadge status={s.status} lang={lang} /></td>
                    {p.showBoth && <td className="num muted">{mode === 'M' ? `${fmt(s.C)}% / ${fmt(s.maxShare)}%` : `${fmt(s.M)}%`}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {insufficient && <p className="note">* {L('insufficient_note', { n: th.minItems })}</p>}
            {result.unmappedMax > 0 && <p className="note">{L('unmapped_note', { v: fmt(result.unmappedMax) })}</p>}
          </section>

          <section className="rp-charts pb">
            {skills.length >= 3 && (
              <div className="rp-card">
                <h2>{L('rp_radar')}</h2>
                <Radar values={skills.map((s) => s.M)} th={th} />
              </div>
            )}
            <div className="rp-card grow">
              <h2>{mode === 'M' ? L('rp_bars') : L('rp_bars_c')}</h2>
              <div className="bars">
                {skills.map((s, i) => (
                  <div key={s.skillId} className="bar-row">
                    <div className="bar-lbl"><span className="n">{i + 1}</span><span>{name(s.skillId)}</span></div>
                    <div className="bar-line">
                      <MasteryBar pct={s.M} th={th} status={s.status} widthPct={mode === 'M' ? 100 : Math.max(8, (s.maxShare / maxShareTop) * 100)} />
                      <b>{mode === 'M' ? `${fmt(s.M)}%` : `${fmt(s.C)}/${fmt(s.maxShare)}%`}</b>
                    </div>
                  </div>
                ))}
              </div>
              <div className="legend">
                <span><i style={{ background: STATUS_COLOR.mastered }} />{L('st_mastered')} <bdi dir="ltr">≥ {th.mastery}%</bdi></span>
                <span><i style={{ background: STATUS_COLOR.developing }} />{L('st_developing')} <bdi dir="ltr">≥ {th.developing}%</bdi></span>
                <span><i style={{ background: STATUS_COLOR.non }} />{L('st_non')} <bdi dir="ltr">&lt; {th.developing}%</bdi></span>
              </div>
            </div>
          </section>

          {p.progress.length > 0 && (
            <section className="rp-card pb">
              <h2>{L('rp_progress')}</h2>
              <table className="rp-table">
                <tbody>
                  {p.progress.map((r) => (
                    <tr key={r.skillId}>
                      <td><b>{name(r.skillId)}</b></td>
                      <td className="trail">
                        {r.points.map((pt, i) => (
                          <span key={pt.examId} className="chip" title={`${pt.title} (${pt.date})`}>{fmt(pt.M, 0)}%{i < r.points.length - 1 && ' →'}</span>
                        ))}
                        <span className={`trend ${trend(r.points) === '▲' ? 'up' : trend(r.points) === '▼' ? 'down' : ''}`}>{trend(r.points)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section className="rp-card pb">
            <h2>{L('rp_feedback')}</h2>
            {feedback.map((f, i) => <p key={i}>{f}</p>)}
          </section>
        </>
      )}

      <footer className="rp-foot pb">
        <span>{L('rp_generated', { d: new Date().toISOString().slice(0, 10) })}</span>
        <span>{L('app_name')} · Motqn Assessment</span>
      </footer>
    </article>
  );
}

/* -------------------------------------------------------------- class report */
export function ClassReport(p: {
  db: DB; lang: Lang; exam: Exam; cls: ClassRoom; analysis: ExamAnalysis; mode: CalcMode; th: Thresholds;
}) {
  const { db, lang, exam, cls, analysis, mode, th } = p;
  const L = (k: string, v?: Record<string, string | number>) => tl(lang, k, v);
  const name = skillNamer(db, lang);
  const subject = findSubject(exam.subjectId, db.customSubjects);
  const students = new Map(db.students.map((s) => [s.id, s]));
  const stat = (m: number): Status => (m + 1e-9 >= th.mastery ? 'mastered' : m + 1e-9 >= th.developing ? 'developing' : 'non');
  const sorted = [...analysis.classSkills].sort((a, b) => a.M - b.M);
  const remedial = sorted.filter((s) => s.studentsByStatus.non.length > 0);

  return (
    <article className="report" dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
      <header className="rp-head pb">
        <img src={logo} alt="" className="rp-logo" />
        <div className="rp-titles">
          <div className="rp-app">{L('app_name')}</div>
          <h1>{L('cr_title')}</h1>
          <div className="rp-sub">{[db.settings.school, db.settings.teacher && `${L('teacher')}: ${db.settings.teacher}`].filter(Boolean).join(' · ')}</div>
        </div>
      </header>
      <section className="rp-info pb">
        <div><span>{L('class')}</span><b>{gradeName(cls.grade)[lang]} {cls.section && `/ ${cls.section}`}</b></div>
        <div><span>{L('subject')}</span><b>{nm(subject?.name, lang)}</b></div>
        <div><span>{L('exam')}</span><b>{exam.title}</b></div>
        <div><span>{L('date')}</span><b>{exam.date}</b></div>
        <div><span>{L('assessed')}</span><b>{analysis.assessedCount}</b></div>
        <div><span>{L('class_avg')}</span><b>{fmt(analysis.average)}%</b></div>
      </section>

      <section className="rp-card pb">
        <h2>{L('cr_skills')}</h2>
        <table className="rp-table">
          <thead>
            <tr><th>#</th><th>{L('skill')}</th><th>{L('q_count')}</th><th>{L('mastery_pct')}</th><th>{L('avg_contrib')}</th>
              <th>{L('st_mastered')}</th><th>{L('st_developing')}</th><th>{L('st_non')}</th></tr>
          </thead>
          <tbody>
            {analysis.classSkills.map((s, i) => (
              <tr key={s.skillId}>
                <td>{i + 1}</td>
                <td><b>{name(s.skillId)}</b><div className="code">{codeOf(db, s.skillId)}</div></td>
                <td>{s.items}{s.insufficient && <sup> *</sup>}</td>
                <td className="num"><span className={`badge ${stat(s.M)}`}>{fmt(s.M)}%</span></td>
                <td className="num muted">{mode === 'C' || p.db.settings.showBoth ? `${fmt(s.C)}% / ${fmt(s.maxShare)}%` : '—'}</td>
                <td className="num">{s.counts.mastered}</td><td className="num">{s.counts.developing}</td><td className="num">{s.counts.non}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rp-card pb">
        <h2>{L('cr_weakest')}</h2>
        <div className="bars">
          {sorted.map((s) => (
            <div key={s.skillId} className="bar-row">
              <div className="bar-lbl"><span>{name(s.skillId)}</span></div>
              <div className="bar-line"><MasteryBar pct={s.M} th={th} status={stat(s.M)} /><b>{fmt(s.M)}%</b></div>
            </div>
          ))}
        </div>
      </section>

      <section className="rp-card">
        <h2>{L('cr_remedial')}</h2>
        {remedial.length === 0 && <p className="muted">{L('cr_no_remedial')}</p>}
        {remedial.map((s) => (
          <div key={s.skillId} className="rem pb">
            <b>{name(s.skillId)}</b> <span className="muted">({s.studentsByStatus.non.length})</span>
            <div className="chips">
              {s.studentsByStatus.non.map((id) => <span className="chip" key={id}>{students.get(id)?.name}</span>)}
            </div>
          </div>
        ))}
      </section>
      <footer className="rp-foot pb">
        <span>{L('rp_generated', { d: new Date().toISOString().slice(0, 10) })}</span>
        <span>{L('app_name')} · Motqn Assessment</span>
      </footer>
    </article>
  );
}

export type { Skill };
