const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const out = process.argv[2] || '/tmp/shots';
  require('fs').mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const errs = [];
  const mk = async (name, vp, lang) => {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, locale: lang === 'ar' ? 'ar-SA' : 'en-US' });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(name + ': ' + e.message));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(name + ' console: ' + m.text()); });
    await p.goto('http://localhost:8080/');
    await p.waitForSelector('.shell');
    if (lang === 'en') { await p.click('.lang-btn'); }
    await p.screenshot({ path: `${out}/${name}-home-empty.png` });
    await p.click('text=/تحميل بيانات تجريبية|Load sample data/');
    await p.waitForSelector('.stats');
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${name}-results.png`, fullPage: true });
    const url = p.url();
    const examId = url.split('/exam/')[1].split('/')[0];
    for (const [k, path] of [['setup', `/exam/${examId}/setup`], ['scores', `/exam/${examId}/scores`], ['classreport', `/class-report/${examId}`], ['skills', '/skills'], ['settings', '/settings'], ['classes', '/classes']]) {
      await p.goto(`http://localhost:8080/#${path}`); await p.waitForTimeout(250);
      await p.screenshot({ path: `${out}/${name}-${k}.png`, fullPage: true });
    }
    // first student report
    await p.goto(`http://localhost:8080/#/exam/${examId}/results`); await p.waitForTimeout(200);
    await p.click('table.tbl .act button >> nth=0'); await p.waitForSelector('.report'); await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/${name}-student.png`, fullPage: true });
    await ctx.close();
  };
  await mk('desk-ar', { width: 1280, height: 900 }, 'ar');
  await mk('mob-ar', { width: 390, height: 800 }, 'ar');
  await mk('mob-en', { width: 390, height: 800 }, 'en');
  console.log('errors:', JSON.stringify(errs, null, 1));
  await b.close();
})();
