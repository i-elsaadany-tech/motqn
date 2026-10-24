import { useMemo, useRef, useState } from 'react';
import { analyzeExam, examMax, normWeights } from '../core/calc';
import { parseTable, toCSV, toNumber } from '../core/csv';
import type { CalcMode, ClassRoom, Exam } from '../core/types';
import { findSubject, gradeName, subjectsFor } from '../data/curriculum';
import { csvBlob, saveBlob } from '../native';
import { A, nm, skillMap, thresholdsOf, useDB } from '../store';
import { ModePicker } from './Classes';
import { Btn, Empty, Field, Icon, Modal, STATUS_COLOR, StatusBadge, curLang, fmt, go, t, toast } from './common';
import { MasteryBar, skillNamer } from './Report';
import { SkillPicker } from './SkillPicker';

export function ExamPage({ id, tab }: { id: string; tab: string }) {
  const db = useDB();
  const lang = curLang();
  const exam = db.exams.find((e) => e.id === id);
  const cls = db.classes.find((c) => c.id === exam?.classId);
  if (!exam || !cls) return <Empty title={t('not_found')} />;
  const sub = findSubject(exam.subjectId, db.customSubjects);
  const tabs: [string, string][] = [['setup', 'tab_setup'], ['scores', 'tab_scores'], ['results', 'tab_results']];
  return (
    <div className="page">
      <div className="crumbs"><a href={`#/class/${cls.id}`}><Icon name="back" size={16} /> {cls.name}</a></div>
      <div className="row between wrap">
        <div>
          <h1>{exam.title}</h1>
          <p className="muted">{nm(sub?.name, lang)} · {exam.date} · {gradeName(cls.grade)[lang]}</p>
        </div>
        <span className="tagc big">{t(exam.mode === 'M' ? 'mode_M_short' : 'mode_C_short')}</span>
      </div>
      <div className="tabs">
        {tabs.map(([k, label]) => <a key={k} className={tab === k ? 'on' : ''} href={`#/exam/${id}/${k}`}>{t(label)}</a>)}
      </div>
      {tab === 'scores' ? <ExamScores exam={exam} cls={cls} /> : tab === 'results' ? <ExamResults exam={exam} cls={cls} /> : <ExamSetup exam={exam} cls={cls} />}
    </div>
  );
}

