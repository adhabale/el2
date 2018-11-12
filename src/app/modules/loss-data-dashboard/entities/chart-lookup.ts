import { SearchField } from "../../search/entities/search-field";

export class ChartLookup {
    lossTypes: SearchField[];
    areas: SearchField[];
    upDownPowerStream: SearchField[];
    yearOfLoss: string[];
    category1: SearchField[];
    category2: SearchField[];
    majorIncidentLossValue: string[]=[];

    // constructor(){
    //     this.majorIncidentLossValue.push("100M","250M","500M");
    // }
}

// export enum majorLossValue {
//     "100M",
//     "250M",
//     "500M"
// }