# مشروع جديد: Task Ledger — 20 خطأ جديدًا

هذا مشروع مستقل عن error-lab السابق، بملفات JS. استخدم مستودع اختبار جديدًا لتجنب خلط التجربتين. يحتاج Docker Desktop وGit Bash، ولا يحتاج Python أو Node على Windows.

```bash
bash lab.sh baseline
bash lab.sh list
bash lab.sh run 01
bash lab.sh run 02
bash lab.sh reset
```

run يفعّل السيناريو ويشغّل الأمر المقصود ويعيد رمز خروجه الحقيقي. الفشل متوقع. السجلات داخل results/. كل حالة تبدأ من النسخة السليمة ولا تتراكم الأخطاء. reset/apply يستبدلان ملفات هذا المشروع التجريبي فقط: لا تستخدمهما داخل مشروعك الرئيسي.

لتشغيل جميع السيناريوهات محليًا:
```bash
bash lab.sh all
```

لرفع baseline لمستودع فارغ:
```bash
git init
git branch -M main
git add .
git commit -m "new20: healthy baseline"
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_NEW_REPO.git
git push -u origin main
```

بعد إضافة المستودع في المنصة ونجاح baseline:
```bash
bash lab.sh publish 01
```

انتظر تشغيل المنصة ومراجعة إجابتَي النموذجين لنفس commit، ثم:
```bash
bash lab.sh publish 02
```

تابع حتى 20، كل حالة على حدة. publish يعمل commit وpush للفرع الحالي ولا يستدعي API المنصة تلقائيًا. استخدم New Run بعد Re-analyze. الحالات 19 و20 تحتاج Docker Build؛ قد ترفض المنصة Dockerfile قبل التنفيذ وهذا منع مسبق صحيح. الحالة 11 قد تنتج خطأ lockfile أثناء npm ci بدل السبب المقصود؛ احتفظ بالسبب الفعلي في المراجعة، أو استخدم أمر npm install المسجل للسيناريو. الحالة 12 تفشل في تجهيز الحزمة المحلية خلال preinstall. السكربت المحلي ينفذ تلك الأوامر المحددة.

الحالة 18 تفشل assertion مع إعداد اختبار سليم وتصنيفها UNKNOWN ضمن taxonomy الحالية. ليست TEST_CONFIGURATION_FAILURE. جميع الأمثلة مصطنعة ومترابطة وتصلح لتقييم استكشافي، وليست اختبارًا مستقلًا.

المراجع المقترحة في SCENARIOS.md وlab/scenarios.json للمراجعة فقط ولا ترسلها إلى النموذجين. مخرجات all تحتاج فحص السبب: فشل Docker أو سحب الصورة لا يثبت تحقق الخطأ المقصود.
