import { LocationDetails } from "./location";
import { IncidentInvolvement } from "./incident-involvement";
import { Loss } from "./loss";

export class FormFilter {

    incidentId: number;
    incidentLocation: LocationDetails;
    location: LocationDetails;
    causeId?: number;
    eventId?: number;
    loss: Loss;
    createIncidentInvolvement:IncidentInvolvement;
    updateIncidentInvolvement:IncidentInvolvement;
    incidentInvolvement:IncidentInvolvement;
    createdOn:string;
    createdBy:string;
    updatedDate:string;
    updatedBy:string;
    eldmFlag:boolean;
    //Basic Information
    // day: string;
    // month: string;
    // year: string;
    // category1Id: number;
    // category2Id: number;
    // category3Id: number;
    // landOffshoreId: number;
    // isCTL: boolean = false;
    // isDynamicallyPositioned: boolean = false;
    // OperationalStatusId: number;
    // lossDetails: string;
    // approxInsValue: string;
    // yearOfInstal: string;
    // assuredCoventures: string;
    
    
    // waterDepth: string;
    
    // lossTypeId: number;
    // adjuster: string;
    // adjusterFileRef: string;

    // //Well Information
    // typeId: number;
    // DevId: number;
    // statusId: number;
    // shellWellId: number;
    // UGBlowoutId: number;
    // shaleInformation: string;
    // depth: string;
    // projectTotalDepth: string;
    // notes: string;

    // //Source Information
    // source: string;
    // subscriptionName: string;

    // //Asset Information
    // assetId: number;
    // towId: number;
    // yearRebuilt: string;
    // depCatId: number;
    // fieldUnitId: number;
    // approxInsValueAsset: string;
    // ratedWdFeet: string;
    // rigDetailsChecked: boolean = false;
    // waterDepthCategory: string;
    
    // rigDesign: string;
    // generation: string;
    // assetDescriptionId: number;
    // installBuildYearCategory: string;
    // sanitisedDetails: string;

    // //Rating Information
    // ratingAreaId: number;
    // oeeIndexed: string;
    // weldURN: string;
    // adjIndividualId: number;
    // willis: number;
    // checkFlag: boolean = false;
    // incomplete: boolean = false;
    
    // indexedTotalClaim: string;
    // oilURN: string;
    // transit: boolean = false;
    // created: string;
    // updated: string;
    // indexFactor: string;
    // oilMulti: boolean = false;
    // createdBy: string;
    // updatedBy: string;

    // //Cost Categories
    // actualCostPDClaimCategory: string;
    // indexedCostPDClaimCategory: string;
    // actualCostOEEClaimCategory: string;
    // indexedCostOEEClaimCategory: string;
    // actualCostTotalClaimCategory: string;
    // indexedCostTotalClaimCategory: string;
    // statusDetails: number;
    // statusComments: string;
}
