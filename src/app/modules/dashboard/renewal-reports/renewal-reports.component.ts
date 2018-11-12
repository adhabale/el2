import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AccountModel } from '../../account/models/account.model';
import { AccountService } from '../../account/services/account.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { AccountReports } from '../../account/entity/account-reports';
import { DownloadFileService } from '../../../shared/download-file/download-file.service';

@Component({
    selector: 'renewal-reports',
    templateUrl: './renewal-reports.component.html',
    styleUrls: ['./renewal-reports.component.css'],
    providers: [AccountService]
})
export class RenewalReportsComponent {


    currentPageIndex: number = 1;

    sortDirection: string = 'desc';

    reportData: AccountReports[] = [];

    reportList: AccountReports[] = [];

    private accountModel: AccountModel;

    constructor(private router: Router, private accountService: AccountService, private localWebStorage: LocalWebStorageService, private downloadFileService: DownloadFileService) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }
    // public reportDataList = [{ 'createdDate': '05/03/2018' }, { 'createdDate': '05/04/2018' },
    // { 'createdDate': '05/05/2018' }, { 'createdDate': '05/04/2018' },{ 'createdDate': '05/03/2018' },{ 'createdDate': '03/04/2018' },{ 'createdDate': '01/04/2018' },
    // { 'createdDate': '01/04/2018' },{ 'createdDate': '01/04/2018' },{ 'createdDate': '04/03/2018' },{ 'createdDate': '02/04/2018' },{ 'createdDate': '01/14/2018' },
    // { 'createdDate': '06/04/2018' },{ 'createdDate': '06/07/2018' },{ 'createdDate': '04/03/2018' },{ 'createdDate': '02/04/2018' },{ 'createdDate': '01/14/2018' }];
    ngOnInit() {
        this.getSubscriptionReports();
    }

    getSubscriptionReports() {
        this.accountModel.getSubscriptionReports().subscribe((result) => {
            this.reportList = result;
        })
    }

    onSorted(event) {
        this.reportList = _.orderBy(this.reportList, ['createdDate'], [event]);
        this.sortDirection = event;
    }

    downloadReport(report) {
        this.accountModel.getSubscriptionReportContent(report.filename).subscribe((result) => {
            this.downloadFileService.fetchFile(result);
        })
    }

    onGenerate() {
        this.accountModel.getRenewalReportContent().subscribe((result) => {
            this.downloadFileService.fetchFile(result);
        })
    }

    onPageChange(event) {
        this.reportList = event;
        this.reportList = _.orderBy(this.reportList, ['createdDate'], [this.sortDirection]);
    }


}
