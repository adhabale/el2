import { HttpHeaders } from '@angular/common/http';

export class WebRequestParameter {
    url: string;
    params?: string;
    headers?: HttpHeaders;

    constructor(url: string, params?: string, headers?: HttpHeaders) {
        this.url = url;
        this.params = params;
        this.headers = headers;
    }
}