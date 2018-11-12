import { Component, OnInit } from "@angular/core";
import { SearchField } from "../../../search/entities/search-field";
import { ChartFilter, GraphLegends } from "../../entities/chart-filter";
import { LossDataDashboardService } from "../../loss-data-dashboard.service";
import { ChartLookup } from "../../entities/chart-lookup";
import { ChartData } from "../../../../user-controls/chart/entities/chart-data";
import * as _ from 'lodash';
import * as html2canvas from 'html2canvas';
import canvg from 'canvg-browser';
declare var $: any;

@Component({
    selector: 'incident-by-year-large-chart',
    templateUrl: './incident-by-year-large-chart.component.html',
    styleUrls: ['./incident-by-year-large-chart.component.css']
})

export class IncidentByYearLargeChartComponent implements OnInit {

    chartFilter: ChartFilter = new ChartFilter();

    chartLookup: ChartLookup = new ChartLookup();

    chartData: ChartData;

    selectedItems: any[];

    removalCountUD: number = 0;

    removalCountArea: number = 0;
    details: any;
    toYear: number = (new Date()).getFullYear();
    fromYear: number = (new Date()).getFullYear() - 10;
    upDownPowerValue: any = 'All Selected';
    areasSelected: any = 'All Selected';
    showSplitBy: string = 'Up/Down/Power';
    allAreaSelected: boolean = true;
    toYearPrev: number = (new Date()).getFullYear();
    fromYearPrev: number = (new Date()).getFullYear() - 10;
    constructor(private lossDataDashboardService: LossDataDashboardService) {
    }

    ngOnInit() {
        this.getLossDataFilters();
    }

    onYearChangeTo(toYear) {
        this.toYear = toYear;
        this.getIncidentByYear();
        console.log('onYearChangeTo')
    }
    onYearChangeFrom(fromYear) {
        this.fromYear = fromYear;
        this.getIncidentByYear();
        console.log('onYearChangeFrom')
    }

    categoryChange(option) {
        if (option == 5) {
            this.chartFilter.legend = GraphLegends.Up_Down_Power;
            this.showSplitBy = 'Up/Down/Power';
            this.getIncidentByYear();
            console.log('cat change opt 5');
        }
        else {
            this.chartFilter.legend = GraphLegends.Area;
            this.showSplitBy = 'Area';
            this.getIncidentByYear();
            console.log('cat change opt else');
        }

    }

    private getLossDataFilters() {

        this.lossDataDashboardService.getIncidentByYearFilters()
            .subscribe(response => {

                this.chartLookup = response;
                this.chartLookup.upDownPowerStream.splice(0, 0, new SearchField(null, "All"));
                this.chartLookup.areas.splice(0, 0, new SearchField(null, "All"));

                //bind - year from and to 
                this.setDefaultFilters();
                //call large view chart
                this.getIncidentByYear();
                console.log('ngOnInit large');
              
            });
    }

    private setDefaultFilters() {

        this.selectedItems = [new SearchField(null, "All")];
        this.chartFilter.legend = GraphLegends.Up_Down_Power;

        const currentYear = new Date().getFullYear().toString();

        if (this.chartLookup.yearOfLoss.indexOf(currentYear) > -1) {
            this.chartFilter.toYear = currentYear;
        } else {
            this.chartFilter.toYear = _.last(this.chartLookup.yearOfLoss);
        }

        this.chartFilter.fromYear = (parseInt(this.chartFilter.toYear) - 10).toString();

        this.chartFilter.areaId= null,
        this.chartFilter.upDownPowerStreamId= null
    }

    onUpDownLoad: boolean = true;//use to avoid call on load

    onUpDownItemSelect(item: any) {
        //console.log('emit onUpDownItemSelect');
        this.removalCountUD = this.removalCountUD - 1;
        this.chartFilter.upDownPowerStreamId = this.chartFilter.upDownPowerStreamId || [];
        this.chartFilter.upDownPowerStreamId.push(item.id);
        if (this.upDownPowerValue != 'All Selected') {
            this.upDownPowerValue = _.filter(this.chartLookup.upDownPowerStream, (item: any) => {
                return this.chartFilter.upDownPowerStreamId.indexOf(item.id) > -1;
            })
            this.exportUpDownValue(this.upDownPowerValue, this.chartLookup.upDownPowerStream.length);
        }
        
        if (item.reload) {
            if (this.onUpDownLoad) { this.onUpDownLoad = false; return; }
            console.log('onUpDownItemSelect');
            this.getIncidentByYear();
        }
    }

    onAreaLoad: boolean = true;//use to avoid call on load

