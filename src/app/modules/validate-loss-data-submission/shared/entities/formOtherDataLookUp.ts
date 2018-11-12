export class FormOtherClassLookUp {
    //Basic Information
    day: string;
    month: string;
    year: string;
    isCTL: boolean = false;
    isDynamicallyPositioned: boolean = false;
    lossDetails: string;
    approxInsValue: string;
    yearOfInstal: string;
    assuredCoventures: string;
    waterDepth: string;
    adjuster: string;
    adjusterFileRef: string;

    //Well Information
    
    shaleInformation: string;
    depth: string;
    projectTotalDepth: string;
    notes: string;

    //Source Information
    source: string;
    subscriptionName: string;

    //Asset Information
    yearRebuilt: string;
    approxInsValueAsset: string;
    ratedWdFeet: string;
    rigDetailsChecked: boolean = false;
    waterDepthCategory: string;
    rigDesign: string;
    generation: string;
    installBuildYearCategory: string;
    sanitisedDetails: string;

    //Rating Information
    oeeIndexed: string;
    weldURN: string;
    checkFlag: boolean = false;
    incomplete: boolean = false;
    indexedTotalClaim: string;
    oilURN: string;
    transit: boolean = false;
    created: string;
    updated: string;
    indexFactor: string;
    oilMulti: boolean = false;
    createdBy: string;
    updatedBy: string;

    //Cost Categories
    actualCostPDClaimCategory: string;
    indexedCostPDClaimCategory: string;
    actualCostOEEClaimCategory: string;
    indexedCostOEEClaimCategory: string;
    actualCostTotalClaimCategory: string;
    indexedCostTotalClaimCategory: string;
    statusDetails: number;
    statusComments: string;
}