
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../../shared/http/web-request-parameter';
import { HttpClientWrapper } from '../../../../shared/http/http-client-wrapper';
import { ReportParameters } from "../entities/reportParameters";
import { Observable } from 'rxjs/Rx';
import { Report } from '../entities/report';
import { ModifyReport } from '../entities/modifyReport';
import { SaveReport } from '../entities/saveReport';
import { ReportResponse } from '../../entities/report.response';
import { ReportPayload } from '../../entities/report.payload';

@Injectable()
export class CustomReportService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

   getReportParameters():Observable<ReportParameters[]> {
        let webRequestParams = new WebRequestParameter("customReports/fields");
        return this.httpClientWrapper.get<string>(webRequestParams).map((response)=>{
            let result:Array<ReportParameters>=new Array<ReportParameters>();
            return result=JSON.parse(response);
        })
    }

    getSavedReports():Observable<Report[]> {
        let webRequestParams = new WebRequestParameter("customReports/userReports");
        return this.httpClientWrapper.get<Report[]>(webRequestParams);
    }

    saveReport(report : SaveReport): Observable<string> {
        let webRequestParams = new WebRequestParameter("customReports/", JSON.stringify(report));
        return this.httpClientWrapper.post<string>(webRequestParams);
    }

    updateReport(report: ModifyReport): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("customReports/", JSON.stringify(report));
        return this.httpClientWrapper.put<boolean>(webRequestParams);
    }

    deleteReport(id: string): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("customReports/"+id);
        return this.httpClientWrapper.delete<boolean>(webRequestParams);
    }

}