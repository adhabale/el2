import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { BatchJob } from '../entity/batch-job';


@Injectable()
export class BatchJobService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    postFile(body: BatchJob ): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("documents", JSON.stringify(body));
        return this.httpClientWrapper.post<boolean>(webRequestParams);
    }

}