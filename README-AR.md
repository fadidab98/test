# React Failure Lab

مشروع React مستقل لتجميع عينات فشل CI/CD حقيقية من Runner، وليس داخل مشروع منصة DevOps.

أولاً شغّل Baseline وتأكد أن npm ci ثم npm test ثم npm run build تنجح. اختبار React اسمه `tests/GreetingCard.test.js` ويدعمه TestDetector. يجب أن تتعرف المنصة على `REACT` وعلى وجود الاختبارات. أعد تحليل المستودع وأنشئ Pipeline Plan جديدة بعد كل Git Push.

لتفعيل السيناريو الأول:

```bash
node tools/activate-scenario.mjs r01-ts2322-react-props
git add -A
git commit -m "test: r01-ts2322-react-props"
git push
```

تحقق من Logs الفعلية وحدد الفئة الصحيحة يدويًا. التصنيف الموجود في `experiment.json` مجرد توقع. سيناريوهات Docker تتطلب Docker Build، وسيناريو r16 يتطلب Node 20 في Runner.
