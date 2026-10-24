const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('dialog', (d) => d.accept());
  await p.goto('http://localhost:8080/'); await p.waitForSelector('.shell');
  // new class
  await p.click('button:has-text("إضافة فصل") >> nth=0'); await p.waitForSelector('.modal');
  await p.screenshot({ path: '/tmp/shots/e2e-classform.png' });
  await p.click('.modal-foot .btn.primary'); await p.waitForURL(/#\/class\//);
  // bulk students
  await p.click('text=/لصق قائمة الطلاب/'); await p.fill('.modal textarea', '1001\tأحمد علي\n1002\tسارة محمد\n1003\tليلى خالد');
  await p.click('.modal-foot .btn.primary');
  await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/shots/e2e-class.png', fullPage: true });
  console.log('students rows:', await p.locator('table tbody tr').count());
  await p.click('.tabs button >> nth=1'); await p.click('button:has-text("اختبار جديد") >> nth=0'); await p.waitForSelector('.modal');
  await p.click('.modal-foot .btn.primary'); await p.waitForURL(/\/setup/);
  // 4 questions x 2
  await p.locator('.num-in').first().fill('4'); await p.click('button:has-text("إضافة أسئلة")');
  await p.click('text=تحديد الكل'); await p.click('text=/ربط المحدد بمهارات/');
  await p.waitForSelector('.modal'); await p.screenshot({ path: '/tmp/shots/e2e-picker.png' });
  await p.locator('.skill-item').first().click();
  await p.click('.modal-foot .btn.primary');
  await p.click('text=التالي: إدخال الدرجات'); await p.waitForSelector('.grid-tbl');
  await p.click('text=لصق الدرجات'); await p.fill('.modal textarea', '1001\t2\t1\t2\t0\n1002\t2\t2\t2\t2\n1003\t0\t1\t1\t0');
  await p.click('.modal-foot .btn.primary'); await p.waitForTimeout(300);
  await p.screenshot({ path: '/tmp/shots/e2e-scores.png' });
  await p.click('text=عرض النتائج'); await p.waitForSelector('.stats');
  await p.screenshot({ path: '/tmp/shots/e2e-results.png', fullPage: true });
  await p.click('table.tbl .act button >> nth=0'); await p.waitForSelector('.report');
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 60000 }), p.click('.toolbar .btn.primary')]);
  await dl.saveAs('/tmp/student.pdf'); console.log('pdf saved', dl.suggestedFilename());
  await p.goto(p.url().replace(/#.*/, '') + '#/reports/' + p.url().split('/report/')[1].split('/')[0]);
  await p.waitForSelector('.report');
  const [dl2] = await Promise.all([p.waitForEvent('download', { timeout: 90000 }), p.click('.toolbar .btn.primary')]);
  await dl2.saveAs('/tmp/all.pdf');
  console.log('errors', errs);
  await b.close();
})();
