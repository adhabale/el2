import { Component, ViewChild, OnDestroy, ElementRef, SimpleChanges, Input, OnChanges } from '@angular/core';
import { Chart } from 'highcharts';
import { ChartData } from "../entities/chart-data";
import * as _ from 'lodash';

@Component({
    selector: 'pie-chart1',
    template: `<div #pieChart></div>`
})

export class PieChartComponent1 implements OnChanges, OnDestroy {

    @Input() chartData: any;

    @ViewChild("pieChart") chartTarget: ElementRef;

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
                type: 'pie',
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
            legend: {
                align: "center",
                symbolHeight: 10,
                symbolWidth: 10,
                symbolRadius: 10,
                x: 30
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    cursor: 'pointer',
                    colors: ['#FDB71E', '#B72F93', '#5E65AE', '#4b0082', '#df7e8d', '#68d1e7', '#ffa500', '#50C878', '#191970', '#4169e1', '#00FF00', '#228b22'],
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{ data: this.chartData }]
        };

        return options;
    }
}
