# Live RAG npm Missing Script Test

A safe disposable Node.js repository to trigger the exact npm diagnostic:
`npm error Missing script: "test"`.

`package-lock.json` is present so `npm ci` succeeds. `package.json` intentionally has a `build` script but NO `test` script. Keep it that way for this test.

1. Push the repository files to a new GitHub repository.
2. Add that repository as a new project to your AI-Driven DevOps platform.
3. Select a Node.js test pipeline or template that **runs `npm test`** (preferably `npm ci` then `npm test`).
4. Run it and open the new incident.
5. In `infra/docker-compose`, inspect core-backend logs for `Live knowledge fallback completed`.

External lookup is conditional: it will only execute if RAG doesn't find usable local REVIEWED technical knowledge for this case.
