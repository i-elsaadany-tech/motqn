import { useState } from 'react';
import type { CalcMode, ClassRoom, Framework } from '../core/types';
import { parseTable } from '../core/csv';
import { findSubject, FRAMEWORKS, gradeName, gradesOf, needsTrack, STAGES, stageOf, subjectsFor, TRACKS } from '../data/curriculum';
import { loadDemo } from '../data/demo';
import { A, nm, useDB } from '../store';
import { Btn, Empty, Field, Icon, Modal, curLang, go, t, today, toast } from './common';
import logoFull from '../../public/logo-full.jpg';

/* ------------------------------------------------------------------- home */
export function Home() {
  const db = useDB();
  const lang = curLang();
  const recent = [...db.exams].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <div className="page">
      <section className="hero">
        <img src={logoFull} alt="Motqn" className="hero-logo" />
        <p>{t('tagline')}</p>
      </section>

      {db.classes.length === 0 ? (
        <Empty icon="users" title={t('start_title')} text={t('start_text')}>
          <Btn kind="primary" icon="plus" onClick={() => go('/classes?new=1')}>{t('add_class')}</Btn>
          <Btn icon="grid" onClick={() => { const id = loadDemo(); toast(t('demo_loaded')); go(`/exam/${id}/results`); }}>{t('load_demo')}</Btn>
        </Empty>
      ) : (
        <>
          <div className="stats">
            <div className="stat"><b>{db.classes.length}</b><span>{t('classes')}</span></div>
            <div className="stat"><b>{db.students.length}</b><span>{t('students')}</span></div>
            <div className="stat"><b>{db.exams.length}</b><span>{t('exams')}</span></div>
          </div>
          <div className="row gap wrap">
            <Btn kind="primary" icon="plus" onClick={() => go('/classes?new=1')}>{t('add_class')}</Btn>
            <Btn icon="book" onClick={() => go('/skills')}>{t('skills_library')}</Btn>
          </div>
          <h2 className="sec">{t('recent_exams')}</h2>
          {recent.length === 0 && <p className="muted">{t('no_exams')}</p>}
          <div className="list">
            {recent.map((e) => {
              const c = db.classes.find((x) => x.id === e.classId);
              return (
                <a key={e.id} className="item link" href={`#/exam/${e.id}/results`}>
                  <div className="grow">
                    <b>{e.title}</b>
                    <div className="sub">{nm(findSubject(e.subjectId, db.customSubjects)?.name, lang)} · {c?.name} · {e.date}</div>
                  </div>
                  <Icon name="back" size={18} />
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- classes */
export function ClassForm({ initial, onSave, onClose }: { initial?: ClassRoom; onSave: (c: Omit<ClassRoom, 'id'>) => void; onClose: () => void }) {
  const lang = curLang();
  const [fw, setFw] = useState<Framework>(initial?.framework ?? 'MOE_SA');
  const [grade, setGrade] = useState(initial?.grade ?? 'p1');
  const [track, setTrack] = useState(initial?.track ?? 'general');
  const [section, setSection] = useState(initial?.section ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const grades = gradesOf(fw);
  const autoName = `${gradeName(grade)[lang]}${section ? ' / ' + section : ''}`;
  const setFramework = (f: Framework) => { setFw(f); setGrade(gradesOf(f)[f === 'MOE_SA' ? 3 : 1]); };
  return (
    <Modal title={initial ? t('edit_class') : t('add_class')} onClose={onClose}
      footer={<><Btn onClick={onClose}>{t('cancel')}</Btn>
        <Btn kind="primary" icon="check" onClick={() => onSave({ name: name.trim() || autoName, framework: fw, grade, section: section.trim(), ...(needsTrack(fw, grade) ? { track } : {}) })}>{t('save')}</Btn></>}>
      <div className="grid2">
        <Field label={t('curriculum')}>
          <select value={fw} onChange={(e) => setFramework(e.target.value as Framework)}>
            {(Object.keys(FRAMEWORKS) as Framework[]).map((f) => <option key={f} value={f}>{FRAMEWORKS[f][lang]}</option>)}
          </select>
        </Field>
        <Field label={t('grade')}>
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            {grades.map((g) => <option key={g} value={g}>{gradeName(g)[lang]}</option>)}
          </select>
        </Field>
        {needsTrack(fw, grade) && (
          <Field label={t('track')}>
            <select value={track} onChange={(e) => setTrack(e.target.value)}>
              {Object.keys(TRACKS).map((k) => <option key={k} value={k}>{TRACKS[k][lang]}</option>)}
            </select>
          </Field>
        )}
        <Field label={t('section')}><input value={section} onChange={(e) => setSection(e.target.value)} placeholder="أ / A" /></Field>
        <Field label={t('class_name')} hint={t('class_name_hint')}><input value={name} onChange={(e) => setName(e.target.value)} placeholder={autoName} /></Field>
      </div>
    </Modal>
  );
}

export function Classes({ query }: { query: URLSearchParams }) {
  const db = useDB();
  const lang = curLang();
  const [adding, setAdding] = useState(query.get('new') === '1');
  return (
    <div className="page">
      <div className="row between wrap">
        <h1>{t('classes')}</h1>
        <Btn kind="primary" icon="plus" onClick={() => setAdding(true)}>{t('add_class')}</Btn>
      </div>
      {db.classes.length === 0 && <Empty icon="users" title={t('no_classes')} text={t('no_classes_text')}><Btn kind="primary" icon="plus" onClick={() => setAdding(true)}>{t('add_class')}</Btn></Empty>}
      <div className="cards">
        {db.classes.map((c) => (
          <a key={c.id} className="card link" href={`#/class/${c.id}`}>
            <div className="row between"><h3>{c.name}</h3><span className="tagc">{STAGES[stageOf(c.grade)][lang]}</span></div>
            <p className="muted">{FRAMEWORKS[c.framework][lang]}{c.track ? ' · ' + TRACKS[c.track][lang] : ''}</p>
            <div className="row gap muted">
              <span><Icon name="users" size={16} /> {db.students.filter((s) => s.classId === c.id).length}</span>
              <span><Icon name="file" size={16} /> {db.exams.filter((e) => e.classId === c.id).length}</span>
            </div>
          </a>
        ))}
      </div>
      {adding && <ClassForm onClose={() => { setAdding(false); if (query.get('new')) go('/classes'); }} onSave={(c) => { const id = A.addClass(c); setAdding(false); go(`/class/${id}`); }} />}
    </div>
  );
}

/* ------------------------------------------------------------ class detail */
export function ClassDetail({ id }: { id: string }) {
  const db = useDB();
  const lang = curLang();
  const cls = db.classes.find((c) => c.id === id);
  const [tab, setTab] = useState<'students' | 'exams'>('students');
  const [edit, setEdit] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [newExam, setNewExam] = useState(false);
  const [one, setOne] = useState<{ no: string; name: string } | null>(null);
  if (!cls) return <Empty title={t('not_found')} />;
  const students = db.students.filter((s) => s.classId === id);
  const exams = db.exams.filter((e) => e.classId === id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="page">
      <div className="crumbs"><a href="#/classes"><Icon name="back" size={16} /> {t('classes')}</a></div>
      <div className="row between wrap">
        <div>
          <h1>{cls.name}</h1>
          <p className="muted">{gradeName(cls.grade)[lang]} · {FRAMEWORKS[cls.framework][lang]}{cls.track ? ' · ' + TRACKS[cls.track][lang] : ''}</p>
        </div>
        <div className="row gap">
          <Btn icon="edit" small onClick={() => setEdit(true)}>{t('edit')}</Btn>
          <Btn icon="trash" small kind="danger" onClick={() => { if (confirm(t('confirm_delete_class'))) { A.deleteClass(id); go('/classes'); } }}>{t('delete')}</Btn>
        </div>
      </div>
      <div className="tabs">
        <button type="button" className={tab === 'students' ? 'on' : ''} onClick={() => setTab('students')}>{t('students')} ({students.length})</button>
        <button type="button" className={tab === 'exams' ? 'on' : ''} onClick={() => setTab('exams')}>{t('exams')} ({exams.length})</button>
      </div>

      {tab === 'students' && (
        <>
          <div className="row gap wrap">
            <Btn kind="primary" icon="plus" onClick={() => setOne({ no: '', name: '' })}>{t('add_student')}</Btn>
            <Btn icon="upload" onClick={() => setBulk(true)}>{t('paste_students')}</Btn>
          </div>
          {students.length === 0 ? <Empty icon="users" title={t('no_students')} text={t('no_students_text')} /> : (
            <div className="table-wrap">
              <table className="tbl">
                <thead><tr><th>#</th><th>{t('student_no')}</th><th>{t('student_name')}</th><th /></tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td><td>{s.no}</td><td>{s.name}</td>
                      <td className="act">
                        <button type="button" className="icon-btn" aria-label={t('edit')} onClick={() => setOne({ no: s.no, name: s.name, ...{ id: s.id } } as never)}><Icon name="edit" size={16} /></button>
                        <button type="button" className="icon-btn" aria-label={t('delete')} onClick={() => { if (confirm(t('confirm_delete'))) A.deleteStudent(s.id); }}><Icon name="trash" size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'exams' && (
        <>
          <Btn kind="primary" icon="plus" onClick={() => setNewExam(true)}>{t('new_exam')}</Btn>
          {exams.length === 0 ? <Empty icon="file" title={t('no_exams')} text={t('no_exams_text')} /> : (
            <div className="list">
              {exams.map((e) => (
                <a key={e.id} className="item link" href={`#/exam/${e.id}/${e.questions.length ? 'results' : 'setup'}`}>
                  <div className="grow"><b>{e.title}</b>
                    <div className="sub">{nm(findSubject(e.subjectId, db.customSubjects)?.name, lang)} · {e.date} · {e.questions.length} {t('questions')}</div></div>
                  <span className="tagc">{e.mode === 'M' ? 'M' : 'C'}</span>
                </a>
              ))}
            </div>
          )}
        </>
      )}

      {edit && <ClassForm initial={cls} onClose={() => setEdit(false)} onSave={(c) => { A.updateClass(id, c); setEdit(false); }} />}
      {bulk && <BulkStudents onClose={() => setBulk(false)} onSave={(list) => { A.addStudents(id, list); setBulk(false); toast(t('students_added', { n: list.length })); }} />}
      {one && <StudentForm init={one as { no: string; name: string; id?: string }} onClose={() => setOne(null)} onSave={(v) => {
        const sid = (one as { id?: string }).id;
        if (sid) A.updateStudent(sid, v); else A.addStudents(id, [v]);
        setOne(null);
      }} />}
      {newExam && <NewExam cls={cls} onClose={() => setNewExam(false)} />}
    </div>
  );
}

function StudentForm({ init, onSave, onClose }: { init: { no: string; name: string }; onSave: (v: { no: string; name: string }) => void; onClose: () => void }) {
  const [no, setNo] = useState(init.no);
  const [name, setName] = useState(init.name);
  return (
    <Modal title={t('student')} onClose={onClose} footer={<><Btn onClick={onClose}>{t('cancel')}</Btn><Btn kind="primary" icon="check" onClick={() => name.trim() && onSave({ no: no.trim(), name: name.trim() })}>{t('save')}</Btn></>}>
      <div className="grid2">
        <Field label={t('student_no')}><input value={no} onChange={(e) => setNo(e.target.value)} inputMode="numeric" /></Field>
        <Field label={t('student_name')}><input value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      </div>
    </Modal>
  );
}

function BulkStudents({ onSave, onClose }: { onSave: (l: { no: string; name: string }[]) => void; onClose: () => void }) {
  const [text, setText] = useState('');
  const rows = parseTable(text);
  const list = rows.map((r) => {
    if (r.length >= 2) return /^\d+$/.test(r[0]) ? { no: r[0], name: r.slice(1).join(' ') } : { no: r[r.length - 1], name: r[0] };
    return { no: '', name: r[0] };
  }).filter((x) => x.name);
  return (
    <Modal title={t('paste_students')} onClose={onClose} footer={<><Btn onClick={onClose}>{t('cancel')}</Btn><Btn kind="primary" icon="check" onClick={() => list.length && onSave(list)}>{t('add')} ({list.length})</Btn></>}>
      <p className="muted">{t('paste_students_hint')}</p>
      <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder={'1001\tمحمد أحمد\n1002\tسارة علي'} />
    </Modal>
  );
}

function NewExam({ cls, onClose }: { cls: ClassRoom; onClose: () => void }) {
  const db = useDB();
  const lang = curLang();
  const subs = subjectsFor(cls.framework, cls.grade, cls.track, db.customSubjects);
  const [subjectId, setSubjectId] = useState(subs[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [mode, setMode] = useState<CalcMode>(db.settings.defaultMode);
  const [addSub, setAddSub] = useState(false);
  const [sn, setSn] = useState({ ar: '', en: '' });
  const create = () => {
    if (!subjectId) return;
    const sub = findSubject(subjectId, db.customSubjects);
    const id = A.addExam({ classId: cls.id, subjectId, title: title.trim() || `${nm(sub?.name, lang)} - ${date}`, date, mode });
    go(`/exam/${id}/setup`);
  };
  return (
    <Modal title={t('new_exam')} onClose={onClose} footer={<><Btn onClick={onClose}>{t('cancel')}</Btn><Btn kind="primary" icon="check" onClick={create} disabled={!subjectId}>{t('create')}</Btn></>}>
      <div className="grid2">
        <Field label={t('subject')}>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            {subs.map((s) => <option key={s.id} value={s.id}>{nm(s.name, lang)}</option>)}
          </select>
        </Field>
        <Field label={t('date')}><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label={t('exam_title')}><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('exam_title_ph')} /></Field>
      </div>
      <button type="button" className="linkish" onClick={() => setAddSub((a) => !a)}>+ {t('add_custom_subject')}</button>
      {addSub && (
        <div className="card inset">
          <div className="grid2">
            <Field label={t('subject_name_ar')}><input value={sn.ar} onChange={(e) => setSn({ ...sn, ar: e.target.value })} dir="rtl" /></Field>
            <Field label={t('subject_name_en')}><input value={sn.en} onChange={(e) => setSn({ ...sn, en: e.target.value })} dir="ltr" /></Field>
          </div>
          <Btn icon="plus" onClick={() => {
            if (!sn.ar.trim() && !sn.en.trim()) return;
            const s = A.addCustomSubject({ name: { ar: sn.ar || sn.en, en: sn.en || sn.ar }, framework: cls.framework, grades: [cls.grade], ...(cls.track ? { track: cls.track } : {}) });
            setSubjectId(s.id); setAddSub(false); setSn({ ar: '', en: '' });
          }}>{t('add')}</Btn>
        </div>
      )}
      <ModePicker mode={mode} setMode={setMode} />
    </Modal>
  );
}

export function ModePicker({ mode, setMode }: { mode: CalcMode; setMode: (m: CalcMode) => void }) {
  return (
    <div className="modes">
      {(['M', 'C'] as CalcMode[]).map((m) => (
        <button key={m} type="button" className={`mode ${mode === m ? 'on' : ''}`} onClick={() => setMode(m)}>
          <b>{t(`mode_${m}`)}</b>
          <span>{t(`mode_${m}_desc`)}</span>
        </button>
      ))}
    </div>
  );
}
