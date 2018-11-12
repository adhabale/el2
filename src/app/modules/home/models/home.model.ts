
import { Observable } from 'rxjs/Rx';
import { Announcement } from '../entity/announcement';
import { Document } from '../entity/document';
import { HomeService } from '../services/home.services';
import {LogDocument} from "../entity/logDocument";


export class HomeModel{

    constructor(private homeService: HomeService) {
    }

    getAnnouncements(): Observable<Announcement[]> {
        return this.homeService.getAnnouncements();
    }

    getDocuments(): Observable<Document[]> {
        return this.homeService.getDocuments();
    }

    getDocumentContent(filename:string): Observable<Document> {
        return this.homeService.getDocumentContent(filename);
    }

    logContactUs(email: any): Observable<any> {
        return this.homeService.logContactUs(email);
    }

    logGetDocument(fileName: string, moduleName: string): Observable<any> {
        return this.homeService.logGetDocument(fileName,moduleName);
    }
}