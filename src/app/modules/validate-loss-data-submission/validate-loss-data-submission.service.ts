import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { HttpClientWrapper } from "../../shared/http/http-client-wrapper";
import { WebRequestParameter } from "../../shared/http/web-request-parameter";
import { FormLookUp } from "./shared/entities/formLookUp";
import { FormFilter } from "./shared/entities/formFilter";
import { LatLong } from "./shared/entities/latLong";
import { LossSubmission } from "../loss-data-submission/entities/loss-submission";
import { YearIndexLookUp } from "./shared/entities/yearIndexLookUp";
import { SourceSubscriptionData } from "./shared/entities/sourceSubscirptionData";
import { LossRangesData } from "./shared/entities/lossRangesData";

@Injectable()
export class ValidateLossDataSubmissionService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getAllLossDetailsData(): Observable<LossSubmission[]> {
        let webRequestParams = new WebRequestParameter("submission-history");
        return this.httpClientWrapper.get<LossSubmission[]>(webRequestParams);
    }

    getAdditionalLossInformation(): Observable<FormLookUp> {
        const webRequestParam = new WebRequestParameter("loss-information");
        return this.httpClientWrapper.get<FormLookUp>(webRequestParam);
    }

    getAllData(incidentId: number): Observable<FormFilter> {
        const webRequestParam = new WebRequestParameter(`submissionDetails/${incidentId}`);
        return this.httpClientWrapper.get<FormFilter>(webRequestParam);
    }

    updateLossSubmissionData(incidentId: number,latitude: string, longitude: string, country: string,  body: FormFilter): Observable<number> {
        const webRequestParam = new WebRequestParameter(`${body.incidentId}/incident/${latitude}/${longitude}/${country}`, JSON.stringify(body));
        return this.httpClientWrapper.put<number>(webRequestParam);
    }

    getLatLongData(location: string, country: string): Observable<LatLong> {
        const webRequestParam = new WebRequestParameter(`${location}/${country}/geographic`);
        return this.httpClientWrapper.get<LatLong>(webRequestParam);
    }

    getAllIndices(): Observable<YearIndexLookUp[]> {
        const webRequestParam = new WebRequestParameter("Indices");
        return this.httpClientWrapper.get<YearIndexLookUp[]>(webRequestParam);
    }

    getSourceSubscriptionData(name: string): Observable<SourceSubscriptionData[]> {
        const webRequestParam = new WebRequestParameter("accounts/sourceSubscription/"+name);
        return this.httpClientWrapper.get<SourceSubscriptionData[]>(webRequestParam);
    }

    getLossRanges(): Observable<LossRangesData[]> {
        const webRequestParam = new WebRequestParameter("loss-ranges");
        return this.httpClientWrapper.get<LossRangesData[]>(webRequestParam);
    }

    getRoles(): Observable<any[]> {
        const webRequestParam = new WebRequestParameter("roles");
        return this.httpClientWrapper.get<any[]>(webRequestParam);
    }

}