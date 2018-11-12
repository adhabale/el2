import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { UpdateIndexFile, SaveComment } from "../entity/update-index-file";


@Injectable()
export class UpdateIndexFileService
{
    constructor(private httpClientWrapper: HttpClientWrapper){}

    getUpdateIndexFile(): Observable<UpdateIndexFile>
    {
        let webRequestParams = new WebRequestParameter("Indices");      
        return this.httpClientWrapper.get<UpdateIndexFile>(webRequestParams);
    }

    getComment(): Observable<SaveComment>
    {
        let webRequestParams = new WebRequestParameter("Indices/comment");      
        return this.httpClientWrapper.get<SaveComment>(webRequestParams);
    }
    
    saveIndex(body: UpdateIndexFile): any{
        let webRequestParams = new WebRequestParameter("Indices",JSON.stringify(body));
        return this.httpClientWrapper.post<any>(webRequestParams)
    }
    
    updateIndices(id:string,body: UpdateIndexFile ): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("Indices/"+id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(webRequestParams);
    }

    exportPDF(reportContent,reportTitle,reportText):Observable<boolean>{
        let body = {
            'ReportContent': reportContent,
            'ReportTitle': reportTitle,
            'ReportText': reportText
          }


        let webRequestParam = new WebRequestParameter('Indices/pdf', JSON.stringify(body));
        return this.httpClientWrapper.post<boolean>(webRequestParam);

    }

    saveComment(body: SaveComment): any{
        let webRequestParams = new WebRequestParameter("Indices/comment",JSON.stringify(body));
        return this.httpClientWrapper.post<any>(webRequestParams)
    }
}