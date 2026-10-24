import { useSyncExternalStore } from 'react';
import type { Bi, CalcMode, ClassRoom, DB, Exam, Lang, Question, Settings, Skill, Student, Subject, Thresholds } from './core/types';
import { SEED_SKILLS } from './data/skills';

export const DEFAULT_SETTINGS: Settings = {
  lang: 'ar', mastery: 80, developing: 60, minItems: 3, teacher: '', school: '', defaultMode: 'M', showBoth: true,
};

export const emptyDB = (): DB => ({
  v: 1, settings: { ...DEFAULT_SETTINGS }, classes: [], students: [], exams: [], customSkills: [], customSubjects: [],
});

export function uid(): string {
  const c: Crypto | undefined = (globalThis as { crypto?: Crypto }).crypto;
  if (c?.randomUUID) return c.randomUUID().slice(0, 13);
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/* ------------------------------------------------------------------ state */
let db: DB = emptyDB();
let version = 0;
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };

export const getDB = () => db;
export function useDB(): DB {
  useSyncExternalStore(subscribe, () => version);
  return db;
}
export function mutate(fn: (d: DB) => void) {
  fn(db);
  version++;
  listeners.forEach((l) => l());
  schedulePersist();
}
export function replaceDB(next: DB) {
  db = normalize(next);
  version++;
  listeners.forEach((l) => l());
  schedulePersist();
}

function normalize(x: Partial<DB>): DB {
  const base = emptyDB();
  return {
    v: 1,
    settings: { ...base.settings, ...(x.settings || {}) },
    classes: x.classes || [], students: x.students || [], exams: x.exams || [],
    customSkills: x.customSkills || [], customSubjects: x.customSubjects || [],
  };
}

export const thresholdsOf = (d: DB): Thresholds => ({
  mastery: d.settings.mastery, developing: d.settings.developing, minItems: d.settings.minItems,
});

/* -------------------------------------------------------------- persistence */
const KEY = 'motqn-db-v1';
const IDB = 'motqn';

