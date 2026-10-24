// مكتبة المهارات الأساسية (ثنائية اللغة). كل سطر: العربية | English
// هذه مهارات أساسية صاغها فريق المشروع من نواتج التعلم العامة، وتحتاج مراجعة معلمين متخصصين قبل الاعتماد الرسمي.
import { SUBJECTS, NGL_STRANDS, ALL_LEVEL_KEYS } from './curriculum.js';

// [معرّف المادة, [المستويات], النص]
const BLOCKS = [
  // ===== رياض الأطفال =====
  ['kg_islamic', ['kg'], `
حفظ سور قصيرة وأدعية يومية|Recite short surahs and daily supplications
التعرف على أركان الإسلام|Identify the pillars of Islam
ممارسة آداب السلام والطعام|Practice greeting and eating etiquette
التعرف على قصص الأنبياء المبسطة|Recall simple prophets' stories`],
  ['kg_lang', ['kg'], `
تمييز الحروف الهجائية وأصواتها|Recognize Arabic letters and their sounds
التعرف على الحركات القصيرة|Identify short vowels
تكوين كلمات بسيطة|Form simple words
الاستماع والتعبير عن الأفكار بجمل قصيرة|Listen and express ideas in short sentences
مسك القلم والكتابة الأولية|Hold a pencil and begin early writing`],
  ['kg_math', ['kg'], `
العد والتناظر الأحادي حتى 20|Count with one-to-one correspondence up to 20
التعرف على الأرقام وكتابتها|Recognize and write numerals
المقارنة بين المجموعات (أكثر/أقل)|Compare groups (more/less)
التعرف على الأشكال الهندسية|Identify basic shapes
تصنيف الأشياء وترتيب الأنماط|Sort objects and extend patterns`],
  ['kg_science', ['kg'], `
استخدام الحواس في الملاحظة|Use senses to observe
تصنيف الكائنات الحية وغير الحية|Classify living and non-living things
التعرف على الفصول والطقس|Describe seasons and weather
الحفاظ على البيئة|Practice caring for the environment`],
  ['kg_english', ['kg'], `
التعرف على حروف الأبجدية الإنجليزية|Recognize English alphabet letters
ربط الحرف بصوته|Match letters to sounds
فهم تعليمات بسيطة|Follow simple instructions
نطق مفردات مألوفة|Say familiar vocabulary words`],
  ['kg_motor', ['kg'], `
التحكم بالحركات الكبيرة (الجري والقفز)|Show gross-motor control
التآزر الحركي الدقيق|Show fine-motor coordination
التعبير الفني بالتلوين والتشكيل|Express ideas through drawing and crafts
التفاعل الاجتماعي والعمل الجماعي|Cooperate in group play`],

  // ===== القرآن والدراسات الإسلامية =====
  ['islamic', ['p13'], `
تلاوة الآيات المقررة تلاوة سليمة|Recite assigned verses correctly
حفظ السور والآيات المقررة|Memorize assigned surahs
التعرف على أركان الإسلام والإيمان|Identify the pillars of Islam and faith
تطبيق آداب الصلاة والطهارة|Apply prayer and purification etiquette
استنتاج القيم من قصص الأنبياء|Infer values from prophets' stories
حفظ الأحاديث والأدعية المقررة|Memorize assigned hadiths and supplications`],
  ['islamic', ['p46'], `
تلاوة القرآن مع مراعاة أحكام التجويد الأساسية|Recite with basic tajweed rules
حفظ الآيات والسور المقررة|Memorize assigned verses
شرح معاني الآيات المقررة|Explain the meanings of assigned verses
تطبيق أحكام الطهارة والصلاة والصيام|Apply rulings of purification, prayer and fasting
شرح الأحاديث المقررة واستخلاص الفوائد|Explain hadiths and derive lessons
التعرف على أمور العقيدة الأساسية|Explain core beliefs
الاستدلال بسيرة النبي ﷺ|Draw lessons from the Prophet's biography`],
  ['islamic', ['m'], `
تلاوة الآيات وفق أحكام التجويد|Recite verses according to tajweed
تفسير الآيات المقررة تفسيراً مبسطاً|Explain assigned verses
شرح الأحاديث النبوية وتطبيقها|Explain and apply prophetic hadiths
الاستدلال على مسائل العقيدة|Support core beliefs with evidence
تطبيق أحكام الفقه في العبادات والمعاملات|Apply fiqh rulings in worship and transactions
تحليل الدروس المستفادة من السيرة|Analyze lessons from the Seerah
ربط القيم الإسلامية بالسلوك الاجتماعي|Link Islamic values to social conduct`],

  // ===== اللغة العربية =====
  ['arabic', ['p13'], `
قراءة نصوص قصيرة قراءة سليمة|Read short texts fluently
فهم المقروء والإجابة عن أسئلته|Comprehend a text and answer questions
تمييز الاسم والفعل والحرف|Distinguish nouns, verbs and particles
الكتابة الإملائية السليمة (الهمزة، التاء، اللام الشمسية والقمرية)|Spell correctly
كتابة جمل وفقرات قصيرة|Write short sentences and paragraphs
المحادثة والتعبير الشفهي|Speak and express ideas orally
تنمية الثروة اللغوية|Build vocabulary`],
  ['arabic', ['p46'], `
قراءة النصوص قراءة معبرة|Read texts expressively
استخراج الفكرة الرئيسة والأفكار الفرعية|Identify main and supporting ideas
تحليل التراكيب النحوية (الجملة الاسمية والفعلية)|Analyze basic grammar (nominal and verbal sentences)
تطبيق قواعد الإملاء|Apply spelling rules
كتابة موضوع تعبيري متسلسل|Write an organized composition
استنتاج معاني المفردات من السياق|Infer meaning from context
تذوق النصوص الأدبية|Appreciate literary texts`],
  ['arabic', ['m'], `
تحليل النصوص القرائية واستنتاج الأفكار|Analyze and infer from reading texts
التعرف على الأساليب البلاغية|Identify rhetorical devices
تطبيق القواعد النحوية (الإعراب)|Apply grammar and parsing
تطبيق القواعد الإملائية والصرفية|Apply spelling and morphology rules
كتابة مقال أو رسالة بأسلوب سليم|Write an essay or letter
تحليل النصوص الأدبية وتذوقها|Analyze literary texts
تلخيص المقروء بلغة الطالب|Summarize a text in one's own words`],

  // ===== الرياضيات =====
  ['math', ['p13'], `
العد والمقارنة بين الأعداد حتى 1000|Count and compare numbers up to 1000
القيمة المنزلية للأرقام|Use place value
الجمع والطرح بإعادة التجميع|Add and subtract with regrouping
مفهوم الضرب وجدول الضرب|Understand multiplication and multiplication facts
مفهوم القسمة|Understand division
التعرف على الكسور البسيطة|Identify simple fractions
قياس الطول والكتلة والزمن|Measure length, mass and time
التعرف على الأشكال الهندسية|Identify 2D and 3D shapes
قراءة التمثيلات البيانية البسيطة|Read simple graphs
حل مسائل لفظية بخطوة واحدة|Solve one-step word problems`],
  ['math', ['p46'], `
العمليات على الأعداد الكبيرة|Operate on multi-digit numbers
تطبيق القسمة المطولة|Apply long division
المقارنة بين الكسور الاعتيادية والعشرية|Compare fractions and decimals
جمع الكسور وطرحها|Add and subtract fractions
حساب المحيط والمساحة والحجم|Calculate perimeter, area and volume
تصنيف الزوايا والمضلعات|Classify angles and polygons
تحليل التمثيلات البيانية بالأعمدة والنقاط|Analyze bar graphs and dot plots
حساب المتوسط الحسابي|Calculate the mean
حل مسائل لفظية متعددة الخطوات|Solve multi-step word problems`],
  ['math', ['m'], `
العمليات على الأعداد الصحيحة والنسبية|Operate on integers and rational numbers
النسبة والتناسب والنسبة المئوية|Use ratios, proportions and percentages
تبسيط التعبيرات الجبرية|Simplify algebraic expressions
حل المعادلات والمتباينات الخطية|Solve linear equations and inequalities
تمثيل الدوال بيانياً|Represent functions graphically
الهندسة الإحداثية|Use coordinate geometry
التطابق والتشابه|Apply congruence and similarity
تطبيق نظرية فيثاغورس|Apply the Pythagorean theorem
حساب المساحات والحجوم|Calculate areas and volumes
الإحصاء والاحتمالات|Analyze data and probability`],
  ['math', ['s1', 'sg', 'sh'], `
حل المعادلات والمتباينات|Solve equations and inequalities
الدوال والعلاقات وتمثيلها|Analyze functions and relations
العمليات على كثيرات الحدود والتحليل|Operate on and factor polynomials
حل المعادلات التربيعية|Solve quadratic equations
الهندسة والبرهان|Use geometric reasoning and proof
حساب المثلثات|Apply trigonometry
الإحصاء وتحليل البيانات|Analyze statistical data
الاحتمالات والعد|Apply probability and counting
النمذجة الرياضية وحل المسائل|Model and solve real-world problems`],

  // ===== العلوم =====
  ['science', ['p13'], `
استخدام الحواس والأدوات في الملاحظة|Observe using senses and tools
تصنيف الكائنات الحية|Classify living things
التعرف على دورات حياة النبات والحيوان|Describe life cycles
وصف خصائص المادة وحالاتها|Describe properties and states of matter
التعرف على القوة والحركة|Identify force and motion
وصف الأرض والطقس والفصول|Describe Earth, weather and seasons
المحافظة على البيئة|Protect the environment`],
  ['science', ['p46'], `
تنفيذ استقصاء علمي بسيط|Carry out a simple investigation
وصف السلاسل والشبكات الغذائية|Describe food chains and webs
شرح أجهزة جسم الإنسان|Explain human body systems
تمييز خواص المادة وتغيراتها|Distinguish properties and changes of matter
تفسير القوة والحركة والطاقة|Explain force, motion and energy
تفسير ظواهر الأرض والفضاء|Explain Earth and space phenomena
تفسير البيانات في جداول ورسوم|Interpret scientific data`],
  ['science', ['m'], `
تصميم تجربة علمية وضبط المتغيرات|Design a controlled experiment
شرح الخلية والوراثة|Explain cells and heredity
تفسير النظم البيئية|Explain ecosystems
التمييز بين التغيرات الفيزيائية والكيميائية|Distinguish physical and chemical changes
تطبيق قوانين الحركة والطاقة|Apply laws of motion and energy
تفسير ظواهر الأرض والفضاء|Explain Earth and space systems
استخدام الأدلة لدعم الاستنتاجات|Support conclusions with evidence`],
  ['science', ['s1'], `
تطبيق خطوات الاستقصاء العلمي|Apply scientific inquiry
حل المسائل الفيزيائية الأساسية|Solve basic physics problems
شرح العمليات الحيوية في الخلية|Explain biological processes
تحليل بيانات تجريبية وتفسيرها|Analyze experimental data
ربط الأنظمة البيئية بالأنشطة البشرية|Relate ecosystems to human activity`],

  // ===== الإنجليزية =====
  ['english', ['p13'], `
التعرف على الحروف والأصوات|Recognize letters and sounds
قراءة الكلمات الشائعة|Read high-frequency words
فهم جمل ونصوص بسيطة|Understand simple sentences
تكوين جمل قصيرة|Write short sentences
المحادثة بعبارات أساسية|Use basic spoken phrases`],
  ['english', ['p46', 'm', 's1', 'sg', 'sc', 'sh', 'ss'], `
فهم نص مسموع|Listen for main ideas
قراءة نصوص وفهمها|Comprehend reading texts
استخدام المفردات الأكاديمية|Use academic vocabulary
تطبيق القواعد النحوية|Apply grammar conventions
الكتابة المنظمة (فقرة أو مقال)|Write an organized paragraph or essay
التحدث والتواصل الشفهي|Speak and communicate orally`],

  // ===== الدراسات الاجتماعية =====
  ['social', ['p46'], `
قراءة الخرائط وتحديد الاتجاهات|Read maps and directions
التعرف على جغرافية المملكة|Describe the geography of Saudi Arabia
التعرف على تاريخ المملكة وتأسيسها|Recall the history and founding of Saudi Arabia
شرح مفاهيم المواطنة|Explain citizenship concepts
مقارنة الأنشطة الاقتصادية والموارد|Compare resources and economic activities`],
  ['social', ['m', 'sg'], `
تحليل الأحداث التاريخية وتتابعها|Analyze historical events and sequence
استخدام الخرائط والبيانات الجغرافية|Use maps and geographic data
شرح العلاقة بين الإنسان والبيئة|Explain human-environment interaction
تقويم مصادر المعلومات|Evaluate information sources
ممارسة قيم المواطنة المسؤولة|Practice responsible citizenship`],

  // ===== المهارات الرقمية =====
  ['digital', ['p46'], `
استخدام الحاسب وملفاته|Use a computer and manage files
حماية المعلومات والسلوك الآمن على الإنترنت|Practice safe online behavior
معالجة النصوص والعروض|Use word processing and presentations
البرمجة بالكتل|Create programs with blocks`],
  ['digital', ['m', 's1', 'sg'], `
كتابة برامج بلغة بايثون|Write Python programs
استخدام الجمل الشرطية والتكرارية|Use conditionals and loops
تصميم صفحات الويب|Design web pages
تطبيق ممارسات الأمن الرقمي|Apply digital security practices
تحليل بيانات أساسية|Analyze basic data
تقويم المصادر الرقمية|Evaluate digital sources`],

  // ===== التفكير الناقد =====
  ['critical', ['m', 's1'], `
التمييز بين الحقيقة والرأي|Distinguish fact from opinion
تحديد المغالطات المنطقية|Identify logical fallacies
تطبيق الاستدلال الاستقرائي والاستنباطي|Apply inductive and deductive reasoning
تقويم الأدلة والمصادر|Evaluate evidence and sources
بناء حجة منطقية|Construct a sound argument
اتخاذ قرار مبني على التحليل|Make reasoned decisions`],

  // ===== المهارات الحياتية، الفنية، البدنية =====
  ['life', ['p13', 'p46', 'm'], `
ممارسة آداب السلوك الاجتماعي|Practice social etiquette
المحافظة على السلامة والصحة|Maintain safety and health
إدارة الوقت والموارد الشخصية|Manage time and personal resources
التعاون والعمل الجماعي|Cooperate in teams
اتخاذ القرارات المناسبة|Make sound decisions`],
  ['art', ['p13', 'p46', 'm'], `
استخدام عناصر الفن (الخط واللون والشكل)|Use elements of art
تنفيذ أعمال بالخامات المختلفة|Create works using different materials
تطبيق الزخرفة الإسلامية|Apply Islamic decoration
تذوق الأعمال الفنية ونقدها|Appreciate and critique artworks
الإبداع والابتكار في التصميم|Create original designs`],
  ['pe', ['p13', 'p46', 'm'], `
أداء المهارات الحركية الأساسية|Perform basic motor skills
تطوير عناصر اللياقة البدنية|Develop fitness components
تطبيق قواعد الألعاب الرياضية|Apply sports rules
أداء مهارات الدفاع عن النفس الأساسية|Perform basic self-defense moves
الالتزام بالسلامة والروح الرياضية|Show safety and sportsmanship`],

  // ===== الثانوية: السنة المشتركة =====
  ['quran_tafseer', ['s1'], `
تلاوة الآيات تلاوة سليمة|Recite verses correctly
تفسير الآيات المقررة|Explain assigned verses
استنباط الأحكام والقيم من الآيات|Derive rulings and values
حفظ الآيات المقررة|Memorize assigned verses`],
  ['lang_comp', ['s1', 'sg', 'sc'], `
تحليل نصوص قرائية متنوعة|Analyze varied reading texts
تطبيق القواعد النحوية والصرفية|Apply grammar and morphology
كتابة نصوص وظيفية وإبداعية|Write functional and creative texts
تحليل الأساليب البلاغية|Analyze rhetorical devices
الحوار والتعبير الشفهي|Engage in oral expression`],
  ['env', ['s1'], `
شرح النظم البيئية وتدفق الطاقة|Explain ecosystems and energy flow
تحليل العلاقة بين الإنسان والبيئة|Analyze human impact on the environment
تقويم حلول الاستدامة|Evaluate sustainability solutions
تفسير بيانات بيئية|Interpret environmental data`],
  ['physics', ['s1', 'sg'], `
تطبيق قوانين الحركة|Apply laws of motion
حل مسائل الشغل والطاقة|Solve work and energy problems
تحليل الموجات والصوت والضوء|Analyze waves, sound and light
تحليل الدوائر الكهربائية|Analyze electric circuits
استخدام الرياضيات في النمذجة الفيزيائية|Use mathematics in physical models`],
  ['biology', ['s1', 'sg'], `
شرح بنية الخلية ووظائفها|Explain cell structure and function
شرح التمثيل الضوئي والتنفس الخلوي|Explain photosynthesis and respiration
حل مسائل الوراثة|Solve genetics problems
شرح التطور والتنوع الحيوي|Explain evolution and biodiversity
تحليل بيانات أحيائية|Analyze biological data`],
  ['fitness', ['s1'], `
تقييم مكونات اللياقة البدنية|Assess fitness components
تطبيق مبادئ التغذية السليمة|Apply sound nutrition principles
أداء تمارين وفق خطة شخصية|Follow a personal exercise plan
الوعي بالصحة النفسية والوقاية|Understand mental health and prevention`],
  ['vocational', ['s1'], `
التعرف على المهن وبيئات العمل|Identify careers and work environments
تطبيق أخلاقيات العمل|Apply work ethics
تحديد الميول المهنية وأهداف التطوير|Identify career interests and goals
إعداد سيرة ذاتية|Prepare a CV`],
  ['arts_sec', ['s1'], `
تطبيق مبادئ التصميم|Apply design principles
تنفيذ عمل فني بوسيط مختار|Produce an artwork
تحليل الأعمال الفنية والثقافية|Analyze artworks and culture
توثيق العمل الفني وتقديمه|Document and present art`],

  // ===== المسار العام =====
  ['chemistry', ['sg', 'sc'], `
تطبيق مفاهيم الذرة والجدول الدوري|Apply atomic structure and periodic trends
تفسير الروابط الكيميائية|Explain chemical bonding
موازنة المعادلات الكيميائية وحساب المولات|Balance equations and perform mole calculations
تحليل الحالات والغازات|Analyze states of matter and gas laws
تفسير الاتزان والأحماض والقواعد|Explain equilibrium and acids/bases
تحليل بيانات مختبرية|Analyze lab data`],
  ['earth_space', ['sg'], `
شرح تركيب الأرض وحركة الصفائح|Explain Earth's structure and plate tectonics
تفسير الغلاف الجوي والمناخ|Explain atmosphere and climate
شرح الأجرام السماوية ونشأة الكون|Explain celestial bodies and the universe
قراءة الخرائط والبيانات الفلكية|Read maps and astronomical data`],
  ['elective', ['sg'], `
تطبيق المعارف في المجال الاختياري|Apply knowledge in the elective field
إنجاز مهام عملية في المجال|Complete practical tasks
تحليل مشكلات المجال واقتراح حلول|Analyze problems and propose solutions`],
  ['capstone', ['sg', 'sc', 'sh', 'sb', 'ss'], `
تحديد مشكلة المشروع وصياغة أهدافه|Define the project problem and goals
جمع المعلومات وتحليلها|Collect and analyze information
تنفيذ المنتج أو الحل|Develop the product or solution
عرض المشروع والدفاع عنه|Present and defend the project
العمل الجماعي وإدارة المشروع|Teamwork and project management`],

  // ===== علوم الحاسب والهندسة =====
  ['data_science', ['sc'], `
جمع البيانات وتنظيفها|Collect and clean data
تطبيق الإحصاء الوصفي|Apply descriptive statistics
تمثيل البيانات بصرياً|Visualize data
بناء نموذج تنبؤي بسيط|Build a simple predictive model
تفسير النتائج وتوصيلها|Interpret and communicate results`],
  ['ai', ['sc'], `
شرح مفاهيم الذكاء الاصطناعي|Explain AI concepts
تمييز أنواع التعلم الآلي|Distinguish machine learning types
تدريب نموذج وتقييمه|Train and evaluate a model
تحليل أخلاقيات الذكاء الاصطناعي والتحيز|Analyze AI ethics and bias`],
  ['cyber', ['sc'], `
تحديد التهديدات والثغرات الشائعة|Identify common threats and vulnerabilities
تطبيق مبادئ التشفير الأساسية|Apply basic cryptography
تطبيق ضوابط حماية الحسابات والشبكات|Apply account and network protections
تحليل حادثة أمنية|Analyze a security incident`],
  ['iot', ['sc'], `
وصف مكونات إنترنت الأشياء|Describe IoT components
برمجة متحكم وحساسات|Program a microcontroller and sensors
بناء دائرة وربطها بالشبكة|Build and connect a circuit
تحليل بيانات الحساسات|Analyze sensor data`],
  ['eng_principles', ['sc'], `
تطبيق خطوات التصميم الهندسي|Apply the engineering design process
الرسم والنمذجة الهندسية|Create engineering drawings and models
حل مسائل هندسية أساسية|Solve basic engineering problems
اختبار النماذج وتقويمها|Test and evaluate prototypes`],
  ['software_eng', ['sc'], `
تحليل متطلبات برنامج|Analyze software requirements
تصميم خوارزميات وهياكل بيانات|Design algorithms and data structures
كتابة شيفرة نظيفة|Write clean code
اختبار البرمجيات وتصحيحها|Test and debug software
العمل بمنهجيات تطوير جماعية|Use collaborative development`],
  ['adv_math', ['sc'], `
تطبيق التفاضل|Apply differentiation
تطبيق التكامل|Apply integration
حل مسائل المصفوفات والمتجهات|Solve matrix and vector problems
نمذجة مسائل هندسية رياضياً|Model engineering problems mathematically`],
  ['eng_physics', ['sc'], `
تحليل القوى والعزوم|Analyze forces and moments
تحليل الأنظمة الكهربائية والميكانيكية|Analyze electrical and mechanical systems
قياس البيانات التجريبية وتقدير الخطأ|Measure data and estimate error
تطبيق مفاهيم الطاقة في تصميمات هندسية|Apply energy concepts in designs`],

  // ===== الصحة والحياة =====
  ['human_body', ['sh'], `
شرح تركيب أجهزة الجسم ووظائفها|Explain body systems
تفسير التوازن الداخلي|Explain homeostasis
ربط الاختلالات بالأمراض الشائعة|Relate dysfunction to common diseases
استخدام المصطلحات التشريحية|Use anatomical terminology`],
  ['health_sci', ['sh'], `
وصف المهن الصحية ومساراتها|Describe health careers
تطبيق مبادئ السلامة ومكافحة العدوى|Apply safety and infection control
تطبيق الإسعافات الأولية|Perform first aid
التواصل الصحي الفعال|Communicate effectively in health settings`],
  ['healthcare', ['sh'], `
تقييم العلامات الحيوية|Assess vital signs
شرح نظم تقديم الرعاية الصحية|Explain healthcare delivery systems
تطبيق أخلاقيات الرعاية وسرية المريض|Apply care ethics and confidentiality
وضع خطة رعاية بسيطة|Develop a simple care plan`],
  ['biochem', ['sh'], `
شرح تركيب الجزيئات الحيوية|Explain biomolecule structure
تفسير دور الإنزيمات|Explain enzyme function
شرح مسارات التمثيل الغذائي|Describe metabolic pathways
تحليل نتائج مخبرية|Analyze lab results`],
  ['health_stats', ['sh'], `
حساب المقاييس الإحصائية للبيانات الصحية|Compute health-data statistics
تفسير معدلات الانتشار والحدوث|Interpret prevalence and incidence
قراءة الدراسات الصحية بنقد|Critically read health studies
تمثيل البيانات الصحية|Visualize health data`],
  ['biomed', ['sh'], `
تحديد مشكلة طبية والبحث عن حلول مبتكرة|Identify a medical problem and innovate
تصميم نموذج لجهاز أو حل صحي|Prototype a health solution
تقويم أخلاقيات الابتكار الحيوي|Evaluate bioethics
عرض نتائج الابتكار|Present innovation results`],
  ['adv_bio', ['sh'], `
شرح علم الأحياء الجزيئي|Explain molecular biology
تحليل الوراثة والهندسة الوراثية|Analyze genetics and genetic engineering
شرح المناعة والأمراض|Explain immunity and disease
تحليل بيانات أحيائية متقدمة|Analyze advanced biological data`],

  // ===== إدارة الأعمال =====
  ['mgmt', ['sb'], `
شرح وظائف الإدارة|Explain management functions
تحليل الهيكل التنظيمي|Analyze organizational structure
التخطيط واتخاذ القرار|Plan and make decisions
تطبيق مهارات القيادة والتحفيز|Apply leadership and motivation`],
  ['finance', ['sb'], `
قراءة القوائم المالية|Read financial statements
حساب النسب المالية|Calculate financial ratios
إعداد موازنة|Prepare a budget
تقييم خيارات التمويل والاستثمار|Evaluate financing and investment options`],
  ['economics', ['sb'], `
شرح العرض والطلب|Explain supply and demand
تحليل السوق والتسعير|Analyze markets and pricing
شرح المؤشرات الاقتصادية الكلية|Explain macroeconomic indicators
تفسير السياسات الاقتصادية|Interpret economic policy`],
  ['marketing', ['sb'], `
تحليل السوق المستهدف|Analyze target markets
تطبيق عناصر المزيج التسويقي|Apply the marketing mix
تصميم حملة تسويقية|Design a marketing campaign
تحليل سلوك المستهلك|Analyze consumer behavior`],
  ['accounting', ['sb'], `
تطبيق معادلة المحاسبة وقيد اليومية|Apply the accounting equation and journal entries
ترحيل القيود وإعداد ميزان المراجعة|Post entries and prepare trial balance
إعداد القوائم المالية|Prepare financial statements
تطبيق مبادئ المحاسبة المقبولة|Apply accounting principles`],
  ['entrepreneurship', ['sb'], `
توليد فكرة مشروع وتقييمها|Generate and assess a business idea
إعداد خطة عمل|Prepare a business plan
تقدير التكاليف والإيرادات|Estimate costs and revenues
عرض المشروع على المستثمرين|Pitch a venture`],
  ['secretarial', ['sb'], `
تنظيم الملفات والمراسلات|Organize files and correspondence
كتابة المراسلات الإدارية|Write business correspondence
جدولة المواعيد وإدارة الاجتماعات|Schedule and manage meetings
استخدام برامج المكاتب|Use office software`],
  ['law', ['sb', 'ss'], `
شرح مفاهيم القانون وأقسامه|Explain legal concepts and branches
التعرف على مصادر النظام السعودي|Identify sources of Saudi regulations
تحليل حالة قانونية بسيطة|Analyze a simple legal case
شرح العقود والحقوق والواجبات|Explain contracts, rights and duties`],
  ['biz_stats', ['sb'], `
حساب مقاييس النزعة المركزية والتشتت|Compute central tendency and dispersion
تفسير الرسوم الإحصائية للأعمال|Interpret business charts
تطبيق الانحدار والارتباط البسيط|Apply simple regression and correlation
دعم قرار بالبيانات|Support decisions with data`],

  // ===== المسار الشرعي =====
  ['hadith_terms', ['ss'], `
التمييز بين أنواع الحديث|Distinguish hadith types
تحليل السند والمتن|Analyze isnad and matn
الحكم على الحديث بقواعد المصطلح|Grade a hadith using terminology rules
التعرف على كتب الحديث ومناهجها|Identify hadith books and methods`],
  ['usul_fiqh', ['ss'], `
شرح الأدلة الشرعية|Explain legal evidences
تطبيق دلالات الألفاظ|Apply textual implications
تمييز الحكم التكليفي والوضعي|Distinguish legal ruling types
استنباط حكم من دليل|Derive a ruling from evidence`],
  ['quran_sci', ['ss'], `
شرح نزول القرآن وجمعه|Explain revelation and compilation
التمييز بين المكي والمدني والناسخ والمنسوخ|Distinguish Makki/Madani and abrogation
تطبيق قواعد التفسير|Apply tafseer principles
شرح القراءات وأثرها|Explain qira'at and their effects`],
  ['fiqh_studies', ['ss'], `
مقارنة آراء المذاهب في مسألة|Compare schools of thought on an issue
تطبيق الفقه على النوازل|Apply fiqh to contemporary issues
الاستدلال على الأحكام|Support rulings with evidence
شرح فقه المعاملات|Explain fiqh of transactions`],
  ['tafseer', ['ss'], `
تفسير الآيات تفسيراً تحليلياً|Provide analytical tafseer
الربط بين الآيات وسياقها|Connect verses with context
استخراج الفوائد والأحكام|Extract lessons and rulings
شرح مقاصد السور|Explain surah objectives`],
  ['law_apps', ['ss'], `
تطبيق النظام على وقائع|Apply regulations to cases
صياغة مذكرة أو دفاع مبسط|Draft a brief memo or defense
تحليل حكم قضائي|Analyze a ruling
شرح إجراءات التقاضي|Explain litigation procedures`],
  ['digital_citizen', ['ss'], `
ممارسة السلوك الرقمي المسؤول|Practice responsible digital behavior
حماية الخصوصية والهوية الرقمية|Protect privacy and digital identity
تقويم المحتوى الرقمي|Evaluate digital content
احترام الملكية الفكرية|Respect intellectual property`],
  ['rhetoric', ['ss'], `
تحليل الصور البيانية والبديعية|Analyze figurative and rhetorical devices
نقد نص أدبي|Critique a literary text
تذوق جماليات الأسلوب|Appreciate stylistic aesthetics
توظيف البلاغة في الكتابة|Use rhetoric in writing`],
  ['adv_arabic', ['ss'], `
الإعراب التفصيلي للتراكيب|Perform detailed parsing
تحليل النصوص التراثية|Analyze classical texts
الكتابة الأكاديمية الرصينة|Write formal academic prose
تطبيق الصرف والعروض والإملاء المتقدم|Apply morphology, prosody and advanced spelling`],

  // ===== ناشونال جيوغرافيك (خيوط المهارة) =====
  ['ngl_found', ['ALL'], `
الوعي الفونيمي (تمييز الأصوات)|Phonemic awareness
فك شفرة الكلمات (Decoding)|Decode words
قراءة الكلمات عالية التردد|Read high-frequency words
الطلاقة في القراءة|Read with fluency
تطبيق قواعد الإملاء التأسيسية|Apply foundational spelling patterns`],
  ['ngl_vocab', ['ALL'], `
استخدام مفردات عامة واسعة الاستخدام (Tier 2)|Use Tier 2 vocabulary
استخدام مفردات علمية تخصصية (Tier 3)|Use Tier 3 content vocabulary
تحليل السوابق واللواحق والجذور|Analyze prefixes, suffixes and roots
اشتقاق معنى الكلمة من السياق|Infer word meaning from context
إكمال خرائط المفاهيم|Complete concept maps`],
  ['ngl_read', ['ALL'], `
تحديد الفكرة الرئيسة والتفاصيل الداعمة|Identify main idea and supporting details
تحليل السبب والنتيجة|Analyze cause and effect
المقارنة والتباين|Compare and contrast
تحديد التتابع الزمني|Sequence events
تحديد نبرة الكاتب ووجهة نظره|Identify author's tone and point of view
قراءة الرسوم والإنفوجرافيك|Interpret graphics and infographics
تحديد الأدلة النصية|Cite textual evidence`],
  ['ngl_write', ['ALL'], `
صياغة جمل مركبة باستخدام أطر اللغة|Write compound sentences using language frames
كتابة نص تفسيري|Write an explanatory text
كتابة مقال حجاجي أو إقناعي|Write an argumentative or persuasive essay
كتابة تقرير استقصائي|Write an investigative report
تطبيق قواعد اللغة والترقيم|Apply grammar and punctuation
مراجعة الكتابة وتحريرها|Revise and edit writing`],
  ['ngl_speak', ['ALL'], `
المشاركة في نقاش حول السؤال المحوري|Discuss the Big Question
تقويم موثوقية الأدلة والمصادر|Evaluate reliability of evidence
عرض فكرة شفهياً بوضوح|Present ideas orally
تلخيص الأفكار المعقدة شفهياً|Summarize complex ideas orally
العمل التشاركي لحل مشكلة|Collaborate to solve a problem`],
];

