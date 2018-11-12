import { Range } from "../../search/entities/search-criteria";

export class SearchCriteriaPayload {

    yearOfLoss: number[];

    area: number[];

    country: number[];

    location: string;

    gomArea: number[];

    usLocationCode: number[];

    landOffShore: number[];

    category1: number[];

    category2: number[];

    category3: number[];

    car_op: number[];

    lossType: number[];

    cause: number[];

    upDownPower: number[];

    event: number[];

    pdClaim: Range;

    oeeClaim: Range;

    biClaim: Range;

    totalClaim: Range;

    totalIndexedClaim: Range;

    ratingArea: number[];

    wellType: number[];

    drillingStatus: number[];

    ugbo: number[];

    depthCategory: number[];

    ptd: Range;

    actualPDLiabCategory: Range[];

    indexedPDLiabCategory: Range[];

    actualOEECategory: Range[];

    indexedOEECategory: Range[];

    actualTotalCategory: Range[];

    indexedTotalCategory: Range[];
}