    onAreaItemSelect(item: any) {        
        this.removalCountArea = this.removalCountArea - 1;
        this.chartFilter.areaId = this.chartFilter.areaId || [];
        this.chartFilter.areaId.push(item.id);
        if (this.areasSelected != 'All Selected') {
            this.areasSelected = _.filter(this.chartLookup.areas, (item: any) => {
                return this.chartFilter.areaId.indexOf(item.id) > -1;
            })
            this.exportSelectedAreas(this.areasSelected, this.chartLookup.areas.length);
        }
        // else {
        //     this.chartFilter.areaId = null;
        // }
        if (item.reload) {
            if (this.onAreaLoad) { this.onAreaLoad = false; return; }
            this.getIncidentByYear();
            console.log('onAreaItemSelect');
        }
    }

    onUpDownItemRemove(item: any) {
        this.removalCountUD = this.removalCountUD + 2;
        this.chartFilter.upDownPowerStreamId = _.filter(this.chartFilter.upDownPowerStreamId, (e: number) => { return e != item.id });
        this.upDownPowerValue = _.filter(this.chartLookup.upDownPowerStream, (item: any) => {
            return this.chartFilter.upDownPowerStreamId.indexOf(item.id) > -1;
        })
        this.exportUpDownValue(this.upDownPowerValue, this.chartLookup.upDownPowerStream.length);
        if (this.removalCountUD == 0) {
            this.chartFilter.upDownPowerStreamId = [5000000];
        }
        if (item.reload) {
            this.getIncidentByYear();
            console.log('onUpDownItemRemove');
        }
    }

    onAreaItemRemove(item: any) {
        this.allAreaSelected = false;
        this.removalCountArea = this.removalCountArea + 2;
        this.chartFilter.areaId = _.filter(this.chartFilter.areaId, (e: number) => { return e != item.id });
        this.areasSelected = _.filter(this.chartLookup.areas, (item: any) => {
            return this.chartFilter.areaId.indexOf(item.id) > -1;
        })
        this.exportSelectedAreas(this.areasSelected, this.chartLookup.areas.length);
        if (this.removalCountArea == 0) {
            this.chartFilter.areaId = [5000000];
        }
        if (item.reload) {
            this.getIncidentByYear();
            console.log('onAreaItemRemove');
        }
    }

    exportUpDownValue(res, len) {
        if (res.length == 0) {
            this.upDownPowerValue = 'None Selected';
        }


        else {
            if (res.length == len - 1) {
                this.upDownPowerValue = 'All Selected';
            }
            else {
                this.upDownPowerValue = res.map(a => a.displayName);

            }
        }


    }
    exportSelectedAreas(res, len) {
        if (res.length == 0) {
            this.areasSelected = 'None Selected';
        }
        else {
            if (res.length == len - 1) {
                this.areasSelected = 'All Selected';
            }
            else {
                this.areasSelected = res.map(a => a.displayName);
            }

        }
    }

    private getIncidentByYear() {

        if (this.validateYearRange()) {

            // if (this.areasSelected == 'All Selected') {
            //     this.chartFilter.areaId = null;
            // }

            if (this.allAreaSelected){
                this.chartFilter.areaId = null;
            }
            this.lossDataDashboardService.getIncidentByYear(this.chartFilter)
                .subscribe((response) => {
                    this.chartData = response;
                    console.log('getIncidentByYear large ')
                    console.log(response);
                    this.chartData.xAxisTitle = "Years";
                    this.chartData.yAxisTitle = "Number Of Incidents";
                });
        }
    }

    private validateYearRange() {

        if ((this.toYear - this.fromYear) > 15) {
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

    exportGraph() {
        this.details = new Object();
        this.details.action = "Download";
        this.details.chartName = "Incidents By Year";
        this.lossDataDashboardService.logDashboardData(this.details)
            .subscribe(response => {

            });
        var date = new Date();
        var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var month = monthArray[date.getMonth()];
        let exportedText = "Selected Criteria : Year from " + this.fromYearPrev + " to " + this.toYearPrev + ";  Up/Down/Power = " + this.upDownPowerValue + ";  Area = " + this.areasSelected + "; Show Split By = " + this.showSplitBy;
        let staticText = "Risk Intelligence Energy Losses - " + this.details.chartName;

        let nodeList: NodeList = document.getElementsByTagName('stacked-column-chart');
        let divNodes: any = nodeList[3].childNodes[0].firstChild;
        let svg: any = $(divNodes).find('.highcharts-root')[0];
        var canvas = document.createElement('canvas');
        canvas.height = 450;
        canvas.width = 1302;
        // canvg(canvas, divNodes.innerHTML);
        var filename = "Incidents by Year_" + date.getDate() + '_' + month + '_' + date.getFullYear() + '_' + date.getUTCHours() + '_' + date.getUTCMinutes();
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
