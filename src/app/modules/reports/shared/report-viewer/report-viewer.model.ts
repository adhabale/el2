import * as _ from 'lodash';
import { ReportResponse } from '../../entities/report.response';
import { ReportViewer, ReportViewerTableRow, ReportViewerTableCell } from './report-viewer';
import { ReportViewerConstant } from './report-viewer.const';
import { Observable } from 'rxjs/Rx';

export class ReportViewerModel {

    loadAllRecords(apiDataSource, selectedReportDetails) {

        let reportViewerData: ReportViewer = new ReportViewer();

        if (selectedReportDetails) {

            reportViewerData.tableColumns = selectedReportDetails.columns.map(column => column.displayName);

            _.each(apiDataSource, (reportItem) => {
                this.groupData(reportViewerData.tableRows, reportItem, selectedReportDetails, 1);
            });

            if (selectedReportDetails.showTotalRow) {

                let filteredItems = _.filter(reportViewerData.tableRows, (e) => { return e.rowGroupLevel == 1 });
                reportViewerData.tableRows.push(this.createTotalRow(filteredItems, selectedReportDetails.columns));
            }
        }

        return reportViewerData;
    }

    expandAllRow(apiDataSource, selectedReportDetails) {

        let allGroupedItems = this.loadAllRecords(apiDataSource, selectedReportDetails);

        _.each(allGroupedItems.tableRows, (item) => {
            item.isRowVisible = true;
            item.isRowExpanded = true;
        });

        return allGroupedItems;
    }

    private groupData(reportViewerTableRows: ReportViewerTableRow[], reportItem: ReportResponse, selectedReportInfo, rowGroupLevel: number, parentLink: string[] = [], filterBy = {}) {

        let reportGroup = _.find(selectedReportInfo.groups, (e) => { return e.level == rowGroupLevel });

        if (!reportGroup)
            this.addDetailRow(reportViewerTableRows, reportItem, selectedReportInfo, rowGroupLevel, parentLink);

        if (reportGroup) {

            let appendfilterBy = {};
            appendfilterBy[reportGroup.name] = reportItem[reportGroup.name];
            let mergedFilterBy = this.mergeObjects(appendfilterBy, filterBy);

            let reportViewerTableRow = _.find(reportViewerTableRows, (e) => { return e.name == reportItem[reportGroup.name] && JSON.stringify(e.parentLink) == JSON.stringify(parentLink) });

            if (!reportViewerTableRow)
                this.addTableRow(reportViewerTableRows, reportItem, reportGroup, selectedReportInfo.columns, parentLink, mergedFilterBy);
            else
                this.updateTableRow(reportViewerTableRow, reportItem, selectedReportInfo.columns);

            if (selectedReportInfo.groups.length >= rowGroupLevel) {
                rowGroupLevel++;
                let newParentGroup = parentLink.concat([reportItem[reportGroup.name]]);
                this.groupData(reportViewerTableRows, reportItem, selectedReportInfo, rowGroupLevel, newParentGroup, mergedFilterBy);
            }
        }
    }

    private addTableRow(reportViewerTableRows: ReportViewerTableRow[], reportItem: ReportResponse, reportGroup, reportColumns, parentLink: string[], filterBy) {

        let tableRow = new ReportViewerTableRow("", reportItem[reportGroup.name], ReportViewerConstant.GroupRow, reportGroup.level, false, reportGroup.level == 1, parentLink, filterBy, []);

        tableRow.tableCells = _.chain(reportColumns).map(function (column) {

            let value;

            if (column.key == "name") {
                value = reportItem[reportGroup.name];
            }
            else if (column.operation == "divide") {
                value = reportItem[column.numerator];
            }
            else if (column.operation == "count") {
                value = 1;
            }
            else {
                value = reportItem[column.key];
            }

            return new ReportViewerTableCell(column.key, value);

        }).value();

        reportViewerTableRows.push(tableRow);
    }

