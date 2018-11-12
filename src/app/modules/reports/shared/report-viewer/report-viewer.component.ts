import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ReportResponse } from '../../entities/report.response';
import { ReportViewer, ReportViewerTableRow } from './report-viewer';
import { ReportViewerModel } from './report-viewer.model';
import * as _ from 'lodash';
import { LoaderService } from '../../../../shared/loader/loader.service';
import { InMemoryStorageService } from '../../../../shared/storage/in-memory-storage.service';
import { Router } from '@angular/router';
import { AuditReportService } from '../../services/audit-report.service';
import { AuditReportLog, ReportAction } from '../../entities/audit-report-log';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';

@Component({
    selector: 'report-viewer',
    templateUrl: './report-viewer.component.html',
    styleUrls: ['./report-viewer.component.css']
})

export class ReportViewerComponent implements OnChanges {

    @Input() reportType: string;

    @Input() customReportName: string = "";

    @Input() sourceItems: ReportResponse[];

    @Input() selectedReport: any;

    isExpandAll: boolean = false;

    isLinked: boolean = true;

    currentPageIndex: number = 1;

    pageItems: ReportViewer;

    private reportViewerModel: ReportViewerModel;

    private allTableItems: ReportViewer;

    constructor(private loaderService: LoaderService, private inMemoryStorage: InMemoryStorageService, private router: Router, private auditReportLogService: AuditReportService, private localWebStorage: LocalWebStorageService) {
        this.reportViewerModel = new ReportViewerModel();

    }

    ngOnChanges(changes: SimpleChanges) {

        for (let propName in changes) {

            if (propName == "selectedReport" && changes[propName].currentValue != changes[propName].previousValue) {

                this.isExpandAll = false;
                this.allTableItems = null;
                this.loaderService.show();
                this.inMemoryStorage.setItem("selectedReportNameToIgnoreIdleTimeout", this.selectedReport.reportName);
                setTimeout(() => {
                    this.generateLossReport();
                }, 1000);
            }
        }
    }


    showLink(tableCell, last) {

        if (tableCell.value != null && this.isLinked) {
            this.isLinked = !this.isLinked;
            if (last) {
                this.isLinked = !this.isLinked;

            }
            return true;
        }
        else {
            if (last) {
                this.isLinked = !this.isLinked;
            }
            return false;
        }
    }

    openLossDetails(data) {
        let oldData = JSON.stringify(data).replace(/{NULL}/g, '');
        let newData = JSON.parse(oldData);
        this.inMemoryStorage.setItem("lossDetails", newData);
        this.localWebStorage.set("lossDetails", newData);
        this.inMemoryStorage.setItem("selectedReportName", this.selectedReport.reportName);
        this.inMemoryStorage.setItem("reportData", this.allTableItems);
        this.inMemoryStorage.setItem("currentReportPageIndex", this.currentPageIndex);
        this.inMemoryStorage.setItem("isExpandAll", this.isExpandAll);
        this.localWebStorage.set("returnToReportUrl", this.router.url);
        this.router.navigate(["reports/loss-details"]);
    }

    generateLossReport() {

        this.auditReportLog();

        this.pageItems = this.pageItems || new ReportViewer();

        if (this.selectedReport != null && this.selectedReport != undefined) {

            this.pageItems.tableColumns = this.selectedReport.columns.map(column => column.displayName);

            let allItems = this.inMemoryStorage.getItem("reportData");

            if (allItems) {
                this.currentPageIndex = this.localWebStorage.get<number>("currentReportPageIndex");
                this.isExpandAll = this.inMemoryStorage.getItem("isExpandAll");
                this.localWebStorage.remove("reportData");
                this.localWebStorage.remove("currentReportPageIndex");
                this.inMemoryStorage.setItem("reportData", null);
                this.inMemoryStorage.setItem("isExpandAll", null);
                this.inMemoryStorage.setItem("currentReportPageIndex", null);

                this.sourceItems = _.orderBy(this.sourceItems, this.selectedReport.orderBy.columns, this.selectedReport.orderBy.orders);
                this.allTableItems = allItems;
            }
            else {
                if (this.sourceItems != null && this.sourceItems != undefined && this.sourceItems.length > 0) {

                    if (this.selectedReport.orderBy.columns.length > 0)
                        this.sourceItems = _.orderBy(this.sourceItems, this.selectedReport.orderBy.columns, this.selectedReport.orderBy.orders);

                    this.allTableItems = this.reportViewerModel.generateReport(this.sourceItems, this.selectedReport);
                }
                else {
                    this.loaderService.hide();
                }
            }
        }
    }

