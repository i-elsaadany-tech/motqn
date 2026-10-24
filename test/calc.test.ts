import assert from 'node:assert/strict';
import { analyzeExam, computeStudent, DEFAULT_THRESHOLDS, statusOf } from '../src/core/calc';
import { parseTable, toCSV } from '../src/core/csv';
import type { Exam, Student } from '../src/core/types';

const th = DEFAULT_THRESHOLDS;
const near = (a: number, b: number, e = 0.051) => assert.ok(Math.abs(a - b) <= e, `${a} !~ ${b}`);

// ---- The worked example from the specification document (total = 40) ----
// 401: 3 items, 4/6   404: 4 items, 2/8   402: 2 items, 4/4   403: 2 items, 1.5/2   + filler skill (20 pts)
const q = (id: string, max: number, skills: [string, number][]) => ({ id, max, skills: skills.map(([skillId, w]) => ({ skillId, w })) });
const exam: Exam = {
  id: 'e', classId: 'c', subjectId: 'math', title: 't', date: '2026-01-01', mode: 'M',
  questions: [
    q('q1', 2, [['401', 1]]), q('q2', 2, [['401', 1]]), q('q3', 2, [['401', 1]]),
    q('q4', 2, [['402', 1]]), q('q5', 2, [['402', 1]]),
    q('q6', 1, [['403', 1]]), q('q7', 1, [['403', 1]]),
    q('q8', 2, [['404', 1]]), q('q9', 2, [['404', 1]]), q('q10', 2, [['404', 1]]), q('q11', 2, [['404', 1]]),
    q('q12', 20, [['X', 1]]),
  ],
  scores: { s1: { q1: 2, q2: 1, q3: 1, q4: 2, q5: 2, q6: 1, q7: 0.5, q8: 1, q9: 1, q10: 0, q11: 0, q12: 20 } },
};
const r = computeStudent(exam, 's1', th);
const get = (id: string) => r.skills.find((s) => s.skillId === id)!;
near(get('401').M, 66.7); near(get('401').C, 10.0); assert.equal(get('401').status, 'developing');
near(get('402').M, 100); near(get('402').C, 10.0); assert.equal(get('402').status, 'mastered');
near(get('403').M, 75); near(get('403').C, 3.75, 0.0051); assert.equal(get('403').status, 'developing');
near(get('404').M, 25); near(get('404').C, 5.0); assert.equal(get('404').status, 'non');
assert.equal(r.max, 40);
// sum of contributions equals the overall % (the accounting identity claimed in the spec)
near(r.skills.reduce((a, s) => a + s.C, 0), r.pct, 1e-9);
near(get('401').lost, 5.0); // 15% possible - 10% earned

// ---- Composite question: weights are normalised, shares are split ----
const comp: Exam = {
  ...exam, id: 'e2',
  questions: [q('a', 10, [['A', 3], ['B', 1]])], // 75% / 25%
  scores: { s1: { a: 8 } },
};
const rc = computeStudent(comp, 's1', th);
near(rc.skills.find((s) => s.skillId === 'A')!.earned, 6);
near(rc.skills.find((s) => s.skillId === 'B')!.earned, 2);
near(rc.skills.find((s) => s.skillId === 'A')!.M, 80);
near(rc.skills.reduce((a, s) => a + s.C, 0), 80, 1e-9);

// ---- M is independent of question weights, C is not ("2 points out of 100" case) ----
const two: Exam = { ...exam, id: 'e3', questions: [q('x', 2, [['S', 1]]), q('y', 98, [['T', 1]])], scores: { s1: { x: 2, y: 0 } } };
const r2 = computeStudent(two, 's1', th);
near(r2.skills.find((s) => s.skillId === 'S')!.M, 100);
near(r2.skills.find((s) => s.skillId === 'S')!.C, 2);

// ---- thresholds + insufficient data ----
assert.equal(statusOf(80, th), 'mastered');
assert.equal(statusOf(79.99, th), 'developing');
assert.equal(statusOf(60, th), 'developing');
assert.equal(statusOf(59.9, th), 'non');
assert.equal(get('402').insufficient, true); // 2 items < 3
assert.equal(get('401').insufficient, false);

// ---- class analysis + absent students ----
const students: Student[] = [{ id: 's1', classId: 'c', no: '1', name: 'A' }, { id: 's2', classId: 'c', no: '2', name: 'B' }];
const an = analyzeExam(exam, students, th);
assert.equal(an.assessedCount, 1); // s2 has no scores -> absent
assert.equal(an.results['s2'].assessed, false);
near(an.average, r.pct);
assert.deepEqual(an.classSkills.find((s) => s.skillId === '404')!.studentsByStatus.non, ['s1']);

// ---- unmapped questions are reported ----
const um: Exam = { ...exam, id: 'e4', questions: [q('z', 5, [])], scores: { s1: { z: 5 } } };
assert.deepEqual(analyzeExam(um, students, th).unmappedQuestions, [1]);

// ---- CSV round trip (Arabic, quotes, commas, BOM) ----
const rows = [['رقم', 'اسم'], ['1', 'علي, "الأول"'], ['2', 'سارة']];
const back = parseTable('﻿' + toCSV(rows));
assert.deepEqual(back, rows);
assert.deepEqual(parseTable('a\tb\n1\t2'), [['a', 'b'], ['1', '2']]);
assert.deepEqual(parseTable('a;b\n1;2'), [['a', 'b'], ['1', '2']]);

console.log('all calc tests passed');
