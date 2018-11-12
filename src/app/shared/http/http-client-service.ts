import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {WebRequestParameter} from './web-request-parameter';

@Injectable()

export class HttpClientService {

    constructor(private http: HttpClient) { }

    get<T>(requestParams:WebRequestParameter): Observable<T> {
        const httpHeaders = this.setHeaders(requestParams.headers);
        return this.http.get<T>(requestParams.url, httpHeaders);
    }

    post<T>(requestParams:WebRequestParameter): Observable<T> {
        const httpHeaders = this.setHeaders(requestParams.headers);
        return this.http.post<T>(requestParams.url,requestParams.params,httpHeaders);
    }

    put<T>(requestParams:WebRequestParameter): Observable<T> {
        const httpHeaders = this.setHeaders(requestParams.headers);
        return this.http.put<T>(requestParams.url, requestParams.params, httpHeaders);
    }

    delete<T>(requestParams:WebRequestParameter): Observable<T> {
        const httpHeaders = this.setHeaders(requestParams.headers);
        return this.http.delete<T>(requestParams.url, httpHeaders);
    }

    private setHeaders(headers: HttpHeaders | null): object {
        
        headers = headers || new HttpHeaders();
    
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Accept', 'application/json');
    
        return {
            headers: headers
        }
    }
}