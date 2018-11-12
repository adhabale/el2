import { Injectable, Injector, Inject } from "@angular/core";
import { WebRequestParameter } from "../../shared/http/web-request-parameter";
import { HttpClient } from "@angular/common/http";
import { RequestOptions, Headers } from "@angular/http";

@Injectable()
export class LogOutService {

    constructor(private _injector: Injector) {
    }

    signOut() {
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        options.headers.append("X-XSRF-TOKEN", "sign-out");
        let http = this._injector.get(HttpClient);
        return http.post('log-out',options);
    }
}