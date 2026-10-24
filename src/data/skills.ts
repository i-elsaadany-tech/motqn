import type { Bloom, Framework, Skill } from '../core/types';
import { band } from './curriculum';

/**
 * Starter skills library.  IMPORTANT: this is a *seed* written from the published structure of the
 * curricula, so that the app is usable on day one.  It must be reviewed and extended by subject
 * specialists / the school before official use; teachers can add their own skills at any time.
 * Format of an item: [Arabic, English, bloom (R U A N E C), optional fixed code]
 */
type Item = [string, string, string, string?];
type Block = [subject: string, grades: string, domAr: string, domEn: string, items: Item[], framework?: Framework, ref?: string];

const BL: Record<string, Bloom> = { R: 'remember', U: 'understand', A: 'apply', N: 'analyze', E: 'evaluate', C: 'create' };

const B: Block[] = [
  /* ============================ Mathematics ============================ */
  ['math', 'p1-p3', 'الأعداد والعمليات', 'Numbers & Operations', [
    ['قراءة الأعداد وكتابتها ومقارنتها وترتيبها', 'Read, write, compare and order whole numbers', 'U'],
    ['القيمة المنزلية للأرقام', 'Place value of digits', 'U'],
    ['الجمع والطرح مع إعادة التجميع', 'Add and subtract with regrouping', 'A'],
    ['فهم الضرب والقسمة وحقائقهما الأساسية', 'Understand multiplication and division facts', 'U'],
    ['التعرف على الكسور البسيطة (النصف والثلث والربع)', 'Identify simple fractions (half, third, quarter)', 'U'],
  ]],
  ['math', 'p1-p3', 'القياس والهندسة والبيانات', 'Measurement, Geometry & Data', [
    ['تصنيف الأشكال ثنائية وثلاثية الأبعاد', 'Classify 2D and 3D shapes', 'U'],
    ['قياس الطول والزمن والنقود', 'Measure length, time and money', 'A'],
    ['قراءة التمثيلات البيانية البسيطة', 'Read simple picture and bar graphs', 'U'],
    ['حل المسائل اللفظية ذات الخطوة الواحدة', 'Solve one-step word problems', 'A'],
  ]],
  ['math', 'p4-p6', 'الأعداد والعمليات', 'Numbers & Operations', [
    ['الضرب في عدد من رقمين', 'Multiply by two-digit numbers', 'A'],
    ['تطبيق القسمة المطولة على قاسم من خانتين', 'Apply long division with a two-digit divisor', 'A', 'SKL-MATH-401'],
    ['جمع الكسور وطرحها', 'Add and subtract fractions', 'A'],
    ['ضرب الكسور وقسمتها', 'Multiply and divide fractions', 'A'],
    ['المقارنة بين الكسور الاعتيادية والعشرية', 'Compare common fractions and decimals', 'U', 'SKL-MATH-404'],
    ['النسبة والتناسب', 'Ratios and proportional relationships', 'U'],
  ]],
  ['math', 'p4-p6', 'القياس والهندسة والبيانات', 'Measurement, Geometry & Data', [
    ['حساب محيط ومساحة الأشكال المركبة', 'Calculate perimeter and area of composite shapes', 'A', 'SKL-MATH-402'],
    ['حساب حجم المجسمات', 'Calculate the volume of solids', 'A'],
    ['تحليل التمثيلات البيانية بالأعمدة والنقاط', 'Analyse bar graphs and dot plots', 'N', 'SKL-MATH-403'],
    ['الأنماط والعبارات الجبرية البسيطة', 'Patterns and simple algebraic expressions', 'A'],
    ['حل المسائل اللفظية متعددة الخطوات', 'Solve multi-step word problems', 'A'],
  ]],
  ['math', 'm1-m3', 'الجبر والدوال', 'Algebra & Functions', [
    ['العمليات على الأعداد الصحيحة والنسب المئوية', 'Operations on integers and percentages', 'A'],
    ['كتابة العبارات الجبرية وتبسيطها', 'Write and simplify algebraic expressions', 'A'],
    ['حل المعادلات والمتباينات الخطية', 'Solve linear equations and inequalities', 'A'],
    ['تمثيل الدوال الخطية وتحليلها بيانياً', 'Represent and analyse linear functions graphically', 'N'],
    ['الأسس والجذور', 'Exponents and roots', 'U'],
  ]],
  ['math', 'm1-m3', 'الهندسة والإحصاء والاحتمال', 'Geometry, Statistics & Probability', [
    ['الزوايا والتطابق والتشابه', 'Angles, congruence and similarity', 'A'],
    ['تطبيق نظرية فيثاغورث', 'Apply the Pythagorean theorem', 'A'],
    ['المساحة والحجم للأشكال والمجسمات', 'Area and volume of shapes and solids', 'A'],
    ['مقاييس النزعة المركزية وتمثيل البيانات', 'Measures of centre and data displays', 'N'],
    ['الاحتمال البسيط والمركب', 'Simple and compound probability', 'A'],
  ]],

  /* ============================== Arabic ============================== */
  ['arabic', 'p1-p3', 'القراءة والكتابة', 'Reading & Writing', [
    ['تمييز الحروف وأصواتها ومواضعها في الكلمة', 'Recognise letters, their sounds and positions in a word', 'R'],
    ['قراءة الكلمات والجمل المشكولة قراءة سليمة', 'Read vowelled words and sentences accurately', 'A'],
    ['الطلاقة القرائية', 'Reading fluency', 'A'],
    ['فهم النص المقروء واستخراج الفكرة', 'Comprehend a text and extract its idea', 'U'],
    ['الإملاء المنقول والمنظور', 'Copied and visual dictation (spelling)', 'A'],
    ['الخط وكتابة الجملة', 'Handwriting and sentence writing', 'A'],
    ['التعبير الشفهي والمحادثة', 'Oral expression and conversation', 'A'],
  ]],
  ['arabic', 'p4-p6', 'القراءة والفهم', 'Reading & Comprehension', [
    ['القراءة الجهرية السليمة', 'Accurate oral reading', 'A'],
    ['استخراج الفكرة الرئيسة والأفكار الجزئية', 'Identify main and supporting ideas', 'U'],
    ['الاستنتاج وإبداء الرأي في النص', 'Infer and give an opinion on a text', 'N'],
    ['المفردات: المعنى والمرادف والضد', 'Vocabulary: meaning, synonym, antonym', 'U'],
  ]],
  ['arabic', 'p4-p6', 'اللغة والكتابة', 'Language & Writing', [
    ['القواعد: الجملة الاسمية والفعلية والفاعل والمفعول به', 'Grammar: nominal and verbal sentences, subject and object', 'A'],
    ['الإملاء: الهمزات والتاء والألف اللينة', 'Spelling: hamza, ta marbuta/maftuha, alif maqsura', 'A'],
    ['علامات الترقيم', 'Punctuation marks', 'A'],
    ['كتابة فقرة منظمة', 'Write an organised paragraph', 'C'],
  ]],
  ['arabic', 'm1-m3', 'الأدب والفهم', 'Literature & Comprehension', [
    ['تحليل النصوص الأدبية وتذوقها', 'Analyse and appreciate literary texts', 'N'],
    ['الاستيعاب القرائي والاستنتاج', 'Reading comprehension and inference', 'N'],
    ['البلاغة: التشبيه والاستعارة والكناية', 'Rhetoric: simile, metaphor, metonymy', 'U'],
    ['المحادثة والإلقاء', 'Speaking and recitation', 'A'],
  ]],
  ['arabic', 'm1-m3', 'اللغة والكتابة', 'Language & Writing', [
    ['النحو: المرفوعات والمنصوبات والمجرورات', 'Grammar: nominative, accusative and genitive cases', 'A'],
    ['الصرف: الأوزان والاشتقاق', 'Morphology: patterns and derivation', 'A'],
    ['الإملاء والترقيم', 'Spelling and punctuation', 'A'],
    ['الكتابة: المقال والرسالة والتلخيص', 'Writing: essay, letter and summary', 'C'],
  ]],

  /* ============================== Science ============================== */
  ['science', 'p1-p3', 'علوم الحياة والمادة والطاقة', 'Life, Matter & Energy', [
    ['تصنيف الكائنات الحية وغير الحية', 'Classify living and non-living things', 'U'],
    ['خصائص المادة وحالاتها', 'Properties and states of matter', 'U'],
    ['القوة والحركة', 'Forces and motion', 'U'],
    ['الأرض والشمس والقمر والفصول', 'Earth, sun, moon and seasons', 'U'],
    ['مهارات العلم: الملاحظة والقياس والتسجيل', 'Science skills: observe, measure and record', 'A'],
  ]],
  ['science', 'p4-p6', 'علوم الحياة والأرض', 'Life & Earth Science', [
    ['دورات الحياة والسلاسل الغذائية', 'Life cycles and food chains', 'U'],
    ['أجهزة جسم الإنسان ووظائفها', 'Human body systems and their functions', 'U'],
    ['النظام الشمسي وتغيرات سطح الأرض', 'The solar system and changes on Earth', 'U'],
  ]],
  ['science', 'p4-p6', 'العلوم الفيزيائية والاستقصاء', 'Physical Science & Inquiry', [
    ['المادة: خصائصها وتغيراتها الفيزيائية والكيميائية', 'Matter: properties, physical and chemical changes', 'U'],
    ['أشكال الطاقة (الحرارة والضوء والصوت والكهرباء)', 'Forms of energy (heat, light, sound, electricity)', 'U'],
    ['القوى والآلات البسيطة', 'Forces and simple machines', 'A'],
    ['تصميم التجارب وتفسير البيانات', 'Design experiments and interpret data', 'N'],
  ]],
  ['science', 'm1-m3', 'علوم الحياة والأرض', 'Life & Earth Science', [
    ['الخلية والوراثة', 'Cells and heredity', 'U'],
    ['التصنيف والتنوع الحيوي والنظم البيئية', 'Classification, biodiversity and ecosystems', 'U'],
    ['علوم الأرض والفضاء', 'Earth and space science', 'U'],
  ]],
  ['science', 'm1-m3', 'العلوم الفيزيائية والاستقصاء', 'Physical Science & Inquiry', [
    ['تركيب المادة والجدول الدوري', 'Structure of matter and the periodic table', 'U'],
    ['التفاعلات الكيميائية والمحاليل', 'Chemical reactions and solutions', 'A'],
    ['الحركة والقوى وقوانين نيوتن', 'Motion, forces and Newton’s laws', 'A'],
    ['الطاقة والكهرباء والمغناطيسية', 'Energy, electricity and magnetism', 'A'],
    ['مهارات الاستقصاء العلمي وتحليل البيانات', 'Scientific inquiry and data analysis', 'N'],
  ]],

  /* ============================== English ============================== */
  ['english', 'p1-p3', 'English (We Can)', 'English (We Can)', [
    ['التعرف على حروف الأبجدية وأصواتها', 'Recognise the alphabet letters and sounds', 'R'],
    ['قراءة الكلمات الشائعة وفهمها', 'Read and understand high-frequency words', 'U'],
    ['الاستماع وفهم التعليمات البسيطة', 'Listen to and understand simple instructions', 'U'],
    ['التحدث: السؤال والجواب البسيط', 'Speaking: ask and answer simple questions', 'A'],
    ['كتابة الكلمات والجمل القصيرة', 'Write words and short sentences', 'A'],
  ]],
  ['english', 'p4-p6', 'English Skills', 'English Skills', [
    ['فهم مفردات الوحدة واستخدامها', 'Understand and use unit vocabulary', 'U'],
    ['استخدام التراكيب والأزمنة الأساسية بشكل صحيح', 'Use basic grammar structures and tenses correctly', 'A'],
    ['فهم النصوص القصيرة المقروءة', 'Comprehend short reading texts', 'U'],
    ['الاستماع والفهم', 'Listening comprehension', 'U'],
    ['التحدث: حوارات قصيرة', 'Speaking: short dialogues', 'A'],
    ['الكتابة: فقرة قصيرة', 'Writing: a short paragraph', 'C'],
  ]],
  ['english', 'm1-m3', 'English Skills', 'English Skills', [
    ['المفردات الأكاديمية والسياقية', 'Academic and contextual vocabulary', 'U'],
    ['القواعد: توظيف الأزمنة والتراكيب', 'Grammar: use tenses and structures accurately', 'A'],
    ['الاستيعاب القرائي والاستنتاج', 'Reading comprehension and inference', 'N'],
    ['الاستماع لتفاصيل وأفكار رئيسة', 'Listening for details and main ideas', 'U'],
    ['التحدث والتفاعل', 'Speaking and interaction', 'A'],
    ['كتابة نص منظم (رسالة، مقال قصير)', 'Write an organised text (letter, short essay)', 'C'],
  ]],

  /* ===================== Quran & Islamic studies ===================== */
  ['islamic', 'p1-p3', 'القرآن والدراسات الإسلامية', 'Quran & Islamic Studies', [
    ['تلاوة السور والآيات المقررة تلاوة صحيحة', 'Recite assigned surahs and verses correctly', 'A'],
    ['حفظ السور والآيات المقررة', 'Memorise assigned surahs and verses', 'R'],
    ['معرفة أركان الإسلام والإيمان', 'Know the pillars of Islam and faith', 'R'],
    ['فهم الآداب والأخلاق الإسلامية', 'Understand Islamic manners and ethics', 'U'],
    ['الطهارة والصلاة المبسطة', 'Basic rulings of purification and prayer', 'U'],
    ['قصص الأنبياء والصحابة', 'Stories of the prophets and companions', 'U'],
  ]],
  ['islamic', 'p4-m3', 'القرآن والدراسات الإسلامية', 'Quran & Islamic Studies', [
    ['التلاوة وأحكام التجويد', 'Recitation and tajweed rules', 'A'],
    ['الحفظ والتسميع', 'Memorisation and recitation from memory', 'R'],
    ['فهم معاني الآيات (التفسير)', 'Understand the meanings of verses (tafsir)', 'U'],
    ['حفظ الأحاديث المقررة وفهمها', 'Memorise and understand assigned hadiths', 'U'],
    ['العقيدة والتوحيد', 'Creed and tawhid', 'U'],
    ['الفقه: أحكام العبادات والمعاملات', 'Fiqh: rulings of worship and transactions', 'A'],
    ['السيرة النبوية والتاريخ الإسلامي', 'Prophetic biography and Islamic history', 'U'],
    ['الآداب والسلوك', 'Etiquette and conduct', 'A'],
  ]],

  /* ============================ Social studies ============================ */
  ['social', 'p4-m3', 'الدراسات الاجتماعية', 'Social Studies', [
    ['تاريخ المملكة العربية السعودية وتوحيدها', 'History and unification of Saudi Arabia', 'U'],
    ['جغرافية المملكة: التضاريس والمناخ والسكان', 'Geography of the Kingdom: terrain, climate, population', 'U'],
    ['قراءة الخرائط واستخدام الإحداثيات', 'Read maps and use coordinates', 'A'],
    ['المواطنة والحقوق والواجبات', 'Citizenship, rights and duties', 'U'],
    ['التاريخ الإسلامي والحضارات', 'Islamic history and civilisations', 'U'],
    ['الاقتصاد والموارد', 'Economy and resources', 'U'],
    ['تحليل المصادر التاريخية', 'Analyse historical sources', 'N'],
  ]],

  /* ============================== Digital ============================== */
  ['digital', 'p4-m3', 'المهارات الرقمية', 'Digital Skills', [
    ['مكونات الحاسب وتشغيله', 'Computer components and operation', 'U'],
    ['السلامة الرقمية وحماية المعلومات', 'Digital safety and information protection', 'A'],
    ['استخدام برامج النصوص والعروض والجداول', 'Use word, presentation and spreadsheet software', 'A'],
    ['التفكير الحسابي والبرمجة بالكتل', 'Computational thinking and block programming', 'A'],
    ['البرمجة بلغة بايثون', 'Programming in Python', 'A'],
    ['تصميم صفحات الويب', 'Web page design', 'C'],
    ['تحليل البيانات الأساسي', 'Basic data analysis', 'N'],
    ['البحث الآمن وتقييم المصادر الرقمية', 'Safe searching and evaluating digital sources', 'E'],
  ]],

  /* ============================ Critical thinking ============================ */
  ['critical', 'm3,s1', 'التفكير الناقد', 'Critical Thinking', [
    ['معايير التفكير الناقد', 'Standards of critical thinking', 'U'],
    ['تحليل الحجج وتمييزها', 'Identify and analyse arguments', 'N'],
    ['كشف المغالطات المنطقية', 'Detect logical fallacies', 'N'],
    ['الاستدلال الاستقرائي والاستنباطي', 'Inductive and deductive reasoning', 'A'],
    ['تقييم الأدلة والمصادر', 'Evaluate evidence and sources', 'E'],
    ['اتخاذ القرار وحل المشكلات', 'Decision making and problem solving', 'C'],
  ]],

  /* ===================== Life skills / Art / PE (p1-m3) ===================== */
  ['life', 'p1-m3', 'المهارات الحياتية والأسرية', 'Life & Family Skills', [
    ['السلامة المنزلية والإسعافات الأولية', 'Home safety and first aid', 'A'],
    ['التغذية الصحية والنظافة الشخصية', 'Healthy eating and personal hygiene', 'U'],
    ['إدارة الوقت والموارد الشخصية', 'Manage time and personal resources', 'A'],
    ['التواصل والعمل الجماعي', 'Communication and teamwork', 'A'],
    ['المسؤولية الأسرية والمجتمعية', 'Family and community responsibility', 'U'],
  ]],
  ['art', 'p1-m3', 'التربية الفنية', 'Art Education', [
    ['استخدام عناصر الفن (الخط واللون والشكل)', 'Use the elements of art (line, colour, shape)', 'A'],
    ['تنفيذ عمل فني بخامات متنوعة', 'Create an artwork with varied media', 'C'],
    ['الزخرفة الإسلامية والخط العربي', 'Islamic ornament and Arabic calligraphy', 'A'],
    ['التذوق الفني ونقد الأعمال', 'Art appreciation and critique', 'E'],
  ]],
  ['pe', 'p1-m3', 'التربية البدنية والدفاع عن النفس', 'PE & Self-Defence', [
    ['المهارات الحركية الأساسية', 'Fundamental movement skills', 'A'],
    ['اللياقة البدنية المرتبطة بالصحة', 'Health-related fitness', 'A'],
    ['مهارات الألعاب والرياضات', 'Game and sport skills', 'A'],
    ['قواعد السلامة والروح الرياضية', 'Safety rules and sportsmanship', 'U'],
    ['أساسيات الدفاع عن النفس', 'Self-defence basics', 'A'],
  ]],

  /* ============================== Kindergarten ============================== */
  ['kg-islamic', 'kg1-kg3', 'القيم الإسلامية', 'Islamic Values', [
    ['حفظ سور قصيرة وأدعية يومية', 'Memorise short surahs and daily supplications', 'R'],
    ['معرفة الله والرسول ﷺ بصورة مبسطة', 'Simple knowledge of Allah and the Prophet ﷺ', 'U'],
    ['ممارسة السلوكيات الإسلامية (السلام، الشكر)', 'Practise Islamic conduct (greeting, gratitude)', 'A'],
  ]],
  ['kg-arabic', 'kg1-kg3', 'التهيئة اللغوية', 'Early Literacy', [
    ['تمييز أشكال الحروف وأصواتها', 'Recognise letter shapes and sounds', 'R'],
    ['الاستماع وفهم القصص', 'Listen to and understand stories', 'U'],
    ['التعبير الشفهي عن الأفكار والمشاعر', 'Express ideas and feelings orally', 'A'],
    ['مهارات ما قبل الكتابة (التحكم بالقلم)', 'Pre-writing skills (pencil control)', 'A'],
  ]],
  ['kg-math', 'kg1-kg3', 'المفاهيم الرياضية', 'Early Maths', [
    ['العد والمقابلة (1–10)', 'Counting and one-to-one matching (1–10)', 'A'],
    ['تمييز الأشكال والأحجام والألوان', 'Recognise shapes, sizes and colours', 'U'],
    ['المقارنة والترتيب والأنماط البسيطة', 'Compare, order and simple patterns', 'A'],
    ['مفهوم الجمع والطرح بالأشياء المحسوسة', 'Concrete addition and subtraction', 'A'],
  ]],
  ['kg-science', 'kg1-kg3', 'الاستكشاف العلمي', 'Science Discovery', [
    ['استخدام الحواس في الملاحظة', 'Use the senses to observe', 'A'],
    ['النباتات والحيوانات والبيئة المحيطة', 'Plants, animals and the environment', 'U'],
    ['الطقس والفصول', 'Weather and seasons', 'U'],
    ['طرح الأسئلة والاستكشاف', 'Ask questions and explore', 'A'],
  ]],
  ['kg-english', 'kg1-kg3', 'English Early Skills', 'English Early Skills', [
    ['التعرف على حروف الأبجدية الإنجليزية وأصواتها', 'Recognise English letters and sounds', 'R'],
    ['فهم لغة الصف والكلمات الشائعة', 'Understand classroom language and common words', 'U'],
    ['ترديد الأناشيد والعبارات البسيطة', 'Say songs and simple phrases', 'A'],
  ]],
  ['kg-motor', 'kg1-kg3', 'النمو الحركي والصحة', 'Motor Development & Health', [
    ['الحركات الكبرى (الجري والقفز والتوازن)', 'Gross motor (running, jumping, balance)', 'A'],
    ['الحركات الدقيقة (القص والإمساك)', 'Fine motor (cutting, gripping)', 'A'],
    ['العادات الصحية والسلامة', 'Healthy habits and safety', 'U'],
  ]],
  ['kg-social', 'kg1-kg3', 'النمو الاجتماعي والانفعالي', 'Social-Emotional', [
    ['التعرف على المشاعر وتنظيمها', 'Identify and regulate feelings', 'U'],
    ['التعاون والمشاركة', 'Cooperation and sharing', 'A'],
    ['الاستقلالية في الروتين اليومي', 'Independence in daily routines', 'A'],
    ['احترام القواعد والآخرين', 'Respect rules and others', 'U'],
  ]],
  ['kg-arts', 'kg1-kg3', 'الفنون والإبداع', 'Arts & Creativity', [
    ['التعبير بالرسم والتلوين', 'Express through drawing and colouring', 'C'],
    ['التشكيل بالصلصال والخامات', 'Modelling with clay and materials', 'C'],
    ['الغناء والإيقاع', 'Singing and rhythm', 'A'],
  ]],

  /* ======================= Secondary — common first year ======================= */
  ['quran-tafsir', 's1', 'القرآن وتفسيره', 'Quran & Tafsir', [
    ['التلاوة الصحيحة بأحكام التجويد', 'Correct recitation with tajweed', 'A'],
    ['حفظ المقرر', 'Memorise assigned portions', 'R'],
    ['تفسير المفردات والآيات', 'Explain vocabulary and verses', 'U'],
    ['استنباط الهدايات والأحكام', 'Derive guidance and rulings', 'N'],
    ['ربط الآيات بالواقع', 'Connect verses to real life', 'A'],
  ]],
  ['lang1', 's1', 'الكفايات اللغوية', 'Language Competencies', [
    ['الاستيعاب القرائي وتحليل النصوص', 'Reading comprehension and text analysis', 'N'],
    ['توظيف النحو والصرف', 'Apply grammar and morphology', 'A'],
    ['الإملاء والكتابة الوظيفية', 'Spelling and functional writing', 'A'],
    ['التعبير الكتابي (مقال، تقرير)', 'Written expression (essay, report)', 'C'],
    ['تذوق الأدب والبلاغة', 'Literary and rhetorical appreciation', 'E'],
  ]],
  ['math1', 's1', 'الرياضيات', 'Mathematics', [
    ['المعادلات والمتباينات بمتغير واحد', 'Equations and inequalities in one variable', 'A'],
    ['العمليات على كثيرات الحدود والتحليل', 'Polynomial operations and factoring', 'A'],
    ['الدوال: تمثيلها وتحليل خصائصها', 'Functions: representation and properties', 'N'],
    ['الهندسة: المثلثات والدائرة', 'Geometry: triangles and circles', 'A'],
    ['الإحصاء والاحتمال', 'Statistics and probability', 'A'],
  ]],
  ['env', 's1', 'علم البيئة', 'Environmental Science', [
    ['النظم البيئية وتدفق الطاقة', 'Ecosystems and energy flow', 'U'],
    ['التنوع الحيوي والتوازن البيئي', 'Biodiversity and ecological balance', 'U'],
    ['الملوثات والتغير المناخي', 'Pollutants and climate change', 'N'],
    ['الموارد الطبيعية والاستدامة', 'Natural resources and sustainability', 'E'],
  ]],
  ['phys1', 's1', 'الفيزياء', 'Physics', [
    ['الحركة في بعد واحد وبعدين', 'Motion in one and two dimensions', 'A'],
    ['القوى وقوانين نيوتن', 'Forces and Newton’s laws', 'A'],
    ['الشغل والطاقة', 'Work and energy', 'A'],
    ['الموجات والصوت', 'Waves and sound', 'U'],
    ['حل المسائل الفيزيائية وتحليل البيانات', 'Physics problem solving and data analysis', 'N'],
  ]],
  ['bio1', 's1', 'الأحياء', 'Biology', [
    ['الخلية وعملياتها', 'The cell and its processes', 'U'],
    ['الوراثة والحمض النووي', 'Heredity and DNA', 'U'],
    ['التطور والتصنيف', 'Evolution and classification', 'U'],
    ['أجهزة الجسم', 'Body systems', 'U'],
    ['مهارات المختبر', 'Laboratory skills', 'A'],
  ]],
  ['digital1', 's1', 'التقنية الرقمية', 'Digital Technology', [
    ['الخوارزميات والبرمجة', 'Algorithms and programming', 'A'],
    ['قواعد البيانات وتنظيم المعلومات', 'Databases and information organisation', 'A'],
    ['الشبكات والأمن الرقمي', 'Networks and digital security', 'U'],
    ['تصميم حلول رقمية', 'Design digital solutions', 'C'],
  ]],
  ['english1', 's1', 'English Skills', 'English Skills', [
    ['الاستيعاب القرائي', 'Reading comprehension', 'N'],
    ['المفردات والقواعد', 'Vocabulary and grammar', 'A'],
    ['الكتابة', 'Writing', 'C'],
    ['الاستماع', 'Listening', 'U'],
    ['التحدث', 'Speaking', 'A'],
  ]],
  ['fitness', 's1', 'اللياقة والثقافة الصحية', 'Fitness & Health Culture', [
    ['مكونات اللياقة البدنية', 'Components of physical fitness', 'U'],
    ['التغذية والصحة العامة', 'Nutrition and general health', 'U'],
    ['السلامة والإسعاف', 'Safety and first aid', 'A'],
    ['تخطيط برنامج رياضي شخصي', 'Plan a personal fitness programme', 'C'],
  ]],
  ['vocational', 's1', 'التربية المهنية', 'Vocational Education', [
    ['التخطيط المهني والتعرف على المهن', 'Career planning and exploring professions', 'U'],
    ['مهارات سوق العمل', 'Workplace skills', 'A'],
    ['السلامة المهنية', 'Occupational safety', 'A'],
    ['التواصل المهني', 'Professional communication', 'A'],
  ]],
  ['arts-s1', 's1', 'الفنون', 'Arts', [
    ['عناصر ومبادئ التصميم', 'Elements and principles of design', 'U'],
    ['تنفيذ عمل فني', 'Create an artwork', 'C'],
    ['تاريخ الفن والتذوق', 'Art history and appreciation', 'E'],
  ]],

  /* ========================= Secondary — general track ========================= */
  ['math-g', 's2-s3', 'الرياضيات', 'Mathematics', [
    ['حساب المثلثات والدوال المثلثية', 'Trigonometry and trigonometric functions', 'A'],
    ['الدوال الأسية واللوغاريتمية', 'Exponential and logarithmic functions', 'A'],
    ['المتتاليات والمتسلسلات', 'Sequences and series', 'A'],
    ['الإحصاء والاحتمالات', 'Statistics and probability', 'N'],
    ['مدخل إلى التفاضل والتكامل', 'Introduction to calculus', 'A'],
  ]],
  ['phys-g', 's2-s3', 'الفيزياء', 'Physics', [
    ['الكهرباء والمغناطيسية', 'Electricity and magnetism', 'A'],
    ['الديناميكا الحرارية', 'Thermodynamics', 'A'],
    ['الضوء والبصريات', 'Light and optics', 'U'],
    ['الفيزياء الحديثة', 'Modern physics', 'U'],
    ['التحليل وحل المسائل', 'Analysis and problem solving', 'N'],
  ]],
  ['chem-g', 's2-s3', 'الكيمياء', 'Chemistry', [
    ['بنية الذرة والجدول الدوري', 'Atomic structure and the periodic table', 'U'],
    ['الروابط الكيميائية والمركبات', 'Chemical bonds and compounds', 'U'],
    ['المعادلات والمولات والحسابات الكيميائية', 'Equations, moles and stoichiometry', 'A'],
    ['المحاليل والأحماض والقواعد', 'Solutions, acids and bases', 'A'],
    ['الاتزان الكيميائي والحركية', 'Chemical equilibrium and kinetics', 'N'],
  ]],
  ['bio-g', 's2-s3', 'الأحياء', 'Biology', [
    ['علم الوراثة الجزيئي', 'Molecular genetics', 'U'],
    ['الأيض والتنفس الخلوي والبناء الضوئي', 'Metabolism, respiration and photosynthesis', 'U'],
    ['فسيولوجيا الأجهزة', 'Systems physiology', 'U'],
    ['علم البيئة والتطور', 'Ecology and evolution', 'N'],
  ]],
  ['lang-g', 's2-s3', 'الكفايات اللغوية', 'Language Competencies', [
    ['تحليل النصوص الأدبية والفكرية', 'Analyse literary and intellectual texts', 'N'],
    ['النحو والصرف التطبيقي', 'Applied grammar and morphology', 'A'],
    ['الكتابة الإبداعية والحجاجية', 'Creative and argumentative writing', 'C'],
    ['النقد والبلاغة', 'Criticism and rhetoric', 'E'],
  ]],
  ['digital-g', 's2-s3', 'التقنية الرقمية', 'Digital Technology', [
    ['البرمجة المتقدمة وهياكل البيانات', 'Advanced programming and data structures', 'A'],
    ['قواعد البيانات وSQL', 'Databases and SQL', 'A'],
    ['الشبكات والحوسبة السحابية', 'Networks and cloud computing', 'U'],
    ['مبادئ الذكاء الاصطناعي', 'Principles of artificial intelligence', 'U'],
  ]],
  ['social-g', 's2-s3', 'الدراسات الاجتماعية', 'Social Studies', [
    ['تحليل الأحداث التاريخية وتفسيرها', 'Analyse and interpret historical events', 'N'],
    ['التحليل الجغرافي والخرائط والبيانات', 'Geographic analysis, maps and data', 'N'],
    ['الاقتصاد والتنمية', 'Economy and development', 'U'],
    ['المواطنة والمجتمع', 'Citizenship and society', 'U'],
  ]],
  ['english-g', 's2-s3', 'English Skills', 'English Skills', [
    ['الاستيعاب القرائي المتقدم', 'Advanced reading comprehension', 'N'],
    ['المفردات الأكاديمية والقواعد', 'Academic vocabulary and grammar', 'A'],
    ['الكتابة الأكاديمية', 'Academic writing', 'C'],
    ['الاستماع والتحدث', 'Listening and speaking', 'A'],
  ]],
  ['earth', 's2-s3', 'علوم الأرض والفضاء', 'Earth & Space Science', [
    ['تركيب الأرض والصفائح التكتونية', 'Earth’s structure and plate tectonics', 'U'],
    ['الغلاف الجوي والمناخ', 'Atmosphere and climate', 'U'],
    ['النجوم والمجرات', 'Stars and galaxies', 'U'],
    ['استكشاف الفضاء', 'Space exploration', 'U'],
  ]],
  ['elective', 's2-s3', 'المجال الاختياري', 'Elective Field', [
    ['إتقان المحتوى المعرفي للمقرر', 'Mastery of the course content', 'U'],
    ['التطبيق العملي للمهارات', 'Practical application of skills', 'A'],
    ['البحث والعرض', 'Research and presentation', 'C'],
  ]],

  /* =========================== Computer science & engineering =========================== */
  ['data-sci', 's2-s3', 'علم البيانات', 'Data Science', [
    ['جمع البيانات وتنظيفها', 'Collect and clean data', 'A'],
    ['التحليل الإحصائي والاستكشافي', 'Statistical and exploratory analysis', 'N'],
    ['التصور البياني للبيانات', 'Data visualisation', 'C'],
    ['بناء نماذج تنبؤية بسيطة', 'Build simple predictive models', 'C'],
    ['أخلاقيات البيانات', 'Data ethics', 'E'],
  ]],
  ['ai', 's2-s3', 'الذكاء الاصطناعي', 'Artificial Intelligence', [
    ['مفاهيم الذكاء الاصطناعي وتطبيقاته', 'AI concepts and applications', 'U'],
    ['التعلم الآلي: التدريب والتقييم', 'Machine learning: training and evaluation', 'A'],
    ['معالجة اللغة والرؤية الحاسوبية', 'Language processing and computer vision', 'U'],
    ['أخلاقيات الذكاء الاصطناعي', 'AI ethics', 'E'],
    ['تطبيق نموذج على مسألة واقعية', 'Apply a model to a real problem', 'C'],
  ]],
  ['cyber', 's2-s3', 'الأمن السيبراني', 'Cybersecurity', [
    ['أنواع التهديدات والهجمات', 'Types of threats and attacks', 'U'],
    ['أساسيات التشفير', 'Cryptography basics', 'A'],
    ['حماية الشبكات والأنظمة', 'Protect networks and systems', 'A'],
    ['الاستجابة للحوادث', 'Incident response', 'A'],
    ['الأنظمة والأخلاقيات الأمنية', 'Security regulations and ethics', 'E'],
  ]],
  ['iot', 's2-s3', 'إنترنت الأشياء', 'Internet of Things', [
    ['مكونات الأنظمة: الحساسات والمشغلات', 'System components: sensors and actuators', 'U'],
    ['برمجة المتحكمات الدقيقة', 'Programming microcontrollers', 'A'],
    ['الاتصال والبروتوكولات', 'Connectivity and protocols', 'U'],
    ['بناء نموذج تطبيقي', 'Build a working prototype', 'C'],
  ]],
  ['eng-prin', 's2-s3', 'مبادئ الهندسة', 'Principles of Engineering', [
    ['عملية التصميم الهندسي', 'The engineering design process', 'A'],
    ['القياس والرسم الهندسي', 'Measurement and engineering drawing', 'A'],
    ['المواد والآلات', 'Materials and machines', 'U'],
    ['بناء النماذج الأولية واختبارها', 'Build and test prototypes', 'C'],
  ]],
  ['soft-eng', 's2-s3', 'هندسة البرمجيات', 'Software Engineering', [
    ['دورة حياة تطوير البرمجيات', 'Software development life cycle', 'U'],
    ['تحليل المتطلبات والتصميم', 'Requirements analysis and design', 'N'],
    ['البرمجة والاختبار', 'Programming and testing', 'A'],
    ['التحكم بالإصدارات والعمل الجماعي', 'Version control and teamwork', 'A'],
  ]],
  ['adv-math', 's2-s3', 'الرياضيات المتقدمة', 'Advanced Mathematics', [
    ['التفاضل', 'Differentiation', 'A'],
    ['التكامل', 'Integration', 'A'],
    ['المصفوفات والجبر الخطي', 'Matrices and linear algebra', 'A'],
    ['المتتاليات واللوغاريتمات', 'Sequences and logarithms', 'A'],
    ['الاحتمالات المتقدمة', 'Advanced probability', 'N'],
  ]],
  ['eng-phys', 's2-s3', 'الفيزياء الهندسية', 'Engineering Physics', [
    ['الميكانيكا الهندسية', 'Engineering mechanics', 'A'],
    ['الدوائر الكهربائية', 'Electric circuits', 'A'],
    ['الديناميكا الحرارية', 'Thermodynamics', 'U'],
    ['القياس وتحليل الخطأ', 'Measurement and error analysis', 'N'],
  ]],
  ['chem-cs', 's2-s3', 'الكيمياء', 'Chemistry', [
    ['بنية المادة وخصائصها', 'Structure and properties of matter', 'U'],
    ['التفاعلات والحسابات الكيميائية', 'Reactions and stoichiometry', 'A'],
    ['الكيمياء الكهربائية والمواد', 'Electrochemistry and materials', 'U'],
  ]],
  ['lang-cs', 's2-s3', 'الكفايات اللغوية', 'Language Competencies', [
    ['الاستيعاب القرائي', 'Reading comprehension', 'N'],
    ['الكتابة الوظيفية والتقارير الفنية', 'Functional writing and technical reports', 'C'],
    ['القواعد والأسلوب', 'Grammar and style', 'A'],
  ]],
  ['english-cs', 's2-s3', 'English Skills', 'English Skills', [
    ['القراءة الفنية والعلمية', 'Technical and scientific reading', 'N'],
    ['المفردات التقنية', 'Technical vocabulary', 'U'],
    ['الكتابة والتقارير', 'Writing and reports', 'C'],
    ['الاستماع والتحدث', 'Listening and speaking', 'A'],
  ]],

  /* ============================== Health & life ============================== */
  ['human-body', 's2-s3', 'أنظمة جسم الإنسان', 'Human Body Systems', [
    ['تراكيب الأجهزة ووظائفها', 'Structure and function of systems', 'U'],
    ['الاتزان الداخلي', 'Homeostasis', 'U'],
    ['الأمراض الشائعة وأسبابها', 'Common diseases and their causes', 'U'],
    ['القياسات الحيوية والفحص', 'Vital signs and examination', 'A'],
    ['المصطلحات الطبية', 'Medical terminology', 'R'],
  ]],
  ['health-prin', 's2-s3', 'مبادئ العلوم الصحية', 'Principles of Health Sciences', [
    ['مبادئ الصحة والوقاية', 'Principles of health and prevention', 'U'],
    ['مكافحة العدوى', 'Infection control', 'A'],
    ['الصحة العامة', 'Public health', 'U'],
    ['أخلاقيات المهن الصحية', 'Health professions ethics', 'E'],
    ['الإسعافات الأولية', 'First aid', 'A'],
  ]],
  ['healthcare', 's2-s3', 'الرعاية الصحية', 'Healthcare', [
    ['النظام الصحي ومستوياته', 'The health system and its levels', 'U'],
    ['الرعاية السريرية الأساسية', 'Basic clinical care', 'A'],
    ['السلامة وجودة الرعاية', 'Safety and quality of care', 'E'],
    ['التواصل مع المريض', 'Communicating with patients', 'A'],
  ]],
  ['biochem', 's2-s3', 'الكيمياء الحيوية', 'Biochemistry', [
    ['الجزيئات الحيوية', 'Biomolecules', 'U'],
    ['الإنزيمات', 'Enzymes', 'U'],
    ['مسارات الأيض', 'Metabolic pathways', 'N'],
    ['الأحماض النووية', 'Nucleic acids', 'U'],
  ]],
  ['health-stats', 's2-s3', 'الإحصاء الصحي', 'Health Statistics', [
    ['جمع البيانات الصحية وتنظيمها', 'Collect and organise health data', 'A'],
    ['الإحصاء الوصفي', 'Descriptive statistics', 'A'],
    ['الارتباط والاستدلال', 'Correlation and inference', 'N'],
    ['تفسير نتائج الدراسات', 'Interpret study results', 'E'],
  ]],
  ['biomed', 's2-s3', 'الابتكار الطبي الحيوي', 'Biomedical Innovation', [
    ['تحديد مشكلة صحية', 'Define a health problem', 'U'],
    ['البحث والتصميم', 'Research and design', 'C'],
    ['النمذجة والاختبار', 'Modelling and testing', 'C'],
    ['الأخلاقيات والملكية الفكرية', 'Ethics and intellectual property', 'E'],
  ]],
  ['adv-bio', 's2-s3', 'الأحياء المتقدمة', 'Advanced Biology', [
    ['علم الوراثة الجزيئي', 'Molecular genetics', 'U'],
    ['التقنية الحيوية', 'Biotechnology', 'A'],
    ['المناعة', 'Immunology', 'U'],
    ['الأحياء الدقيقة', 'Microbiology', 'U'],
  ]],
  ['math-h', 's2-s3', 'الرياضيات', 'Mathematics', [
    ['الدوال والنمذجة', 'Functions and modelling', 'A'],
    ['الإحصاء والاحتمال', 'Statistics and probability', 'A'],
    ['الحساب الدوائي والقياسات', 'Dosage calculation and measurement', 'A'],
  ]],
  ['english-h', 's2-s3', 'English Skills', 'English Skills', [
    ['المفردات الطبية', 'Medical vocabulary', 'U'],
    ['القراءة العلمية', 'Scientific reading', 'N'],
    ['الكتابة والتقارير', 'Writing and reports', 'C'],
    ['الاستماع والتحدث', 'Listening and speaking', 'A'],
  ]],

  /* ============================== Business administration ============================== */
  ['mgmt', 's2-s3', 'مبادئ الإدارة', 'Principles of Management', [
    ['وظائف الإدارة (التخطيط والتنظيم والتوجيه والرقابة)', 'Functions of management (plan, organise, lead, control)', 'U'],
    ['القيادة والتحفيز', 'Leadership and motivation', 'U'],
    ['اتخاذ القرار', 'Decision making', 'A'],
    ['الهياكل التنظيمية', 'Organisational structures', 'U'],
  ]],
  ['finance', 's2-s3', 'الإدارة المالية', 'Financial Management', [
    ['القوائم المالية والنسب', 'Financial statements and ratios', 'A'],
    ['القيمة الزمنية للنقود', 'Time value of money', 'A'],
    ['الاستثمار والمخاطر', 'Investment and risk', 'N'],
    ['الموازنات والتخطيط المالي', 'Budgeting and financial planning', 'C'],
  ]],
  ['econ', 's2-s3', 'الاقتصاد', 'Economics', [
    ['العرض والطلب', 'Supply and demand', 'U'],
    ['سلوك المستهلك والمنتج', 'Consumer and producer behaviour', 'U'],
    ['هياكل الأسواق', 'Market structures', 'N'],
    ['الاقتصاد الكلي والاقتصاد السعودي', 'Macroeconomics and the Saudi economy', 'U'],
  ]],
  ['marketing', 's2-s3', 'التسويق', 'Marketing', [
    ['المزيج التسويقي', 'The marketing mix', 'U'],
    ['بحوث السوق وسلوك المستهلك', 'Market research and consumer behaviour', 'N'],
    ['التسويق الرقمي', 'Digital marketing', 'A'],
    ['إعداد خطة تسويقية', 'Prepare a marketing plan', 'C'],
  ]],
  ['accounting', 's2-s3', 'المحاسبة', 'Accounting', [
    ['معادلة المحاسبة والقيود', 'The accounting equation and entries', 'A'],
    ['دفتر اليومية والأستاذ', 'Journal and ledger', 'A'],
    ['ميزان المراجعة', 'Trial balance', 'A'],
    ['إعداد القوائم المالية', 'Prepare financial statements', 'C'],
    ['ضريبة القيمة المضافة', 'Value-added tax', 'U'],
  ]],
  ['entre', 's2-s3', 'ريادة الأعمال', 'Entrepreneurship', [
    ['توليد الأفكار وتقييم الفرص', 'Generate ideas and evaluate opportunities', 'C'],
    ['نموذج العمل', 'Business model', 'C'],
    ['دراسة الجدوى والخطة المالية', 'Feasibility study and financial plan', 'N'],
    ['العرض والإقناع', 'Pitching and persuasion', 'A'],
  ]],
  ['secretary', 's2-s3', 'السكرتارية والإدارة المكتبية', 'Secretarial & Office Admin', [
    ['تنظيم المراسلات والملفات', 'Organise correspondence and files', 'A'],
    ['إدارة المواعيد والاجتماعات', 'Manage appointments and meetings', 'A'],
    ['التواصل المهني', 'Professional communication', 'A'],
    ['برامج المكتب', 'Office software', 'A'],
  ]],
  ['law-b', 's2-s3', 'مبادئ القانون', 'Principles of Law', [
    ['مفهوم القانون ومصادره', 'The concept and sources of law', 'U'],
    ['الحقوق والالتزامات', 'Rights and obligations', 'U'],
    ['العقود', 'Contracts', 'A'],
    ['الأنظمة السعودية ذات الصلة', 'Relevant Saudi regulations', 'U'],
  ]],
  ['biz-stats', 's2-s3', 'تطبيقات الإحصاء في الأعمال', 'Business Statistics', [
    ['جمع البيانات وتنظيمها', 'Collect and organise data', 'A'],
    ['الإحصاء الوصفي', 'Descriptive statistics', 'A'],
    ['الاتجاهات والتنبؤ', 'Trends and forecasting', 'N'],
    ['الاحتمال في اتخاذ القرار', 'Probability in decision making', 'A'],
  ]],
  ['english-b', 's2-s3', 'English for Business', 'English for Business', [
    ['مفردات الأعمال', 'Business vocabulary', 'U'],
    ['المراسلات التجارية', 'Business correspondence', 'C'],
    ['العروض والاجتماعات', 'Presentations and meetings', 'A'],
    ['القراءة والاستماع', 'Reading and listening', 'U'],
  ]],

  /* ================================== Sharia track ================================== */
  ['hadith-term', 's2-s3', 'مصطلح الحديث', 'Hadith Terminology', [
    ['أقسام الحديث وتعريفاتها', 'Types of hadith and their definitions', 'R'],
    ['الصحيح والحسن والضعيف', 'Sahih, hasan and da‘if', 'U'],
    ['الإسناد والرواة', 'Chains of narration and narrators', 'N'],
    ['تخريج الحديث', 'Hadith referencing (takhrij)', 'A'],
  ]],
  ['usul', 's2-s3', 'أصول الفقه', 'Principles of Jurisprudence', [
    ['الحكم الشرعي وأقسامه', 'The legal ruling and its categories', 'U'],
    ['أدلة الأحكام', 'Sources of rulings', 'U'],
    ['دلالات الألفاظ', 'Implications of wording', 'N'],
    ['القواعد الأصولية وتطبيقها', 'Usuli maxims and their application', 'A'],
  ]],
  ['quran-sci', 's2-s3', 'علوم القرآن', 'Quranic Sciences', [
    ['نزول القرآن وجمعه', 'Revelation and compilation of the Quran', 'U'],
    ['المكي والمدني وأسباب النزول', 'Makki/Madani and occasions of revelation', 'U'],
    ['الناسخ والمنسوخ', 'Abrogation', 'U'],
    ['إعجاز القرآن', 'Inimitability of the Quran', 'N'],
  ]],
  ['fiqh', 's2-s3', 'الدراسات الفقهية', 'Fiqh Studies', [
    ['فقه العبادات', 'Fiqh of worship', 'A'],
    ['فقه المعاملات', 'Fiqh of transactions', 'A'],
    ['فقه الأسرة', 'Family fiqh', 'A'],
    ['القواعد الفقهية', 'Fiqh maxims', 'U'],
    ['المقارنة والترجيح', 'Comparison and weighing', 'E'],
  ]],
  ['tafsir', 's2-s3', 'التفسير', 'Tafsir', [
    ['مناهج التفسير', 'Methodologies of tafsir', 'U'],
    ['تفسير الآيات المقررة', 'Explain assigned verses', 'U'],
    ['اللغة في التفسير', 'Language in tafsir', 'A'],
    ['استنباط الأحكام والفوائد', 'Derive rulings and benefits', 'N'],
  ]],
  ['law-s', 's2-s3', 'مبادئ القانون', 'Principles of Law', [
    ['مفهوم القانون ومصادره', 'The concept and sources of law', 'U'],
    ['الحقوق والالتزامات', 'Rights and obligations', 'U'],
    ['النظام القضائي', 'The judicial system', 'U'],
  ]],
  ['law-apps', 's2-s3', 'تطبيقات في القانون', 'Applications in Law', [
    ['تحليل النصوص النظامية', 'Analyse regulatory texts', 'N'],
    ['تطبيق الأنظمة على وقائع', 'Apply regulations to cases', 'A'],
    ['صياغة المذكرات', 'Draft memoranda', 'C'],
    ['دراسة الحالات', 'Case studies', 'N'],
  ]],
  ['digital-cit', 's2-s3', 'المواطنة الرقمية', 'Digital Citizenship', [
    ['الهوية والسمعة الرقمية', 'Digital identity and reputation', 'U'],
    ['الخصوصية والأمن', 'Privacy and security', 'A'],
    ['الأنظمة والأخلاقيات الرقمية', 'Digital laws and ethics', 'E'],
    ['التعامل النقدي مع المحتوى', 'Critical engagement with content', 'E'],
  ]],
  ['balagha', 's2-s3', 'البلاغة والنقد', 'Rhetoric & Criticism', [
    ['علم المعاني', 'Science of meanings (ma‘ani)', 'U'],
    ['علم البيان', 'Science of figurative language (bayan)', 'U'],
    ['علم البديع', 'Science of embellishment (badi‘)', 'U'],
    ['التحليل البلاغي والنقدي للنصوص', 'Rhetorical and critical analysis of texts', 'N'],
  ]],
  ['arabic-deep', 's2-s3', 'اللغة العربية المعمقة', 'Advanced Arabic', [
    ['النحو المتقدم', 'Advanced grammar', 'A'],
    ['الصرف', 'Morphology', 'A'],
    ['فقه اللغة', 'Philology', 'U'],
    ['النصوص الأدبية', 'Literary texts', 'N'],
    ['التحرير والكتابة', 'Composition and writing', 'C'],
  ]],

  /* ===================== NGL — National Geographic Learning (CBLL) ===================== */
  ['ngl-ela', 'gk-g5', 'Phonics & Foundational Skills', 'Phonics & Foundational Skills', [
    ['الوعي الفونيمي', 'Phonemic awareness', 'U'],
    ['فك شفرة الكلمات (Decoding)', 'Decode words', 'A'],
    ['تمييز الكلمات عالية التردد البصري', 'Recognise high-frequency sight words', 'R'],
    ['الطلاقة في قراءة النصوص', 'Fluency in reading text', 'A'],
  ], 'NGL_US', 'CCSS.ELA.RF / WIDA 1-2'],
  ['ngl-ela', 'gk-g12', 'Academic Vocabulary', 'Academic Vocabulary', [
    ['المفردات العامة واسعة الاستخدام (Tier 2)', 'General academic words (Tier 2)', 'U'],
    ['المفردات التخصصية العلمية (Tier 3)', 'Domain-specific science words (Tier 3)', 'U'],
    ['تحليل السوابق واللواحق والجذور', 'Analyse prefixes, suffixes and roots', 'N'],
    ['اشتقاق المعنى من السياق', 'Use context clues to determine meaning', 'A'],
  ], 'NGL_US', 'CCSS.ELA.L / WIDA ELD-LA, SC'],
  ['ngl-ela', 'gk-g12', 'Reading Informational & Literary Texts', 'Reading Informational & Literary Texts', [
    ['تحديد الفكرة الرئيسة والتفاصيل الداعمة', 'Identify the main idea and supporting details', 'U'],
    ['تحليل السبب والنتيجة', 'Analyse cause and effect', 'N'],
    ['المقارنة والتباين', 'Compare and contrast', 'N'],
    ['التتابع الزمني للأحداث', 'Sequence of events', 'U'],
    ['تحديد وجهة نظر الكاتب ونبرته', 'Determine author’s point of view and tone', 'N'],
    ['استخدام الرسوم والإنفوجرافيك لفهم النص', 'Use graphics and infographics to understand text', 'A'],
  ], 'NGL_US', 'CCSS.ELA.RI & RL / WIDA 4-5'],
  ['ngl-ela', 'g1-g12', 'Writing & Conventions', 'Writing & Conventions', [
    ['صياغة جمل مركبة باستخدام أطر اللغة', 'Compose compound sentences using Language Frames', 'A'],
    ['كتابة نص تفسيري', 'Write an explanatory text', 'C'],
    ['كتابة مقال حجاجي إقناعي', 'Write an argumentative / persuasive essay', 'C'],
    ['كتابة تقرير استقصائي', 'Write an investigative research report', 'C'],
    ['القواعد والأساليب اللغوية', 'Language conventions', 'A'],
  ], 'NGL_US', 'CCSS.ELA.W & L / WIDA 1-5'],
  ['ngl-ela', 'gk-g12', 'Speaking, Listening & Critical Inquiry', 'Speaking, Listening & Critical Inquiry', [
    ['مناقشة السؤال المحوري للوحدة (Big Question)', 'Discuss the unit Big Question', 'A'],
    ['تقييم موثوقية المصادر والأدلة', 'Evaluate credibility of sources and evidence', 'E'],
    ['المناظرة الأكاديمية', 'Academic debate', 'E'],
    ['التلخيص الشفهي للأفكار المعقدة', 'Orally summarise complex ideas', 'U'],
  ], 'NGL_US', 'CCSS.ELA.SL / 21st Century Skills'],
];