const BLOOM_MAP = [
  ['create', /^(design|create|compose|develop|build|plan|prepare|draft|produce|prototype|generate|program|write an? (argument|essay|business|organized|investigative)|construct|define the project|model)/i],
  ['evaluate', /^(evaluate|judge|justify|critique|assess|support|grade|appreciate|compare schools|make reasoned|make sound|test and)/i],
  ['analyze', /^(analy[sz]e|distinguish|examine|infer|identify (logical|main|common)|compare|interpret|relate|connect|debug|classify)/i],
  ['apply', /^(apply|use|solve|calculate|compute|perform|practice|operate|write|follow|represent|read|carry|conduct|show|simplify|train|balance|derive|organi|schedule|measure|decode|complete|cite|revise|sequence|discuss|present|cooperate|collaborate|engage|speak|mak)/i],
  ['understand', /^(explain|describe|summari[sz]e|understand|recogni[sz]e|express|listen|comprehend|illustrate|provide|identify)/i],
  ['remember', /^(recall|recite|memori[sz]e|name|count|match|say|hold|form|read short|stat)/i],
];

export function bloomOf(en) {
  for (const [lvl, re] of BLOOM_MAP) if (re.test(en)) return lvl;
  return 'understand';
}

function parse(text) {
  return text.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const [ar, en] = l.split('|').map(s => s.trim());
    return { ar, en };
  });
}

