export function total(tasks) { return tasks.reduce((sum, task) => sum + task.hours, 0); }
