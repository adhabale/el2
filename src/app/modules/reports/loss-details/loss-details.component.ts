import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router'
import { InMemoryStorageService } from '../../../shared/storage/in-memory-storage.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { ReportResponse } from '../../reports/entities/report.response';

@Component({
    templateUrl: './loss-details.component.html',
    styleUrls: ['./loss-details.component.css']
})
export class LossDetailsComponent {

    reportDetail: ReportResponse = new ReportResponse(null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null);

    currentDate: Date = new Date();
    dateOfLoss: Date = new Date();
    dateOfLossString: string;

    constructor(private inMemoryStorage: InMemoryStorageService, private localWebStorage: LocalWebStorageService, private router: Router) {
    }

    ngOnInit() {
        //console.log("Hey There !! From Loss Details");
        //this.reportDetail = this.inMemoryStorage.getItem("lossDetails");
        this.reportDetail = this.localWebStorage.get("lossDetails");
        //console.log(this.reportDetail.dateOfLoss + "- dateOfLoss", this.reportDetail.monthName + "- monthName", this.reportDetail.year, "- year");
        this.dateOfLoss = new Date(this.reportDetail.dateOfLoss);
        this.dateOfLossString = this.reportDetail.dateOfLoss.substr(8, 2) + "-" + this.reportDetail.monthName + "-" + this.reportDetail.year;
    }

    goToReport() {
        this.localWebStorage.set("selectedReportName", this.inMemoryStorage.getItem("selectedReportName"));
        this.localWebStorage.set("currentReportPageIndex", this.inMemoryStorage.getItem("currentReportPageIndex"));
        this.inMemoryStorage.setItem("lossDetails", null);
        let url = this.localWebStorage.get<string>("returnToReportUrl");
        this.localWebStorage.remove("returnToReportUrl");
        this.router.navigate([url]);
    }
}