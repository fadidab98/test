#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export MSYS_NO_PATHCONV=1
ROOT="$(pwd)"
if command -v cygpath >/dev/null 2>&1; then ROOT="$(cygpath -m "$ROOT")"; fi
IMAGE="${LAB_NODE_IMAGE:-node:22-alpine}"
node_lab() { docker run --rm -v "$ROOT:/app" -w /app "$IMAGE" node "$@"; }
action="${1:-help}"
id="${2:-}"
case "$action" in
 list) node_lab lab/apply.mjs list ;;
 apply) node_lab lab/apply.mjs "$id" ;;
 reset) node_lab lab/apply.mjs reset ;;
 baseline)
  node_lab lab/apply.mjs reset
  docker run --rm -v "$ROOT:/app" -w /app "$IMAGE" sh -c 'npm ci && npm test && npm run build'
  ;;
 run)
  [[ "$id" =~ ^(0[1-9]|1[0-6])$ ]] || { echo 'Use: bash lab.sh run 01..16'; exit 2; }
  node_lab lab/apply.mjs "$id"
  mkdir -p results
  set +e
  if [[ "$id" == 10 || "$id" == 11 || "$id" == 16 ]]; then
   docker build --progress=plain -t "devops-error-lab:case-$id" . >"results/$id.log" 2>&1
   code=$?
  else
   docker run --rm -v "$ROOT:/app" -w /app "$IMAGE" node lab/execute.mjs "$id" >"results/$id.log" 2>&1
   code=$?
  fi
  set -e
  cat "results/$id.log"
  echo "$code" >"results/$id.exit-code"
  echo "Observed exit code: $code (nonzero expected). Log: results/$id.log"
  # Preserve the actual failure code for callers and CI.
  exit "$code"
  ;;
 all)
  failed=0
  for n in 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16; do
   if bash lab.sh run "$n"; then echo "UNEXPECTED PASS: $n"; failed=1
   elif [[ "$(cat "results/$n.exit-code" 2>/dev/null || true)" == 125 ]]; then echo "Docker infrastructure error: $n"; failed=1
   fi
  done
  bash lab.sh reset
  echo 'Finished. Inspect each log: a nonzero exit alone does not prove the intended cause.'
  exit "$failed"
  ;;
 publish)
  [[ "$id" =~ ^(0[1-9]|1[0-6])$ ]] || { echo 'Use: bash lab.sh publish 01..16'; exit 2; }
  git rev-parse --is-inside-work-tree >/dev/null
  [[ -z "$(git status --porcelain)" ]] || { echo 'Commit or save existing changes first.'; exit 2; }
  branch="$(git branch --show-current)"
  [[ -n "$branch" ]] || { echo 'Detached HEAD is not supported.'; exit 2; }
  node_lab lab/apply.mjs "$id"
  git add -- package.json package-lock.json src scripts test Dockerfile
  if [[ -f .npmrc ]] || git ls-files --error-unmatch .npmrc >/dev/null 2>&1; then git add -A -- .npmrc; fi
  git commit --allow-empty -m "lab: inject scenario $id"
  git push -u origin "$branch"
  echo 'Create a NEW platform run for this commit. Wait for both predictions, then review, before publishing the next case.'
  ;;
 *) echo 'Commands: list | baseline | apply 01 | run 01 | all | reset | publish 01'
    echo 'Requires Docker Desktop; run from Git Bash. publish additionally requires Git + a configured origin.' ;;
esac