function idbOpen(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(IDB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbGet(): Promise<unknown> {
  const d = await idbOpen();
  return new Promise((res, rej) => {
    const q = d.transaction('kv').objectStore('kv').get(KEY);
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
}
async function idbSet(v: unknown): Promise<void> {
  const d = await idbOpen();
  return new Promise((res, rej) => {
    const tx = d.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(v, KEY);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

let timer: ReturnType<typeof setTimeout> | undefined;
function schedulePersist() {
  clearTimeout(timer);
  timer = setTimeout(persistNow, 350);
}
export async function persistNow() {
  try { await idbSet(db); return; } catch { /* fall through */ }
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* storage unavailable */ }
}

export async function loadDB() {
  let raw: unknown;
  try { raw = await idbGet(); } catch { raw = undefined; }
  if (!raw) {
    try { const s = localStorage.getItem(KEY); if (s) raw = JSON.parse(s); } catch { /* ignore */ }
  }
  if (raw && typeof raw === 'object') db = normalize(raw as Partial<DB>);
  version++;
  listeners.forEach((l) => l());
  // ask the browser not to evict our data
  try { await navigator.storage?.persist?.(); } catch { /* ignore */ }
}

window.addEventListener('pagehide', () => { void persistNow(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') void persistNow(); });

/* ------------------------------------------------------------------ skills */
export function allSkills(d: DB): Skill[] { return [...SEED_SKILLS, ...d.customSkills]; }
let cacheKey = '';
let cacheMap = new Map<string, Skill>();
export function skillMap(d: DB): Map<string, Skill> {
  const key = d.customSkills.length + ':' + d.customSkills.map((s) => s.id + s.name.ar + s.name.en).join('|');
  if (key !== cacheKey) {
    cacheKey = key;
    cacheMap = new Map(allSkills(d).map((s) => [s.id, s]));
  }
  return cacheMap;
}
export const nm = (b: Bi | undefined, lang: Lang) => (b ? b[lang] || b.ar || b.en : '');

/* ----------------------------------------------------------------- actions */
export const A = {
  setSettings(p: Partial<Settings>) { mutate((d) => { Object.assign(d.settings, p); }); },

  addClass(c: Omit<ClassRoom, 'id'>): string {
    const id = uid();
    mutate((d) => { d.classes.push({ ...c, id }); });
    return id;
  },
  updateClass(id: string, p: Partial<ClassRoom>) {
    mutate((d) => { const c = d.classes.find((x) => x.id === id); if (c) Object.assign(c, p); });
  },
  deleteClass(id: string) {
    mutate((d) => {
      d.classes = d.classes.filter((c) => c.id !== id);
      d.students = d.students.filter((s) => s.classId !== id);
      d.exams = d.exams.filter((e) => e.classId !== id);
    });
  },

  addStudents(classId: string, list: { no: string; name: string }[]) {
    mutate((d) => {
      const have = new Set(d.students.filter((s) => s.classId === classId).map((s) => s.no + '|' + s.name));
      for (const s of list) {
        if (!s.name.trim() || have.has(s.no + '|' + s.name)) continue;
        d.students.push({ id: uid(), classId, no: s.no, name: s.name.trim() });
      }
    });
  },
  updateStudent(id: string, p: Partial<Student>) {
    mutate((d) => { const s = d.students.find((x) => x.id === id); if (s) Object.assign(s, p); });
  },
  deleteStudent(id: string) {
    mutate((d) => {
      d.students = d.students.filter((s) => s.id !== id);
      for (const e of d.exams) delete e.scores[id];
    });
  },

  addExam(e: { classId: string; subjectId: string; title: string; date: string; mode: CalcMode }): string {
    const id = uid();
    mutate((d) => {
      d.exams.push({ ...e, id, questions: [], scores: {} });
    });
    return id;
  },
  updateExam(id: string, p: Partial<Exam>) {
    mutate((d) => { const e = d.exams.find((x) => x.id === id); if (e) Object.assign(e, p); });
  },
  deleteExam(id: string) { mutate((d) => { d.exams = d.exams.filter((e) => e.id !== id); }); },
  duplicateExam(id: string, title: string): string | undefined {
    const src = getDB().exams.find((e) => e.id === id);
    if (!src) return undefined;
    const nid = uid();
    mutate((d) => {
      d.exams.push({
        ...src, id: nid, title, scores: {},
        questions: src.questions.map((q) => ({ ...q, id: uid(), skills: q.skills.map((s) => ({ ...s })) })),
      });
    });
    return nid;
  },
  addQuestions(examId: string, n: number, max: number) {
    mutate((d) => {
      const e = d.exams.find((x) => x.id === examId);
      if (!e) return;
      for (let i = 0; i < n; i++) e.questions.push({ id: uid(), max, skills: [] });
    });
  },
  updateQuestion(examId: string, qid: string, p: Partial<Question>) {
    mutate((d) => {
      const q = d.exams.find((x) => x.id === examId)?.questions.find((x) => x.id === qid);
      if (q) Object.assign(q, p);
    });
  },
  deleteQuestions(examId: string, qids: string[]) {
    mutate((d) => {
      const e = d.exams.find((x) => x.id === examId);
      if (!e) return;
      e.questions = e.questions.filter((q) => !qids.includes(q.id));
      for (const row of Object.values(e.scores)) for (const id of qids) delete row[id];
    });
  },
  setScore(examId: string, studentId: string, qid: string, v: number | null) {
    mutate((d) => {
      const e = d.exams.find((x) => x.id === examId);
      if (!e) return;
      const row = (e.scores[studentId] ||= {});
      if (v === null) delete row[qid]; else row[qid] = v;
      if (!Object.keys(row).length) delete e.scores[studentId];
    });
  },
  setScoresBulk(examId: string, rows: { studentId: string; scores: Record<string, number> }[]) {
    mutate((d) => {
      const e = d.exams.find((x) => x.id === examId);
      if (!e) return;
      for (const r of rows) e.scores[r.studentId] = { ...(e.scores[r.studentId] || {}), ...r.scores };
    });
  },

  addCustomSkill(s: Omit<Skill, 'id' | 'code' | 'custom'>): Skill {
    const n = getDB().customSkills.length + 1;
    const id = 'CUS-' + uid();
    const skill: Skill = { ...s, id, code: `CUS-${String(n).padStart(3, '0')}`, custom: true };
    mutate((d) => { d.customSkills.push(skill); });
    return skill;
  },
  updateCustomSkill(id: string, p: Partial<Skill>) {
    mutate((d) => { const s = d.customSkills.find((x) => x.id === id); if (s) Object.assign(s, p); });
  },
  deleteCustomSkill(id: string) { mutate((d) => { d.customSkills = d.customSkills.filter((s) => s.id !== id); }); },
  addCustomSubject(s: Omit<Subject, 'id' | 'custom'>): Subject {
    const sub: Subject = { ...s, id: 'cus-' + uid(), custom: true };
    mutate((d) => { d.customSubjects.push(sub); });
    return sub;
  },
};
