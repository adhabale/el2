import { Observable } from "rxjs";
import { Search } from "../eldm-filters/entities/search-input";
import { SearchOutput } from "../eldm-filters/entities/search-output";
import { SearchLossService } from "../services/el-data-management-service";


export class EldmMainModel {
    constructor(private searchLossService: SearchLossService) {

    }

    getSearchInformation(body: Search): Observable<SearchOutput> {
        return this.searchLossService.getSearchInformation(body);
    }

    downloadReport(reportType: string, extension: string, body: Search, isInternetExplorer: number): Observable<any> {
        return this.searchLossService.downloadReport(reportType, extension, body, isInternetExplorer);
    }
}