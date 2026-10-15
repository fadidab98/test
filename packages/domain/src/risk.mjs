export function riskScore({orderTotalCents=0,accountAgeDays=365,failedPayments=0,shipCountry='DE',ipCountry='DE'}={}) {
  let score=0;
  if(orderTotalCents>50000)score+=20;if(orderTotalCents>200000)score+=25;
  if(accountAgeDays<7)score+=20;if(failedPayments>=2)score+=30;
  if(shipCountry!==ipCountry)score+=15;
  return {score:Math.min(score,100),decision:score>=70?'REJECT':score>=35?'REVIEW':'APPROVE'};
}
