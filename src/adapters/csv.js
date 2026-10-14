export function csvLines(items){return ['id,amountCents',...items.map(i=>`${i.id},${i.amountCents}`)].join('\n');}
