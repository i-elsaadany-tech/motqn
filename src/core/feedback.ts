import type { CalcMode, Lang, StudentResult, Thresholds } from './types';

const T = {
  ar: {
    opening: (n: string, pct: string, tot: string, max: string, ex: string) =>
      `حصل الطالب/ة ${n} على ${tot} من ${max} (${pct}%) في «${ex}».`,
    strong: (l: string) => `أظهر/ت إتقاناً واضحاً في: ${l}.`,
    dev: (l: string) => `هو/هي في طور التقدم في: ${l}، ويحتاج/تحتاج مزيداً من التدريب لتثبيتها.`,
    non: (l: string) => `يحتاج/تحتاج إلى دعم علاجي في: ${l}.`,
    allStrong: 'أظهر/ت إتقاناً في جميع المهارات المقاسة، ويُنصح بتقديم أنشطة إثرائية.',
    rec: (l: string) => `التوصية: تدريبات مركزة تبدأ بـ «${l}» لأنها الأدنى إتقاناً.`,
    lost: (l: string, v: string) => `أكثر مهارة أثّرت في فقدان الدرجات هي «${l}» (فقد ${v}% من مجموع الاختبار).`,
    insuff: 'ملاحظة: بعض المهارات قيست بعدد قليل من الأسئلة، فنتائجها مؤشر أولي فقط.',
    absent: 'لم تُرصد درجات لهذا الطالب في الاختبار.',
    and: ' و', sep: '، ',
  },
  en: {
    opening: (n: string, pct: string, tot: string, max: string, ex: string) =>
      `${n} scored ${tot} out of ${max} (${pct}%) in “${ex}”.`,
    strong: (l: string) => `Showed clear mastery of: ${l}.`,
    dev: (l: string) => `Is developing in: ${l}, and needs more practice to consolidate these skills.`,
    non: (l: string) => `Needs targeted support in: ${l}.`,
    allStrong: 'Mastered every skill assessed; enrichment activities are recommended.',
    rec: (l: string) => `Recommendation: focused practice starting with “${l}”, the skill with the lowest mastery.`,
    lost: (l: string, v: string) => `The skill that cost the most marks was “${l}” (${v}% of the exam total lost).`,
    insuff: 'Note: some skills were measured by only a few questions, so their results are an early indicator only.',
    absent: 'No scores were recorded for this student in the exam.',
    and: ' and ', sep: ', ',
  },
};

function join(list: string[], lang: Lang): string {
  const x = T[lang];
  if (list.length <= 1) return list.join('');
  return list.slice(0, -1).join(x.sep) + x.and + list[list.length - 1];
}

const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

/** Template based narrative (deterministic, safe to show to parents). */
export function buildFeedback(o: {
  lang: Lang; studentName: string; examTitle: string; result: StudentResult;
  skillName: (id: string) => string; mode: CalcMode; th: Thresholds;
}): string[] {
  const { lang, result: r } = o;
  const x = T[lang];
  if (!r.assessed) return [x.absent];
  const out: string[] = [x.opening(o.studentName, f1(r.pct), f1(r.total), f1(r.max), o.examTitle)];
  const by = (s: string) => r.skills.filter((k) => k.status === s).sort((a, b) => b.M - a.M).map((k) => o.skillName(k.skillId));
  const strong = by('mastered'), dev = by('developing'), non = by('non');
  if (strong.length && !dev.length && !non.length) out.push(x.allStrong);
  else if (strong.length) out.push(x.strong(join(strong, lang)));
  if (dev.length) out.push(x.dev(join(dev, lang)));
  if (non.length) out.push(x.non(join(non, lang)));
  const weakest = [...r.skills].filter((k) => k.status !== 'mastered').sort((a, b) => a.M - b.M)[0];
  if (weakest) out.push(x.rec(o.skillName(weakest.skillId)));
  if (o.mode === 'C') {
    const lostTop = [...r.skills].sort((a, b) => b.lost - a.lost)[0];
    if (lostTop && lostTop.lost > 0.05) out.push(x.lost(o.skillName(lostTop.skillId), f1(lostTop.lost)));
  }
  if (r.skills.some((k) => k.insufficient)) out.push(x.insuff);
  return out;
}
