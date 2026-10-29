#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
node_task() {
  local mount_dir="$PWD"
  if command -v cygpath >/dev/null 2>&1; then mount_dir="$(cygpath -w "$PWD")"; fi
  MSYS_NO_PATHCONV=1 docker run --rm --mount "type=bind,source=$mount_dir,target=/workspace" -w /workspace node:22-alpine "$@"
}
valid_case(){ case "$1" in baseline|repair|01|02|03|04) ;; *) echo 'Choose baseline, repair, 01, 02, 03 or 04'; exit 2;; esac; }
case "${1:-help}" in
 list) node_task node lab/control.js list;;
 baseline|repair|01|02|03|04) node_task node lab/control.js "$1";;
 check) scenario="${2:-baseline}"; valid_case "$scenario"; node_task node lab/verify.js "$scenario";;
 rehearse)
   # Restore baseline even when verification fails. No Git commits or pushes here.
   trap 'node_task node lab/control.js baseline' EXIT
   for scenario in baseline 01 02 03 04 repair; do
     node_task node lab/control.js "$scenario"
     node_task node lab/verify.js "$scenario"
   done
   ;;
 publish)
   scenario="${2:-}"; valid_case "$scenario"
   git rev-parse --show-toplevel >/dev/null
   if [ -n "$(git status --porcelain)" ]; then echo 'Commit existing work first. Publishing requires a clean working tree.'; exit 2; fi
   branch="$(git symbolic-ref --short HEAD)"
   node_task node lab/control.js "$scenario"
   git add -- package.json package-lock.json src/ledger.js test/ledger.test.js
   if ! git diff --cached --quiet; then git commit -m "Professor demo scenario $scenario"; fi
   git push -u origin "$branch"
   git rev-parse HEAD
   echo 'Re-analyze repository and create a NEW platform run. Verify its checkout SHA.'
   ;;
 *) echo 'bash demo.sh list | rehearse | baseline | repair | 01 | 02 | 03 | 04'
    echo 'bash demo.sh check baseline|01|02|03|04|repair'
    echo 'bash demo.sh publish baseline|01|02|03|04|repair';;
esac
