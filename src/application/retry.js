export async function retry(task, attempts=3){let last;for(let n=0;n<attempts;n++){try{return await task()}catch(err){last=err;}}throw last;}
