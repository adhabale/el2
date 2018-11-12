import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { TermsOfUse } from '../entities/termsofuse';
import { calcBindingFlags } from '@angular/core/src/view/util';


@Injectable()

export class AdminTermsOfUseService
{

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getAllTermsOfUse(): Observable<TermsOfUse[]> {
        let webRequestParams = new WebRequestParameter("users/terms-of-use");      
        return this.httpClientWrapper.get<TermsOfUse[]>(webRequestParams);
      }
    addTermsOfUse(body: TermsOfUse ): Observable<TermsOfUse> {
        let webRequestParams = new WebRequestParameter("users/terms-of-use", JSON.stringify(body));
        return this.httpClientWrapper.post<TermsOfUse>(webRequestParams);
    }

    updateTermsOfUse(body: TermsOfUse ): Observable<boolean> {
      let webRequestParams = new WebRequestParameter("users/terms-of-use/"+body.id, JSON.stringify(body));
      return this.httpClientWrapper.put<boolean>(webRequestParams);
  }

}