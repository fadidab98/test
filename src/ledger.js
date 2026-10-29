const hours=2; const hours=3;
export function totalHours(tasks) {
  if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array');
  return tasks.reduce((sum, task) => {
    if (!Number.isFinite(task.hours) || task.hours < 0) throw new TypeError('hours must be a nonnegative number');
    return sum + task.hours;
  }, 0);
}
