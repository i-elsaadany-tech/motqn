import { useMemo, useState } from 'react';
import type { Bloom, Framework } from '../core/types';
import { FRAMEWORKS, gradeName, gradesOf, SUBJECTS } from '../data/curriculum';
import { BLOOM_LABEL } from '../data/skills';
import { A, allSkills, nm, replaceDB, useDB, emptyDB, getDB } from '../store';
import { loadDemo } from '../data/demo';
import { saveBlob, textBlob } from '../native';
import { Btn, Empty, Field, Icon, Modal, curLang, go, t, toast } from './common';

/* ------------------------------------------------------------------ skills */
export function SkillsLibrary() {
  const db = useDB();
  const lang = curLang();
  const [fw, setFw] = useState<Framework>('MOE_SA');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<string | null>(null);

  const subjects = [...SUBJECTS, ...db.customSubjects].filter((s) => s.framework === fw && (!grade || s.grades.includes(grade)));
  const all = useMemo(() => allSkills(db), [db.customSkills]);
  const list = all.filter((s) => {
    if (s.framework !== fw) return false;
    if (grade && !s.grades.includes(grade)) return false;
    if (subject && s.subjectId !== subject) return false;
    if (q && !`${s.name.ar} ${s.name.en} ${s.code}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const subName = (id: string) => nm([...SUBJECTS, ...db.customSubjects].find((s) => s.id === id)?.name, lang);
  const coverage = SUBJECTS.filter((s) => s.framework === fw).length;
  const covered = new Set(all.filter((s) => s.framework === fw).map((s) => s.subjectId)).size;
  const grouped = new Map<string, typeof list>();
  list.forEach((s) => grouped.set(s.subjectId, [...(grouped.get(s.subjectId) || []), s]));

  return (
    <div className="page">
      <div className="row between wrap"><h1>{t('skills_library')}</h1></div>
      <p className="muted">{t('lib_total', { n: all.length, c: covered, s: coverage })} {t('lib_disclaimer')}</p>
      <div className="filters">
        <select value={fw} onChange={(e) => { setFw(e.target.value as Framework); setGrade(''); setSubject(''); }}>
          {(Object.keys(FRAMEWORKS) as Framework[]).map((f) => <option key={f} value={f}>{FRAMEWORKS[f][lang]}</option>)}
        </select>
        <select value={grade} onChange={(e) => { setGrade(e.target.value); setSubject(''); }}>
          <option value="">{t('all_grades')}</option>
          {gradesOf(fw).map((g) => <option key={g} value={g}>{gradeName(g)[lang]}</option>)}
        </select>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">{t('all_subjects')}</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{nm(s.name, lang)}</option>)}
        </select>
        <div className="search"><Icon name="search" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_skill')} /></div>
      </div>
      {list.length === 0 && <Empty icon="book" title={t('no_skills_here')} />}
      {[...grouped.entries()].map(([sid, items]) => (
        <div className="card" key={sid}>
          <h3>{subName(sid)} <span className="muted">({items.length})</span></h3>
          {items.map((s) => (
            <div className="skill-row" key={s.id}>
              <div className="grow">
                <b>{nm(s.name, lang)}</b>
                <div className="sub">{lang === 'ar' ? s.name.en : s.name.ar}</div>
                <div className="sub">{nm(s.domain, lang)} · {BLOOM_LABEL[s.bloom][lang]}{s.ref ? ` · ${s.ref}` : ''}</div>
              </div>
              {s.custom && <span className="tagc">{t('custom')}</span>}
              <span className="code">{s.code}</span>
              {s.custom && <>
                <button type="button" className="icon-btn" aria-label={t('edit')} onClick={() => setEdit(s.id)}><Icon name="edit" size={16} /></button>
                <button type="button" className="icon-btn" aria-label={t('delete')} onClick={() => { if (confirm(t('confirm_delete'))) A.deleteCustomSkill(s.id); }}><Icon name="trash" size={16} /></button>
              </>}
            </div>
          ))}
        </div>
      ))}
      {edit && <EditSkill id={edit} onClose={() => setEdit(null)} />}
      <p className="hint">{t('lib_hint_add')}</p>
    </div>
  );
}

function EditSkill({ id, onClose }: { id: string; onClose: () => void }) {
  const db = useDB();
  const s = db.customSkills.find((x) => x.id === id);
  const [f, setF] = useState({ ar: s?.name.ar ?? '', en: s?.name.en ?? '', bloom: (s?.bloom ?? 'apply') as Bloom });
  const lang = curLang();
  if (!s) return null;
  return (
    <Modal title={t('edit')} onClose={onClose} footer={<><Btn onClick={onClose}>{t('cancel')}</Btn><Btn kind="primary" icon="check" onClick={() => { A.updateCustomSkill(id, { name: { ar: f.ar || f.en, en: f.en || f.ar }, bloom: f.bloom }); onClose(); }}>{t('save')}</Btn></>}>
      <div className="grid2">
        <Field label={t('skill_name_ar')}><input dir="rtl" value={f.ar} onChange={(e) => setF({ ...f, ar: e.target.value })} /></Field>
        <Field label={t('skill_name_en')}><input dir="ltr" value={f.en} onChange={(e) => setF({ ...f, en: e.target.value })} /></Field>
        <Field label={t('bloom')}>
          <select value={f.bloom} onChange={(e) => setF({ ...f, bloom: e.target.value as Bloom })}>
            {(Object.keys(BLOOM_LABEL) as Bloom[]).map((b) => <option key={b} value={b}>{BLOOM_LABEL[b][lang]}</option>)}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------- settings */
export function Settings() {
  const db = useDB();
  const s = db.settings;
  const set = A.setSettings;
  const num = (v: string, min: number, max: number, d: number) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d; };
  const invalid = s.developing >= s.mastery;
  return (
    <div className="page">
      <h1>{t('settings')}</h1>

      <div className="card">
        <h3>{t('language')}</h3>
        <div className="seg big">
          <button type="button" className={s.lang === 'ar' ? 'on' : ''} onClick={() => set({ lang: 'ar' })}>العربية</button>
          <button type="button" className={s.lang === 'en' ? 'on' : ''} onClick={() => set({ lang: 'en' })}>English</button>
        </div>
      </div>

      <div className="card">
        <h3>{t('report_identity')}</h3>
        <div className="grid2">
          <Field label={t('school')}><input value={s.school} onChange={(e) => set({ school: e.target.value })} /></Field>
          <Field label={t('teacher')}><input value={s.teacher} onChange={(e) => set({ teacher: e.target.value })} /></Field>
        </div>
      </div>

      <div className="card">
        <h3>{t('thresholds')}</h3>
        <p className="muted">{t('thresholds_hint')}</p>
        <div className="grid3">
          <Field label={t('th_mastery')}><input type="number" min={1} max={100} value={s.mastery} onChange={(e) => set({ mastery: num(e.target.value, 1, 100, 80) })} /></Field>
          <Field label={t('th_developing')}><input type="number" min={0} max={99} value={s.developing} onChange={(e) => set({ developing: num(e.target.value, 0, 99, 60) })} /></Field>
          <Field label={t('th_min_items')} hint={t('th_min_items_hint')}><input type="number" min={1} max={10} value={s.minItems} onChange={(e) => set({ minItems: num(e.target.value, 1, 10, 3) })} /></Field>
        </div>
        {invalid && <p className="bad-t">⚠ {t('th_invalid')}</p>}
        <h3 className="sec">{t('default_mode')}</h3>
        <div className="seg big">
          <button type="button" className={s.defaultMode === 'M' ? 'on' : ''} onClick={() => set({ defaultMode: 'M' })}>M · {t('mode_M_short')}</button>
          <button type="button" className={s.defaultMode === 'C' ? 'on' : ''} onClick={() => set({ defaultMode: 'C' })}>C · {t('mode_C_short')}</button>
        </div>
        <label className="check"><input type="checkbox" checked={s.showBoth} onChange={(e) => set({ showBoth: e.target.checked })} /> {t('show_both')}</label>
      </div>

      <div className="card">
        <h3>{t('data')}</h3>
        <p className="muted">{t('data_local')}</p>
        <div className="row gap wrap">
          <Btn icon="download" onClick={() => void saveBlob(`motqn-backup-${new Date().toISOString().slice(0, 10)}.json`, textBlob(JSON.stringify(getDB()), 'application/json'))}>{t('backup')}</Btn>
          <label className="btn ghost"><Icon name="upload" size={18} /><span>{t('restore')}</span>
            <input type="file" accept=".json,application/json" hidden onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try {
                const j = JSON.parse(await f.text());
                if (j?.v !== 1 || !Array.isArray(j.classes)) throw new Error('bad');
                if (confirm(t('confirm_restore'))) { replaceDB(j); toast(t('restored')); }
              } catch { toast(t('restore_failed')); }
            }} />
          </label>
          <Btn icon="grid" onClick={() => { const id = loadDemo(); toast(t('demo_loaded')); go(`/exam/${id}/results`); }}>{t('load_demo')}</Btn>
          <Btn kind="danger" icon="trash" onClick={() => { if (confirm(t('confirm_wipe'))) { const l = getDB().settings; const n = emptyDB(); n.settings = l; replaceDB(n); go('/'); } }}>{t('wipe')}</Btn>
        </div>
      </div>

      <div className="card">
        <h3>{t('about')}</h3>
        <p>{t('about_text')}</p>
        <p className="muted">v1.0.0 · <a href="privacy.html" target="_blank" rel="noreferrer">{t('privacy')}</a></p>
      </div>
    </div>
  );
}
