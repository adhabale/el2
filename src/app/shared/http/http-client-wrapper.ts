import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client-service';
import { WebRequestParameter } from './web-request-parameter';
import { TokenService } from '../token/token.service';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class HttpClientWrapper {

    constructor(private httpClientService: HttpClientService, private _tokenService: TokenService, private _config: ConfigurationService) {
    }

    get<T>(requestParams: WebRequestParameter): Observable<T> {
        this.appendRequestParams(requestParams);
        return this.httpClientService.get<T>(requestParams);
    }

    post<T>(requestParams: WebRequestParameter): Observable<T> {
        this.appendRequestParams(requestParams);
        return this.httpClientService.post<T>(requestParams);
    }

    put<T>(requestParams: WebRequestParameter): Observable<T> {
        this.appendRequestParams(requestParams);
        return this.httpClientService.put<T>(requestParams);
    }

    delete<T>(requestParams: WebRequestParameter): Observable<T> {
        this.appendRequestParams(requestParams);
        return this.httpClientService.delete<T>(requestParams);
    }

    private appendRequestParams(requestParams: WebRequestParameter) {
        requestParams.url = this._config.apiUrl + requestParams.url;
        requestParams.headers = new HttpHeaders();

        requestParams.headers = requestParams.headers.set("Cache-Control", "no-cache");
        requestParams.headers = requestParams.headers.set("Pragma", "no-cache");
        requestParams.headers = requestParams.headers.set('Authorization', 'Bearer ' + this._tokenService.getAccessToken());
        requestParams.headers = requestParams.headers.set('LoggedInUserInfo', this._config.loggedInUserInfoEncrypted);
    }
}