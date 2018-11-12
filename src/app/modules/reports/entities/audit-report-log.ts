import { ReportPayload } from "./report.payload";

export class AuditReportLog {

    reportType: string;
    reportView: string;
    action: string;
    reportName: string;
    filters: ReportPayload;
    loggedInUser:string;
}

export const ReportAction = {
    VIEW:"VIEW",
    DOWNLOAD:"DOWNLOAD",
    DELETE:"DELETE",
    SAVE:"SAVE"
}