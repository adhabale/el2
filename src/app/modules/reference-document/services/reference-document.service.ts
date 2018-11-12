import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { ReferenceDocument } from '../entities/reference-document';

@Injectable()
export class ReferenceDocumentService {
    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getAllDocuments(): Observable<ReferenceDocument[]> {
        let webRequestParams = new WebRequestParameter("documents");
        return this.httpClientWrapper.get<ReferenceDocument[]>(webRequestParams);
    }


    addDocument(body: ReferenceDocument): Observable<ReferenceDocument> {
        let webRequestParams = new WebRequestParameter("documents/reference-doc", JSON.stringify(body));
        return this.httpClientWrapper.post<ReferenceDocument>(webRequestParams);
    }

    updateDocument(body: ReferenceDocument): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("documents/reference-doc/" + body.filename, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(webRequestParams);
    }

    deleteDocument(id: string, fileName: string): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("documents/reference-doc/" + id);
        return this.httpClientWrapper.delete<boolean>(webRequestParams);
    }

    logDeleteDocument(fileName: string, extension: string): Observable<any> {
        let webRequestParams = new WebRequestParameter("audit/reference-doc/" + fileName + "/" + extension);
        return this.httpClientWrapper.post<any>(webRequestParams);
    }

    getDocumentContent(filename: string): Observable<ReferenceDocument> {
        let webRequestParams = new WebRequestParameter("documents/" + filename);
        return this.httpClientWrapper.get<ReferenceDocument>(webRequestParams);
    }

}