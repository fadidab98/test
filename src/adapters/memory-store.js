export function memoryStore(){let stored=[];return {async save(x){stored.push(x);},async all(){return [...stored];}};}
