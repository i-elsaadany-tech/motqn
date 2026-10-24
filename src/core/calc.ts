import type {
  ClassSkillStat, Exam, ExamAnalysis, Question, SkillStat, Status, Student, StudentResult, Thresholds,
} from './types';

export const DEFAULT_THRESHOLDS: Thresholds = { mastery: 80, developing: 60, minItems: 3 };

export function statusOf(pct: number, th: Thresholds): Status {
  // tiny epsilon protects 79.9999999 style float noise
  const p = pct + 1e-9;
  if (p >= th.mastery) return 'mastered';
  if (p >= th.developing) return 'developing';
  return 'non';
}

/** Normalised weights of one question (always sum to 1). */
export function normWeights(q: Question): { skillId: string; w: number }[] {
  const list = q.skills.filter((s) => s.w > 0);
  const sum = list.reduce((a, s) => a + s.w, 0);
  if (!sum) return [];
  return list.map((s) => ({ skillId: s.skillId, w: s.w / sum }));
}

export const examMax = (exam: Exam) => exam.questions.reduce((a, q) => a + (q.max || 0), 0);

export function skillIdsOf(exam: Exam): string[] {
  const seen: string[] = [];
  for (const q of exam.questions) for (const s of q.skills) if (!seen.includes(s.skillId)) seen.push(s.skillId);
  return seen;
}

export function hasAnyScore(exam: Exam, studentId: string): boolean {
  const row = exam.scores[studentId];
  return !!row && Object.keys(row).length > 0;
}

/**
 * M_k = sum(w*s) / sum(w*Max) * 100        (mastery of the skill)
 * C_k = sum(w*s) / T_total * 100           (contribution to the exam total)
 * Blank cells count as 0 for a student who has at least one score; a student with
 * no score at all is "not assessed" (absent) and is left out of the class figures.
 */
export function computeStudent(exam: Exam, studentId: string, th: Thresholds): StudentResult {
  const T = examMax(exam);
  const row = exam.scores[studentId] || {};
  const assessed = hasAnyScore(exam, studentId);
  const acc: Record<string, { items: number; qNos: number[]; earned: number; maxW: number }> = {};
  let total = 0;
  let unmappedMax = 0;

  exam.questions.forEach((q, i) => {
    const s = Math.min(Math.max(row[q.id] ?? 0, 0), q.max);
    total += s;
    const ws = normWeights(q);
    if (!ws.length) { unmappedMax += q.max; return; }
    for (const { skillId, w } of ws) {
      const a = (acc[skillId] ||= { items: 0, qNos: [], earned: 0, maxW: 0 });
      a.items += 1;
      a.qNos.push(i + 1);
      a.earned += w * s;
      a.maxW += w * q.max;
    }
  });

  const skills: SkillStat[] = skillIdsOf(exam)
    .filter((id) => acc[id])
    .map((skillId) => {
      const a = acc[skillId];
      const M = a.maxW ? (a.earned / a.maxW) * 100 : 0;
      const C = T ? (a.earned / T) * 100 : 0;
      const maxShare = T ? (a.maxW / T) * 100 : 0;
      return {
        skillId, items: a.items, qNos: a.qNos, earned: a.earned, maxW: a.maxW,
        M, C, maxShare, lost: maxShare - C,
        status: statusOf(M, th), insufficient: a.items < th.minItems,
      };
    });

  return { studentId, assessed, total, max: T, pct: T ? (total / T) * 100 : 0, unmappedMax, skills };
}

export function analyzeExam(exam: Exam, students: Student[], th: Thresholds): ExamAnalysis {
  const results: Record<string, StudentResult> = {};
  for (const s of students) results[s.id] = computeStudent(exam, s.id, th);
  const assessed = students.filter((s) => results[s.id].assessed);

  const classSkills: ClassSkillStat[] = skillIdsOf(exam).map((skillId) => {
    let earned = 0, maxW = 0, cSum = 0, n = 0, items = 0, maxShare = 0;
    const counts: Record<Status, number> = { mastered: 0, developing: 0, non: 0 };
    const by: Record<Status, string[]> = { mastered: [], developing: [], non: [] };
    for (const s of assessed) {
      const st = results[s.id].skills.find((k) => k.skillId === skillId);
      if (!st) continue;
      earned += st.earned; maxW += st.maxW; cSum += st.C; n++;
      items = st.items; maxShare = st.maxShare;
      counts[st.status]++; by[st.status].push(s.id);
    }
    const M = maxW ? (earned / maxW) * 100 : 0;
    return {
      skillId, items, M, C: n ? cSum / n : 0, maxShare, counts, studentsByStatus: by,
      insufficient: items < th.minItems,
    };
  });

  const T = examMax(exam);
  const average = assessed.length ? assessed.reduce((a, s) => a + results[s.id].pct, 0) / assessed.length : 0;
  const unmappedQuestions = exam.questions
    .map((q, i) => (normWeights(q).length ? 0 : i + 1))
    .filter(Boolean);

  return { max: T, results, classSkills, assessedCount: assessed.length, average, unmappedQuestions };
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
