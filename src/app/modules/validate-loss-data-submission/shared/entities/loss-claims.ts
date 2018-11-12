export class LossClaims
{
lossClaimId:number;
lossId:number;
coverageTypeId:number;
lossAmount:number;
closeFlag?: boolean=false;
incomplete?: boolean=false;
status:string;
statusComment:string;
}