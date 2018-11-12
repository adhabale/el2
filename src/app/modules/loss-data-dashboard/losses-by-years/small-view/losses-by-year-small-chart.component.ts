import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Chart } from 'highcharts';
import { LossDataDashboardService } from "../../loss-data-dashboard.service";
import { ChartFilter } from "../../entities/chart-filter";
import { ChartData } from "../../../../user-controls/chart/entities/chart-data";

@Component({
    selector: 'losses-by-year-small-chart',
    templateUrl: './losses-by-year-small-chart.component.html',
    styleUrls: ['./losses-by-year-small-chart.component.css']
})

export class LossesByYearSmallChartComponent implements OnInit {

    chartData: ChartData;
    details: any;

    constructor(private lossDataDashboardService: LossDataDashboardService) {
    }

    ngOnInit() {
        this.getLossesByYear();
        this.details = new Object();
        this.details.action = "View";
        this.details.chartName = "All";
        this.lossDataDashboardService.logDashboardData(this.details)
            .subscribe(response => {

            });
    };

    onExpand() {
        document.getElementById("lossesByYearBtn").click();
        this.details = new Object();
        this.details.action = "View";
        this.details.chartName = "Loss Values By Year";
        this.lossDataDashboardService.logDashboardData(this.details)
            .subscribe(response => {

            });
    }

    private getLossesByYear() {

        let chartFilter = new ChartFilter();
        chartFilter.fromYear = (new Date().getFullYear() - 10).toString();
        chartFilter.toYear = new Date().getFullYear().toString();
        chartFilter.areaId = null;
        chartFilter.upDownPowerStreamId = null;

        this.lossDataDashboardService.getLossesByYear(chartFilter)
            .subscribe((response) => {
                this.chartData = response;
                this.chartData.xAxisTitle = "Years";
                this.chartData.yAxisTitle = "Total Losses in US$";
            });
    }
}