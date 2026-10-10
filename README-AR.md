# مختبر أعطال DevOps لتجميع بيانات ML — مستودع GitHub واحد

هذا **مستودع اختبار منفصل** عن كود منصتك الأساسية. هدفه إنتاج أعطال حقيقية ومقصودة عبر Runner، ثم مراجعتها وتسجيلها كعينات تدريب. لا تحتاج مستودعًا جديدًا لكل خطأ؛ تستخدم المستودع نفسه وتغيّر السيناريو عبر Commit جديد.

## البداية من Git Bash

1. فك الضغط وانسخ **محتويات المجلد** إلى جذر مستودع GitHub التجريبي الذي ستستخدمه (لا تنسخها إلى جذر مشروع DevOps الأساسي).
2. تأكد أن المشروع يعمل طبيعيًا:

```bash
node tools/activate-scenario.mjs --reset
npm ci
npm test
npm run build
```

3. شاهد كل السيناريوهات:

```bash
node tools/activate-scenario.mjs --list
```

4. جرّب خطأ Dependency أولًا:

```bash
node tools/activate-scenario.mjs dependency-no-lockfile
git add -A
git commit -m "test: dependency-no-lockfile"
git push
```

5. شغّل **Repository Analysis جديدًا** في منصتنا بعد Push، ثم Pipeline Run جديدًا، وشاهد Log الفعلي، وراجع التصنيف في Moderator. تأكد من وصول السجل إلى Dataset API وStreamlit.
6. لتجربة جديدة: نفّذ `node tools/activate-scenario.mjs <scenario-id>`، ثم Commit وPush جديدين في **نفس** المستودع. البرنامج يرجع الملفات إلى الوضع السليم قبل إدخال الخطأ التالي.

## نقاط مهمة

- السيناريوهات **13** تغطي الفئات السبع، لكنها **ليست 13 عينة مستقلة مضمون قبولها**؛ لا تضف أي عينة بدون خطأ فعلي وVerification من المراجع.
- عطل `runtime-node24-engine` قد يمنعه الـ Platform قبل بدء Runner إذا لم يدعم Node 24، لذلك ليس مضمونًا أن يتحول إلى Incident.
- تجربة `container-missing-copy` تحتاج تفعيل Docker Build فعليًا؛ وإلا لن ينفّذ Dockerfile.
- الأخطاء من نوع `CONTROLLED_INDUCED`: Runner نفّذها فعليًا، ولكن مصدرها تجربة مقصودة.
- سجّل Commit SHA وScenario ID والأدلة الصحيحة والتصنيف الذي أثبته Moderator؛ لا تعتمد فقط على التصنيف المتوقع في `experiment.json`.
- GitHub لا ينفذ ملفات `tools/` عند رفعها وحدها؛ عليك تفعيل السيناريو محليًا ثم Push إلى الفرع الذي تقرؤه منصتنا.
- بعض الحالات قد تتشابه وتكون مرتبطة بالمشروع ذاته، لذلك لا تعتبرها اختبارًا مستقلاً للتعميم.

راجع `README.md` لجدول السيناريوهات الكامل والتعليمات الإنجليزية.
