import { computeStudent } from './calc';
import type { Exam, Thresholds } from './types';

export interface ProgressRow { skillId: string; points: { examId: string; title: string; date: string; M: number }[] }

/** Mastery of the same skill across the student's exams (same class & subject), oldest first. */
export function studentProgress(exams: Exam[], current: Exam, studentId: string, th: Thresholds): ProgressRow[] {
  const sameCtx = exams
    .filter((e) => e.classId === current.classId && e.subjectId === current.subjectId && (e.scores[studentId] || e.id === current.id))
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
  const map = new Map<string, ProgressRow>();
  for (const e of sameCtx) {
    const r = computeStudent(e, studentId, th);
    if (!r.assessed) continue;
    for (const s of r.skills) {
      const row = map.get(s.skillId) || { skillId: s.skillId, points: [] };
      row.points.push({ examId: e.id, title: e.title, date: e.date, M: s.M });
      map.set(s.skillId, row);
    }
  }
  return [...map.values()].filter((r) => r.points.length >= 2);
}
