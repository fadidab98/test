export function summarizePipeline(steps) {
  const safeSteps = Array.isArray(steps) ? steps : [];
  const total = safeSteps.length;
  const failed = safeSteps.filter((step) => step.status === 'FAILED').length;
  const succeeded = safeSteps.filter((step) => step.status === 'SUCCEEDED').length;
  const skipped = safeSteps.filter((step) => step.status === 'SKIPPED').length;

  return {
    total,
    failed,
    succeeded,
    skipped,
    success_rate: total === 0 ? 0 : Number((succeeded / total).toFixed(2))
  };
}

export function nextAction(summary) {
  if (summary.failed > 0) {
    return 'inspect_failure';
  }
  if (summary.skipped > 0) {
    return 'review_skipped_steps';
  }
  return 'ready';
}
