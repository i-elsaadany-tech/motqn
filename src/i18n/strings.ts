import type { Lang } from '../core/types';

type Dict = Record<string, string>;

const ar: Dict = {
  app_name: 'متقن',
  tagline: 'حلّل نتائج طلابك، واعرف مدى إتقان كل طالب لكل مهارة، وأصدر تقريراً فردياً لكل طالب في كل مادة.',
  start_title: 'ابدأ بإضافة فصلك الأول',
  start_text: 'أنشئ فصلاً وأضف طلابه، ثم أنشئ اختباراً واربط أسئلته بالمهارات، وأدخل الدرجات لتحصل على التقارير. أو جرّب التطبيق ببيانات تجريبية.',
  load_demo: 'تحميل بيانات تجريبية',
  demo_loaded: 'تم تحميل البيانات التجريبية',

  // generic
  add: 'إضافة', edit: 'تعديل', delete: 'حذف', remove: 'إزالة', save: 'حفظ', cancel: 'إلغاء', close: 'إغلاق',
  create: 'إنشاء', apply: 'تطبيق', import: 'استيراد', next: 'التالي', prev: 'السابق', print: 'طباعة',
  confirm_delete: 'هل أنت متأكد من الحذف؟', select_all: 'تحديد الكل', not_found: 'لم يتم العثور على الصفحة المطلوبة',
  custom: 'مخصص', total: 'المجموع', date: 'التاريخ', score: 'الدرجة', status: 'الحالة', preparing: 'جارٍ التجهيز…',
  pts: 'درجة', points: 'الدرجات', max_score: 'الدرجة العظمى', total_points: 'المجموع الكلي',

  // navigation / entities
  classes: 'الفصول', class: 'الفصل', students: 'الطلاب', student: 'الطالب', exams: 'الاختبارات', exam: 'الاختبار',
  skills: 'المهارات', skill: 'المهارة', skills_library: 'مكتبة المهارات', settings: 'الإعدادات',
  subject: 'المادة', grade: 'الصف', section: 'الشعبة', track: 'المسار', curriculum: 'المنهج',
  teacher: 'المعلم', school: 'المدرسة', questions: 'الأسئلة', report: 'التقرير', language: 'اللغة',
  recent_exams: 'آخر الاختبارات', start_nav: 'الرئيسية',

  // classes & students
  add_class: 'إضافة فصل', edit_class: 'تعديل الفصل', class_name: 'اسم الفصل',
  class_name_hint: 'اختياري، يُولَّد تلقائياً من الصف والشعبة',
  no_classes: 'لا توجد فصول بعد', no_classes_text: 'أضف فصلاً لتبدأ.',
  confirm_delete_class: 'سيتم حذف الفصل وطلابه واختباراته نهائياً. هل تريد المتابعة؟',
  add_student: 'إضافة طالب', student_name: 'اسم الطالب', student_no: 'الرقم الأكاديمي',
  paste_students: 'لصق قائمة الطلاب', students_added: 'تمت إضافة {n} طالب',
  paste_students_hint: 'الصق من Excel أو من ملف نصي: سطر لكل طالب، بالصيغة «الرقم ثم الاسم» أو «الاسم فقط».',
  no_students: 'لا يوجد طلاب في هذا الفصل', no_students_text: 'أضف الطلاب أولاً قبل إدخال الدرجات.',

  // exams
  new_exam: 'اختبار جديد', exam_title: 'عنوان الاختبار', exam_title_ph: 'مثال: الاختبار القصير الأول',
  no_exams: 'لا توجد اختبارات بعد', no_exams_text: 'أنشئ اختباراً لهذا الفصل لتبدأ التحليل.',
  delete_exam: 'حذف الاختبار', confirm_delete_exam: 'سيتم حذف الاختبار ودرجاته نهائياً. هل تريد المتابعة؟',
  duplicate_exam: 'نسخ الاختبار', duplicated: 'تم نسخ الاختبار (بدون درجات)',
  tab_setup: 'جدول المواصفات', tab_scores: 'إدخال الدرجات', tab_results: 'النتائج والتقارير',
  add_questions: 'إضافة أسئلة', q_count: 'عدد الأسئلة',
  no_questions: 'لا توجد أسئلة بعد', no_questions_text: 'أضف أسئلة الاختبار واربط كل سؤال بالمهارة التي يقيسها.',
  next_enter_scores: 'التالي: إدخال الدرجات',
  spec_table: 'ملخص جدول المواصفات',
  spec_hint: 'يوضح عدد الأسئلة ودرجاتها لكل مهارة ونسبتها من مجموع الاختبار.',
  share_of_exam: 'نسبتها من الاختبار',
  no_skill: 'لم تُربط بمهارة', assign_skills: 'ربط بمهارات', assign_to_selected: 'ربط المحدد بمهارات',
  selected_skills: 'المهارات المحددة',
  weights_total: 'مجموع الأوزان', equalize: 'توزيع متساوٍ',
  weights_hint: 'السؤال المركّب: وزّع درجته على المهارات بنسب مئوية مجموعها 100%.',
  unmapped_questions: 'أسئلة غير مرتبطة بمهارة (لن تدخل في تحليل المهارات): {q}',
  unmapped_note: 'ملاحظة: {v} درجة من أسئلة غير مرتبطة بمهارة لم تُحتسب في تحليل المهارات.',
  insufficient: 'بيانات غير كافية',
  insufficient_note: 'المهارات المعلَّمة قيست بأقل من {n} أسئلة، لذا نتيجتها مؤشر أولي فقط.',

  // calc modes
  calc_mode: 'طريقة الحساب', default_mode: 'طريقة الحساب الافتراضية',
  mode_M: 'إتقان المهارة (M)', mode_C: 'مساهمة المهارة في المجموع (C)',
  mode_M_short: 'إتقان المهارة', mode_C_short: 'مساهمة من المجموع',
  mode_M_desc: 'درجة الطالب في المهارة ÷ الدرجة العظمى للمهارة. مناسب للتشخيص والخطط العلاجية.',
  mode_C_desc: 'درجة الطالب في المهارة ÷ مجموع الاختبار. مناسب لتفسير الدرجة النهائية لولي الأمر.',
  mastery_pct: 'نسبة الإتقان', contrib_pct: 'المساهمة من الاختبار', avg_contrib: 'متوسط المساهمة',
  show_both: 'عرض الطريقتين معاً في التقرير',

  // status
  st_mastered: 'متقن', st_developing: 'قيد التقدم', st_non: 'غير متقن',

  // scores
  scores_hint: 'أدخل الدرجات مباشرة في الجدول، أو استورد ملف CSV، أو الصق من Excel. الخلايا الفارغة لطالب رُصدت درجاته تُحتسب صفراً، والطالب بلا أي درجة يُعدّ غائباً ولا يدخل في التحليل.',
  export_template: 'تنزيل قالب الدرجات', import_csv: 'استيراد ملف CSV', paste_scores: 'لصق الدرجات',
  paste_scores_hint: 'انسخ الجدول من Excel والصقه هنا: الرقم الأكاديمي أو الاسم، ثم درجات الأسئلة بالترتيب.',
  import_done: 'تم استيراد {n} طالب. غير مطابق: {u}. درجات تم تقليلها للحد الأقصى: {c}.',
  absent: 'غائب', assessed: 'عدد من رُصدت درجاتهم',
  view_results: 'عرض النتائج', export_results: 'تصدير النتائج (CSV)',
  no_results: 'لا توجد نتائج بعد', no_results_text: 'أدخل درجات الطلاب لتظهر النتائج.',

  // reports
  rp_title: 'تقرير إتقان المهارات الفردي', rp_skills: 'تفصيل المهارات', rp_radar: 'الرادار العنكبوتي للمهارات',
  rp_bars: 'مؤشرات الإتقان', rp_bars_c: 'مساهمة كل مهارة من مجموع الاختبار', rp_progress: 'التقدم عبر الاختبارات',
  rp_feedback: 'التغذية الراجعة والتوصيات', rp_generated: 'أُصدر بتاريخ {d}',
  cr_title: 'تقرير الفصل', cr_skills: 'أداء الفصل في المهارات', cr_weakest: 'المهارات من الأضعف إلى الأقوى',
  cr_remedial: 'مجموعات الدعم العلاجي', cr_no_remedial: 'لا يوجد طلاب غير متقنين لأي مهارة. أحسنتم!',
  class_report: 'تقرير الفصل', class_avg: 'متوسط الفصل',
  all_reports: 'كل تقارير الطلاب', all_reports_hint: 'سيتم إصدار {n} تقريراً، تقرير لكل طالب في ملف واحد.',
  report_language: 'لغة التقرير', download_pdf: 'تنزيل PDF', share_pdf: 'مشاركة PDF', pdf_failed: 'تعذّر إنشاء ملف PDF',

  // library
  lib_total: 'تحتوي المكتبة {n} مهارة، تغطي {c} من {s} مادة.',
  lib_disclaimer: 'المهارات الجاهزة قاعدة أولية تحتاج مراجعة المختصين، ويمكنك إضافة مهاراتك الخاصة في أي وقت.',
  lib_hint_add: 'لم تجد المهارة؟ أضف مهارة مخصصة وستظهر عند ربط الأسئلة.',
  add_custom_skill: 'إضافة مهارة مخصصة', custom_skill: 'مهارات مخصصة', skill_name_ar: 'اسم المهارة بالعربية',
  skill_name_en: 'اسم المهارة بالإنجليزية', domain_ar: 'الوحدة / المجال (عربي)', domain_en: 'الوحدة / المجال (إنجليزي)',
  bloom: 'المستوى المعرفي', search_skill: 'ابحث عن مهارة بالاسم أو الرمز…', no_skills_here: 'لا توجد مهارات مطابقة',
  all_grades: 'كل الصفوف', all_subjects: 'كل المواد', scope_grade: 'مهارات الصف فقط', scope_subject: 'كل مهارات المادة',
  add_custom_subject: 'إضافة مادة مخصصة', subject_name_ar: 'اسم المادة بالعربية', subject_name_en: 'اسم المادة بالإنجليزية',
  no_results_found: 'لا نتائج',

  // settings
  thresholds: 'حدود مستويات الإتقان', thresholds_hint: 'يمكن تعديل الحدود وفق سياسة مدرستك.',
  th_mastery: 'متقن من (%)', th_developing: 'قيد التقدم من (%)', th_min_items: 'الحد الأدنى لعدد الأسئلة لكل مهارة',
  th_min_items_hint: 'أقل من هذا العدد تظهر المهارة بتنبيه «بيانات غير كافية».',
  th_invalid: 'يجب أن يكون حد «قيد التقدم» أقل من حد «متقن».',
  report_identity: 'هوية التقارير',
  data: 'البيانات', data_local: 'تُحفظ كل البيانات على جهازك فقط ولا تُرسل إلى أي خادم. خذ نسخة احتياطية بانتظام.',
  backup: 'نسخة احتياطية', restore: 'استعادة نسخة', restored: 'تمت الاستعادة', restore_failed: 'ملف النسخة الاحتياطية غير صالح',
  confirm_restore: 'ستحلّ النسخة المستعادة محل كل البيانات الحالية. هل تريد المتابعة؟',
  wipe: 'حذف كل البيانات', confirm_wipe: 'سيتم حذف كل الفصول والطلاب والاختبارات نهائياً. هل أنت متأكد؟',
  about: 'عن التطبيق', privacy: 'سياسة الخصوصية',
  about_text: 'متقن تطبيق لتحليل نتائج الاختبارات على مستوى المهارة، ويصدر تقريراً تشخيصياً لكل طالب في كل مادة، وفق المناهج السعودية ومناهج ناشونال جيوغرافيك.',
};

