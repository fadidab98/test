import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
await writeFile(
  'dist/build-info.json',
  JSON.stringify(
    {
      app: 'cicd-platform-demo',
      builtAt: new Date().toISOString()
    },
    null,
    2
  )
);

console.log('build output written to dist/build-info.json');
