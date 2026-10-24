// المراحل والصفوف والمواد — بنية قابلة للتعديل دون المساس بالمنطق الحسابي.
// ملاحظة: الخطط الدراسية تتغير سنوياً؛ راجع قائمة وزارة التعليم الرسمية للعام الحالي.

export const LEVELS = {
  kg:  { ar: 'رياض الأطفال', en: 'Kindergarten' },
  p13: { ar: 'الابتدائية – الصفوف الأولية (1–3)', en: 'Primary – Lower (1–3)' },
  p46: { ar: 'الابتدائية – الصفوف العليا (4–6)', en: 'Primary – Upper (4–6)' },
  m:   { ar: 'المرحلة المتوسطة', en: 'Intermediate' },
  s1:  { ar: 'الثانوية – السنة المشتركة', en: 'Secondary – Common Year' },
  sg:  { ar: 'الثانوية – المسار العام', en: 'Secondary – General Track' },
  sc:  { ar: 'الثانوية – علوم الحاسب والهندسة', en: 'Secondary – CS & Engineering' },
  sh:  { ar: 'الثانوية – الصحة والحياة', en: 'Secondary – Health & Life' },
  sb:  { ar: 'الثانوية – إدارة الأعمال', en: 'Secondary – Business' },
  ss:  { ar: 'الثانوية – المسار الشرعي', en: 'Secondary – Sharia' },
};

// الصفوف المتاحة عند إنشاء فصل: كل صف يشير إلى مفتاح مستوى (أو مسارات)
export const STAGES = [
  { id: 'kg', ar: 'رياض الأطفال', en: 'Kindergarten', grades: [
    { id: 'kg1', ar: 'المستوى الأول', en: 'KG 1', level: 'kg' },
    { id: 'kg2', ar: 'المستوى الثاني', en: 'KG 2', level: 'kg' },
    { id: 'kg3', ar: 'المستوى الثالث', en: 'KG 3', level: 'kg' } ] },
  { id: 'primary', ar: 'الابتدائية', en: 'Primary', grades: [
    { id: 'p1', ar: 'الأول الابتدائي', en: 'Grade 1', level: 'p13' },
    { id: 'p2', ar: 'الثاني الابتدائي', en: 'Grade 2', level: 'p13' },
    { id: 'p3', ar: 'الثالث الابتدائي', en: 'Grade 3', level: 'p13' },
    { id: 'p4', ar: 'الرابع الابتدائي', en: 'Grade 4', level: 'p46' },
    { id: 'p5', ar: 'الخامس الابتدائي', en: 'Grade 5', level: 'p46' },
    { id: 'p6', ar: 'السادس الابتدائي', en: 'Grade 6', level: 'p46' } ] },
  { id: 'intermediate', ar: 'المتوسطة', en: 'Intermediate', grades: [
    { id: 'm1', ar: 'الأول المتوسط', en: 'Grade 7', level: 'm' },
    { id: 'm2', ar: 'الثاني المتوسط', en: 'Grade 8', level: 'm' },
    { id: 'm3', ar: 'الثالث المتوسط', en: 'Grade 9', level: 'm' } ] },
  { id: 'secondary', ar: 'الثانوية', en: 'Secondary', grades: [
    { id: 's1', ar: 'السنة الأولى (مشتركة)', en: 'Year 1 (Common)', level: 's1' },
    { id: 's2', ar: 'السنة الثانية', en: 'Year 2', level: 'TRACK' },
    { id: 's3', ar: 'السنة الثالثة', en: 'Year 3', level: 'TRACK' } ] },
];

export const TRACKS = [
  { id: 'sg', ar: 'المسار العام', en: 'General' },
  { id: 'sc', ar: 'علوم الحاسب والهندسة', en: 'CS & Engineering' },
  { id: 'sh', ar: 'الصحة والحياة', en: 'Health & Life' },
  { id: 'sb', ar: 'إدارة الأعمال', en: 'Business' },
  { id: 'ss', ar: 'المسار الشرعي', en: 'Sharia' },
];

