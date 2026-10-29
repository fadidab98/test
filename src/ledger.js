import isNumber from 'is-number';
export function totalHours(tasks) {
  if (!Array.isArray(tasks)) throw new TypeError('tasks must be an array');
  return tasks.reduce((sum, task) => {
    if (!isNumber(task.hours) || task.hours < 0) throw new TypeError('hours must be a nonnegative number');
    return sum + task.hours;
  }, 0);
}
