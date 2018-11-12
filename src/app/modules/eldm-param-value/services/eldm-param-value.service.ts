import { Injectable } from "@angular/core";
import { HttpClientWrapper } from "../../../shared/http/http-client-wrapper";
import { Observable } from "rxjs";
import { ParamLookUp } from "../entities/ParamLookUp";
import { WebRequestParameter } from "../../../shared/http/web-request-parameter";
import { OperationType } from "../entities/operation-type-model";
import { GeneralParamModel } from "../entities/general-param-model";
import { CategoryParamModel } from "../entities/category-param-model";
import { LossTypeModel } from "../entities/loss-type-model";
import { CauseModel } from "../entities/cause-param-model";
import { LossAmountRangeModel } from '../entities/lost-amount-range-model';
import { EavPatternModel } from '../entities/eav-pattern-model';
import { SaveModifiedInputModel } from '../entities/save-modified-input-model';


@Injectable()
export class ParamValueService {
    constructor(private httpClientWrapper: HttpClientWrapper) { }

    getParamValue(): Observable<ParamLookUp[]> {
        let paramValue = new WebRequestParameter("loss-parameter");
        return this.httpClientWrapper.get<ParamLookUp[]>(paramValue);
    }

    getOperationType(): Observable<OperationType[]> {
        let operationType = new WebRequestParameter("loss-parameter/getoperationalType");
        return this.httpClientWrapper.get<OperationType[]>(operationType);
    }

    getGeneralParam(id: string): Observable<GeneralParamModel[]> {
        let generalParam = new WebRequestParameter("loss-parameter/getgeneral/" + id);
        return this.httpClientWrapper.get<GeneralParamModel[]>(generalParam);
    }
    //general param services
    addGeneralParam(body: GeneralParamModel): Observable<string> {
        let generalParam = new WebRequestParameter("loss-parameter/general", JSON.stringify(body));
        return this.httpClientWrapper.post<string>(generalParam);
    }
    editGeneralParam(body: GeneralParamModel): Observable<boolean> {
        let generalParam = new WebRequestParameter("loss-parameter/general/" + body.id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(generalParam);
    }
    //category param services
    getCategoryParam(body: CategoryParamModel): Observable<CategoryParamModel[]> {
        let category = new WebRequestParameter("loss-parameter/getcategories/categoryTypeId/" + body.categoryTypeId + "/OperationTypeId/" + body.operationTypeId);
        return this.httpClientWrapper.get<CategoryParamModel[]>(category);
    }
    addCategoryParam(body: CategoryParamModel): Observable<string> {
        let category = new WebRequestParameter("loss-parameter/category", JSON.stringify(body));
        return this.httpClientWrapper.post<string>(category);
    }
    editCategoryParam(body: CategoryParamModel): Observable<boolean> {
        let category = new WebRequestParameter("loss-parameter/category/" + body.id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(category);
    }
    //loss type services
    getLossTypes(body: LossTypeModel): Observable<LossTypeModel[]> {
        let lossParam = new WebRequestParameter("loss-parameter/getcoverageType");
        return this.httpClientWrapper.get<LossTypeModel[]>(lossParam);
    }
    addLossType(body: LossTypeModel): Observable<string> {
        let lossParam = new WebRequestParameter("loss-parameter/coverageType/", JSON.stringify(body));
        return this.httpClientWrapper.post<string>(lossParam);
    }
    editLossType(body: LossTypeModel): Observable<boolean> {
        let lossParam = new WebRequestParameter("loss-parameter/coverageType/" + body.id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(lossParam);
    }
    //cause services
    getCauses(body: CauseModel): Observable<CauseModel[]> {
        let causeParam = new WebRequestParameter("loss-parameter/getcause");
        return this.httpClientWrapper.get<CauseModel[]>(causeParam);
    }
    addCauses(body: CauseModel): Observable<string> {
        let causeParam = new WebRequestParameter("loss-parameter/cause/", JSON.stringify(body));
        return this.httpClientWrapper.post<string>(causeParam);
    }
    editCauses(body: CauseModel): Observable<boolean> {
        let causeParam = new WebRequestParameter("loss-parameter/cause/" + body.id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(causeParam);
    }
    //lost amount ranges services
    getLostAmountRanges(): Observable<LossAmountRangeModel[]> {
        let rangeParam = new WebRequestParameter("loss-parameter/getlossamountranges");
        return this.httpClientWrapper.get<LossAmountRangeModel[]>(rangeParam);
    }
    addLostAmountRange(body: LossAmountRangeModel): Observable<string> {
        let rangeParam = new WebRequestParameter("loss-parameter/lossAmountRange/", JSON.stringify(body));
        return this.httpClientWrapper.post<string>(rangeParam);
    }
    editLostAmountRange(body: LossAmountRangeModel): Observable<boolean> {
        let rangeParam = new WebRequestParameter("loss-parameter/lossAmountRange/" + body.id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(rangeParam);
    }
    //depth category services
    getDepthCategory(): Observable<LossAmountRangeModel[]> {
        let category = new WebRequestParameter("loss-parameter/getdepthCategory");
        return this.httpClientWrapper.get<LossAmountRangeModel[]>(category);
    }
    addDepthCategory(body: LossAmountRangeModel): Observable<string> {
        let category = new WebRequestParameter("loss-parameter/depthCategory/", JSON.stringify(body));
        return this.httpClientWrapper.post<string>(category);
    }
    editDepthCategory(body: LossAmountRangeModel): Observable<boolean> {
        let category = new WebRequestParameter("loss-parameter/depthCategory/" + body.id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(category);
    }
    //Platform Asset Category services
    getPlatformAssetCategory(): Observable<LossAmountRangeModel[]> {
        let category = new WebRequestParameter("loss-parameter/getPlatformAssetCategory");
        return this.httpClientWrapper.get<LossAmountRangeModel[]>(category);
    }
    addPlatformAssetCategory(body: LossAmountRangeModel): Observable<string> {
        let category = new WebRequestParameter("loss-parameter/PlatformAssetCategory/", JSON.stringify(body));
        return this.httpClientWrapper.post<string>(category);
    }
    editPlatformAssetCategory(body: LossAmountRangeModel): Observable<boolean> {
        let category = new WebRequestParameter("loss-parameter/PlatformAssetCategory/" + body.id, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(category);
    }
    //get count of impacted rows
    getImpactedRowCount(body: EavPatternModel): Observable<number> {
        
        let getParam = new WebRequestParameter("loss-parameter/getCount",JSON.stringify(body));
        return this.httpClientWrapper.post<number>(getParam);
    }
    //Save modified rows
    saveModifiedParameter(body: SaveModifiedInputModel): Observable<number> {
        let saveParam = new WebRequestParameter("loss-parameter/saveModifiedParameter", JSON.stringify(body));
        return this.httpClientWrapper.post<number>(saveParam);
    }
}
