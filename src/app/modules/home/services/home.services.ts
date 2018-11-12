

import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { Announcement } from '../entity/announcement';
import { Document } from '../entity/document';
import { LogDocument } from '../entity/logDocument';

@Injectable()
export class HomeService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getAnnouncements(): Observable<Announcement[]> {
      let webRequestParams = new WebRequestParameter("announcements");      
      return this.httpClientWrapper.get<Announcement[]>(webRequestParams);
    }
    getDocuments(): Observable<Document[]> {
      let webRequestParams = new WebRequestParameter("documents");      
      return this.httpClientWrapper.get<Document[]>(webRequestParams);
    }
    getDocumentContent(filename:string): Observable<Document> {
      let webRequestParams = new WebRequestParameter("documents/"+filename);      
      return this.httpClientWrapper.get<Document>(webRequestParams);
    }

    logContactUs(email: any): Observable<any> {
      const webRequestParam = new WebRequestParameter("audit/contact-us", JSON.stringify(email));
      return this.httpClientWrapper.post<any[]>(webRequestParam);
  }

  
  logGetDocument(fileName: string, moduleName: string): Observable<any> {
    let logDoc=new LogDocument(fileName,moduleName);
    let webRequestParams = new WebRequestParameter("audit/ref-doc/", JSON.stringify(logDoc));
    return this.httpClientWrapper.post<any>(webRequestParams);
}
}