    expandRow(parentItem: ReportViewerTableRow) {

        this.loaderService.show();

        if (!parentItem.isChildRecordsLoaded) {

            parentItem.isRowExpanded = true;

            parentItem.isChildRecordsLoaded = true;

            let tableRows = this.reportViewerModel.expandRow(this.sourceItems, parentItem, this.selectedReport);

            let index = _.findIndex(this.allTableItems.tableRows, function (o) { return o.name == parentItem.name && JSON.stringify(o.parentLink) == JSON.stringify(parentItem.parentLink); });

            if (index > -1) {

                _.each(tableRows, (item) => {
                    index++;
                    this.allTableItems.tableRows.splice(index, 0, item)
                });
            }

        } else {

            parentItem.isRowExpanded = true;

            let parentLink = parentItem.parentLink.concat(parentItem.name);

            let filteredItems = _.filter(this.allTableItems.tableRows, (e) => { return JSON.stringify(e.parentLink) == JSON.stringify(parentLink) });

            if (filteredItems)
                _.each(filteredItems, (e) => { e.isRowVisible = true; });
        }
    }

    collapseRow(item: ReportViewerTableRow) {
        this.loaderService.show();
        this.reportViewerModel.collapseRow(item, this.allTableItems);
    }

    expandAllRow() {
        this.loaderService.show();
        setTimeout(() => {
            this.allTableItems = this.reportViewerModel.expandAllRow(this.sourceItems, this.selectedReport);
        }, 1000);
    }

    collapseAllRow() {
        this.loaderService.show();
        setTimeout(() => {
            this.reportViewerModel.collapseAllRow(this.allTableItems);
        }, 1000);
    }

    onPageChange(pageItem) {
        setTimeout(() => {
            this.pageItems.tableRows = pageItem;
            this.loaderService.hide();
        });
    }

    setCurrentPageIndex(pageIndex) {
        this.currentPageIndex = pageIndex;
    }

    get allVisibleItems() {

        if (this.allTableItems != null && this.allTableItems != undefined && this.allTableItems.tableRows != null && this.allTableItems.tableRows != undefined && this.allTableItems.tableRows.length > 0)
            return _.filter(this.allTableItems.tableRows, (e) => { return e.isRowVisible });
    }

    private auditReportLog() {
        this.auditReportLogService.log(this.reportType, this.selectedReport.reportName, this.customReportName, ReportAction.VIEW);
    }


    checkValue(value) {
        if (typeof (value) === "object") {
            if (value == null)
                return true;
            else
                return false;
        }
        else if (typeof (value) === "string") {

            if (value === "<blank>") {
                return false;
            }
            return true;

        }
        else return false;
    }

    checkNumber(value) {
        if (value == null)
            return true;
        return isNaN(value);
    }

    checkHeading(columnName) {
        if (columnName == "Total / Actual U$" || columnName == "Depth at loss (feet)" || columnName == "Year of Loss"
            || columnName == "OEE / Actual US$" || columnName == "PD / Actual US$" || columnName == "ProjTD (feet)"
            || columnName == "Total Actual US$" || columnName == "Total / Actual US$" || columnName == "Incidents"
            || columnName == "Average Actual US$" || columnName == "Total Indexed US$" || columnName == "Average Indexed US$"
            || columnName == "Total Actual OEE US$" || columnName == "Total Indexed OEE US$" || columnName == "Total Indexed PD US$"
            || columnName == "BI / Actual US$" || columnName == "OEE Actual US$" || columnName == "Average OEE Actual US$"
            || columnName == "OEE Indexed US$" || columnName == "Average OEE Indexed US$" || columnName == "Total Actual PD US$"
            || columnName == "PD /  Actual US$" || columnName == "Depth (feet)" || columnName == "PD Actual US$" ||
            columnName == "BI Actual US$") {
            return false;
        }
        else { return true; }
    }
}




