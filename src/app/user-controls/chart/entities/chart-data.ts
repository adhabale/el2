export class ChartData {
    xAxisTitle: string;
    yAxisTitle: string;
    categories: any[];
    series: ChartSeries[];
}

export class ChartSeries {
    name: string;
    data: any[];
}