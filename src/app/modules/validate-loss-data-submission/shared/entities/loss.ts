import { LossClaims } from "./loss-claims";


export class Loss {
    lossId: number;
    reportDate: string;
    incidentId: number;
    categoryId?: string;
    lossCategoryId?: string;  //put
    outageDays?: number;
    noOfDaysOutage?: number;   //put
    lossStartDate: string;
    lossEndDate: string;
    status?: number;
    ugbo?: number;
    ctl?: boolean;
    notes: string;
    submissionId: string;
    weldurn: string;
    sanitisedDetails: string;
    willis?: number;
    oilUrn: string;
    lossDepth?: any;
    lossClaim: LossClaims[];
    pdAmount?: number;
    pDAmount?: number;
    biAmount?: number;
    bIAmount?: number;
    oeeAmount?: number;
    oEEAmount?: number;
    updatedBy?: string;
    updatedDate?: string;
}