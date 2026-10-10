# مختبر Node.js لتوسيع بيانات ML

الملف يحتوي على مشروع Node.js مستقل و16 سيناريو لفشل حقيقي في CI/CD، بالإضافة إلى وضع سليم Baseline. **لا تضع الملفات في مستودع منصة DevOps الأصلية**؛ استخدم مستودع GitHub مخصصًا للتجارب.

## بداية العمل

من جذر المشروع التجريبي:

```bash
node tools/activate-scenario.mjs --reset
npm ci
npm test
npm run build
node tools/activate-scenario.mjs --list
```

ثم أول سيناريو:

```bash
node tools/activate-scenario.mjs n01-ts2322
git add -A
git commit -m "test: n01-ts2322"
git push
```

بعد الـ Push، نفذ Repository Analysis إن احتاجت المنصة تحديث الخطة، ثم شغّل Pipeline جديدة باستخدام `node-20` وتأكد من وجود مرحلة `node-build`. يجب أن يظهر خطأ TypeScript حقيقي برمز `TS2322`.

راجع أدلة Runner أولًا، ثم تحقق من فئة `COMPILATION_FAILURE` عبر نظام مراجعة التصنيف. **الفئة داخل `experiment.json` هي توقع تجريبي وليست Verified Label.**

بعد إتمام التحقق انتقل مباشرة للسيناريو الثاني:

```bash
node tools/activate-scenario.mjs n02-ts2307
git add -A
git commit -m "test: n02-ts2307"
git push
```

ليس مطلوبًا `--reset` بين السيناريوهات: أداة التفعيل تعيد جميع ملفات السيناريو السابق للحالة السليمة قبل إدخال الخطأ الجديد.

## ملاحظات أساسية

- Node.js أولًا بالكامل؛ React وSpring Boot لاحقًا في مشروعين منفصلين.
- أخطاء `TS2322`, `TS2307`, `TS2345`, `TS7006`, `TS2588` تصدر عن TypeScript الحقيقي. مترجم TypeScript 5.8.3 مضمن داخل `vendor/`، فلا حاجة لتنزيله وقت البناء أو تثبيته عالميًا.
- `n05` خطأ `EINTEGRITY` بسبب اختلاف Hash في lockfile.
- `n06` خطأ `ENOENT` لحزمة محلية مفقودة.
- `n07` يحتاج Node 20 لإظهار `EBADENGINE`، وقد تمنعه قواعد اختيار Runtime قبل الـ Runner.
- `n12` يختبر تعذر الاتصال بحزمة محلية عبر `127.0.0.1:9` داخل Runner، وليس انقطاع الإنترنت العام.
- `n13` و`n14` يحتاجان قالب Docker Build فعالًا؛ لا يكفي Node Build وحده.
- `CONTROLLED_INDUCED` و`scenario_group` يجب توثيقهما في Dataset Metadata، وليس بمجرد وجود `experiment.json`.
- احتفظ بـ Git commit SHA وLogs وFailed Step لكل حالة، وراجع التصنيف؛ لا تضف الفئة المتوقعة آليًا إلى التدريب.
- لا تعِد تدريب نموذج `experimental-v1` بعد كل تشغيل؛ اجمع مجموعة من العينات المعتمدة أولًا.

راجع `README.md` للجدول الكامل بالأسماء والمتطلبات الدقيقة لكل سيناريو.
