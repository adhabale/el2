export class ReportViewer {
    tableColumns: string[];
    tableRows: ReportViewerTableRow[];

    constructor() {
        this.tableColumns = [];
        this.tableRows = [];
    }
}

export class ReportViewerTableRow {
    name: string;
    rowType: string;
    rowGroupLevel: number;
    isRowExpanded: boolean;
    isRowVisible: boolean;
    parentLink: string[];
    tableCells: ReportViewerTableCell[];
    filterBy: any;
    isChildRecordsLoaded: boolean;
    dataSource:any;

    constructor(dataSource,name, rowType, rowGroupLevel, isRowExpanded, isRowVisible, parentLink, filterBy, tableCells) {
        this.dataSource=dataSource;
        this.name = name;
        this.rowType = rowType;
        this.rowGroupLevel = rowGroupLevel;
        this.isRowExpanded = isRowExpanded;
        this.isRowVisible = isRowVisible;
        this.parentLink = parentLink;
        this.tableCells = tableCells;
        this.filterBy = filterBy;
        this.isChildRecordsLoaded = false;
    }
}

export class ReportViewerTableCell {
    name: string;
    value: any;

    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}