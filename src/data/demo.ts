import { SEED_SKILLS } from './skills';
import { getDB, mutate, uid } from '../store';
import type { Exam, Question } from '../core/types';

/** Deterministic sample class + two maths exams so the app can be explored immediately. */
const NAMES = [
  'عبدالله العتيبي', 'محمد القحطاني', 'فهد الدوسري', 'سلمان الشمري', 'خالد الحربي', 'ياسر الغامدي', 'تركي الزهراني',
  'ناصر المطيري', 'بندر السبيعي', 'سعود العنزي', 'ريان الشهري', 'عمر البلوي', 'زياد الرشيدي', 'مازن الجهني',
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

const byEn = (en: string) => {
  const s = SEED_SKILLS.find((k) => k.subjectId === 'math' && k.name.en === en);
  if (!s) throw new Error('demo skill missing: ' + en);
  return s.id;
};

export function loadDemo(): string {
  const rand = rng(2026);
  const classId = uid();
  const studentIds = NAMES.map(() => uid());

  const S = {
    div: 'SKL-MATH-401', area: 'SKL-MATH-402', graph: 'SKL-MATH-403', cmp: 'SKL-MATH-404',
    mul: byEn('Multiply by two-digit numbers'), addf: byEn('Add and subtract fractions'),
    pat: byEn('Patterns and simple algebraic expressions'), multi: byEn('Solve multi-step word problems'),
  };
  const q = (max: number, ...ids: [string, number?][]): Question => ({
    id: uid(), max, skills: ids.map(([skillId, w]) => ({ skillId, w: w ?? 1 })),
  });

  const examQs: Question[] = [
    q(2, [S.div]), q(2, [S.div]), q(2, [S.div]),
    q(2, [S.area]), q(2, [S.area]),
    q(1, [S.graph]), q(1, [S.graph]),
    q(2, [S.cmp]), q(2, [S.cmp]), q(2, [S.cmp]), q(2, [S.cmp]),
    q(6, [S.mul]), q(6, [S.addf]), q(4, [S.pat]),
    q(4, [S.multi, 3], [S.addf, 1]),
  ];
  const earlyQs: Question[] = [
    q(2, [S.div]), q(2, [S.div]), q(2, [S.div]),
    q(3, [S.cmp]), q(3, [S.cmp]), q(3, [S.cmp]),
    q(4, [S.mul]), q(4, [S.mul]), q(4, [S.addf]), q(5, [S.area]),
  ];

  // each skill is "harder" or "easier" for this class
  const diff: Record<string, number> = {
    [S.div]: -0.08, [S.area]: 0.12, [S.graph]: 0.04, [S.cmp]: -0.3, [S.mul]: 0.05, [S.addf]: -0.05, [S.pat]: 0.0, [S.multi]: -0.1,
  };
  const ability = studentIds.map(() => 0.45 + rand() * 0.5);

  const fill = (qs: Question[], boost: number, absentIdx: number[]) => {
    const scores: Exam['scores'] = {};
    studentIds.forEach((sid, i) => {
      if (absentIdx.includes(i)) return;
      const row: Record<string, number> = {};
      for (const qq of qs) {
        const d = qq.skills.reduce((a, s) => a + (diff[s.skillId] ?? 0), 0) / qq.skills.length;
        const p = Math.min(1, Math.max(0, ability[i] + boost + d + (rand() - 0.5) * 0.35));
        row[qq.id] = Math.round(qq.max * p * 2) / 2;
      }
      scores[sid] = row;
    });
    return scores;
  };

  const exam: Exam = {
    id: uid(), classId, subjectId: 'math', title: 'اختبار الرياضيات - الوحدة الثالثة', date: '2026-10-15', mode: 'M',
    questions: examQs, scores: fill(examQs, 0.03, [13]),
  };
  const early: Exam = {
    id: uid(), classId, subjectId: 'math', title: 'اختبار قصير - الوحدة الثانية', date: '2026-09-20', mode: 'M',
    questions: earlyQs, scores: fill(earlyQs, -0.1, [13]),
  };

  mutate((d) => {
    d.classes.push({ id: classId, name: 'الرابع الابتدائي / أ', framework: 'MOE_SA', grade: 'p4', section: 'أ' });
    NAMES.forEach((name, i) => d.students.push({ id: studentIds[i], classId, no: String(1001 + i), name }));
    d.exams.push(early, exam);
  });
  return getDB().exams.find((e) => e.id === exam.id)!.id;
}
