export class ChartFilter {

    lossTypeId?: number;

    fromYear?: string;

    toYear?: string;

    areaId?: number[] = [];

    upDownPowerStreamId?: number[] = [];

    category1?: number[] = [];

    category2?: number[] = [];

    legend?: number = GraphLegends.None;

    majorIncidentLossValue: string;

    get isAreaSelected() {
        return this.legend == GraphLegends.Area;
    }

    get isCategory1Selected() {
        return this.legend == GraphLegends.Category1;
    }
}

export enum GraphLegends {
    None,
    Area,
    Up_Down_Power,
    Category1,
    Category2
}
