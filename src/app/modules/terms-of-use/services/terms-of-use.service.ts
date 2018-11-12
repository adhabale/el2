import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { TermsOfUse } from '../entity/terms-of-use';
import { AcceptedTermsOfUse } from '../entity/accepted-terms-of-use';

@Injectable()
export class TermsOfUseService
{
    constructor(private httpClientWrapper: HttpClientWrapper){}

    getTermsOfUse(): Observable<TermsOfUse>
    {
        let webRequestParams = new WebRequestParameter("users/terms-of-use/version/latest");      
        return this.httpClientWrapper.get<TermsOfUse>(webRequestParams);
    }

    updateTermsOfUse(body: AcceptedTermsOfUse ): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("users/terms-of-use/accept", JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(webRequestParams);
    }

    getLastAcceptedVersion(principalId: string): Observable<number> {
        let webRequestParams = new WebRequestParameter("users/terms-of-use/getLastAcceptedVersion/"+principalId);   
        return this.httpClientWrapper.get<number>(webRequestParams);
    }
    
}