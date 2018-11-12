import { SearchField } from "./search-field";
import { Country } from "./country";
import { DepthCategory } from "./depthCategory";
import { LossAmountRange } from "./lossAmountRange";

export class SearchCriteria {

    masterSearchData: MasterSearchData;
    selectedSearchCriteria: SelectedSearchCriteria;

    constructor() {
        this.masterSearchData = new MasterSearchData();
        this.selectedSearchCriteria = new SelectedSearchCriteria();
    }
}

export class MasterSearchData {

    yearOfLoss: any;
    area: SearchField[];
    country: Country[];
    gomArea: SearchField[];
    landOffShore: SearchField[];
    usLocationCode: SearchField[];
    category1: SearchField[];
    category2: SearchField[];
    category3: SearchField[];
    car_op: SearchField[];
    lossType: SearchField[];
    cause: SearchField[];
    upDownPower: SearchField[];
    event: SearchField[];
    wellTypes: SearchField[];
    ratingAreas: SearchField[];
    drillingStatues: SearchField[];
    depthCategories: DepthCategory[];
    ugbo: SearchField[];
    lossAmountRanges: LossAmountRange[];

}

export class SelectedSearchCriteria {

    yearOfLoss: any[];
    area: SearchField[] = [];
    country: Country[]=[];
    location: string;
    gomArea: SearchField[] = [];
    usLocationCode: SearchField[] = [];
    landOffShore: SearchField;
    category1: SearchField[] = [];
    category2: SearchField[] = [];
    category3: SearchField[] = [];
    car_op: SearchField[] = [];
    lossType: SearchField[] = [];
    cause: SearchField[] = [];
    upDownPower: SearchField[] = [];
    event: SearchField[] = [];
    pdClaim: Range;
    oeeClaim: Range;
    biClaim: Range;
    totalClaim: Range;
    totalIndexedClaim: Range;
    wellTypes: SearchField[] = [];
    ratingAreas: SearchField[] = [];
    drillingStatues: SearchField[] = [];
    depthCategories: DepthCategory[] = [];
    ugbo: SearchField[] = [];
    ptd: Range;
    actualPDLiabCategory: LossAmountRange[] = [];
    indexedPDLiabCategory: LossAmountRange[] = [];
    actualOEECategory: LossAmountRange[] = [];
    indexedOEECategory: LossAmountRange[] = [];
    actualTotalCategory: LossAmountRange[] = [];
    indexedTotalCategory: LossAmountRange[] = [];

    constructor() {
        this.yearOfLoss = [];
        this.pdClaim = new Range();
        this.oeeClaim = new Range();
        this.biClaim = new Range();
        this.totalClaim = new Range();
        this.totalIndexedClaim = new Range();
        this.ptd = new Range();
    }
}

export class Range {
    min: number = null;
    max: number = null;
}
