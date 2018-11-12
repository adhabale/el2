import { FormLookUp } from "../eldm-filters/entities/formLookUp";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Rx';
import { HttpClientWrapper } from "../../../shared/http/http-client-wrapper";
import { WebRequestParameter } from "../../../shared/http/web-request-parameter";
import { Search } from "../eldm-filters/entities/search-input";
import { SearchOutput } from "../eldm-filters/entities/search-output";

@Injectable()
export class SearchLossService {

    constructor(private httpClientWrapper: HttpClientWrapper) { }

    //get loss dropdowns data
    getlLossInformation(): Observable<FormLookUp> {
        const webRequestParam = new WebRequestParameter("loss-information");
        return this.httpClientWrapper.get<FormLookUp>(webRequestParam);
    }

    //get search results
    getSearchInformation(body: Search): Observable<SearchOutput> {
        const webRequestParam = new WebRequestParameter("loss-data/eldm/", JSON.stringify(body));
        return this.httpClientWrapper.post<SearchOutput>(webRequestParam);
    }

    //get download
    downloadReport(reportType: string, extension: string, body: Search, isInternetExplorer: number): Observable<any> {
        let webRequestParams = new WebRequestParameter('eldm/' + reportType + '/export/' + isInternetExplorer + '/' + extension, JSON.stringify(body));
        return this.httpClientWrapper.post<any>(webRequestParams);
    }

}
