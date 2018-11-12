import { Observable } from "rxjs";
import { SearchLossService } from "../../services/el-data-management-service";
import { FormLookUp } from "../entities/formLookUp";

export class SearchFilterModel {

    constructor(private searchLossService: SearchLossService) {

    }

    //get master data of all dropdowns
    getlLossInformation(): Observable<FormLookUp> {
        return this.searchLossService.getlLossInformation();
    }
  
}