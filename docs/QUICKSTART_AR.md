# دليل الاستخدام بالعربية

هذا المشروع مصمم لاختبار AI/ML DevOps Platform وليس نظام دفع حقيقي.

## بدء الاختبار

1. فك ضغط ملف ZIP.
2. افتح Git Bash في مجلد المشروع.
3. نفّذ `npm ci` ثم `npm run build`.
4. الوضع الافتراضي هو `build-config`: من المتوقع أن يفشل **البناء عمدًا** بعد فحص Workspaces.
5. ارفع المشروع إلى GitHub أو GitLab، مع `package-lock.json` والملف `config/scenario.json`.
6. في منصتك أنشئ Project باستخدام رابط المستودع، ثم شغّل خطة Node 20 التي تنفذ `npm ci` و`npm run build`.

## تبديل نوع الخطأ

```bash
npm run scenario -- compilation
npm run scenario -- dependency
npm run scenario -- runtime
npm run scenario -- test
npm run scenario -- test-config
npm run scenario -- success
```

**مهم:** بعد تغيير السيناريو يجب حفظ التعديل باستخدام Git commit ثم Git push قبل تشغيله من المنصة.

`test` و`test-config`: يتطلبان وجود مرحلة `npm test` في الـPipeline. أما `build-config` و`compilation` و`dependency` و`runtime` فكلها تفشل خلال `npm run build`.

## تشغيل المشروع بشكل صحيح محليًا

```bash
npm run scenario -- success
npm ci
npm run build
npm test
npm run smoke
npm start
```

افتح المتصفح `http://localhost:8080` وستظهر لوحة التحكم. يمكنك إنشاء طلب شراء تجريبي ومراقبة المخزون والأحداث والـMetrics. لا توجد عمليات دفع حقيقية.

## كيفية تسجيل نتائج الـML

سجّل لكل تجربة: Incident ID، فشل الـStep، Exit Code، تصنيف RAG، تصنيف CodeBERT-v4، هل اقتباس Evidence Grounding مقبول أم مرفوض، حالة مراجعة Moderator، وزمن الاستدلال. لا تعتبر اتفاق النموذجين بديلًا عن المراجعة البشرية.