    private updateTableRow(reportViewerTableRow: ReportViewerTableRow, reportItem: ReportResponse, reportColumns) {

        _.each(reportColumns, function (column) {

            let tableCell = _.find(reportViewerTableRow.tableCells, (tblCell) => { return tblCell.name == column.key });

            if (column.operation == "divide") {
                let numerator = _.find(reportViewerTableRow.tableCells, (e) => { return e.name == column.numerator }).value;
                let denominator = _.find(reportViewerTableRow.tableCells, (e) => { return e.name == column.denominator }).value;
                tableCell.value = _.divide(numerator, denominator);
            }

            else if (column.operation == "count")
                tableCell.value = _.sum([tableCell.value, 1]);

            else if (column.operation == "sum")
                tableCell.value = _.sum([tableCell.value, reportItem[column.key]]);
        });
    }

    private addDetailRow(reportViewerTableRows: ReportViewerTableRow[], reportItem: ReportResponse, selectedReportInfo, groupLevel: number, parentLink: string[]) {

        let detailRow = new ReportViewerTableRow(reportItem, "", ReportViewerConstant.DetailRow, groupLevel, false, groupLevel == 1, parentLink, "", []);
        
        _.each(selectedReportInfo.columns, (column, index: number) => {

            if (["By Depth Category", "By PD Cost Categories - Actual", "By OEE Cost Categories - Actual", "By PD Cost Categories - Indexed", "By OEE Cost Categories - Indexed"].indexOf(selectedReportInfo.reportName) > -1) {

                if (column.key == "indexedPDLiabClaim" || column.key == "indexedOEEClaim" || column.key == "pdLiabClaim" || column.key == "oeeClaim") {

                    if (reportItem[column.key] != undefined && reportItem[column.key] != null && reportItem[column.key] != "")
                        detailRow.tableCells.push(new ReportViewerTableCell(column.key, reportItem[column.key]));
                    else
                        detailRow.tableCells.push(new ReportViewerTableCell(column.key,0));
                }
                else {
                    detailRow.tableCells.push(new ReportViewerTableCell(column.key, reportItem[column.key]));
                }
            }

            else if (selectedReportInfo.reportName == "") {

                let value = reportItem[column.key];
                if (index == 0) {
                    detailRow.tableCells.push(new ReportViewerTableCell(column.key, value != null ? _.replace(value, "{NULL}", "N/A") : value));
                }
                else {
                    detailRow.tableCells.push(new ReportViewerTableCell(column.key, value != null ? _.replace(value, "{NULL}", "") : value));
                }
            }

            else {
                detailRow.tableCells.push(new ReportViewerTableCell(column.key, reportItem[column.key]));
            }

        });

        reportViewerTableRows.push(detailRow);
    }


    generateReport(apiDataSource, selectedReportDetails) {

        let reportViewerData: ReportViewer = new ReportViewer();

        if (selectedReportDetails) {

            reportViewerData.tableColumns = selectedReportDetails.columns.map(column => column.displayName);

            reportViewerData.tableRows = this.loadParentRecords(apiDataSource, selectedReportDetails);

            if (selectedReportDetails.showTotalRow) {

                let filteredItems = _.filter(reportViewerData.tableRows, (e) => { return e.rowGroupLevel == 1 });
                reportViewerData.tableRows.push(this.createTotalRow(filteredItems, selectedReportDetails.columns));
            }
        }

        return reportViewerData;
    }

    expandRow(apiDataSource, parentItem, selectedReportDetails) {
        return this.loadChildRecords(apiDataSource, parentItem, selectedReportDetails);
    }

    collapseRow(parentItem, allTableRows) {

        parentItem.isRowExpanded = false;

        let parentLink = parentItem.parentLink.concat(parentItem.name);

        let filteredItems = _.filter(allTableRows.tableRows, (e) => { return JSON.stringify(e.parentLink) == JSON.stringify(parentLink) });

        if (filteredItems)
            _.each(filteredItems, (e) => {
                if (e.rowType == ReportViewerConstant.GroupRow && e.isRowVisible) {
                    e.isRowVisible = false;
                    this.collapseRow(e, allTableRows);
                }
                else {
                    e.isRowVisible = false;
                }
            });
    }

