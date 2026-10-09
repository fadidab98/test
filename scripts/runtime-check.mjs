export function assertNodeRuntime(version, minimumMajor) {
  const activeMajor = Number(version.replace(/^v/, '').split('.')[0]);
  if (!Number.isInteger(activeMajor) || activeMajor < minimumMajor) {
    throw new Error(`Unsupported Node.js runtime: requires Node.js >=${minimumMajor}, detected ${version}. Application runtime requirement is not satisfied.`);
  }
}
