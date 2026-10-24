export type Lang = 'ar' | 'en';
export type Framework = 'MOE_SA' | 'NGL_US';
export type StageId = 'kg' | 'primary' | 'middle' | 'secondary';
export type Bloom = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
export type CalcMode = 'M' | 'C'; // M = mastery of the skill, C = contribution to the total
export type Status = 'mastered' | 'developing' | 'non';

export interface Bi { ar: string; en: string }

export interface Subject {
  id: string;
  name: Bi;
  framework: Framework;
  grades: string[];
  track?: string; // secondary tracks only
  custom?: boolean;
}

export interface Skill {
  id: string;
  code: string;
  framework: Framework;
  subjectId: string;
  grades: string[];
  domain: Bi;
  name: Bi;
  bloom: Bloom;
  custom: boolean;
  ref?: string; // public reference standard (e.g. CCSS.ELA.RI)
}

export interface Settings {
  lang: Lang;
  mastery: number;    // >= this % => mastered
  developing: number; // >= this % => developing
  minItems: number;   // below this many questions => "insufficient data"
  teacher: string;
  school: string;
  defaultMode: CalcMode;
  showBoth: boolean;
}

export interface ClassRoom {
  id: string;
  name: string;
  framework: Framework;
  grade: string;
  track?: string;
  section: string;
}

export interface Student { id: string; classId: string; no: string; name: string }

export interface QuestionSkill { skillId: string; w: number }
export interface Question { id: string; max: number; skills: QuestionSkill[] }

export interface Exam {
  id: string;
  classId: string;
  subjectId: string;
  title: string;
  date: string;
  mode: CalcMode;
  questions: Question[];
  scores: Record<string, Record<string, number>>; // studentId -> questionId -> score
}

export interface DB {
  v: 1;
  settings: Settings;
  classes: ClassRoom[];
  students: Student[];
  exams: Exam[];
  customSkills: Skill[];
  customSubjects: Subject[];
}

export interface Thresholds { mastery: number; developing: number; minItems: number }

export interface SkillStat {
  skillId: string;
  items: number;        // number of questions measuring the skill
  qNos: number[];       // question numbers (1-based)
  earned: number;       // sum(w * s)
  maxW: number;         // sum(w * max)
  M: number;            // mastery %  (0-100)
  C: number;            // contribution % of the whole exam
  maxShare: number;     // the most the skill can contribute (% of the exam)
  lost: number;         // maxShare - C
  status: Status;
  insufficient: boolean;
}

export interface StudentResult {
  studentId: string;
  assessed: boolean;
  total: number;
  max: number;
  pct: number;
  unmappedMax: number;
  skills: SkillStat[];
}

export interface ClassSkillStat {
  skillId: string;
  items: number;
  M: number;            // pooled mastery of the class
  C: number;            // mean contribution
  maxShare: number;
  counts: Record<Status, number>;
  studentsByStatus: Record<Status, string[]>;
  insufficient: boolean;
}

export interface ExamAnalysis {
  max: number;
  results: Record<string, StudentResult>;
  classSkills: ClassSkillStat[];
  assessedCount: number;
  average: number; // class average %
  unmappedQuestions: number[];
}
