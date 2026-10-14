export function memoryStore(){const rows=[];return {save(row){rows.push(row)},list(){return [...rows]}};}
