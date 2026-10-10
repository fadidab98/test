# Spring Boot Failure Lab — مختبر Maven Java 17

أولاً نفذ Baseline:

```bash
node tools/activate-scenario.mjs --reset
mvn -B -ntp clean verify
```

ثم ارفع المشروع إلى GitHub Repository مستقلة، وافحص Repository Intelligence ثم شغّل Pipeline باستخدام `maven-java17`. يجب أن تنجح Baseline بما فيها الاختبارات قبل بدء سيناريوهات الأخطاء.

الأوامر المتاحة:

```bash
node tools/activate-scenario.mjs --list
node tools/activate-scenario.mjs s01-java-cannot-find-symbol
```

بعد كل سيناريو: `git add -A` ثم `git commit -m "test: S01"` ثم `git push`، وشغّل Pipeline وافحص Logs وأكد التصنيف الصحيح. لا تحتاج إلى `--reset` بين السيناريوهات.

S09–S11 تتطلب Maven test phase؛ S15–S16 تتطلب Docker Build step؛ S17 تتطلب Runner Java 17. لا تعتبر التصنيف المتوقع Verified قبل قراءة Logs والتأكد منه.
