import { SearchField } from './search-field';
import { SearchFieldWithType } from "./searchFieldWithType";
import { LossRangeType } from './loss-range-type';

export class LossSubmission{
    day: string[];
    month: string[];
    year: string[];
    categories1: SearchFieldWithType[];
    categories2: SearchFieldWithType[];
    categories3: SearchFieldWithType[];
    land_Offshore: SearchField[];
    opeartionalStatus: SearchField[];
    lossLocation: SearchField[];
    country: SearchField[];
    area: SearchField[];
    lossType: SearchFieldWithType[];
    cause: SearchFieldWithType[];

    //Well Information
    wellType: SearchField[];
    Dev: SearchField[];
    drillingStatus: SearchField[];
    shellWell: SearchField[];
    UGBlowout: SearchField[];
    operationalType: SearchField[];

    //Asset Information
    assetCategory: SearchField[];
    tow: SearchField[];
    depCat: SearchField[];
    field: SearchField[];
    gomArea: SearchField[];
    assetDescription: SearchField[];

    //Rating Information
    ratingArea: SearchField[];
    adjIndividual: SearchField[];
    willis: SearchField[];
    usLocationCode: SearchField[];
    event: SearchField[];

    //Cost Categories
    status: SearchField[];
    equipmentType: SearchField[];
    model: SearchField[];
    modelOEM: SearchField[];
    countryManufactured: SearchField[];

    ugbo: SearchField[];
    shell: SearchField[];
    dev_Exp: SearchField[];

    depthCategory: SearchField[];
    waterDepthCategory: SearchField[];
    productInfo: SearchField[];

    rigDesc: SearchField[];
    generation: SearchField[];
    shaleFormation: SearchField[];
    costCategory: LossRangeType[];

}