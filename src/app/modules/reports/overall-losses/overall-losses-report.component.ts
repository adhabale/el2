import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { ReportResponse } from '../entities/report.response';
import { ReportPayload } from '../entities/report.payload';
import { OverallReportConfiguration } from './overall-losses-report.configuration';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { OverallLossesFilters } from './overall-losses-report-filter.const';
import { Router } from '@angular/router';
import { InMemoryStorageService } from '../../../shared/storage/in-memory-storage.service';
import { ReportService } from '../services/report.service';

@Component({
    templateUrl: './overall-losses-report.component.html',
    styleUrls: ['./overall-losses-report.component.css']
})

export class OverallLossesReportComponent implements OnInit, AfterViewInit {

    reportItems: ReportResponse[];
    reportTypes: Array<any>;
    selectedReport: any;
    selectedReportName: string;
    isCaretToggle: boolean;
    currentDate: Date = new Date();

    constructor(private router: Router, private reportService: ReportService, private inMemoryStorage: InMemoryStorageService, private localWebStorage: LocalWebStorageService) {
        this.localWebStorage.set("lastVisitedReportUrl", "reports/overall-losses");
    }

    ngOnInit() {

        let selectedReportName = this.localWebStorage.get<string>("selectedReportName");
        if (selectedReportName) {
            this.selectedReportName = selectedReportName;
            this.localWebStorage.remove("selectedReportName");
            this.inMemoryStorage.setItem("selectedReportName", null);
        }
        else {
            this.selectedReportName = "By Year";
        }

        this.getAllReportTypes();
        this.isCaretToggle = true;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.getLossData(this.selectedReportName);
        });
    }

    redirectToSearchPage() {
        this.router.navigate(['search']);
    }

    getAllReportTypes() {
        this.reportTypes = OverallLossesFilters;
    }

    onReportTypeChange(reportName) {
        this.getLossData(reportName);
    }

    private getLossData(reportName) {

        let lossReportItems = this.getLossDataFromStore(reportName);

        if (!lossReportItems) {

            let reportPayload = new ReportPayload();

            // this.reportService.getLossDataJson("Overall").subscribe(
            //     (result) => {
            //         //var data:any=this.reportService.csvJSON(result.value);
            //         this.reportItems = JSON.parse(result.value);
            //         this.inMemoryStorage.setItem("OverallLossReportItems", this.reportItems);
            //         this.selectedReport = _.find(OverallReportConfiguration, (e) => e.reportName == reportName);
            //     });
            
            this.reportService.getLossDataExport("Overall").subscribe(
                (result) => {
                    var data: any = this.reportService.csvJSON(result.value);
                    this.reportItems = data;
                    this.inMemoryStorage.setItem("OverallLossReportItems", this.reportItems);
                    this.selectedReport = _.find(OverallReportConfiguration, (e) => e.reportName == reportName);
                });
        }
    }

    private getLossDataFromStore(reportName: string) {

        let lossReportItems = this.inMemoryStorage.getItem("OverallLossReportItems");

        if (lossReportItems) {
            this.reportItems = lossReportItems;
            this.selectedReport = _.find(OverallReportConfiguration, (e) => e.reportName == reportName);
        }

        return lossReportItems;
    }

    caretToggle() {
        this.isCaretToggle = !this.isCaretToggle;
    }
}