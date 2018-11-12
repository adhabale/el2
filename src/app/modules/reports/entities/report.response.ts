import * as moment from 'moment/moment';

export class ReportResponse {

    year?: number;
    month: number;
    monthName: string;
    dateOfLoss:string;
    area: string;
    country: string;
    location: string;

    cause: string;

    category1: string;
    category2: string;

    depthCategoryRange: string;
    displayOrder?: number;

    actualTotalCategory: string;
    actualOEECategory: string;
    actualPDLiabCategory: string;

    totalClaim?: number;
    oeeClaim?: number;
    pdLiabClaim?: number;

    indexedOEECategory: string;
    indexedPDLiabCategory: string;
    indexedTotalCategory: string;

    indexedOEEClaim?: number;
    indexedPDLiabClaim?: number;
    indexedTotalClaim?: number;

    drillingStatus: string;
    ratingArea: string;
    wellType: string;
    ugbo: string;
    depthAtLoss?: number;
    ptd?: number;
    onOffshore: string;
    caR_OP: string;
    biClaim?: number;

    category3: string;
    lossType: string;
    depthCategoryDescription: string;
    event: string;
    gomArea: string;
    locationCode: string;
    upDownStream: string;

    constructor(actualOEECategory, actualPDLiabCategory, actualTotalCategory, area, biClaim, caR_OP, 
        category1, category2,category3,cause, country, depthAtLoss, dateOfLoss, depthCategoryDescription, depthCategoryRange,
        drillingStatus, event, gomArea, indexedOEECategory, indexedOEEClaim, indexedPDLiabCategory, indexedPDLiabClaim, 
        indexedTotalClaim, location, locationCode, lossType, oeeClaim, onOffshore, pdLiabClaim, ptd, ratingArea, totalClaim,
        ugbo, upDownStream, wellType, displayOrder, indexedTotalCategory)
    {   
        this.actualOEECategory =actualOEECategory == null || actualOEECategory == "" ? '{NULL}': actualOEECategory;
        this.actualPDLiabCategory = actualPDLiabCategory == null || actualPDLiabCategory == "" ? '{NULL}': actualPDLiabCategory;;
        this.actualTotalCategory =actualTotalCategory;
        this.area = area;
        this.biClaim = biClaim != null && biClaim != "" ? parseFloat(biClaim): 0;
        this.caR_OP = caR_OP;
        this.category1 = category1;
        this.category2 = category2 == null || category2 == "" ? 'Empty': category2;
        this.category3 = category3;
        this.cause = cause;
        this.country = country;
        this.depthAtLoss = depthAtLoss != null && depthAtLoss != "" ? parseFloat(depthAtLoss): 0;        
        this.dateOfLoss = moment(dateOfLoss).format();
        // this.dateOfLoss = new Date(dateOfLoss);
        this.depthCategoryDescription = depthCategoryDescription;
        this.depthCategoryRange = depthCategoryRange;
        this.displayOrder = displayOrder != null && displayOrder != "" ? parseInt(displayOrder): displayOrder;
        this.drillingStatus =  drillingStatus == null || drillingStatus == "" ? '{NULL}': drillingStatus;
        this.event = event;
        this.gomArea = gomArea;
        this.indexedOEECategory =indexedOEECategory == null || indexedOEECategory == "" ? '{NULL}': indexedOEECategory;;
        this.indexedOEEClaim =indexedOEEClaim != null && indexedOEEClaim != "" ? parseFloat(indexedOEEClaim): 0;
        this.indexedPDLiabCategory = indexedPDLiabCategory == null || indexedPDLiabCategory == "" ? '{NULL}': indexedPDLiabCategory;;
        this.indexedPDLiabClaim = indexedPDLiabClaim != null && indexedPDLiabClaim != "" ? parseFloat(indexedPDLiabClaim): 0;
        this.indexedTotalClaim =indexedTotalClaim != null && indexedTotalClaim != "" ? parseFloat(indexedTotalClaim): 0;
        this.location = location;
        this.locationCode = locationCode;
        this.lossType = lossType;
        this.month = new Date(this.dateOfLoss).getMonth();
        this.monthName = moment(this.dateOfLoss).format("MMM");
        this.oeeClaim = oeeClaim != null && oeeClaim != "" ? parseFloat(oeeClaim): 0;
        this.onOffshore = onOffshore;
        this.pdLiabClaim =pdLiabClaim != null && pdLiabClaim != "" ? parseFloat(pdLiabClaim): 0;
        this.ptd = ptd != null && ptd != "" ? parseFloat(ptd): 0;
        this.ratingArea = ratingArea == null || ratingArea == "" ? '{NULL}': ratingArea;
        this.totalClaim = totalClaim != null && totalClaim != "" ? parseFloat(totalClaim): 0;
        this.ugbo = ugbo;
        this.upDownStream = upDownStream;
        this.wellType =wellType == null || wellType == "" ? '{NULL}': wellType;;
        this.year = new Date(this.dateOfLoss).getFullYear();
        this.indexedTotalCategory = indexedTotalCategory == null || indexedTotalCategory == "" ? '{NULL}': indexedTotalCategory;;
    }
}

export class ReportData{
    value: any;
}
