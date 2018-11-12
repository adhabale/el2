import { Component, OnChanges, SimpleChanges, ElementRef, ViewChild, Input, OnDestroy } from "@angular/core";
import { Chart } from 'highcharts';
import { ChartData } from "../entities/chart-data";

@Component({
    selector: 'stacked-column-chart',
    template: `<div #stackedColumnChart></div>`
})

export class StackedColumnChartComponent implements OnChanges, OnDestroy {

    @Input() chartData: ChartData;

    @Input() xAxisStep: number = null;

    @Input() columnColors: any[] = ['#FDB71E', '#B72F93', '#5E65AE', '#4b0082', '#df7e8d', '#68d1e7', '#ffa500', '#50C878', '#191970', '#4169e1', '#00FF00', '#228b22'];

    @Input() showLegend: boolean = true;

    @ViewChild("stackedColumnChart") chartTarget: ElementRef;

    chartObject: Highcharts.ChartObject;

    ngOnChanges(changes: SimpleChanges) {

        for (const propName in changes) {

            if (propName === "chartData" && changes[propName].currentValue !== changes[propName].previousValue) {

                setTimeout(() => {
                    this.loadChart();
                });
            }
        }
    }

    ngOnDestroy() {
        this.chartObject = null;
    }

    loadChart() {
        this.chartObject = new Chart(this.chartTarget.nativeElement, this.getChartOptions());
    }

    private getChartOptions(): Highcharts.Options {

        const options: Highcharts.Options = {
            chart: {
                type: 'column',
                height:400
            },
            credits: {
                text: `${new Date().getFullYear()} WTW © All Rights Reserved`,
                href: '',
                position: {
                    align: 'right'
                }
            },
            title: {
                text: ""
            },
            colors: this.columnColors,
            xAxis: {
                categories: this.chartData.categories,
                title: {
                    text: this.chartData.xAxisTitle
                },
                labels: {
                    step: this.xAxisStep
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.chartData.yAxisTitle
                },
                stackLabels: {
                    enabled: false
                },
                labels: {
                    formatter: function(){
                        if(this.value>1000000000){
                            return this.value/1000000000 + " B";            
                         } 
                        if(this.value>1000000){
                           return this.value/1000000 + " M";            
                        }
                                         
                        return this.value;  
                    }
                }
            },
            legend: {
                align: "center",
                symbolHeight: 10,
                symbolWidth: 10,
                symbolRadius: 10,
                x: 30,
                enabled: this.showLegend
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: this.chartData.series
        };

        return options;
    }
}
