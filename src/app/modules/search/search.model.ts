import { Observable } from 'rxjs/Rx';
import { SearchService } from './search.service';
import { SearchSaveCriteria } from './entities/saveSearchCriteria';

export class SearchModel {
    searchCriteria: any;
    templateName : string;
    flagModified : boolean;
    private _searchService: SearchService;

    constructor(searchService: SearchService) {
        this._searchService = searchService;
    }
    getSearchData(): Observable<any> {
        return this._searchService.getSearchData();
    }
    getSearchTemplates(): Observable<any> {
        return this._searchService.getSearchTemplates();
    }
    getSearchCriteria(): Observable<any> {
        return this.searchCriteria;
    }
    setSearchCriteria(value) {
        this.searchCriteria = value;
    }
    saveSearchCriteria(saveSearchCriteria: SearchSaveCriteria): Observable<SearchSaveCriteria> {
        return this._searchService.saveSearchCriteria(saveSearchCriteria);
    }
    deleteSearchCriteria(id: string): Observable<boolean> {
        return this._searchService.deleteCriteria(id);
    }
    setModifiedflag(value :boolean){
        this.flagModified = value;
    }
    getModifiedFlag(){
        return this.flagModified;
    }
    
}