// بناء المكتبة النهائية: مصفوفة مهارات مسطحة
export function buildLibrary() {
  const out = [];
  const counters = {};
  const nglIds = new Set(NGL_STRANDS.map(s => s.id));
  for (const [subjectId, levels, text] of BLOCKS) {
    const isNgl = nglIds.has(subjectId);
    const lvls = levels[0] === 'ALL' ? ALL_LEVEL_KEYS : levels;
    const items = parse(text);
    for (const lvl of lvls) {
      items.forEach(it => {
        const key = `${subjectId}:${lvl}`;
        counters[key] = (counters[key] || 0) + 1;
        const n = String(counters[key]).padStart(2, '0');
        out.push({
          id: `${isNgl ? 'NGL' : 'MOE'}-${subjectId}-${lvl}-${n}`.toUpperCase().replace(/_/g, ''),
          code: `${(isNgl ? 'NGL' : 'MOE')}-${subjectId.toUpperCase().replace(/_/g, '')}-${lvl.toUpperCase()}-${n}`,
          framework: isNgl ? 'NGL_US' : 'MOE_SA',
          subjectId, level: lvl,
          ar: it.ar, en: it.en,
          taxonomy: bloomOf(it.en),
          custom: false,
        });
      });
    }
  }
  return out;
}

export const SKILL_LIBRARY = buildLibrary();

// تغطية: كل مادة سعودية يجب أن تملك مهارات في كل مستوى تُدرَّس فيه
export function coverageGaps() {
  const gaps = [];
  for (const s of SUBJECTS) {
    for (const lvl of s.levels) {
      if (!SKILL_LIBRARY.some(k => k.subjectId === s.id && k.level === lvl)) gaps.push(`${s.id}:${lvl}`);
    }
  }
  return gaps;
}
