import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Chart } from 'highcharts';
import { LossDataDashboardService } from "../../loss-data-dashboard.service";
import { ChartFilter, GraphLegends } from "../../entities/chart-filter";
import { ChartData } from "../../../../user-controls/chart/entities/chart-data";
import * as _ from 'lodash';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'incident-by-category-small-chart',
    templateUrl: './incident-by-category-small-chart.component.html',
    styleUrls: ['./incident-by-category-small-chart.component.css']
})

export class IncidentByCategorySmallChartComponent implements OnInit {

    chartData: any;
    details: any;

    constructor(private lossDataDashboardService: LossDataDashboardService) {
    }

    ngOnInit() {
        this.getIncidentByCategory();
    }

    onExpand() {
        this.details = new Object();
        this.details.action = "View";
        this.details.chartName = "Incidents By Main Categories";
        this.lossDataDashboardService.logDashboardData(this.details)
            .subscribe(response => {

            });
        document.getElementById("incidentByCategoryBtn").click();
    }

    private getIncidentByCategory() {

        let chartFilter = new ChartFilter(); 
        const currentYear = new Date().getFullYear().toString();
        chartFilter.toYear = currentYear;
        chartFilter.fromYear = (parseInt(chartFilter.toYear) - 10).toString();    
        chartFilter.category1 = null;
        chartFilter.category2 = null;
        chartFilter.upDownPowerStreamId = null;
        chartFilter.legend = GraphLegends.Category1;

        this.lossDataDashboardService.getIncidentByCategory(chartFilter).delay(1)
            .subscribe((response) => {
                if (response) {
                    _.each(response, (item) => {
                        item.sliced = true;
                    });
                    this.chartData = response;
                }
            });
    }
}