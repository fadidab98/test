export function dailyReport(items){return {count:items.length,totalCents:items.reduce((sum,row)=>sum+row.amountCents,0)};}
