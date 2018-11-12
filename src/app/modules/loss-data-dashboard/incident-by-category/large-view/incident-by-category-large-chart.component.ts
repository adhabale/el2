import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SearchField } from "../../../search/entities/search-field";
import { ChartFilter, GraphLegends } from "../../entities/chart-filter";
import { LossDataDashboardService } from "../../loss-data-dashboard.service";
import { ChartLookup } from "../../entities/chart-lookup";
import { ChartData } from "../../../../user-controls/chart/entities/chart-data";
import * as _ from 'lodash';
import * as html2canvas from 'html2canvas';
import canvg from 'canvg-browser';

@Component({
    selector: 'incident-by-category-large-chart',
    templateUrl: './incident-by-category-large-chart.component.html',
    styleUrls: ['./incident-by-category-large-chart.component.css']
})

export class IncidentByCategoryLargeChartComponent implements OnInit {

    chartFilter: ChartFilter = new ChartFilter();

    chartLookup: ChartLookup = new ChartLookup();

    chartData: ChartData;

    selectedItems: any[];

    removalCountCategory1: number = 0;

    removalCountCategory2: number = 0;
    details: any;
    upDownPowerValue: string = 'Upstream';
    showSplitBy: string = 'Category1';
    toYear: number = (new Date()).getFullYear();
    fromYear: number = (new Date()).getFullYear() - 10;
    
    toYearPrev: number = (new Date()).getFullYear();
    fromYearPrev: number = (new Date()).getFullYear() - 10;

    ddlToyear:string;
    ddlFromyear:string;

    constructor(private lossDataDashboardService: LossDataDashboardService) {
    }

    ngOnInit() {
        this.getLossDataFilters();
    }

    onUpDownPowerChange(upDownPowerStreamId) {
        this.getIncidentByCategory();
        let res = _.filter(this.chartLookup.upDownPowerStream, (item: any) => {
            return item.id == upDownPowerStreamId;
        })
        this.exportUpDownValue(res);

    }
    exportUpDownValue(res) {
        this.upDownPowerValue = res[0].displayName;
    }

    onCategoryLoad: boolean = true;//use to avoid call on load

    onItemSelect(item: any) {

        if (this.chartFilter.legend == GraphLegends.Category1) {

            this.removalCountCategory2 = 0;

            this.removalCountCategory1 = this.removalCountCategory1 - 1;

            this.chartFilter.category2 = null;

            this.chartFilter.category1 = this.chartFilter.category1 || [];

            this.chartFilter.category1.push(item.id);

        } else {
            this.removalCountCategory1 = 0;

            this.removalCountCategory2 = this.removalCountCategory2 - 1;

            this.chartFilter.category1 = null;

            this.chartFilter.category2 = this.chartFilter.category2 || [];

            this.chartFilter.category2.push(item.id);
        }

        if (item.reload) {
            if (this.onCategoryLoad) { this.onCategoryLoad = false; return; }
            this.getIncidentByCategory();
        }
    }

