import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { ReportResponse } from '../entities/report.response';
import { ReportPayload } from '../entities/report.payload';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { OEELossesFilters } from './oee-losses-report-filter.const';
import { OEEReportConfiguration } from './oee-losses-report.configuration';
import { Router } from '@angular/router';
import { ReportService } from '../services/report.service';
import { InMemoryStorageService } from '../../../shared/storage/in-memory-storage.service';


@Component({
    templateUrl: './oee-losses-report.component.html',
    styleUrls: ['./oee-losses-report.component.css']
})

export class OEELossesReportComponent implements OnInit, AfterViewInit {

    reportItems: ReportResponse[];
    reportTypes: Array<any>;
    selectedReport: any;
    selectedReportName: string;
    isCaretToggle: boolean;
    currentDate: Date = new Date();

    constructor(private router: Router, private reportService: ReportService, private localWebStorage: LocalWebStorageService, private inMemoryStorage: InMemoryStorageService) {
        this.localWebStorage.set("lastVisitedReportUrl", "reports/oee-losses");
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
        this.reportTypes = OEELossesFilters;
    }

    onReportTypeChange(reportName) {

        setTimeout(() => {
            if (!this.getLossDataFromStore(reportName))
                this.getLossData(reportName);
        });
    }

    private getLossData(reportName) {

        let lossReportItems = this.getLossDataFromStore(reportName);

        if (!lossReportItems) {

            let reportPayload = new ReportPayload();

            // this.reportService.getLossDataJson("OEE").subscribe(
            //     (result) => {
            //         var data:any=this.reportService.csvJSON(result.value);
            //         this.reportItems = JSON.parse(result.value);
            //         this.localWebStorage.set("OEELossReportItems", this.reportItems, 300);
            //         this.selectedReport = _.find(OEEReportConfiguration, (e) => e.reportName == reportName);
            //     });

            this.reportService.getLossDataExport("OEE").subscribe(
                (result) => {
                    var data: any = this.reportService.csvJSON(result.value);
                    this.reportItems = data;
                    this.localWebStorage.set("OEELossReportItems", this.reportItems, 300);
                    this.selectedReport = _.find(OEEReportConfiguration, (e) => e.reportName == reportName);
                });
        }
    }

    private getLossDataFromStore(reportName: string) {

        let lossReportItems = this.localWebStorage.get<ReportResponse[]>("OEELossReportItems");

        if (lossReportItems) {
            this.reportItems = lossReportItems;
            this.selectedReport = _.find(OEEReportConfiguration, (e) => e.reportName == reportName);
        }

        return lossReportItems;
    }

    caretToggle() {
        this.isCaretToggle = !this.isCaretToggle;
    }
}