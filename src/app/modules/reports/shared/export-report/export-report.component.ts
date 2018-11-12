import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReportResponse } from '../../entities/report.response';
import * as _ from 'lodash';
import * as alasql from 'alasql';
import * as XLSX from 'xlsx';
import * as moment from 'moment/moment';
import { Summarylevel } from './summary-level';
import { AuditReportLog, ReportAction } from '../../entities/audit-report-log';
import { AuditReportService } from '../../services/audit-report.service';
import { ReportService } from '../../services/report.service';
import { SelectedSearchCriteria } from '../../../search/entities/search-criteria';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';
import { DownloadFileService } from '../../../../shared/download-file/download-file.service';
import { ReportViewer } from '../report-viewer/report-viewer';

@Component({
    selector: 'export-report',
    templateUrl: './export-report.component.html',
    styleUrls: ['./export-report.component.css']
})

export class ExportReportComponent implements OnChanges {

    @Input() customReportName: string = "";

    @Input() reportType: string;

    @Input() selectedReport: any;

    @Input() sourceItems: ReportResponse[];

    @Input() allTableItems: ReportViewer;

    summaryLevels: Summarylevel[] = [];

    selectedSummaryLevel: Summarylevel;

    selectedExportType: string;

    constructor(private auditReportLogService: AuditReportService, private reportService: ReportService, private localWebStorage: LocalWebStorageService, private downloadFileService: DownloadFileService) {
    }

    ngOnChanges(changes: SimpleChanges) {

        for (let propName in changes) {

            if (propName == "selectedReport" && changes[propName].currentValue != changes[propName].previousValue) {

                this.summaryLevels = [];
                this.selectedSummaryLevel = null;
                this.selectedExportType = "CSV";

                this.loadSummaryLevels();
            }
        }
    }

    get isDownloadBtnDisabled(): boolean {

        if (this.selectedReport.groups.length > 0) {
            return !(this.selectedSummaryLevel != null && this.selectedSummaryLevel != undefined && this.selectedExportType != null && this.selectedExportType != undefined);
        }

        return !(this.selectedExportType != null && this.selectedExportType != undefined);
    }

    download() {

        this.auditReportLog();

        let data = alasql(this.buildSqlQuery(), [this.sourceItems]);

        let oldData = JSON.stringify(data).replace(/null/g, '""');
        let newData = JSON.parse(oldData);

        switch (this.selectedExportType) {

            case "CSV":
                this.generateCSVFile(newData);
                break;

            case "EXCEL":
                this.generateExcelFile(newData);
                break;

            case "PDF":
                this.generatePDFFile(newData);
                break;

            default:
                alert("Please Select File Format");
                break;
        }
    }

    private loadSummaryLevels() {

        if (this.selectedReport.groups.length > 0) {

            let columnName;
            let groupName;
            let displayName;

            _.each(this.selectedReport.groups, (e, index) => {

                if (this.summaryLevels.length == 0) {
                    columnName = `[${e.name}] as [${e.displayName}]`;
                    displayName = e.displayName;
                    groupName = `[${e.name}]`;
                }
                else {
                    displayName = `${displayName} , ${e.displayName}`;
                    columnName = `${columnName}, [${e.name}] as [${e.displayName}]`;
                    groupName = `${groupName}, [${e.name}]`;
                }

                this.summaryLevels.push(new Summarylevel(groupName, columnName, displayName.replace(/,([^,]*)$/, 'and' + '$1')));
            });
        }
    }

    private buildSqlQuery() {
        return this.selectedReport.groups.length > 0 ? this.buildSqlQueryWithGroupBy() : this.buildSqlQueryWithoutGroupBy();
    }

    private buildSqlQueryWithGroupBy() {

        let columns = _.filter(this.selectedReport.columns, (e) => { return e.operation != "" });

        if (columns) {

            let selectColumns = '';

            _.each(columns, (column) => {

                selectColumns += ", ";

                if (column.operation == "count")
                    selectColumns += `COUNT(*) as [${column.displayName}]`;

                if (column.operation == "sum")
                    selectColumns += `SUM([${column.key}]) as [${column.displayName}]`;

                if (column.operation == "divide")
                    selectColumns += `SUM([${column.numerator}])/COUNT(*) as [${column.displayName}]`;
            });

            return `SELECT ${this.selectedSummaryLevel.columnName} ${selectColumns} FROM ? GROUP BY ${this.selectedSummaryLevel.groupName}`;
        }
    }

    private buildSqlQueryWithoutGroupBy() {

        let selectColumns;

        _.each(this.selectedReport.columns, (column) => {

            selectColumns = selectColumns ? selectColumns + ", " : '';

            if (column.operation == "")
                selectColumns += `[${column.key}] as [${column.displayName}]`;

            if (column.operation == "count")
                selectColumns += `COUNT(*) as [${column.displayName}]`;

            if (column.operation == "sum")
                selectColumns += `SUM([${column.key}]) as [${column.displayName}]`;

            if (column.operation == "divide")
                selectColumns += `SUM([${column.numerator}])/COUNT(*) as [${column.displayName}]`;
        });

        return `SELECT ${selectColumns} FROM ? `;

    }

    private generateExcelFile(data) {

        let options = {
            headers: true,
            sheetid: 'Energy Losses Report'            
        };

        return alasql(`SELECT * INTO XLS("${this.getFileName("xls")}",?) FROM ?`, [options, data]);
    }

    private generateCSVFile(data) {

        let options = {
            headers: true,
            separator: ","            
        };

        return alasql(`SELECT * INTO CSV("${this.getFileName("csv")}",?) FROM ?`, [options, data]);
    }

    private generatePDFFile(data) {
        var reportName:string;
        if(this.reportType=='Overall')
        reportName='Overall Losses - '+this.customReportName;
        else if(this.reportType=='OEE')
        reportName='OEE Losses - '+this.customReportName;
        else 
        reportName='Custom Download Report';
        this.reportService.getPDFdocument(data,this.allTableItems, reportName, this.localWebStorage.get<SelectedSearchCriteria>("searchCriteria")).subscribe((result) => {
            this.downloadFileService.fetchFile(result);
        })
    }

    private getFileName(fileExtension) {

        let dt = moment(_.now());
        return `Energy Losses Report_${dt.utc().format("DD-MMM-YYYY:HH:mm")}.${fileExtension}`;
    }

    private auditReportLog() {
        this.auditReportLogService.log(this.reportType, this.selectedReport.reportName, this.customReportName, ReportAction.DOWNLOAD);
    }
}
