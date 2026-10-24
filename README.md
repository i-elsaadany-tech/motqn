# متقن | Motqn Assessment

تطبيق لتحليل نتائج الطلاب على مستوى المهارة وإصدار تقرير فردي لكل طالب في كل مادة (M = إتقان المهارة، C = مساهمة المهارة من المجموع)، بالعربية والإنجليزية.
البيانات تُحفظ على جهاز المعلم فقط (لا خادم). React + TypeScript، تُبنى بـ esbuild، وتُغلَّف لأندرويد بـ Capacitor 8.

## تشغيل الويب
    npm install
    npm test          # اختبارات الحساب (مثال المستند) والترجمة
    npm run build     # الناتج في dist/ (ملفات ثابتة تعمل بدون إنترنت)
    npm run serve     # http://localhost:8080
ارفع محتوى dist/ على أي استضافة ثابتة، أو فعّل GitHub Pages (الملف .github/workflows/web.yml ينشر تلقائياً عند الدفع إلى main).

## أندرويد (جوجل بلاي)
المتطلبات: Node 22، Java 21، ImageMagick. أسهل طريق: GitHub Actions.
1. أنشئ مفتاح الرفع مرة واحدة واحفظه في مكان آمن:
       keytool -genkeypair -v -keystore upload.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
2. في GitHub > Settings > Secrets > Actions أضف: UPLOAD_KEYSTORE_BASE64 (ناتج `base64 -w0 upload.keystore`)، UPLOAD_KEYSTORE_PASSWORD، UPLOAD_KEY_ALIAS، UPLOAD_KEY_PASSWORD.
3. Actions > "Android (AAB for Google Play)" > Run workflow، ثم نزّل app-release.aab (وبجانبه app-debug.apk للتجربة).
4. Play Console: أنشئ التطبيق، فعّل Play App Signing، ارفع الـ AAB، واستخدم محتويات store-assets/ ورابط privacy.html بعد نشر الويب.
محلياً: npm run android:aab

معرّف الحزمة الحالي sa.edu.trbyh.motqn (capacitor.config.json) ولا يمكن تغييره بعد النشر، فعدّله قبل أول رفع إن لزم.

## ملاحظات
- مكتبة المهارات الجاهزة قاعدة أولية تحتاج مراجعة مختصين؛ المعلم يضيف مهاراته الخاصة.
- مهارات ناشونال جيوغرافيك مبنية على معايير CCSS/WIDA العامة وليست نسخاً من فهارسهم التجارية.