const en: Dict = {
  app_name: 'Motqn',
  tagline: 'Analyse your students’ exam results, see how well each student has mastered each skill, and issue an individual report per student in every subject.',
  start_title: 'Start by adding your first class',
  start_text: 'Create a class and add its students, then create an exam, link each question to a skill and enter the scores to get reports. Or explore the app with sample data.',
  load_demo: 'Load sample data',
  demo_loaded: 'Sample data loaded',

  add: 'Add', edit: 'Edit', delete: 'Delete', remove: 'Remove', save: 'Save', cancel: 'Cancel', close: 'Close',
  create: 'Create', apply: 'Apply', import: 'Import', next: 'Next', prev: 'Previous', print: 'Print',
  confirm_delete: 'Are you sure you want to delete this?', select_all: 'Select all', not_found: 'Page not found',
  custom: 'Custom', total: 'Total', date: 'Date', score: 'Score', status: 'Status', preparing: 'Preparing…',
  pts: 'pts', points: 'Points', max_score: 'Max score', total_points: 'Total points',

  classes: 'Classes', class: 'Class', students: 'Students', student: 'Student', exams: 'Exams', exam: 'Exam',
  skills: 'Skills', skill: 'Skill', skills_library: 'Skills library', settings: 'Settings',
  subject: 'Subject', grade: 'Grade', section: 'Section', track: 'Track', curriculum: 'Curriculum',
  teacher: 'Teacher', school: 'School', questions: 'Questions', report: 'Report', language: 'Language',
  recent_exams: 'Recent exams', start_nav: 'Home',

  add_class: 'Add class', edit_class: 'Edit class', class_name: 'Class name',
  class_name_hint: 'Optional, generated from the grade and section',
  no_classes: 'No classes yet', no_classes_text: 'Add a class to get started.',
  confirm_delete_class: 'The class, its students and exams will be deleted permanently. Continue?',
  add_student: 'Add student', student_name: 'Student name', student_no: 'Student ID',
  paste_students: 'Paste student list', students_added: '{n} students added',
  paste_students_hint: 'Paste from Excel or a text file: one student per line, as “ID then name” or “name only”.',
  no_students: 'No students in this class', no_students_text: 'Add students before entering scores.',

  new_exam: 'New exam', exam_title: 'Exam title', exam_title_ph: 'e.g. Quiz 1',
  no_exams: 'No exams yet', no_exams_text: 'Create an exam for this class to start the analysis.',
  delete_exam: 'Delete exam', confirm_delete_exam: 'The exam and its scores will be deleted permanently. Continue?',
  duplicate_exam: 'Duplicate exam', duplicated: 'Exam duplicated (without scores)',
  tab_setup: 'Test blueprint', tab_scores: 'Enter scores', tab_results: 'Results & reports',
  add_questions: 'Add questions', q_count: 'Questions',
  no_questions: 'No questions yet', no_questions_text: 'Add the exam questions and link each one to the skill it measures.',
  next_enter_scores: 'Next: enter scores',
  spec_table: 'Blueprint summary',
  spec_hint: 'Shows the number of questions and points for each skill and its share of the exam total.',
  share_of_exam: 'Share of exam',
  no_skill: 'No skill linked', assign_skills: 'Link skills', assign_to_selected: 'Link selected to skills',
  selected_skills: 'Selected skills',
  weights_total: 'Total weight', equalize: 'Split equally',
  weights_hint: 'Composite question: split its points between the skills using percentages that add up to 100%.',
  unmapped_questions: 'Questions not linked to a skill (excluded from skill analysis): {q}',
  unmapped_note: 'Note: {v} points from questions not linked to a skill were not counted in the skill analysis.',
  insufficient: 'Insufficient data',
  insufficient_note: 'Skills marked * were measured by fewer than {n} questions, so their result is only an early indicator.',

  calc_mode: 'Calculation mode', default_mode: 'Default calculation mode',
  mode_M: 'Skill mastery (M)', mode_C: 'Contribution to the total (C)',
  mode_M_short: 'Skill mastery', mode_C_short: 'Share of total',
  mode_M_desc: 'Student’s score on the skill ÷ the skill’s maximum score. Best for diagnosis and remedial plans.',
  mode_C_desc: 'Student’s score on the skill ÷ the exam total. Best for explaining the final mark to parents.',
  mastery_pct: 'Mastery %', contrib_pct: 'Contribution to exam', avg_contrib: 'Avg. contribution',
  show_both: 'Show both modes in the report',

  st_mastered: 'Mastered', st_developing: 'Developing', st_non: 'Not mastered',

  scores_hint: 'Type scores straight into the grid, import a CSV file, or paste from Excel. Blank cells for a student who has scores count as zero; a student with no scores is treated as absent and left out of the analysis.',
  export_template: 'Download scores template', import_csv: 'Import CSV file', paste_scores: 'Paste scores',
  paste_scores_hint: 'Copy the table from Excel and paste it here: student ID or name, then the question scores in order.',
  import_done: '{n} students imported. Unmatched: {u}. Scores capped to the maximum: {c}.',
  absent: 'Absent', assessed: 'Students assessed',
  view_results: 'View results', export_results: 'Export results (CSV)',
  no_results: 'No results yet', no_results_text: 'Enter the students’ scores to see results.',

  rp_title: 'Individual Skill Mastery Report', rp_skills: 'Skill breakdown', rp_radar: 'Skills radar',
  rp_bars: 'Mastery indicators', rp_bars_c: 'Each skill’s contribution to the exam total', rp_progress: 'Progress across exams',
  rp_feedback: 'Feedback & recommendations', rp_generated: 'Issued on {d}',
  cr_title: 'Class report', cr_skills: 'Class performance by skill', cr_weakest: 'Skills from weakest to strongest',
  cr_remedial: 'Remedial support groups', cr_no_remedial: 'No student is below mastery in any skill. Well done!',
  class_report: 'Class report', class_avg: 'Class average',
  all_reports: 'All student reports', all_reports_hint: '{n} reports will be produced, one per student, in a single file.',
  report_language: 'Report language', download_pdf: 'Download PDF', share_pdf: 'Share PDF', pdf_failed: 'Could not create the PDF',

  lib_total: 'The library holds {n} skills covering {c} of {s} subjects.',
  lib_disclaimer: 'Built-in skills are a starter bank that specialists should review; you can add your own skills at any time.',
  lib_hint_add: 'Can’t find the skill? Add a custom skill and it will appear when you link questions.',
  add_custom_skill: 'Add custom skill', custom_skill: 'Custom skills', skill_name_ar: 'Skill name (Arabic)',
  skill_name_en: 'Skill name (English)', domain_ar: 'Unit / domain (Arabic)', domain_en: 'Unit / domain (English)',
  bloom: 'Cognitive level', search_skill: 'Search skills by name or code…', no_skills_here: 'No matching skills',
  all_grades: 'All grades', all_subjects: 'All subjects', scope_grade: 'This grade only', scope_subject: 'All skills of the subject',
  add_custom_subject: 'Add custom subject', subject_name_ar: 'Subject name (Arabic)', subject_name_en: 'Subject name (English)',
  no_results_found: 'No results',

  thresholds: 'Mastery thresholds', thresholds_hint: 'Adjust the thresholds to match your school’s policy.',
  th_mastery: 'Mastered from (%)', th_developing: 'Developing from (%)', th_min_items: 'Minimum questions per skill',
  th_min_items_hint: 'Below this number a skill is flagged “Insufficient data”.',
  th_invalid: 'The “Developing” threshold must be lower than the “Mastered” threshold.',
  report_identity: 'Report identity',
  data: 'Data', data_local: 'All data is stored on your device only and is never sent to a server. Back it up regularly.',
  backup: 'Back up', restore: 'Restore backup', restored: 'Restored', restore_failed: 'Invalid backup file',
  confirm_restore: 'The restored backup will replace all current data. Continue?',
  wipe: 'Delete all data', confirm_wipe: 'All classes, students and exams will be deleted permanently. Are you sure?',
  about: 'About', privacy: 'Privacy policy',
  about_text: 'Motqn analyses exam results at skill level and issues a diagnostic report for every student in every subject, following the Saudi curriculum and National Geographic Learning.',
};

export const STRINGS: Record<Lang, Dict> = { ar, en };

export function tl(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const s = STRINGS[lang]?.[key] ?? STRINGS.ar[key] ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`)) : s;
}