/* -------------------------------------------------------------------- build */
const counters: Record<string, number> = {};
const lead = (s: string) => s.replace(/-/g, '').toUpperCase();

export const SEED_SKILLS: Skill[] = B.flatMap(([subjectId, grades, domAr, domEn, items, framework = 'MOE_SA', ref]) =>
  items.map(([ar, en, bl, fixed]) => {
    const n = (counters[subjectId] = (counters[subjectId] || 0) + 1);
    const code = fixed || `SKL-${lead(subjectId)}-${String(n).padStart(3, '0')}`;
    const s: Skill = {
      id: code, code, framework, subjectId, grades: band(grades),
      domain: { ar: domAr, en: domEn }, name: { ar, en }, bloom: BL[bl], custom: false,
      ...(ref ? { ref } : {}),
    };
    return s;
  }),
);

export const BLOOM_LABEL: Record<Bloom, { ar: string; en: string }> = {
  remember: { ar: 'تذكر', en: 'Remember' },
  understand: { ar: 'فهم', en: 'Understand' },
  apply: { ar: 'تطبيق', en: 'Apply' },
  analyze: { ar: 'تحليل', en: 'Analyse' },
  evaluate: { ar: 'تقويم', en: 'Evaluate' },
  create: { ar: 'ابتكار', en: 'Create' },
};
