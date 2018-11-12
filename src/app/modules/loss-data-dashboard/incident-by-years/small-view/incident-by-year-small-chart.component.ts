import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Chart } from 'highcharts';
import { LossDataDashboardService } from "../../loss-data-dashboard.service";
import { ChartFilter } from "../../entities/chart-filter";
import { ChartData } from "../../../../user-controls/chart/entities/chart-data";
declare var $: any;

// import { LossDataDashboardComponent } from "../../loss-data-dashboard.component";

@Component({
    selector: 'incident-by-year-small-chart',
    templateUrl: './incident-by-year-small-chart.component.html',
    styleUrls: ['./incident-by-year-small-chart.component.css']
})

export class IncidentByYearSmallChartComponent implements OnInit {

    chartData: ChartData;
    details: any;
    isIncidentByYearLargeExpand: boolean;

    constructor(private lossDataDashboardService: LossDataDashboardService) {
    }

    ngOnInit() {
        this.getIncidentByYear();
        console.log('ngOnInit small');
        this.isIncidentByYearLargeExpand = false;
    }

    onExpand() {
        this.details = new Object();
        this.details.action = "View";
        this.details.chartName = "Incidents By Year";
        this.isIncidentByYearLargeExpand = true;
        //show incident pop up
        $('#maximize-incident-graph').modal('show');
        this.lossDataDashboardService.logDashboardData(this.details)
            .subscribe(response => {

            });
    }

    private getIncidentByYear() {

        let chartFilter = new ChartFilter();
        chartFilter.fromYear = (new Date().getFullYear() - 10).toString(),
            chartFilter.toYear = new Date().getFullYear().toString(),
            chartFilter.areaId = null,
            chartFilter.upDownPowerStreamId = null


        this.lossDataDashboardService.getIncidentByYear(chartFilter)
            .subscribe((response) => {
                this.chartData = response;
                console.log('getIncidentByYear small ')
                console.log(response);
                this.chartData.xAxisTitle = "Years";
                this.chartData.yAxisTitle = "Number Of Incidents";
            });
    }
}