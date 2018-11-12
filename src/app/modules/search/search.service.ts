
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClientWrapper } from '../../shared/http/http-client-wrapper';
import { WebRequestParameter } from '../../shared/http/web-request-parameter';
import { SearchSaveCriteria } from './entities/saveSearchCriteria';

@Injectable()
export class SearchService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getSearchData(): Observable<any> {
        let webRequestParams = new WebRequestParameter("search/filters");
        return this.httpClientWrapper.get<any>(webRequestParams);
    }
    getSearchTemplates(): Observable<any> {
        let webRequestParams = new WebRequestParameter("search/templates");
        return this.httpClientWrapper.get<any>(webRequestParams);
    }
    saveSearchCriteria(saveSearchCriteria: SearchSaveCriteria): Observable<SearchSaveCriteria> {
        let webRequestParams = new WebRequestParameter("search/save", JSON.stringify(saveSearchCriteria));
        return this.httpClientWrapper.post<SearchSaveCriteria>(webRequestParams);
    }
    
    logSavedSearchData(search: any): Observable<any> {
        let webRequestParams = new WebRequestParameter("audit/search", JSON.stringify(search));
        return this.httpClientWrapper.post<any>(webRequestParams);
    }

    deleteCriteria(id: string): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("search/" + id + "/delete");
        return this.httpClientWrapper.delete<boolean>(webRequestParams);
    }
}