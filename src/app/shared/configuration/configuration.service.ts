import { Injectable, Injector, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { InMemoryStorageService } from '../storage/in-memory-storage.service';
import { LocalWebStorageService } from '../storage/local-web-storage.service';
import { WebRequestParameter } from '../http/web-request-parameter';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { } from './role-matrix.json';
import { Local } from 'protractor/built/driverProviders';
import { TokenService } from '../token/token.service';

@Injectable()
export class ConfigurationService {

  constructor(private http: HttpClient, private tokenService: TokenService,
        private _storage: InMemoryStorageService, private _localStorage: LocalWebStorageService,
        @Inject(DOCUMENT) private document) {
  }

  getConfigurations() {

    this.getUserRoles();

    return new Promise((resolve, reject) => {

      const webRequestParameter = new WebRequestParameter('/configs');
      this.setHeaders(webRequestParameter);

      this.http
        .get<any>(webRequestParameter.url, { headers: webRequestParameter.headers, observe: 'response' })
        .subscribe(result => {
          this._storage.setItem("webApiUrl", result.body.webApiUrl);
          this._storage.setItem("loggedInUserInfoEncrypted", result.headers.get("loggedInUserInfo"));
          this._storage.setItem("loggedInUserInfo", result.body.loggedInUserInfo);
          this._storage.setItem("accessToken", result.body.accessToken);
          this._storage.setItem("contactUsUrl", result.body.contactUsUrl);
          this._storage.setItem("serviceDeskUrl", result.body.serviceDeskUrl);
          this._storage.setItem("licensesUrl", result.body.licensesUrl);
          this._storage.setItem("privacyPolicyUrl", result.body.privacyPolicyUrl);          
          resolve(true);
        },
          (errorResponse) => {
            resolve(true);
            if (errorResponse.error !== undefined && errorResponse.error.code === 'UnAuthorized') {
              this.tokenService.redirectToForbidden();
            }
          });
    });
  }

  private setHeaders(webRequestParameter: WebRequestParameter): void {

    webRequestParameter.headers = webRequestParameter.headers || new HttpHeaders();
    webRequestParameter.headers = webRequestParameter.headers.set('Content-Type', 'application/json');
    webRequestParameter.headers = webRequestParameter.headers.set('Accept', 'application/json');
  }

  private getUserRoles() {

    this.http.get<any>('./assets/role-matrix.json').subscribe(result => {
      this._localStorage.set('roleMatrix', result);
    });
  }

  get hostUrl(): string {
    return this.document.location.protocol + '//' + this.document.location.hostname + ':' + this.document.location.port;
  }

  get apiUrl(): string {
    return this._storage.getItem("webApiUrl");
  }

  get loggedInUserInfo(): string {
    return this._storage.getItem("loggedInUserInfo");
  }
  
  get loggedInUserInfoEncrypted(): string {
    return this._storage.getItem("loggedInUserInfoEncrypted");
  }

  get licensesUrll() {
    return this._storage.getItem("licensesUrl");
  }

  get privacyPolicyUrl() {
    return this._storage.getItem("privacyPolicyUrl");
  }

  get contactUsUrl() {
    return this._storage.getItem("contactUsUrl");
  }

  get serviceDeskUrl() {
    return this._storage.getItem("serviceDeskUrl");
  }

  get roleMatrix() {
    return this._localStorage.get('roleMatrix');
  }
}
