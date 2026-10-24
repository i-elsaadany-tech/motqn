const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  for (const lang of ['ar', 'en']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2.77 });
    const p = await ctx.newPage();
    await p.goto('http://localhost:8080/'); await p.waitForSelector('.shell');
    if (lang === 'en') await p.click('.lang-btn');
    await p.click('.btn.soft, .empty .btn:not(.primary)'); await p.waitForSelector('.stats'); await p.waitForTimeout(3600);
    const id = p.url().split('/exam/')[1].split('/')[0];
    const o = `store-assets/${lang}`; require('fs').mkdirSync(o, { recursive: true });
    await p.goto('http://localhost:8080/#/'); await p.waitForTimeout(300); await p.screenshot({ path: `${o}/1-home.png` });
    for (const [n, h] of [['2-results', `/exam/${id}/results`], ['3-setup', `/exam/${id}/setup`], ['4-scores', `/exam/${id}/scores`], ['6-skills', '/skills']]) {
      await p.goto('http://localhost:8080/#' + h); await p.waitForTimeout(350); await p.screenshot({ path: `${o}/${n}.png` });
    }
    await p.goto(`http://localhost:8080/#/exam/${id}/results`); await p.waitForTimeout(200);
    await p.click('table.tbl .act button >> nth=0'); await p.waitForSelector('.report'); await p.waitForTimeout(300);
    await p.evaluate(() => window.scrollTo(0, 120)); await p.screenshot({ path: `${o}/5-student-report.png` });
    await ctx.close();
  }
  await b.close();
})();
