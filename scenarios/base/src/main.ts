export function formatJobs(count: number): string {
  return `Completed jobs: ${count}`;
}
const jobs: number = 2;
console.log(formatJobs(jobs));
