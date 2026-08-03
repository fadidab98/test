# Incident Build Error Demo

This branch intentionally fails during `npm run build`.

Expected failure:

```text
CI demo build failure: CI_DEMO_FIX must be true for this branch.
```

Moderator demo fix:

```bash
CI_DEMO_FIX=true npm run build
```

This lets the platform create an incident from a real failed build step and validate a scoped command override.
