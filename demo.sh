#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
node_task() {
  local mount_dir="$PWD"
  if command -v cygpath >/dev/null 2>&1; then mount_dir="$(cygpath -w "$PWD")"; fi
  MSYS_NO_PATHCONV=1 docker run --rm --mount "type=bind,source=$mount_dir,target=/workspace" -w /workspace node:22-alpine "$@"
}
action="${1:-help}"
case "$action" in
 baseline|fault|repair)
   node_task node lab/control.js "$action"
   ;;
 check)
   scenario="${2:-baseline}"
   node_task node lab/verify.js "$scenario"
   ;;
 rehearse)
   node_task node lab/control.js baseline
   node_task node lab/verify.js baseline
   node_task node lab/control.js fault
   node_task node lab/verify.js fault
   node_task npm install --package-lock-only --ignore-scripts --no-audit --no-fund
   node_task node lab/verify.js repair
   node_task node lab/control.js baseline
   ;;
 publish)
   scenario="${2:-}"
   case "$scenario" in baseline|fault|repair) ;; *) echo 'Use publish baseline|fault|repair'; exit 2;; esac
   git rev-parse --show-toplevel >/dev/null
   if [ -n "$(git status --porcelain)" ]; then echo 'Working tree must be clean before publishing. Commit your baseline files first.'; exit 2; fi
   branch="$(git symbolic-ref --short HEAD)"
   node_task node lab/control.js "$scenario"
   git add -- package.json package-lock.json
   if ! git diff --cached --quiet; then git commit -m "Demo: $scenario build entry"; fi
   git push -u origin "$branch"
   echo 'Published commit:'
   git rev-parse HEAD
   echo 'Re-analyze in the platform and create a NEW run. Check its checkout SHA.'
   ;;
 *)
   echo 'bash demo.sh baseline|fault|repair'
   echo 'bash demo.sh check baseline|fault|repair'
   echo 'bash demo.sh rehearse'
   echo 'bash demo.sh publish baseline|fault|repair'
   ;;
esac
