import { AuditTermsOfUseLog } from '../entity/audit-terms-of-use-log';
import { WebRequestParameter } from "../../../shared/http/web-request-parameter";
import { HttpClientWrapper } from "../../../shared/http/http-client-wrapper";
import { Injectable } from "@angular/core";

@Injectable()
export class AuditTermsOfUseService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    log(auditTermsOfUseLog:AuditTermsOfUseLog)
    {
        let webRequestParam = new WebRequestParameter("audit/terms-of-use", JSON.stringify(auditTermsOfUseLog));
        this.httpClientWrapper.post<any>(webRequestParam).subscribe();
    }

}