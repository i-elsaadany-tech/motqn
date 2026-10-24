import type { Bi, Framework, StageId, Subject } from '../core/types';

/* ------------------------------------------------------------------ grades */
export const MOE_GRADES = ['kg1', 'kg2', 'kg3', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'm1', 'm2', 'm3', 's1', 's2', 's3'];
export const NGL_GRADES = ['gk', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12'];

const ordAr = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
const ordEn = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

export function gradeName(id: string): Bi {
  const n = Number(id.slice(1)) - 1;
  if (id.startsWith('kg')) return { ar: `رياض الأطفال - المستوى ${ordAr[n]}`, en: `Kindergarten - Level ${n + 1}` };
  if (id.startsWith('p')) return { ar: `${ordAr[n]} الابتدائي`, en: `Primary ${ordEn[n]} grade` };
  if (id.startsWith('m')) return { ar: `${ordAr[n]} المتوسط`, en: `Intermediate ${ordEn[n]} grade` };
  if (id.startsWith('s')) return { ar: `${ordAr[n]} الثانوي`, en: `Secondary year ${n + 1}` };
  if (id === 'gk') return { ar: 'روضة (K)', en: 'Kindergarten (K)' };
  return { ar: `الصف ${id.slice(1)} (Grade ${id.slice(1)})`, en: `Grade ${id.slice(1)}` };
}

export function stageOf(grade: string): StageId {
  if (grade.startsWith('kg') || grade === 'gk') return 'kg';
  if (grade.startsWith('p')) return 'primary';
  if (grade.startsWith('m')) return 'middle';
  if (grade.startsWith('s')) return 'secondary';
  const n = Number(grade.slice(1));
  return n <= 5 ? 'primary' : n <= 8 ? 'middle' : 'secondary';
}

export const STAGES: Record<StageId, Bi> = {
  kg: { ar: 'رياض الأطفال', en: 'Kindergarten' },
  primary: { ar: 'الابتدائية', en: 'Primary' },
  middle: { ar: 'المتوسطة', en: 'Intermediate' },
  secondary: { ar: 'الثانوية', en: 'Secondary' },
};

export const FRAMEWORKS: Record<Framework, Bi> = {
  MOE_SA: { ar: 'المنهج السعودي (وزارة التعليم)', en: 'Saudi curriculum (MOE)' },
  NGL_US: { ar: 'ناشونال جيوغرافيك (النظام الأمريكي)', en: 'National Geographic Learning (US)' },
};

export const TRACKS: Record<string, Bi> = {
  general: { ar: 'المسار العام', en: 'General track' },
  cs: { ar: 'مسار علوم الحاسب والهندسة', en: 'Computer Science & Engineering' },
  health: { ar: 'مسار الصحة والحياة', en: 'Health & Life' },
  business: { ar: 'مسار إدارة الأعمال', en: 'Business Administration' },
  sharia: { ar: 'المسار الشرعي', en: 'Sharia track' },
};

export const gradesOf = (fw: Framework) => (fw === 'MOE_SA' ? MOE_GRADES : NGL_GRADES);

/** 'p1-p3' -> ['p1','p2','p3'] (works for both ladders) */
export function band(spec: string): string[] {
  return spec.split(',').flatMap((part) => {
    const [a, b] = part.split('-');
    if (!b) return [a];
    const ladder = NGL_GRADES.includes(a) ? NGL_GRADES : MOE_GRADES;
    return ladder.slice(ladder.indexOf(a), ladder.indexOf(b) + 1);
  });
}

/* ---------------------------------------------------------------- subjects */
const mk = (id: string, ar: string, en: string, grades: string, track?: string, framework: Framework = 'MOE_SA'): Subject => ({
  id, name: { ar, en }, framework, grades: band(grades), ...(track ? { track } : {}),
});

export const SUBJECTS: Subject[] = [
  /* kindergarten: early-learning domains */
  mk('kg-islamic', 'القيم الإسلامية والقرآن الكريم', 'Islamic Values & Quran', 'kg1-kg3'),
  mk('kg-arabic', 'اللغة العربية (تهيئة)', 'Arabic Language (early literacy)', 'kg1-kg3'),
  mk('kg-math', 'المفاهيم الرياضية المبكرة', 'Early Mathematics', 'kg1-kg3'),
  mk('kg-science', 'الاستكشاف العلمي', 'Science Discovery', 'kg1-kg3'),
  mk('kg-english', 'اللغة الإنجليزية (تمهيدي)', 'English (introductory)', 'kg1-kg3'),
  mk('kg-motor', 'النمو الحركي والصحة', 'Motor Development & Health', 'kg1-kg3'),
  mk('kg-social', 'النمو الاجتماعي والانفعالي', 'Social-Emotional Development', 'kg1-kg3'),
  mk('kg-arts', 'الفنون والإبداع', 'Arts & Creativity', 'kg1-kg3'),

  /* primary + intermediate */
  mk('islamic', 'القرآن الكريم والدراسات الإسلامية', 'Quran & Islamic Studies', 'p1-m3'),
  mk('arabic', 'اللغة العربية (لغتي)', 'Arabic Language (Lughati)', 'p1-m3'),
  mk('math', 'الرياضيات', 'Mathematics', 'p1-m3'),
  mk('science', 'العلوم', 'Science', 'p1-m3'),
  mk('english', 'اللغة الإنجليزية', 'English Language', 'p1-m3'),
  mk('social', 'الدراسات الاجتماعية', 'Social Studies', 'p4-m3'),
  mk('digital', 'المهارات الرقمية', 'Digital Skills', 'p4-m3'),
  mk('critical', 'التفكير الناقد', 'Critical Thinking', 'm3,s1'),
  mk('life', 'المهارات الحياتية والأسرية', 'Life & Family Skills', 'p1-m3'),
  mk('art', 'التربية الفنية', 'Art Education', 'p1-m3'),
  mk('pe', 'التربية البدنية والدفاع عن النفس', 'Physical Education & Self-Defence', 'p1-m3'),

  /* secondary: common first year */
  mk('quran-tafsir', 'القرآن الكريم وتفسيره', 'Quran & Tafsir', 's1'),
  mk('lang1', 'الكفايات اللغوية 1', 'Language Competencies 1', 's1'),
  mk('math1', 'الرياضيات 1', 'Mathematics 1', 's1'),
  mk('env', 'علم البيئة', 'Environmental Science', 's1'),
  mk('phys1', 'الفيزياء 1', 'Physics 1', 's1'),
  mk('bio1', 'الأحياء 1', 'Biology 1', 's1'),
  mk('digital1', 'التقنية الرقمية 1', 'Digital Technology 1', 's1'),
  mk('english1', 'اللغة الإنجليزية 1', 'English 1', 's1'),
  mk('fitness', 'اللياقة والثقافة الصحية', 'Fitness & Health Culture', 's1'),
  mk('vocational', 'التربية المهنية', 'Vocational Education', 's1'),
  mk('arts-s1', 'الفنون', 'Arts', 's1'),

  /* general track */
  mk('math-g', 'الرياضيات (2، 3)', 'Mathematics (2, 3)', 's2-s3', 'general'),
  mk('phys-g', 'الفيزياء (2، 3)', 'Physics (2, 3)', 's2-s3', 'general'),
  mk('chem-g', 'الكيمياء (1، 2)', 'Chemistry (1, 2)', 's2-s3', 'general'),
  mk('bio-g', 'الأحياء (2، 3)', 'Biology (2, 3)', 's2-s3', 'general'),
  mk('lang-g', 'الكفايات اللغوية (2، 3)', 'Language Competencies (2, 3)', 's2-s3', 'general'),
  mk('digital-g', 'التقنية الرقمية (2، 3)', 'Digital Technology (2, 3)', 's2-s3', 'general'),
  mk('social-g', 'الدراسات الاجتماعية', 'Social Studies', 's2-s3', 'general'),
  mk('english-g', 'اللغة الإنجليزية (2، 3)', 'English (2, 3)', 's2-s3', 'general'),
  mk('earth', 'علوم الأرض والفضاء', 'Earth & Space Science', 's2-s3', 'general'),
  mk('elective', 'مواد المجال الاختياري', 'Elective Field Courses', 's2-s3', 'general'),
  mk('grad-g', 'مشروع التخرج التكاملي', 'Integrated Graduation Project', 's2-s3', 'general'),

  /* computer science & engineering */
  mk('data-sci', 'علم البيانات', 'Data Science', 's2-s3', 'cs'),
  mk('ai', 'الذكاء الاصطناعي', 'Artificial Intelligence', 's2-s3', 'cs'),
  mk('cyber', 'الأمن السيبراني', 'Cybersecurity', 's2-s3', 'cs'),
  mk('iot', 'إنترنت الأشياء', 'Internet of Things', 's2-s3', 'cs'),
  mk('eng-prin', 'مبادئ الهندسة', 'Principles of Engineering', 's2-s3', 'cs'),
  mk('soft-eng', 'هندسة البرمجيات', 'Software Engineering', 's2-s3', 'cs'),
  mk('adv-math', 'الرياضيات المتقدمة', 'Advanced Mathematics', 's2-s3', 'cs'),
  mk('eng-phys', 'الفيزياء الهندسية', 'Engineering Physics', 's2-s3', 'cs'),
  mk('chem-cs', 'الكيمياء', 'Chemistry', 's2-s3', 'cs'),
  mk('lang-cs', 'الكفايات اللغوية', 'Language Competencies', 's2-s3', 'cs'),
  mk('english-cs', 'اللغة الإنجليزية', 'English', 's2-s3', 'cs'),
  mk('grad-cs', 'مشروع التخرج الهندسي', 'Engineering Graduation Project', 's2-s3', 'cs'),

  /* health & life */
  mk('human-body', 'أنظمة جسم الإنسان', 'Human Body Systems', 's2-s3', 'health'),
  mk('health-prin', 'مبادئ العلوم الصحية', 'Principles of Health Sciences', 's2-s3', 'health'),
  mk('healthcare', 'الرعاية الصحية', 'Healthcare', 's2-s3', 'health'),
  mk('biochem', 'الكيمياء الحيوية', 'Biochemistry', 's2-s3', 'health'),
  mk('health-stats', 'الإحصاء وتطبيقاته الصحية', 'Statistics in Health', 's2-s3', 'health'),
  mk('biomed', 'الابتكار في العلوم الطبية والحيوية', 'Innovation in Biomedical Sciences', 's2-s3', 'health'),
  mk('adv-bio', 'الأحياء المتقدمة', 'Advanced Biology', 's2-s3', 'health'),
  mk('math-h', 'الرياضيات', 'Mathematics', 's2-s3', 'health'),
  mk('english-h', 'اللغة الإنجليزية', 'English', 's2-s3', 'health'),
  mk('grad-h', 'مشروع التخرج الصحي', 'Health Graduation Project', 's2-s3', 'health'),

  /* business administration */
  mk('mgmt', 'مبادئ الإدارة', 'Principles of Management', 's2-s3', 'business'),
  mk('finance', 'الإدارة المالية', 'Financial Management', 's2-s3', 'business'),
  mk('econ', 'الاقتصاد', 'Economics', 's2-s3', 'business'),
  mk('marketing', 'التسويق', 'Marketing', 's2-s3', 'business'),
  mk('accounting', 'المحاسبة', 'Accounting', 's2-s3', 'business'),
  mk('entre', 'ريادة الأعمال', 'Entrepreneurship', 's2-s3', 'business'),
  mk('secretary', 'السكرتارية والإدارة المكتبية', 'Secretarial & Office Administration', 's2-s3', 'business'),
  mk('law-b', 'مبادئ القانون', 'Principles of Law', 's2-s3', 'business'),
  mk('biz-stats', 'تطبيقات الإحصاء في الأعمال', 'Business Statistics', 's2-s3', 'business'),
  mk('english-b', 'اللغة الإنجليزية للأعمال', 'Business English', 's2-s3', 'business'),
  mk('grad-b', 'مشروع التخرج الإداري', 'Business Graduation Project', 's2-s3', 'business'),

  /* sharia */
  mk('hadith-term', 'مصطلح الحديث', 'Hadith Terminology', 's2-s3', 'sharia'),
  mk('usul', 'أصول الفقه', 'Principles of Jurisprudence', 's2-s3', 'sharia'),
  mk('quran-sci', 'علوم القرآن', 'Quranic Sciences', 's2-s3', 'sharia'),
  mk('fiqh', 'الدراسات الفقهية المتخصصة', 'Specialised Fiqh Studies', 's2-s3', 'sharia'),
  mk('tafsir', 'التفسير', 'Tafsir', 's2-s3', 'sharia'),
  mk('law-s', 'مبادئ القانون', 'Principles of Law', 's2-s3', 'sharia'),
  mk('law-apps', 'تطبيقات في القانون', 'Applications in Law', 's2-s3', 'sharia'),
  mk('digital-cit', 'المواطنة الرقمية', 'Digital Citizenship', 's2-s3', 'sharia'),
  mk('balagha', 'البلاغة والنقد', 'Rhetoric & Criticism', 's2-s3', 'sharia'),
  mk('arabic-deep', 'اللغة العربية المعمقة', 'Advanced Arabic', 's2-s3', 'sharia'),
  mk('grad-s', 'مشروع التخرج التخصصي', 'Specialised Graduation Project', 's2-s3', 'sharia'),

  /* National Geographic Learning (US system) */
  mk('ngl-ela', 'اللغة الإنجليزية والقراءة الأكاديمية (ناشونال جيوغرافيك)', 'English Language Arts & Academic Literacy (NGL)', 'gk-g12', undefined, 'NGL_US'),
];

/** Subjects that can be taught to a class (built-in + custom). */
export function subjectsFor(framework: Framework, grade: string, track: string | undefined, custom: Subject[]): Subject[] {
  const all = [...SUBJECTS, ...custom];
  return all.filter((s) => {
    if (s.framework !== framework || !s.grades.includes(grade)) return false;
    if (s.track && track && s.track !== track) return false;
    if (s.track && !track) return false;
    return true;
  });
}

export const needsTrack = (framework: Framework, grade: string) => framework === 'MOE_SA' && (grade === 's2' || grade === 's3');

export function findSubject(id: string, custom: Subject[]): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id) || custom.find((s) => s.id === id);
}
