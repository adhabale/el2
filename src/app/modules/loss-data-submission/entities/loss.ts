import {LossClaims} from './loss-claims';

export class Loss {
    lossId: number;
    reportDate: string;
    lossStartDate: string;
    lossEndDate: string;
    lossCategoryId: number;
    status: number;
    ugbo: number;
    ctl: string;
    notes: string;
    submissionID: string;
    weldurn: string;
    sanitisedDetails: string;
    willis: string;
    incidentId: number;
    noOfDaysOutage:number;
    lossDepth:string;
    oilUrn:string;
    pdAmount:number;
    biAmount:number;
    oeeAmount:number;
    lossClaim:LossClaims[];
}