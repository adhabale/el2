import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { LossData } from '../entities/loss-data';
import { LossSubmission } from '../entities/loss-submission';


@Injectable()
export class LossDataSubmissionService {

    constructor(private httpClientWrapper:HttpClientWrapper)
    {
    }

    submitLossDetails(body: LossData): Observable<number> {
        let webRequestParams = new WebRequestParameter("incident", JSON.stringify(body));
        return this.httpClientWrapper.post<number>(webRequestParams);
    }

    getAllLossDetailsData():Observable<LossSubmission[]>
    {
        let webRequestParams=new WebRequestParameter("submission-history");
        return this.httpClientWrapper.get<LossSubmission[]>(webRequestParams);
    }

    getLossDetails(id:number):Observable<any>
    {
       
        let webRequestParams=new WebRequestParameter("submissionDetails/"+id);
        
        return this.httpClientWrapper.get<any>(webRequestParams);
    }

    getLossSubmissionDrowdownValues():Observable<any>
    {
        let webRequestParams=new WebRequestParameter("getLossSubmission");
        return this.httpClientWrapper.get<any>(webRequestParams);
    }

}