/* ================================================================== setup */
function ExamSetup({ exam, cls }: { exam: Exam; cls: ClassRoom }) {
  const db = useDB();
  const lang = curLang();
  const name = skillNamer(db, lang);
  const th = thresholdsOf(db);
  const [picker, setPicker] = useState<string[] | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [addN, setAddN] = useState(5);
  const [addMax, setAddMax] = useState(2);
  const subs = subjectsFor(cls.framework, cls.grade, cls.track, db.customSubjects);
  const T = examMax(exam);

  const spec = useMemo(() => {
    const m = new Map<string, { items: number; pts: number }>();
    for (const q of exam.questions) for (const { skillId, w } of normWeights(q)) {
      const r = m.get(skillId) || { items: 0, pts: 0 };
      r.items++; r.pts += w * q.max; m.set(skillId, r);
    }
    return [...m.entries()];
  }, [exam.questions]);
  const unmapped = exam.questions.map((q, i) => (normWeights(q).length ? 0 : i + 1)).filter(Boolean);

  const toggleSel = (id: string) => setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const initialFor = picker && picker.length === 1 ? exam.questions.find((q) => q.id === picker[0])?.skills ?? [] : [];

  return (
    <>
      <div className="card">
        <div className="grid2">
          <Field label={t('exam_title')}><input value={exam.title} onChange={(e) => A.updateExam(exam.id, { title: e.target.value })} /></Field>
          <Field label={t('date')}><input type="date" value={exam.date} onChange={(e) => A.updateExam(exam.id, { date: e.target.value })} /></Field>
          <Field label={t('subject')}>
            <select value={exam.subjectId} onChange={(e) => A.updateExam(exam.id, { subjectId: e.target.value })}>
              {subs.map((s) => <option key={s.id} value={s.id}>{nm(s.name, lang)}</option>)}
            </select>
          </Field>
        </div>
        <h3 className="sec">{t('calc_mode')}</h3>
        <ModePicker mode={exam.mode} setMode={(m: CalcMode) => A.updateExam(exam.id, { mode: m })} />
      </div>

      <div className="card">
        <div className="row between wrap">
          <h2>{t('questions')} <span className="muted">({exam.questions.length} · {fmt(T)} {t('pts')})</span></h2>
          <div className="row gap wrap">
            <span className="row"><input className="num-in" type="number" min={1} max={100} value={addN} onChange={(e) => setAddN(Number(e.target.value))} aria-label="n" />
              ×<input className="num-in" type="number" min={0.5} step={0.5} value={addMax} onChange={(e) => setAddMax(Number(e.target.value))} aria-label="max" />
              <Btn icon="plus" onClick={() => addN > 0 && addMax > 0 && A.addQuestions(exam.id, Math.min(addN, 100), addMax)}>{t('add_questions')}</Btn></span>
          </div>
        </div>

        {exam.questions.length === 0 ? <Empty icon="file" title={t('no_questions')} text={t('no_questions_text')} /> : (
          <>
            <div className="row gap wrap sticky-bar">
              <Btn small onClick={() => setSel(sel.size === exam.questions.length ? new Set() : new Set(exam.questions.map((q) => q.id)))}>{t('select_all')}</Btn>
              <Btn small kind="primary" icon="tag" disabled={!sel.size} onClick={() => setPicker([...sel])}>{t('assign_to_selected')} ({sel.size})</Btn>
              <Btn small kind="danger" icon="trash" disabled={!sel.size} onClick={() => { if (confirm(t('confirm_delete'))) { A.deleteQuestions(exam.id, [...sel]); setSel(new Set()); } }}>{t('delete')}</Btn>
            </div>
            <div className="table-wrap">
              <table className="tbl q-tbl">
                <thead><tr><th /><th>#</th><th>{t('max_score')}</th><th>{t('skills')}</th><th /></tr></thead>
                <tbody>
                  {exam.questions.map((q, i) => {
                    const ws = normWeights(q);
                    return (
                      <tr key={q.id}>
                        <td><input type="checkbox" checked={sel.has(q.id)} onChange={() => toggleSel(q.id)} aria-label={`Q${i + 1}`} /></td>
                        <td><b>{i + 1}</b></td>
                        <td><input className="num-in" type="number" min={0} step={0.5} value={q.max} onChange={(e) => A.updateQuestion(exam.id, q.id, { max: Math.max(0, Number(e.target.value)) })} /></td>
                        <td>
                          <button type="button" className="chips-btn" onClick={() => setPicker([q.id])}>
                            {ws.length === 0 ? <span className="warn-t">{t('no_skill')}</span> : ws.map((w) => (
                              <span key={w.skillId} className="chip">{name(w.skillId)}{ws.length > 1 && ` ${Math.round(w.w * 100)}%`}</span>
                            ))}
                          </button>
                        </td>
                        <td className="act"><button type="button" className="icon-btn" aria-label={t('delete')} onClick={() => A.deleteQuestions(exam.id, [q.id])}><Icon name="trash" size={16} /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {spec.length > 0 && (
        <div className="card">
          <h2>{t('spec_table')}</h2>
          <p className="muted">{t('spec_hint')}</p>
          <div className="table-wrap">
            <table className="tbl">
              <thead><tr><th>{t('skill')}</th><th>{t('q_count')}</th><th>{t('points')}</th><th>{t('share_of_exam')}</th></tr></thead>
              <tbody>
                {spec.map(([id, r]) => (
                  <tr key={id}>
                    <td>{name(id)}<div className="code">{skillMap(db).get(id)?.code}</div></td>
                    <td>{r.items}{r.items < th.minItems && <span className="warn-t" title={t('insufficient')}> ⚠</span>}</td>
                    <td>{fmt(r.pts)}</td><td>{T ? fmt((r.pts / T) * 100) : 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {unmapped.length > 0 && <p className="warn-t">⚠ {t('unmapped_questions', { q: unmapped.join(', ') })}</p>}
          {spec.some(([, r]) => r.items < th.minItems) && <p className="warn-t">⚠ {t('insufficient_note', { n: th.minItems })}</p>}
        </div>
      )}

      <div className="row gap wrap">
        <Btn kind="primary" icon="grid" onClick={() => go(`/exam/${exam.id}/scores`)} disabled={!exam.questions.length}>{t('next_enter_scores')}</Btn>
        <Btn icon="copy" onClick={() => { const id = A.duplicateExam(exam.id, exam.title + ' (2)'); if (id) { toast(t('duplicated')); go(`/exam/${id}/setup`); } }}>{t('duplicate_exam')}</Btn>
        <Btn kind="danger" icon="trash" onClick={() => { if (confirm(t('confirm_delete_exam'))) { A.deleteExam(exam.id); go(`/class/${cls.id}`); } }}>{t('delete_exam')}</Btn>
      </div>

      {picker && (
        <SkillPicker
          ctx={{ framework: cls.framework, grade: cls.grade, subjectId: exam.subjectId }}
          title={picker.length > 1 ? `${t('assign_to_selected')} (${picker.length})` : t('assign_skills')}
          initial={initialFor}
          onClose={() => setPicker(null)}
          onApply={(skills) => { picker.forEach((qid) => A.updateQuestion(exam.id, qid, { skills })); setPicker(null); setSel(new Set()); }}
        />
      )}
    </>
  );
}

/* ================================================================= scores */
function ExamScores({ exam, cls }: { exam: Exam; cls: ClassRoom }) {
  const db = useDB();
  const students = db.students.filter((s) => s.classId === cls.id);
  const [paste, setPaste] = useState(false);
  const [nonce, setNonce] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const T = examMax(exam);

  if (!exam.questions.length) return <Empty icon="file" title={t('no_questions')} text={t('no_questions_text')}><Btn kind="primary" onClick={() => go(`/exam/${exam.id}/setup`)}>{t('tab_setup')}</Btn></Empty>;
  if (!students.length) return <Empty icon="users" title={t('no_students')} text={t('no_students_text')}><Btn kind="primary" onClick={() => go(`/class/${cls.id}`)}>{t('students')}</Btn></Empty>;

  const commit = (sid: string, qid: string, raw: string, max: number) => {
    const n = toNumber(raw);
    if (n === null) { A.setScore(exam.id, sid, qid, null); return; }
    A.setScore(exam.id, sid, qid, Math.min(Math.max(n, 0), max));
  };
  const rowTotal = (sid: string) => exam.questions.reduce((a, q) => a + Math.min(exam.scores[sid]?.[q.id] ?? 0, q.max), 0);

  const applyTable = (rows: string[][]) => {
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    const byNo = new Map(students.filter((s) => s.no).map((s) => [norm(s.no), s]));
    const byName = new Map(students.map((s) => [norm(s.name), s]));
    const nQ = exam.questions.length;
    const out: { studentId: string; scores: Record<string, number> }[] = [];
    let unmatched = 0, clamped = 0;
    const find = (r: string[]) => {
      for (let off = 0; off < Math.min(2, r.length); off++) {
        const s = byNo.get(norm(r[off])) || byName.get(norm(r[off]));
        if (s) {
          const other = byNo.get(norm(r[off + 1] ?? '')) || byName.get(norm(r[off + 1] ?? ''));
          return { s, offset: off + 1 + (other === s || (other && off === 0) ? 1 : 0) };
        }
      }
      return null;
    };
    const matched = rows.map(find);
    const useOrder = matched.every((m) => !m) && rows.every((r) => r.length >= nQ && r.slice(-nQ).every((c) => toNumber(c) !== null)) && rows.length <= students.length;
    rows.forEach((r, ri) => {
      let s = matched[ri]?.s, offset = matched[ri]?.offset ?? 0;
      if (useOrder) { s = students[ri]; offset = r.length - nQ; }
      if (!s) { if (r[0]) unmatched++; return; }
      const scores: Record<string, number> = {};
      exam.questions.forEach((q, qi) => {
        const n = toNumber(r[offset + qi] ?? '');
        if (n === null) return;
        const v = Math.min(Math.max(n, 0), q.max);
        if (v !== n) clamped++;
        scores[q.id] = v;
      });
      if (Object.keys(scores).length) out.push({ studentId: s.id, scores });
    });
    A.setScoresBulk(exam.id, out);
    setNonce((n) => n + 1);
    toast(t('import_done', { n: out.length, u: unmatched, c: clamped }));
  };

  const template = () => {
    const header = [t('student_no'), t('student_name'), ...exam.questions.map((_, i) => `Q${i + 1}`)];
    const max = ['', t('max_score'), ...exam.questions.map((q) => q.max)];
    const body = students.map((s) => [s.no, s.name, ...exam.questions.map((q) => exam.scores[s.id]?.[q.id] ?? '')]);
    void saveBlob(`scores-${exam.title}.csv`, csvBlob(toCSV([header, max, ...body])));
  };

  return (
    <>
      <div className="row gap wrap">
        <Btn icon="download" onClick={template}>{t('export_template')}</Btn>
        <Btn icon="upload" onClick={() => fileRef.current?.click()}>{t('import_csv')}</Btn>
        <Btn icon="copy" onClick={() => setPaste(true)}>{t('paste_scores')}</Btn>
        <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,text/csv" hidden onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) applyTable(parseTable(await f.text()));
          e.target.value = '';
        }} />
      </div>
      <p className="muted">{t('scores_hint')}</p>
      <div className="table-wrap grid-wrap">
        <table className="tbl grid-tbl" key={nonce}>
          <thead>
            <tr>
              <th className="stick">{t('student_name')}</th>
              {exam.questions.map((q, i) => <th key={q.id}>Q{i + 1}<div className="sub">/{fmt(q.max)}</div></th>)}
              <th>{t('total')}</th><th>%</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, r) => {
              const has = !!exam.scores[s.id];
              const tot = rowTotal(s.id);
              return (
                <tr key={s.id} className={has ? '' : 'absent'}>
                  <td className="stick">{s.name}</td>
                  {exam.questions.map((q, c) => (
                    <td key={q.id}>
                      <input className="cell" inputMode="decimal" data-r={r} data-c={c}
                        defaultValue={exam.scores[s.id]?.[q.id] ?? ''}
                        onFocus={(e) => e.currentTarget.select()}
                        onChange={(e) => { const n = toNumber(e.target.value); e.currentTarget.classList.toggle('bad', n !== null && (n < 0 || n > q.max)); }}
                        onBlur={(e) => commit(s.id, q.id, e.target.value, q.max)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'ArrowDown') {
                            e.preventDefault(); commit(s.id, q.id, e.currentTarget.value, q.max);
                            (document.querySelector(`[data-r="${r + 1}"][data-c="${c}"]`) as HTMLInputElement | null)?.focus();
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            (document.querySelector(`[data-r="${r - 1}"][data-c="${c}"]`) as HTMLInputElement | null)?.focus();
                          }
                        }} />
                    </td>
                  ))}
                  <td><b>{has ? fmt(tot) : '—'}</b></td>
                  <td>{has && T ? fmt((tot / T) * 100) : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="row gap wrap">
        <Btn kind="primary" icon="chart" onClick={() => go(`/exam/${exam.id}/results`)}>{t('view_results')}</Btn>
      </div>
      {paste && <PasteScores onClose={() => setPaste(false)} onApply={(rows) => { applyTable(rows); setPaste(false); }} />}
    </>
  );
}

function PasteScores({ onApply, onClose }: { onApply: (r: string[][]) => void; onClose: () => void }) {
  const [text, setText] = useState('');
  return (
    <Modal title={t('paste_scores')} onClose={onClose} footer={<><Btn onClick={onClose}>{t('cancel')}</Btn><Btn kind="primary" icon="check" onClick={() => onApply(parseTable(text))}>{t('import')}</Btn></>}>
      <p className="muted">{t('paste_scores_hint')}</p>
      <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder={'1001\tمحمد أحمد\t2\t1.5\t0\t…'} />
    </Modal>
  );
}

/* ================================================================ results */
function ExamResults({ exam, cls }: { exam: Exam; cls: ClassRoom }) {
  const db = useDB();
  const lang = curLang();
  const th = thresholdsOf(db);
  const name = skillNamer(db, lang);
  const students = db.students.filter((s) => s.classId === cls.id);
  const an = useMemo(() => analyzeExam(exam, students, th), [exam, db.students, th.mastery, th.developing, th.minItems]);
  const stat = (m: number) => (m + 1e-9 >= th.mastery ? 'mastered' : m + 1e-9 >= th.developing ? 'developing' : 'non') as 'mastered' | 'developing' | 'non';
  if (!exam.questions.length || an.assessedCount === 0) {
    return <Empty icon="chart" title={t('no_results')} text={t('no_results_text')}><Btn kind="primary" onClick={() => go(`/exam/${exam.id}/${exam.questions.length ? 'scores' : 'setup'}`)}>{exam.questions.length ? t('tab_scores') : t('tab_setup')}</Btn></Empty>;
  }
  const sorted = [...an.classSkills].sort((a, b) => a.M - b.M);
  const exportCSV = () => {
    const sk = an.classSkills.map((s) => s.skillId);
    const head = [t('student_no'), t('student_name'), t('total'), '%', ...sk.flatMap((id) => [`${name(id)} M%`, `${name(id)} C%`])];
    const rows = students.map((s) => {
      const r = an.results[s.id];
      return [s.no, s.name, r.assessed ? fmt(r.total, 2) : '', r.assessed ? fmt(r.pct) : '',
        ...sk.flatMap((id) => { const k = r.skills.find((x) => x.skillId === id); return r.assessed && k ? [fmt(k.M), fmt(k.C, 2)] : ['', '']; })];
    });
    void saveBlob(`results-${exam.title}.csv`, csvBlob(toCSV([head, ...rows])));
  };

  return (
    <>
      <div className="stats">
        <div className="stat"><b>{an.assessedCount}/{students.length}</b><span>{t('assessed')}</span></div>
        <div className="stat"><b>{fmt(an.average)}%</b><span>{t('class_avg')}</span></div>
        <div className="stat"><b>{fmt(an.max)}</b><span>{t('total_points')}</span></div>
      </div>
      {an.unmappedQuestions.length > 0 && <p className="warn-t">⚠ {t('unmapped_questions', { q: an.unmappedQuestions.join(', ') })}</p>}

      <div className="row gap wrap">
        <Btn kind="primary" icon="file" onClick={() => go(`/class-report/${exam.id}`)}>{t('class_report')}</Btn>
        <Btn icon="print" onClick={() => go(`/reports/${exam.id}`)}>{t('all_reports')}</Btn>
        <Btn icon="download" onClick={exportCSV}>{t('export_results')}</Btn>
      </div>

      <div className="card">
        <h2>{t('cr_weakest')}</h2>
        <div className="bars">
          {sorted.map((s) => (
            <div key={s.skillId} className="bar-row">
              <div className="bar-lbl"><span>{name(s.skillId)}{s.insufficient && <sup className="warn-t"> *</sup>}</span></div>
              <div className="bar-line"><MasteryBar pct={s.M} th={th} status={stat(s.M)} /><b>{fmt(s.M)}%</b></div>
            </div>
          ))}
        </div>
        <div className="legend">
          {(['mastered', 'developing', 'non'] as const).map((s) => <span key={s}><i style={{ background: STATUS_COLOR[s] }} />{t('st_' + s)}</span>)}
        </div>
      </div>

      <div className="card">
        <h2>{t('cr_remedial')}</h2>
        {sorted.filter((s) => s.studentsByStatus.non.length).length === 0 && <p className="muted">{t('cr_no_remedial')}</p>}
        {sorted.filter((s) => s.studentsByStatus.non.length).map((s) => (
          <details key={s.skillId} className="rem">
            <summary><b>{name(s.skillId)}</b> <span className="muted">({s.studentsByStatus.non.length})</span></summary>
            <div className="chips">{s.studentsByStatus.non.map((id) => <span className="chip" key={id}>{db.students.find((x) => x.id === id)?.name}</span>)}</div>
          </details>
        ))}
      </div>

      <div className="card">
        <h2>{t('students')}</h2>
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>{t('student_name')}</th><th>{t('total')}</th><th>%</th><th>{t('skills')}</th><th /></tr></thead>
            <tbody>
              {students.map((s) => {
                const r = an.results[s.id];
                return (
                  <tr key={s.id} className={r.assessed ? '' : 'absent'}>
                    <td>{s.name}</td>
                    <td>{r.assessed ? `${fmt(r.total)}/${fmt(r.max)}` : t('absent')}</td>
                    <td>{r.assessed ? fmt(r.pct) + '%' : '—'}</td>
                    <td><span className="dots">{r.skills.map((k) => <i key={k.skillId} title={`${name(k.skillId)} ${fmt(k.M)}%`} style={{ background: STATUS_COLOR[k.status] }} />)}</span></td>
                    <td className="act">{r.assessed && <Btn small icon="file" onClick={() => go(`/report/${exam.id}/${s.id}`)}>{t('report')}</Btn>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="hint"><StatusBadge status="mastered" lang={lang} /> ≥ {th.mastery}% · <StatusBadge status="developing" lang={lang} /> ≥ {th.developing}% · <StatusBadge status="non" lang={lang} /> &lt; {th.developing}%</p>
    </>
  );
}
