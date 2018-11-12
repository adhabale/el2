import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Chart } from 'highcharts';
import { LossDataDashboardService } from "../../loss-data-dashboard.service";
import { ChartFilter } from "../../entities/chart-filter";
import { ChartData } from "../../../../user-controls/chart/entities/chart-data";
import { ChartLookup } from "../../entities/chart-lookup";

@Component({
    selector: 'incident-by-loss-type-small-chart',
    templateUrl: './incident-by-loss-type-small-chart.component.html',
    styleUrls: ['./incident-by-loss-type-small-chart.component.css']
})

export class IncidentByLossTypeSmallChartComponent implements OnInit {

    chartLookUp: ChartLookup = new ChartLookup();

    chartData: ChartData;

    columnColor: any[] = [];

    details: any;

    constructor(private lossDataDashboardService: LossDataDashboardService) {
    }

    ngOnInit() {
        this.getMajorLossesByYear();
    }

    private getMajorLossesByYear() {

        let chartFilter = new ChartFilter();

        chartFilter.fromYear = (new Date().getFullYear() - 10).toString();
        chartFilter.toYear = new Date().getFullYear().toString();
        chartFilter.areaId = null;
        chartFilter.upDownPowerStreamId = null;
        chartFilter.majorIncidentLossValue = this.chartLookUp.majorIncidentLossValue[0];

        this.lossDataDashboardService.getMajorLossesByYear(chartFilter)
            .subscribe((response) => {
                this.chartData = response;
                this.columnColor = ['#FDB71E'];
                this.chartData.xAxisTitle = "Years";
                this.chartData.yAxisTitle = "Total Claims in US$";
            });
    }

    onExpand() {
        document.getElementById("incidentByLossTypeBtn").click();
        this.details = new Object();
        this.details.action = "View";
        this.details.chartName = "Major Losses By Years";
        this.lossDataDashboardService.logDashboardData(this.details)
            .subscribe(response => {

            });
    }

}
