import { Injectable } from '@angular/core';
import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter'
import { UserDetails } from '../entities/user-details';
import { LogData } from '../entities/log-data';
import { SearchCriteria } from '../entities/search-criteria';
import {ActivityLogReport} from '../entities/activity-log-report';
import { LongDateFormatKey } from 'moment';


@Injectable()
export class ActivityLogDataService {

  constructor(private httpClientWrapper: HttpClientWrapper) {
  }

  getUserDetails(username: string): Observable<UserDetails[]> {
    let webRequestParams = new WebRequestParameter("users/" + username + "/activityUser");
    return this.httpClientWrapper.get<UserDetails[]>(webRequestParams);
  }

  getActionDropDownValues(): Observable<any[]> {
    let webRequestParams = new WebRequestParameter("reports/activity/action");
    return this.httpClientWrapper.get<any[]>(webRequestParams);
  }

  getModeDropDownValues(): Observable<any[]> {
    let webRequestParams = new WebRequestParameter("reports/activity/module");
    return this.httpClientWrapper.get<any[]>(webRequestParams);
  }

  getActivitylogsData(logData:SearchCriteria): Observable<ActivityLogReport>{
    let webRequestParams = new WebRequestParameter("reports/activityLog",JSON.stringify(logData));
    return this.httpClientWrapper.post<ActivityLogReport>(webRequestParams);
  }
  getReportGeneration(reportData: SearchCriteria): Observable<any>
  {
    let webRequestParams = new WebRequestParameter("export/activityLog",JSON.stringify(reportData));
    return this.httpClientWrapper.post<any>(webRequestParams);
  }

  /* LogSearchCriteria(body: SearchCriteria ): Observable<any[]>
  {
    let webRequestParams= new WebRequestParameter("reports/activityLog ");
    return this.httpClientWrapper.post<any[]>(webRequestParams);
  } */




}
