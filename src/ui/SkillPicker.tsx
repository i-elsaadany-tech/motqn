import { useMemo, useState } from 'react';
import type { Bloom, Framework, QuestionSkill } from '../core/types';
import { BLOOM_LABEL } from '../data/skills';
import { A, allSkills, nm, useDB } from '../store';
import { Btn, Field, Icon, Modal, curLang, t } from './common';

export interface PickCtx { framework: Framework; grade: string; subjectId: string }

export function SkillPicker({ ctx, initial, title, onApply, onClose }: {
  ctx: PickCtx; initial: QuestionSkill[]; title: string; onApply: (s: QuestionSkill[]) => void; onClose: () => void;
}) {
  const db = useDB();
  const lang = curLang();
  const [sel, setSel] = useState<Record<string, number>>(() => {
    const sum = initial.reduce((a, s) => a + s.w, 0) || 1;
    return Object.fromEntries(initial.map((s) => [s.skillId, Math.round((s.w / sum) * 1000) / 10]));
  });
  const [q, setQ] = useState('');
  const [scope, setScope] = useState<'subject' | 'grade'>('subject');
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ ar: '', en: '', dAr: '', dEn: '', bloom: 'apply' as Bloom });

  const all = useMemo(() => allSkills(db), [db, db.customSkills.length]);
  const byId = useMemo(() => new Map(all.map((s) => [s.id, s])), [all]);
  const list = all.filter((s) => {
    if (s.framework !== ctx.framework || !s.grades.includes(ctx.grade)) return false;
    if (scope === 'subject' && s.subjectId !== ctx.subjectId) return false;
    if (q) {
      const hay = `${s.name.ar} ${s.name.en} ${s.code} ${s.domain.ar} ${s.domain.en}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });
  const domains = [...new Set(list.map((s) => nm(s.domain, lang)))];
  const ids = Object.keys(sel);
  const total = ids.reduce((a, id) => a + (sel[id] || 0), 0);

  const toggle = (id: string) => setSel((m) => {
    const n = { ...m };
    if (id in n) delete n[id]; else n[id] = 0;
    const k = Object.keys(n);
    k.forEach((x) => (n[x] = Math.round((100 / k.length) * 10) / 10));
    return n;
  });
  const equalize = () => setSel((m) => {
    const k = Object.keys(m);
    return Object.fromEntries(k.map((x) => [x, Math.round((100 / k.length) * 10) / 10]));
  });

  const addCustom = () => {
    const ar = f.ar.trim(), en = f.en.trim();
    if (!ar && !en) return;
    const sk = A.addCustomSkill({
      framework: ctx.framework, subjectId: ctx.subjectId, grades: [ctx.grade],
      name: { ar: ar || en, en: en || ar }, domain: { ar: f.dAr || t('custom_skill'), en: f.dEn || f.dAr || 'Custom' }, bloom: f.bloom,
    });
    setSel((m) => {
      const n = { ...m, [sk.id]: 0 };
      const k = Object.keys(n);
      k.forEach((x) => (n[x] = Math.round((100 / k.length) * 10) / 10));
      return n;
    });
    setF({ ar: '', en: '', dAr: '', dEn: '', bloom: 'apply' });
    setAdding(false);
  };

  return (
    <Modal wide title={title} onClose={onClose}
      footer={<>
        <Btn onClick={onClose}>{t('cancel')}</Btn>
        <Btn kind="primary" icon="check" onClick={() => onApply(ids.map((id) => ({ skillId: id, w: ids.length === 1 ? 1 : Math.max(sel[id], 0.0001) })))}>{t('apply')}</Btn>
      </>}>
      {ids.length > 0 && (
        <div className="sel-box">
          <div className="row between wrap">
            <b>{t('selected_skills')} ({ids.length})</b>
            {ids.length > 1 && <div className="row"><span className={total > 99.9 && total < 100.1 ? 'ok-t' : 'bad-t'}>{t('weights_total')}: {Math.round(total * 10) / 10}%</span><Btn small onClick={equalize}>{t('equalize')}</Btn></div>}
          </div>
          {ids.map((id) => (
            <div key={id} className="sel-row">
              <span className="grow">{nm(byId.get(id)?.name, lang)}<span className="code"> {byId.get(id)?.code}</span></span>
              {ids.length > 1 && <span className="row"><input className="num-in" type="number" min={0} max={100} step={0.5} value={sel[id]} onChange={(e) => setSel((m) => ({ ...m, [id]: Number(e.target.value) }))} />%</span>}
              <button type="button" className="icon-btn" onClick={() => toggle(id)} aria-label={t('remove')}><Icon name="x" size={16} /></button>
            </div>
          ))}
          {ids.length > 1 && <p className="hint">{t('weights_hint')}</p>}
        </div>
      )}

      <div className="row wrap gap">
        <div className="search grow"><Icon name="search" size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_skill')} /></div>
        <select value={scope} onChange={(e) => setScope(e.target.value as 'subject' | 'grade')}>
          <option value="subject">{t('scope_subject')}</option>
          <option value="grade">{t('scope_grade')}</option>
        </select>
        <Btn icon="plus" onClick={() => setAdding((a) => !a)}>{t('add_custom_skill')}</Btn>
      </div>

      {adding && (
        <div className="card inset">
          <div className="grid2">
            <Field label={t('skill_name_ar')}><input value={f.ar} onChange={(e) => setF({ ...f, ar: e.target.value })} dir="rtl" /></Field>
            <Field label={t('skill_name_en')}><input value={f.en} onChange={(e) => setF({ ...f, en: e.target.value })} dir="ltr" /></Field>
            <Field label={t('domain_ar')}><input value={f.dAr} onChange={(e) => setF({ ...f, dAr: e.target.value })} dir="rtl" /></Field>
            <Field label={t('domain_en')}><input value={f.dEn} onChange={(e) => setF({ ...f, dEn: e.target.value })} dir="ltr" /></Field>
            <Field label={t('bloom')}>
              <select value={f.bloom} onChange={(e) => setF({ ...f, bloom: e.target.value as Bloom })}>
                {(Object.keys(BLOOM_LABEL) as Bloom[]).map((b) => <option key={b} value={b}>{BLOOM_LABEL[b][lang]}</option>)}
              </select>
            </Field>
          </div>
          <div className="row end"><Btn kind="primary" icon="plus" onClick={addCustom}>{t('add')}</Btn></div>
        </div>
      )}

      <div className="skill-list">
        {list.length === 0 && <p className="muted pad">{t('no_skills_here')}</p>}
        {domains.map((d) => (
          <div key={d}>
            <div className="dom">{d}</div>
            {list.filter((s) => nm(s.domain, lang) === d).map((s) => (
              <label key={s.id} className={`skill-item ${s.id in sel ? 'on' : ''}`}>
                <input type="checkbox" checked={s.id in sel} onChange={() => toggle(s.id)} />
                <span className="grow">{nm(s.name, lang)}<span className="sub">{lang === 'ar' ? s.name.en : s.name.ar}</span></span>
                {s.custom && <span className="tagc">{t('custom')}</span>}
                <span className="code">{s.code}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}
