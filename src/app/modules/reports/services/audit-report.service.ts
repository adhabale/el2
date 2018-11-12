import { HttpClientWrapper } from "../../../shared/http/http-client-wrapper";
import { Injectable } from "@angular/core";
import { AuditReportLog } from "../entities/audit-report-log";
import { ReportService } from "./report.service";
import { WebRequestParameter } from "../../../shared/http/web-request-parameter";
import { ConfigurationService } from "../../../shared/configuration/configuration.service";

@Injectable()
export class AuditReportService {

    constructor(private httpClientWrapper: HttpClientWrapper, private reportService: ReportService,private config:ConfigurationService) {
    }

    log(reportType: string, reportView: string, customReportName: string, action: string) {

        let auditReportLog = new AuditReportLog();
        auditReportLog.reportName = customReportName;
        auditReportLog.reportType = reportType;
        auditReportLog.reportView = reportView;
        auditReportLog.action = action;
        auditReportLog.filters = this.reportService.getSearchCriteria();
        auditReportLog.loggedInUser=this.config.loggedInUserInfo;

        let webRequestParam = new WebRequestParameter("audit/reports", JSON.stringify(auditReportLog));
        this.httpClientWrapper.post<any>(webRequestParam).subscribe();
    }
}   