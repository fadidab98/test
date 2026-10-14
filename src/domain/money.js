export function cents(value){if(!Number.isFinite(value)||value<0)throw new RangeError('Invalid money');return Math.round(value*100);}
