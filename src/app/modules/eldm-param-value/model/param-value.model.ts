import { ParamValueService } from "../services/eldm-param-value.service";
import { Observable } from "rxjs";
import { ParamLookUp } from "../entities/ParamLookUp";
import { OperationType } from "../entities/operation-type-model";
import { GeneralParamModel } from "../entities/general-param-model";
import { CategoryParamModel } from "../entities/category-param-model";
import { LossTypeModel } from "../entities/loss-type-model";
import { CauseModel } from "../entities/cause-param-model";
import { LossAmountRangeModel } from '../entities/lost-amount-range-model';
import { EavPatternModel } from '../entities/eav-pattern-model';
import { SaveModifiedInputModel } from "../entities/save-modified-input-model";

export class ParamValueModel {
    constructor(private paramValueService: ParamValueService) {

    }

    getParamValue(): Observable<ParamLookUp[]> {
        return this.paramValueService.getParamValue();
    }

    getOperationType(): Observable<OperationType[]> {
        return this.paramValueService.getOperationType();
    }
    getGeneralParam(id: string): Observable<GeneralParamModel[]> {
        return this.paramValueService.getGeneralParam(id);
    }
    //general param method
    addGeneralParam(body: GeneralParamModel): Observable<string> {
        return this.paramValueService.addGeneralParam(body);
    }

    editGeneralParam(body: GeneralParamModel): Observable<boolean> {
        return this.paramValueService.editGeneralParam(body);
    }
    //category method
    getCategoryParam(body: CategoryParamModel): Observable<CategoryParamModel[]> {
        return this.paramValueService.getCategoryParam(body);
    }
    addCategoryParam(body: CategoryParamModel): Observable<string> {
        return this.paramValueService.addCategoryParam(body);
    }
    editCategoryParam(body: CategoryParamModel): Observable<boolean> {
        return this.paramValueService.editCategoryParam(body);
    }
    //loss type method
    getLossTypes(body: LossTypeModel): Observable<LossTypeModel[]> {
        return this.paramValueService.getLossTypes(body);
    }
    addLossType(body: LossTypeModel): Observable<string> {
        return this.paramValueService.addLossType(body);
    }
    editLossType(body: LossTypeModel): Observable<boolean> {
        return this.paramValueService.editLossType(body);
    }
    //causes method
    getCauses(body: CauseModel): Observable<CauseModel[]> {
        return this.paramValueService.getCauses(body);
    }
    addCause(body: CauseModel): Observable<string> {
        return this.paramValueService.addCauses(body);
    }
    editCause(body: CauseModel): Observable<boolean> {
        return this.paramValueService.editCauses(body);
    }
    //lost amount range method
    getLostAmountRanges(): Observable<LossAmountRangeModel[]> {
        return this.paramValueService.getLostAmountRanges();
    }
    addLostAmountRange(body: LossAmountRangeModel): Observable<string> {
        return this.paramValueService.addLostAmountRange(body);
    }
    editLostAmountRange(body: LossAmountRangeModel): Observable<boolean> {
        return this.paramValueService.editLostAmountRange(body);
    }
    //depth Category method
    getDepthCategory(): Observable<LossAmountRangeModel[]> {
        return this.paramValueService.getDepthCategory();
    }
    addDepthCategory(body: LossAmountRangeModel): Observable<string> {
        return this.paramValueService.addDepthCategory(body);
    }
    editDepthCategory(body: LossAmountRangeModel): Observable<boolean> {
        return this.paramValueService.editDepthCategory(body);
    }
    //Platform Asset Category method
    getPlatformAssetCategory(): Observable<LossAmountRangeModel[]> {
        return this.paramValueService.getPlatformAssetCategory();
    }
    addPlatformAssetCategory(body: LossAmountRangeModel): Observable<string> {
        return this.paramValueService.addPlatformAssetCategory(body);
    }
    editPlatformAssetCategory(body: LossAmountRangeModel): Observable<boolean> {
        return this.paramValueService.editPlatformAssetCategory(body);
    }
    //get impacted row count
    getImpactedRowCount(body: EavPatternModel): Observable<number> {
        return this.paramValueService.getImpactedRowCount(body);
    }
    //get impacted row count
    saveModifiedParameter(body: SaveModifiedInputModel): Observable<number> {
        return this.paramValueService.saveModifiedParameter(body);
    }
}