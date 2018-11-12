import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { UserRole } from './user-role';
import { HttpClientWrapper } from '../http/http-client-wrapper';
import { WebRequestParameter } from '../http/web-request-parameter';

@Injectable()

export class UserRoleService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getUserProfiles(): Observable<UserRole[]> {
        let webRequestParams = new WebRequestParameter("roles");        
        return this.httpClientWrapper.get<UserRole[]>(webRequestParams);
    }
}