export const FRAMEWORKS = {
  MOE_SA: { ar: 'المنهج السعودي (وزارة التعليم)', en: 'Saudi National (MOE)' },
  NGL_US: { ar: 'ناشونال جيوغرافيك (النظام الأمريكي)', en: 'National Geographic Learning (US)' },
};

const ALL_PRIMARY_UP = ['p13', 'p46', 'm'];
const SEC_ALL = ['s1', 'sg', 'sc', 'sh', 'sb', 'ss'];

// المواد: levels = المستويات التي تُدرَّس فيها
export const SUBJECTS = [
  // ---- رياض الأطفال ----
  { id: 'kg_islamic', ar: 'التربية الإسلامية (رياض الأطفال)', en: 'Islamic Education (KG)', levels: ['kg'] },
  { id: 'kg_lang', ar: 'اللغة العربية المبكرة', en: 'Early Arabic Language', levels: ['kg'] },
  { id: 'kg_math', ar: 'الرياضيات المبكرة', en: 'Early Mathematics', levels: ['kg'] },
  { id: 'kg_science', ar: 'العلوم والاستكشاف', en: 'Science & Discovery', levels: ['kg'] },
  { id: 'kg_english', ar: 'اللغة الإنجليزية المبكرة', en: 'Early English', levels: ['kg'] },
  { id: 'kg_motor', ar: 'النمو الحركي والفني', en: 'Motor & Creative Development', levels: ['kg'] },
  // ---- الابتدائية والمتوسطة ----
  { id: 'islamic', ar: 'القرآن الكريم والدراسات الإسلامية', en: 'Quran & Islamic Studies', levels: ['p13', 'p46', 'm'] },
  { id: 'arabic', ar: 'اللغة العربية (لغتي)', en: 'Arabic Language', levels: ['p13', 'p46', 'm'] },
  { id: 'math', ar: 'الرياضيات', en: 'Mathematics', levels: ['p13', 'p46', 'm', 's1', 'sg', 'sh'] },
  { id: 'science', ar: 'العلوم', en: 'Science', levels: ['p13', 'p46', 'm', 's1'] },
  { id: 'english', ar: 'اللغة الإنجليزية', en: 'English Language', levels: ['p13', 'p46', 'm', 's1', 'sg', 'sc', 'sh', 'ss'] },
  { id: 'social', ar: 'الدراسات الاجتماعية', en: 'Social Studies', levels: ['p46', 'm', 'sg'] },
  { id: 'digital', ar: 'المهارات الرقمية / التقنية الرقمية', en: 'Digital Skills / Digital Technology', levels: ['p46', 'm', 's1', 'sg'] },
  { id: 'critical', ar: 'التفكير الناقد', en: 'Critical Thinking', levels: ['m', 's1'] },
  { id: 'life', ar: 'المهارات الحياتية والأسرية', en: 'Life & Family Skills', levels: ['p13', 'p46', 'm'] },
  { id: 'art', ar: 'التربية الفنية', en: 'Art Education', levels: ['p13', 'p46', 'm'] },
  { id: 'pe', ar: 'التربية البدنية والدفاع عن النفس', en: 'Physical Education & Self-Defense', levels: ['p13', 'p46', 'm'] },
  // ---- الثانوية: السنة المشتركة ----
  { id: 'quran_tafseer', ar: 'القرآن الكريم وتفسيره', en: 'Quran & Tafseer', levels: ['s1'] },
  { id: 'lang_comp', ar: 'الكفايات اللغوية', en: 'Arabic Language Competencies', levels: ['s1', 'sg', 'sc'] },
  { id: 'env', ar: 'علم البيئة', en: 'Environmental Science', levels: ['s1'] },
  { id: 'physics', ar: 'الفيزياء', en: 'Physics', levels: ['s1', 'sg'] },
  { id: 'biology', ar: 'الأحياء', en: 'Biology', levels: ['s1', 'sg'] },
  { id: 'fitness', ar: 'اللياقة والثقافة الصحية', en: 'Fitness & Health Culture', levels: ['s1'] },
  { id: 'vocational', ar: 'التربية المهنية', en: 'Vocational Education', levels: ['s1'] },
  { id: 'arts_sec', ar: 'الفنون', en: 'Arts', levels: ['s1'] },
  // ---- المسار العام ----
  { id: 'chemistry', ar: 'الكيمياء', en: 'Chemistry', levels: ['sg', 'sc'] },
  { id: 'earth_space', ar: 'علوم الأرض والفضاء', en: 'Earth & Space Science', levels: ['sg'] },
  { id: 'elective', ar: 'مواد المجال الاختياري', en: 'Elective Field Courses', levels: ['sg'] },
  { id: 'capstone', ar: 'مشروع التخرج', en: 'Graduation Capstone Project', levels: ['sg', 'sc', 'sh', 'sb', 'ss'] },
  // ---- علوم الحاسب والهندسة ----
  { id: 'data_science', ar: 'علم البيانات', en: 'Data Science', levels: ['sc'] },
  { id: 'ai', ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence', levels: ['sc'] },
  { id: 'cyber', ar: 'الأمن السيبراني', en: 'Cybersecurity', levels: ['sc'] },
  { id: 'iot', ar: 'إنترنت الأشياء', en: 'Internet of Things', levels: ['sc'] },
  { id: 'eng_principles', ar: 'مبادئ الهندسة', en: 'Principles of Engineering', levels: ['sc'] },
  { id: 'software_eng', ar: 'هندسة البرمجيات', en: 'Software Engineering', levels: ['sc'] },
  { id: 'adv_math', ar: 'الرياضيات المتقدمة', en: 'Advanced Mathematics', levels: ['sc'] },
  { id: 'eng_physics', ar: 'الفيزياء الهندسية', en: 'Engineering Physics', levels: ['sc'] },
  // ---- الصحة والحياة ----
  { id: 'human_body', ar: 'أنظمة جسم الإنسان', en: 'Human Body Systems', levels: ['sh'] },
  { id: 'health_sci', ar: 'مبادئ العلوم الصحية', en: 'Principles of Health Sciences', levels: ['sh'] },
  { id: 'healthcare', ar: 'الرعاية الصحية', en: 'Healthcare', levels: ['sh'] },
  { id: 'biochem', ar: 'الكيمياء الحيوية', en: 'Biochemistry', levels: ['sh'] },
  { id: 'health_stats', ar: 'الإحصاء وتطبيقاته الصحية', en: 'Statistics & Health Applications', levels: ['sh'] },
  { id: 'biomed', ar: 'الابتكار في العلوم الطبية والحيوية', en: 'Biomedical Innovation', levels: ['sh'] },
  { id: 'adv_bio', ar: 'الأحياء المتقدمة', en: 'Advanced Biology', levels: ['sh'] },
  // ---- إدارة الأعمال ----
  { id: 'mgmt', ar: 'مبادئ الإدارة', en: 'Principles of Management', levels: ['sb'] },
  { id: 'finance', ar: 'الإدارة المالية', en: 'Financial Management', levels: ['sb'] },
  { id: 'economics', ar: 'الاقتصاد', en: 'Economics', levels: ['sb'] },
  { id: 'marketing', ar: 'التسويق', en: 'Marketing', levels: ['sb'] },
  { id: 'accounting', ar: 'المحاسبة', en: 'Accounting', levels: ['sb'] },
  { id: 'entrepreneurship', ar: 'ريادة الأعمال', en: 'Entrepreneurship', levels: ['sb'] },
  { id: 'secretarial', ar: 'السكرتارية والإدارة المكتبية', en: 'Secretarial & Office Management', levels: ['sb'] },
  { id: 'law', ar: 'مبادئ القانون', en: 'Principles of Law', levels: ['sb', 'ss'] },
  { id: 'biz_stats', ar: 'تطبيقات الإحصاء في الأعمال', en: 'Business Statistics', levels: ['sb'] },
  // ---- المسار الشرعي ----
  { id: 'hadith_terms', ar: 'مصطلح الحديث', en: 'Hadith Terminology', levels: ['ss'] },
  { id: 'usul_fiqh', ar: 'أصول الفقه', en: 'Principles of Fiqh', levels: ['ss'] },
  { id: 'quran_sci', ar: 'علوم القرآن', en: 'Quranic Sciences', levels: ['ss'] },
  { id: 'fiqh_studies', ar: 'الدراسات الفقهية المتخصصة', en: 'Specialized Fiqh Studies', levels: ['ss'] },
  { id: 'tafseer', ar: 'التفسير', en: 'Tafseer', levels: ['ss'] },
  { id: 'law_apps', ar: 'تطبيقات في القانون', en: 'Applications in Law', levels: ['ss'] },
  { id: 'digital_citizen', ar: 'المواطنة الرقمية', en: 'Digital Citizenship', levels: ['ss'] },
  { id: 'rhetoric', ar: 'البلاغة والنقد', en: 'Rhetoric & Criticism', levels: ['ss'] },
  { id: 'adv_arabic', ar: 'اللغة العربية المعمقة', en: 'Advanced Arabic', levels: ['ss'] },
];

// خيوط مناهج ناشونال جيوغرافيك (مبنية على CCSS وWIDA المنشورة علناً — ليست نسخاً من فهارس الناشر)
export const NGL_STRANDS = [
  { id: 'ngl_found', ar: 'المهارات التأسيسية والصوتيات', en: 'Phonics & Foundational Skills', ref: 'CCSS.ELA-LITERACY.RF · WIDA 1–2' },
  { id: 'ngl_vocab', ar: 'المفردات الأكاديمية وبناء المفاهيم', en: 'Academic Vocabulary', ref: 'CCSS.ELA-LITERACY.L · WIDA ELD-LA/SC' },
  { id: 'ngl_read', ar: 'الاستيعاب القرائي وبنية النصوص', en: 'Reading Informational & Literary Texts', ref: 'CCSS.ELA-LITERACY.RI/RL · WIDA 4–5' },
  { id: 'ngl_write', ar: 'الكتابة وبناء التراكيب اللغوية', en: 'Writing & Language Conventions', ref: 'CCSS.ELA-LITERACY.W/L · WIDA 1–5' },
  { id: 'ngl_speak', ar: 'الاستماع والتحدث والتفكير النقدي', en: 'Speaking, Listening & Critical Inquiry', ref: 'CCSS.ELA-LITERACY.SL · 21st Century Skills' },
];

export const ALL_LEVEL_KEYS = Object.keys(LEVELS);

export function levelOfGrade(stageId, gradeId, trackId) {
  const st = STAGES.find(s => s.id === stageId);
  const g = st && st.grades.find(x => x.id === gradeId);
  if (!g) return null;
  return g.level === 'TRACK' ? (trackId || 'sg') : g.level;
}

export function subjectsForClass(cls, customSubjects = []) {
  const fw = cls.framework;
  let list;
  if (fw === 'NGL_US') {
    list = NGL_STRANDS.map(s => ({ ...s, framework: 'NGL_US' }));
  } else {
    list = SUBJECTS.filter(s => s.levels.includes(cls.level)).map(s => ({ ...s, framework: 'MOE_SA' }));
  }
  const custom = customSubjects.filter(s => !s.levels || s.levels.includes(cls.level) || s.frameworks?.includes(fw));
  return list.concat(custom.map(s => ({ ...s, framework: fw, custom: true })));
}

export const SECONDARY_LEVELS = SEC_ALL;
export const BASIC_LEVELS = ALL_PRIMARY_UP;