    collapseAllRow(allGroupedItems: ReportViewer) {

        _.each(allGroupedItems.tableRows, (item) => {
            item.isRowVisible = item.rowGroupLevel == 1 || item.rowType == ReportViewerConstant.TotalRow;
            item.isRowExpanded = false;
        });
    }

    private loadParentRecords(apiDataSource, selectedReportDetails) {

        let tableRows = [];

        let reportGroup = _.find(selectedReportDetails.groups, (e) => { return e.level == 1 });

        if (reportGroup) {
            let parentItem = { filterBy: {}, parentLink: [] };
            tableRows = this.createAndUpdateGroupTableRow(apiDataSource, selectedReportDetails.columns, reportGroup, parentItem);
        }
        else {
            tableRows = this.createDetailTableRows(apiDataSource, selectedReportDetails, 1, []);
        }

        return tableRows;
    }

    private loadChildRecords(apiDataSource, parentItem, selectedReportDetails) {

        let tableRows: ReportViewerTableRow[] = [];

        let filteredApiDataSource = _.filter(apiDataSource, parentItem.filterBy);

        if (filteredApiDataSource.length > 0) {

            let groupLevel = parentItem.rowGroupLevel + 1;

            let reportGroup = _.find(selectedReportDetails.groups, (group) => { return group.level == groupLevel });

            if (reportGroup) {
                tableRows = this.createAndUpdateGroupTableRow(filteredApiDataSource, selectedReportDetails.columns, reportGroup, parentItem);
            }
            else {
                tableRows = this.createDetailTableRows(filteredApiDataSource, selectedReportDetails, groupLevel, parentItem.parentLink.concat([parentItem.name]));
            }
        }

        return tableRows;
    }

    private createAndUpdateGroupTableRow(apiDataSource, reportColumns, reportGroup, parentItem) {

        let tableRows: ReportViewerTableRow[] = [];

        _.each(apiDataSource, (item) => {

            let existingTableRow = _.find(tableRows, (e) => { return e.name == item[reportGroup.name] });

            if (existingTableRow) {

                this.updateGroupTableRow(reportColumns, existingTableRow, item);

            } else {

                let appendfilterBy = {};
                appendfilterBy[reportGroup.name] = item[reportGroup.name];

                let mergedFilterBy = this.mergeObjects(appendfilterBy, parentItem.filterBy);

                let tableRow = this.createGroupTableRow(item, reportColumns, reportGroup, parentItem.parentLink.concat([reportGroup.level == 1 ? item[reportGroup.name] : parentItem.name]), mergedFilterBy);

                tableRows.push(tableRow);
            }
        });

        return tableRows;
    }

    private createGroupTableRow(newReportItem, reportColumns, reportGroup, parentLink, filterBy) {


        let tableRow = new ReportViewerTableRow(
            "",
            newReportItem[reportGroup.name],
            ReportViewerConstant.GroupRow,
            reportGroup.level,
            false,
            true,
            parentLink,
            filterBy,
            []
        );

        tableRow.tableCells = _.chain(reportColumns).map(function (column) {

            let value;

            if (column.key == "name") {
                value = newReportItem[reportGroup.name];
            }
            else if (column.operation == "divide") {
                value = newReportItem[column.numerator];
            }
            else if (column.operation == "count") {
                value = 1;
            }
            else {
                value = newReportItem[column.key];
            }

            return new ReportViewerTableCell(column.key, value);

        }).value();

        return tableRow;
    }

    private updateGroupTableRow(reportColumns, existingTableRow, newReportItem) {

        _.each(reportColumns, function (column) {

            let tableCell = _.find(existingTableRow.tableCells, (tblCell) => { return tblCell.name == column.key });

            if (column.operation == "divide") {
                let numerator = _.find(existingTableRow.tableCells, (e) => { return e.name == column.numerator }).value;
                let denominator = _.find(existingTableRow.tableCells, (e) => { return e.name == column.denominator }).value;
                tableCell.value = _.divide(numerator, denominator);
            }

            else if (column.operation == "count")
                tableCell.value = _.sum([tableCell.value, 1]);

            else if (column.operation == "sum")
                tableCell.value = _.sum([tableCell.value, newReportItem[column.key]]);
        });
    }

