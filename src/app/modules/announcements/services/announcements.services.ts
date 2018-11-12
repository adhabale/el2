import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { Announcement } from '../entities/announcement';


@Injectable()
export class AnnouncementService{
    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getAnnouncements(): Observable<Announcement[]> {
        let webRequestParams = new WebRequestParameter("announcements/all");      
        return this.httpClientWrapper.get<Announcement[]>(webRequestParams);
      }

      addAnnouncement(body: Announcement ): Observable<Announcement> {
        let webRequestParams = new WebRequestParameter("announcements", JSON.stringify(body));
        return this.httpClientWrapper.post<Announcement>(webRequestParams);
    }

    updateAnnouncement(body: Announcement ): Observable<boolean> {
      let webRequestParams = new WebRequestParameter("announcements/"+body.id, JSON.stringify(body));
      return this.httpClientWrapper.put<boolean>(webRequestParams);
  }

    deleteAnnouncement(id: string ): Observable<boolean> {
      let webRequestParams = new WebRequestParameter("announcements/"+id);
      return this.httpClientWrapper.delete<boolean>(webRequestParams);
  }
}