    onItemRemove(item: any) {

        if (this.chartFilter.legend == GraphLegends.Category1) {

            this.removalCountCategory2 = 0;
            this.removalCountCategory1 = this.removalCountCategory1 + 1;
            this.chartFilter.category2 = null;
            if (this.removalCountCategory1 == (0 - this.chartLookup.category1.length)) {
                this.chartFilter.category1 = [5000000];
            }
            this.chartFilter.category1 = _.filter(this.chartFilter.category1, (e: number) => { return e != item.id });


        } else {

            this.removalCountCategory1 = 0;
            this.removalCountCategory2 = this.removalCountCategory2 + 1;
            this.chartFilter.category1 = null;
            if (this.removalCountCategory2 == (0 - this.chartLookup.category2.length)) {
                this.chartFilter.category2 = [5000000];
            }
            this.chartFilter.category2 = _.filter(this.chartFilter.category2, (e: number) => { return e != item.id });
        }
        if (item.reload) {
            this.getIncidentByCategory();
        }

    }
    onYearChangeTo(toYear) {
        this.toYear = toYear;
        this.getIncidentByCategory();
    }
    onYearChangeFrom(fromYear) {
        this.fromYear = fromYear;
        this.getIncidentByCategory();
    }
    private getLossDataFilters() {

        this.lossDataDashboardService.getIncidentByCategoryFilters()
            .subscribe(response => {

                this.chartLookup = response;
                this.lossDataDashboardService.getIncidentByYearFilters()
                    .subscribe(responseforYear => {
                        this.chartLookup.yearOfLoss = responseforYear.yearOfLoss;
                    });
                this.chartLookup.category1.splice(0, 0, new SearchField(null, "All"));
                this.chartLookup.category2.splice(0, 0, new SearchField(null, "All"));

                this.selectedItems = [new SearchField(null, "All")];

                this.chartFilter.upDownPowerStreamId.push(this.chartLookup.upDownPowerStream[2].id);
                this.chartFilter.category1 = null;
                this.chartFilter.category2 = null;
                this.chartFilter.legend = GraphLegends.Category1;
                const currentYear = new Date().getFullYear().toString();
                this.chartFilter.toYear = currentYear;
                this.chartFilter.fromYear = (parseInt(this.chartFilter.toYear) - 10).toString();

                //call method to load large view
                this.getIncidentByCategory();
            });
    }

    private validateYearRange() {
        if ((this.toYear - this.fromYear) > 15) {
            // this.ddlFromyear=this.chartFilter.fromYear;
            // this.ddlToyear=this.chartFilter.toYear;
            // this.chartFilter.toYear = this.toYearPrev.toString();
            // this.chartFilter.fromYear = this.fromYearPrev.toString();
            alert("You can select up to max 15 years of range at a time.");
            return false;
        }
        else {
            this.toYearPrev=this.toYear;
            this.fromYearPrev=this.fromYear;
            return true;
        }
    }

    categoryChange(option) {
        this.chartFilter.legend = option;
        if (option == 3) {
            this.showSplitBy = 'Category 1';
        }
        else this.showSplitBy = 'Category 2';

    }
    private getIncidentByCategory() {
        if (this.validateYearRange()) {

            this.lossDataDashboardService.getIncidentByCategory(this.chartFilter)
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

    exportGraph() {
        this.details = new Object();
        this.details.action = "Download";
        this.details.chartName = "Incidents By Main Categories";
        this.lossDataDashboardService.logDashboardData(this.details)
            .subscribe(response => {

            });
        var date = new Date();
        var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var month = monthArray[date.getMonth()];
        let exportedText = "Selected Criteria : Year from " + this.fromYearPrev + " to " + this.toYearPrev + "; Up/Down/Power = " + this.upDownPowerValue + " ; Show Split By = " + this.showSplitBy;
        let staticText = "Risk Intelligence Energy Losses - " + this.details.chartName;

        let nodeList: NodeList = document.getElementsByTagName('pie-chart1');
        let divNodes: any = nodeList[1].childNodes[0].firstChild;
        let svg: any = $(divNodes).find('.highcharts-root')[0];
        var canvas = document.createElement('canvas');
        canvas.height = 450;
        canvas.width = 1302;
        // canvg(canvas, divNodes.innerHTML);
        var filename = "Incidents by Main Categories_" + date.getDate() + '_' + month + '_' + date.getFullYear() + '_' + date.getUTCHours() + '_' + date.getUTCMinutes();
        if (canvas.msToBlob) { //for IE
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "12px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText(exportedText, 10, 410);
            ctx.font = "Bold 20px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText(staticText, 400, 440);
            canvg(canvas, divNodes.innerHTML, { ignoreMouse: true, ignoreDimensions: true });
            var blob = canvas.msToBlob();
            window.navigator.msSaveBlob(blob, filename + '.jpg');
        }
        else {
            var a = document.createElement('a');
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "12px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText(exportedText, 10, 410);
            ctx.font = "Bold 20px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText(staticText, 400, 440);
            canvg(canvas, divNodes.innerHTML, { ignoreMouse: true, ignoreDimensions: true });
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download = filename + '.jpg';
            a.click();
        }
    }

}