    private createDetailTableRows(apiDataSource, selectedReportDetails, rowGroupLevel, parentLink) {

        let tableRows = [];

        _.each(apiDataSource, (newItem) => {

            let detailRow = new ReportViewerTableRow(newItem, "",
                ReportViewerConstant.DetailRow,
                rowGroupLevel,
                false,
                true,
                parentLink,
                "",
                []);


            _.each(selectedReportDetails.columns, (column, index: number) => {

                if (["By Depth Category", "By PD Cost Categories - Actual", "By OEE Cost Categories - Actual", "By PD Cost Categories - Indexed", "By OEE Cost Categories - Indexed"].indexOf(selectedReportDetails.reportName) > -1) {

                    if (column.key == "indexedPDLiabClaim" || column.key == "indexedOEEClaim" || column.key == "pdLiabClaim" || column.key == "oeeClaim") {

                        if (newItem[column.key] != undefined && newItem[column.key] != null && newItem[column.key] != "")
                            detailRow.tableCells.push(new ReportViewerTableCell(column.key, newItem[column.key]));
                        else
                            detailRow.tableCells.push(new ReportViewerTableCell(column.key, 0));
                    }
                    else {
                        detailRow.tableCells.push(new ReportViewerTableCell(column.key, newItem[column.key]));
                    }
                }

                else if (selectedReportDetails.reportName == "") {
                    if (column.key == "indexedPDLiabClaim" || column.key == "indexedOEEClaim" || column.key == "pdLiabClaim" || column.key == "oeeClaim") {

                        if (newItem[column.key] != undefined && newItem[column.key] != null && newItem[column.key] != "")
                            detailRow.tableCells.push(new ReportViewerTableCell(column.key, newItem[column.key]));
                        else
                            detailRow.tableCells.push(new ReportViewerTableCell(column.key, 0));
                    }
                    else {
                        detailRow.tableCells.push(new ReportViewerTableCell(column.key, newItem[column.key]));
                    }

                    // let value = newItem[column.key];
                    // if (index == 0) {
                    //     detailRow.tableCells.push(new ReportViewerTableCell(column.key, value != null ? _.replace(value, "{NULL}", "N/A") : value));
                    // }
                    // else {
                    //     detailRow.tableCells.push(new ReportViewerTableCell(column.key, value != null ? _.replace(value, "{NULL}", "") : value));
                    // }
                }

                else {
                    detailRow.tableCells.push(new ReportViewerTableCell(column.key, newItem[column.key]));
                }

            });          

            tableRows.push(detailRow);
        });

        return tableRows;
    }

    private createTotalRow(reportViewerTableRows, reportColumns) {

        let totalRow: ReportViewerTableRow;

        if (reportViewerTableRows.length > 0) {


            totalRow = new ReportViewerTableRow("", "", ReportViewerConstant.TotalRow, 0, false, true, [], {}, []);

            var allTableCells = _.chain(reportViewerTableRows).map(e => e.tableCells).value();

            totalRow.tableCells = _.chain(reportColumns).map(function (column, index) {

                let value;

                if (column.showTotal) {

                    if (column.operation == "divide") {

                        let numerator = _.sum(_.chain(allTableCells).map(e => { return _.filter(e, o => { if (o.name == column.numerator) return o.value; })[0].value }).value());

                        let denominator = _.sum(_.chain(allTableCells).map(e => { return _.filter(e, o => { if (o.name == column.denominator) return o.value; })[0].value }).value());

                        value = _.divide(numerator, denominator);
                    }
                    else {
                        value = _.sum(_.chain(allTableCells).map(e => e[index].value).value());
                    }
                }
                else {
                    value = "";
                }

                return new ReportViewerTableCell(column.key, value);

            }).value();
        }

        return totalRow;
    }

    private mergeObjects(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }
}
