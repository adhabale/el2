import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ConfirmationModal } from './entities/confirmation-modal';
import { NotificationMessage } from '../common/entity/notification-message';
import { ParamLookUp } from './entities/ParamLookUp';
import { OperationType } from './entities/operation-type-model';
import { GeneralParamModel } from './entities/general-param-model';
import { CategoryParamModel } from './entities/category-param-model';
import { LossTypeModel } from './entities/loss-type-model';
import { CauseModel } from './entities/cause-param-model';
import { LossAmountRangeModel } from './entities/lost-amount-range-model';
import { ParamValueService } from './services/eldm-param-value.service';
import { ParamValueModel } from './model/param-value.model';
import { EldmParamConstant } from './eldm-param-constant';
import { EavPatternModel } from './entities/eav-pattern-model';
import { SaveModifiedInputModel } from './entities/save-modified-input-model';
import { Body } from '@angular/http/src/body';
import 'rxjs/add/operator/toPromise';
declare var $: any;

//declare component
@Component({
    selector: 'eldm-param-value',
    templateUrl: './eldm-param-value.component.html',
    styleUrls: ['./eldm-param-value.component.css']
})

//define class
export class EldmParamValueComponent implements OnInit {

    //declare model
    generalBody: GeneralParamModel;
    paramvalueModel: ParamValueModel;
    categoryBody: CategoryParamModel;
    lossTypeBody: LossTypeModel;
    causeBody: CauseModel;
    lostAmountRangeBody: CauseModel;
    lossAmountRangeModel: LossAmountRangeModel;
    eavPatternModel: EavPatternModel;
    saveModifiedInputModel: SaveModifiedInputModel = new SaveModifiedInputModel();
    confirmationModal: ConfirmationModal = new ConfirmationModal();

    //error msg object
    notificationMessage: NotificationMessage = new NotificationMessage();

    //local variable
    paramLookUp: ParamLookUp[] = [];
    operationType: any[] = [];
    pageOperationType: any[] = [];
    generalParamList: any[] = [];
    pageGeneralParamList: any[] = [];
    subTypeList: any;
    pageSubTypeList: any;

    //define form objects
    newValue: string;
    editValue: string = "";
    categoryName: string = "";
    editCategoryName: string = "";
    editSubValue: string = ""
    range: string = ""
    editRange: string = ""
    selectedValue: any;

    //other required objects
    i1: number;
    list: any = undefined;
    isUpdate: boolean = false;
    isUpdateCostCategory: boolean = false;
    isCostCategory: boolean = false;
    isSplitted: boolean = false;
    isOther: boolean = false;
    isUpstream: boolean = false;
    selectedUsp: string = "";
    selectedOperationType: number;
    selectedP: boolean = false
    selectedDs: boolean = false;
    newupstream: string;
    impactedRows: number = 0;
    insertRangeError: any;
    updateRangeError: any;
    udp = [
        { type: 1, name: "Upstream" },
        { type: 2, name: "Downstream" },
        { type: 3, name: "Power" }
    ];

    //Other objects

    generalSelectedItem: any;
    udpSelectedItem: any;
    rangeSelectedItem: any;
    popUpCase: any;


    //define constructor
    constructor(private paramValueService: ParamValueService) {
        this.paramvalueModel = new ParamValueModel(paramValueService);
    }

    //declare on init
    ngOnInit() {
        this.list = [];
        this.subTypeList = [];
        this.getParamValue();
    }

    //all get methods
    private getParamValue() {
        this.paramvalueModel.getParamValue().subscribe(response => { this.paramLookUp = response });
    }

    private getOperationTypes() {
        this.paramvalueModel.getOperationType().subscribe(response => { this.operationType = response });
    }

    private getGeneralParam(id: string) {
        this.paramvalueModel.getGeneralParam(id).subscribe(response => { this.generalParamList = response; })
    }

    private getCategoryParam(param: CategoryParamModel) {
        this.paramvalueModel.getCategoryParam(param).subscribe(response => { this.subTypeList = response; })
    }

    private getLossTypes(param: LossTypeModel) {
        this.paramvalueModel.getLossTypes(param).subscribe(response => {
            this.subTypeList = response.filter(item => item.operationTypeId == this.selectedOperationType);
        })
    }

    private getCauses(param: LossTypeModel) {
        this.paramvalueModel.getCauses(param).subscribe(response => {
            this.subTypeList = response.filter(item => item.operationTypeId == this.selectedOperationType);
        })
    }

    private getLostAmountRanges() {
        this.paramvalueModel.getLostAmountRanges().subscribe(response => {
            this.operationType = response;
        })
    }

    private getDepthCategory() {
        this.paramvalueModel.getDepthCategory().subscribe(response => {
            this.operationType = response;
        })
    }

    private getPlatformAssetCategory() {
        this.paramvalueModel.getPlatformAssetCategory().subscribe(response => {
            this.operationType = response;
        })
    }

    allowUpdate(val) {
        switch (this.popUpCase) {
            case 'general':
                if (val) {
                    this.isUpdate = true;
                    this.editValue = this.generalSelectedItem.name;
                    this.i1 = this.pageGeneralParamList.indexOf(this.generalSelectedItem);
                }
                else {
                    this.isUpdate = false;
                    this.generalSelectedItem = null;
                }
                break;
            case 'udp':
                if (val) {
                    this.isUpdate = true
                    this.editSubValue = this.udpSelectedItem.name;
                    this.i1 = this.pageSubTypeList.indexOf(this.udpSelectedItem);
                }
                else {
                    this.isUpdate = false
                    this.udpSelectedItem = null;
                }
                break;
            case 'range':
                if (val) {
                    this.isUpdateCostCategory = true;
                    this.commonEditCostCategory(this.rangeSelectedItem);
                }
                else {
                    this.isUpdateCostCategory = false;
                    this.rangeSelectedItem = null;
                }
                break;
            default:
                break;
        }

        $('#impactedRowsModal').modal('hide');
    }

    onCheckImpactedRows(item: any): Promise<number> {
        this.eavPatternModel = new EavPatternModel();
        this.eavPatternModel.attributeId = this.selectedValue.id;
        this.eavPatternModel.attributeName = this.selectedValue.name;
        this.eavPatternModel.attributeValueId = item.id;
        switch (this.popUpCase) {
            case 'general':
                this.eavPatternModel.attributeValue = item.name;
                break;
            case 'udp':
                this.eavPatternModel.attributeValue = item.name;
                break;
            case 'range':
                this.eavPatternModel.attributeValue = ((item.category) ? (item.category) : item.name);
                break;
            default:
                break;
        }
        return this.paramvalueModel.getImpactedRowCount(this.eavPatternModel).toPromise();
    }

    onEdit(item) {
        if (item) {
            this.onCheckImpactedRows(item).then(
                (count) => {
                    if (count > 0) {
                        this.impactedRows = count;
                        this.generalSelectedItem = item;
                        $('#impactedRowsModal').modal('show');
                        return;
                    }
                    this.isUpdate = true
                    this.editValue = item.name;
                    this.i1 = this.pageGeneralParamList.indexOf(item);
                },
                (error) => {

                }
            );

        }
    }

    onEditSub(item) {
        if (item) {
            this.onCheckImpactedRows(item).then(
                (count) => {
                    if (count > 0) {
                        this.impactedRows = count;
                        this.udpSelectedItem = item;
                        $('#impactedRowsModal').modal('show');
                        return;
                    }
                    this.isUpdate = true
                    this.editSubValue = item.name;
                    this.i1 = this.pageSubTypeList.indexOf(item);
                },
                (error) => {

                }
            );

        }

    }

    commonEditCostCategory(item) {
        this.categoryName = null;
        this.range = null;
        this.insertRangeError = false;
        this.updateRangeError = false;
        this.isUpdateCostCategory = true;
        var rangeCases = EldmParamConstant.RangeCases;
        var selectCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(this.selectedValue.name.toLocaleLowerCase()) > -1);
        if (selectCase.length > 0) {
            var customCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(this.selectedValue.name.toLocaleLowerCase()) > -1)[0].case;
            if (customCase) {
                switch (customCase) {
                    case 1:
                        this.editCategoryName = item.name.substr(0, item.name.indexOf('.')).trim();
                        this.editRange = item.name.substr(item.name.indexOf('.') + 1, item.name.length).trim();
                        this.i1 = this.pageOperationType.indexOf(item);
                        console.log(this.i1);
                        break;
                    case 2:
                        this.editCategoryName = item.category.trim();
                        this.editRange = item.name.trim();
                        this.i1 = this.pageOperationType.indexOf(item);
                        console.log(this.i1);
                        break;
                    case 3:
                        this.editCategoryName = item.name.substr(0, item.name.indexOf('<') > -1 ? item.name.indexOf('<') : item.name.indexOf('>')).trim();
                        this.editRange = item.name.substr(item.name.indexOf('<') > -1 ? item.name.indexOf('<') : item.name.indexOf('>'), item.name.length).trim();
                        this.i1 = this.pageOperationType.indexOf(item);
                        console.log(this.i1);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    onEditCostCategory(item) {
        if (item) {
            this.onCheckImpactedRows(item).then(
                (count) => {
                    if (count > 0) {
                        this.impactedRows = count;
                        this.rangeSelectedItem = item;
                        $('#impactedRowsModal').modal('show');
                        return;
                    }
                    this.commonEditCostCategory(item);
                },
                (error) => {

                }
            );

        }

    }

    onSaveModifiedRows(confirm, item: any): Promise<number> {

        this.saveModifiedInputModel.attributeId = this.selectedValue.id;
        this.saveModifiedInputModel.attributeName = this.selectedValue.name;
        this.saveModifiedInputModel.attributeValueId = item.id;

        switch (this.popUpCase) {
            case 'general':
            case 'udp':
                this.saveModifiedInputModel.oldAttributeValue = item.name;
                break;
            case 'range':
                this.saveModifiedInputModel.oldAttributeValue = (item.category) ? (item.category + '.' + item.name) : (item.name);

                //this.saveModifiedInputModel.oldAttributeValue = (this.editCategoryName + '.' + this.editRange);
                break;
            default:
                break;
        }
        switch (this.popUpCase) {
            case 'general':
                this.saveModifiedInputModel.newAttributeValue = this.editValue;
                break;
            case 'udp':
                this.saveModifiedInputModel.newAttributeValue = this.editSubValue;
                break;
            case 'range':
                this.saveModifiedInputModel.newAttributeValue = (this.editCategoryName + '.' + this.editRange);
                break;
            default:
                break;
        }
        this.saveModifiedInputModel.allowAuditUpdate = confirm;
        return this.paramvalueModel.saveModifiedParameter(this.saveModifiedInputModel).toPromise();
    }

    rowitem: any;
    rowindex: number;

    confirmUpdate(item, index, editVal, editCategory?) {
        this.rowitem = item;
        this.rowindex = index;
        var isExists;
        var rangeValue: any;
        var categoryValue: any;
        switch (this.popUpCase) {
            case 'general':
                isExists = this.generalParamList.filter(it => it.name.toLocaleLowerCase().trim() == editVal.toLocaleLowerCase().trim());
                break;
            case 'udp':
                isExists = this.subTypeList.filter(it => it.name.toLocaleLowerCase().trim() == editVal.toLocaleLowerCase().trim());
                break;
            case 'range':
                isExists = this.operationType.filter(
                    result => {
                        if (result.id != item.id) {
                            if (result.name.includes('.') && item.id != result.id) {
                                var dotIndex: string = result.name.indexOf('.');
                                rangeValue = result.name.substring(dotIndex + 1, result.name.length).replace(/\s/g, '');
                                categoryValue = result.name.substring(0, dotIndex);
                                return rangeValue.toLocaleLowerCase().trim().replace(/\s/g, '') == editVal.toLocaleLowerCase().trim().replace(/\s/g, '') || categoryValue.toLocaleLowerCase().trim() == editCategory.toLocaleLowerCase().trim();
                            }
                            else if (result.name.includes('<')) {
                                var characterIndex: any = result.name.indexOf('<') || result.name.indexOf('>');
                                rangeValue = result.name.substring(characterIndex, result.name.length).replace(/\s/g,'');
                                categoryValue = result.name.substring(0, characterIndex).replace(/\s/g,'');
                                return rangeValue.toLocaleLowerCase().trim().replace(/\s/g,'')== editVal.toLocaleLowerCase().trim().replace(/\s/g,'') || categoryValue.toLocaleLowerCase().trim().replace(/\s/g,'') == editCategory.toLocaleLowerCase().trim().replace(/\s/g,'');
                                // return rangeValue.toLocaleLowerCase().trim().replace(/\s/g,'') == editVal.toLocaleLowerCase().trim().replace(/\s/g,'')|| categoryValue.toLocaleLowerCase().trim().replace(/\s/g,'') == editCategory.toLocaleLowerCase().trim().replace(/\s/g,'');
                            }
                            else if ( result.name.includes('>')) 
                            {
                                var characterIndex: any =  result.name.indexOf('>');
                                rangeValue = result.name.substring(characterIndex, result.name.length).replace(/\s/g,'');
                                categoryValue = result.name.substring(0, characterIndex).replace(/\s/g,'');
                                return rangeValue.toLocaleLowerCase().trim().replace(/\s/g,'')== editVal.toLocaleLowerCase().trim().replace(/\s/g,'') || categoryValue.toLocaleLowerCase().trim().replace(/\s/g,'') == editCategory.toLocaleLowerCase().trim().replace(/\s/g,'');
                                // return rangeValue.toLocaleLowerCase().trim().replace(/\s/g,'') == editVal.toLocaleLowerCase().trim().replace(/\s/g,'')|| categoryValue.toLocaleLowerCase().trim().replace(/\s/g,'') == editCategory.toLocaleLowerCase().trim().replace(/\s/g,'');
                            }
                            else {
                                return result.name.toLocaleLowerCase().trim().replace(/\s/g, '') == editVal.toLocaleLowerCase().trim().replace(/\s/g, '') || result.category.toLocaleLowerCase().trim() == editCategory.toLocaleLowerCase().trim();
                            }
                        }
                    });
                break;
            default:
                break;
        }
        if (isExists.length > 0) {
            this.notificationMessage.errorMessage = "Value already exists!"
        }
        else
            $("#confirmUpdateModal").modal('show');

    }

    completeUpdate(confirm) {
        switch (this.popUpCase) {
            case 'general':
                this.onSaveModifiedRows(confirm, this.rowitem).then(
                    (count) => {
                        this.onUpdate(this.rowitem, this.rowindex);
                    },
                    (error) => {
                    }
                );
                break;
            case 'udp':
                this.onSaveModifiedRows(confirm, this.rowitem).then(
                    (count) => {
                        this.onUpdateSub(this.rowitem, this.rowindex);
                    },
                    (error) => {
                    }
                );
                break;
            case 'range':
                this.onSaveModifiedRows(confirm, this.rowitem).then(
                    (count) => {
                        this.onUpdateCostCategory(this.rowitem, this.rowindex);
                    },
                    (error) => {
                    }
                );
                break;
            default:
                break;
        }
        $("#confirmUpdateModal").modal('hide');
    }

    onUpdate(item, i) {

        this.generalBody = new GeneralParamModel();
        this.generalBody.id = item.id;
        this.generalBody.attributeId = item.attributeId;
        this.generalBody.name = this.editValue;
        this.generalBody.displayName = this.editValue;

        this.paramvalueModel.editGeneralParam(this.generalBody)
            .subscribe(response => {
                if (response) {
                    this.isUpdate = false;
                    item.name = this.editValue;
                    item.displayName = this.editValue;
                    this.notificationMessage.successMessage = `Loss parameter ‘` + this.saveModifiedInputModel.oldAttributeValue + `’ value updated to ‘` + item.name + `’ successfully! ‘` + this.impactedRows + `’ record(s) updated on master database.`;
                }
            })

    }

    onUpdateSub(item, i) {

        var val = this.selectedValue;
        var udpCases = EldmParamConstant.UdpCases;
        var selectCase = udpCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1);
        if (selectCase.length > 0) {
            var customCase = udpCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1)[0].case;
            if (customCase) {
                switch (customCase) {
                    case 1:
                        this.lossTypeBody = new LossTypeModel();
                        this.lossTypeBody.id = item.id;
                        this.lossTypeBody.name = this.editSubValue;
                        this.lossTypeBody.description = this.editSubValue;
                        this.lossTypeBody.operationTypeId = this.selectedOperationType;

                        this.paramvalueModel.editLossType(this.lossTypeBody)
                            .subscribe(response => {
                                if (response) {
                                    this.isUpdate = false;
                                    item.name = this.editSubValue;
                                    item.description = this.editSubValue;
                                    this.notificationMessage.successMessage = `Loss parameter ‘` + this.saveModifiedInputModel.oldAttributeValue + `’ value updated to ‘` + item.name + `’ successfully! ‘` + this.impactedRows + `’ record(s) updated on master database.`;
                                }
                            });
                        break;
                    case 2:
                        this.causeBody = new CauseModel();
                        this.causeBody.id = item.id;
                        this.causeBody.name = this.editSubValue;
                        this.causeBody.description = this.editSubValue;
                        this.causeBody.operationTypeId = this.selectedOperationType;

                        this.paramvalueModel.editCause(this.causeBody)
                            .subscribe(response => {
                                if (response) {
                                    this.isUpdate = false;
                                    item.name = this.editSubValue;
                                    item.description = this.editSubValue;
                                    this.notificationMessage.successMessage = `Loss parameter ‘` + this.saveModifiedInputModel.oldAttributeValue + `’ value updated to ‘` + item.name + `’ successfully! ‘` + this.impactedRows + `’ record(s) updated on master database.`;
                                }
                            });
                        break;
                    case 3:
                        this.categoryBody = new CategoryParamModel();
                        this.categoryBody.id = item.id;
                        this.categoryBody.name = this.editSubValue;
                        this.categoryBody.description = this.editSubValue;
                        this.categoryBody.operationTypeId = this.selectedOperationType;
                        var categoryName = this.selectedValue.name;
                        var catTypeId = categoryName.substr(categoryName.length - 1);
                        if (!isNaN(parseInt(catTypeId))) {
                            this.categoryBody.categoryTypeId = parseInt(catTypeId);
                        }
                        this.paramvalueModel.editCategoryParam(this.categoryBody)
                            .subscribe(response => {
                                if (response) {
                                    this.isUpdate = false;
                                    item.name = this.editSubValue;
                                    item.description = this.editSubValue;
                                    this.notificationMessage.successMessage = `Loss parameter ‘` + this.saveModifiedInputModel.oldAttributeValue + `’ value updated to ‘` + item.name + `’ successfully! ‘` + this.impactedRows + `’ record(s) updated on master database.`;
                                }
                            });
                        break;
                }
            }
        }

    }

    onUpdateCostCategory(item, i) {

        this.lossAmountRangeModel = new LossAmountRangeModel();
        this.lossAmountRangeModel.id = item.id;
        this.lossAmountRangeModel.name = this.editCategoryName;
        this.lossAmountRangeModel.category = this.editRange;

        var rangeCases = EldmParamConstant.RangeCases;
        var selectCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(this.selectedValue.name.toLocaleLowerCase()) > -1);
        if (selectCase.length > 0) {
            var customCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(this.selectedValue.name.toLocaleLowerCase()) > -1)[0].case;
            if (customCase) {
                switch (customCase) {
                    case 1:
                        this.paramvalueModel.editLostAmountRange(this.lossAmountRangeModel)
                            .subscribe(response => {
                                if (response) {
                                    this.isUpdateCostCategory = false;
                                    //item.category = this.editCategoryName;
                                    item.name = this.editCategoryName + '. ' + this.editRange;
                                    this.notificationMessage.successMessage = `Loss parameter ‘` + this.saveModifiedInputModel.oldAttributeValue + `’ value updated to ‘` + item.name + `’ successfully! ‘` + this.impactedRows + `’ record(s) updated on master database.`;
                                }
                            });
                        console.log(this.i1);
                        break;
                    case 2:
                        this.paramvalueModel.editDepthCategory(this.lossAmountRangeModel)
                            .subscribe(response => {
                                if (response) {
                                    this.isUpdateCostCategory = false;
                                    item.category = this.editCategoryName;
                                    item.name = this.editRange;
                                    this.notificationMessage.successMessage = `Loss parameter ‘` + this.saveModifiedInputModel.oldAttributeValue + `’ value updated to ‘` + (item.category + ' . ' + item.name) + `’ successfully! ‘` + this.impactedRows + `’ record(s) updated on master database.`;
                                }
                            });
                        console.log(this.i1);
                        break;
                    case 3:
                        this.paramvalueModel.editPlatformAssetCategory(this.lossAmountRangeModel)
                            .subscribe(response => {
                                if (response) {
                                    this.isUpdateCostCategory = false;
                                    //item.category = this.editCategoryName;
                                    item.name = this.editCategoryName + ' ' + this.editRange;
                                    this.notificationMessage.successMessage = `Loss parameter ‘` + this.saveModifiedInputModel.oldAttributeValue + `’ value updated to ‘` + item.name + `’ successfully! ‘` + this.impactedRows + `’ record(s) updated on master database.`;
                                }
                            });
                        console.log(this.i1);
                        break;
                    default:
                        break;
                }
            }
        }

    }

    onAdd(newVal) {
        if (newVal) {
            //check if not exists in current list
            var isExists = this.generalParamList.filter(item => item.name.toLocaleLowerCase().trim() == newVal.toLocaleLowerCase().trim());
            if (isExists.length > 0) {
                this.notificationMessage.errorMessage = "Value already exists!"
            }
            else {
                this.generalBody = new GeneralParamModel();
                this.generalBody.name = newVal;
                this.generalBody.displayName = newVal;
                this.generalBody.attributeId = this.selectedValue.id;
                this.paramvalueModel.addGeneralParam(this.generalBody)
                    .subscribe(response => {
                        if (response) {
                            this.newValue = null;
                            this.generalBody.id = response;
                            this.generalParamList.push(this.generalBody);
                            this.pageGeneralParamList.push(this.generalBody);
                            this.notificationMessage.successMessage = "Value has been added successfully!"
                        }
                    })
            }
        }

    }

    onAddSub(newVal) {
        if (newVal) {
            //check if not exists in current list
            var isExists = this.subTypeList.filter(item => item.name.toLocaleLowerCase().trim() == newVal.toLocaleLowerCase().trim());
            if (isExists.length > 0) {
                this.notificationMessage.errorMessage = "Value already exists!"
            }
            else {
                var val = this.selectedValue;
                var udpCases = EldmParamConstant.UdpCases;
                var selectCase = udpCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1);
                if (selectCase.length > 0) {
                    var customCase = udpCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1)[0].case;
                    if (customCase) {
                        switch (customCase) {
                            case 1:
                                this.lossTypeBody = new LossTypeModel();
                                this.lossTypeBody.name = newVal;
                                this.lossTypeBody.description = newVal;
                                this.lossTypeBody.operationTypeId = this.selectedOperationType;
                                this.paramvalueModel.addLossType(this.lossTypeBody)
                                    .subscribe(response => {
                                        if (response) {
                                            this.newupstream = null;
                                            this.lossTypeBody.id = response;
                                            this.subTypeList.push(this.lossTypeBody);
                                            this.pageSubTypeList.push(this.lossTypeBody);
                                            this.notificationMessage.successMessage = "Value has been added successfully!"
                                        }
                                    })
                                break;
                            case 2:
                                this.causeBody = new CauseModel();
                                this.causeBody.name = newVal;
                                this.causeBody.description = newVal;
                                this.causeBody.operationTypeId = this.selectedOperationType;
                                this.paramvalueModel.addCause(this.causeBody)
                                    .subscribe(response => {
                                        if (response) {
                                            this.newupstream = null;
                                            this.causeBody.id = response;
                                            this.subTypeList.push(this.causeBody);
                                            this.pageSubTypeList.push(this.causeBody);
                                            this.notificationMessage.successMessage = "Value has been added successfully!"
                                        }
                                    })
                                break;
                            case 3:
                                this.categoryBody = new CategoryParamModel();
                                this.categoryBody.name = newVal;
                                this.categoryBody.description = newVal;
                                this.categoryBody.operationTypeId = this.selectedOperationType;
                                var categoryName = this.selectedValue.name;
                                var catTypeId = categoryName.substr(categoryName.length - 1);
                                if (!isNaN(parseInt(catTypeId))) {
                                    this.categoryBody.categoryTypeId = parseInt(catTypeId);
                                }
                                this.paramvalueModel.addCategoryParam(this.categoryBody)
                                    .subscribe(response => {
                                        if (response) {
                                            this.newupstream = null;
                                            this.categoryBody.id = response;
                                            this.subTypeList.push(this.categoryBody);
                                            this.pageSubTypeList.push(this.categoryBody);
                                            this.notificationMessage.successMessage = "Value has been added successfully!"
                                        }
                                    })
                                break;
                            default:
                                break;

                        }
                    }
                }
            }
        }

    }

    onAddCostCategory(category, range) {
        //check if not exists in current list
        var rangeValue: string;
        var categoryValue: string;
        var isExists = this.operationType.filter(
            item => {
                if (item.name.includes('.')) {
                    var dotIndex: string = item.name.indexOf('.');
                    rangeValue = item.name.substring(dotIndex + 1, item.name.length).replace(/\s/g, '');
                    categoryValue = item.name.substring(0, dotIndex);
                    return rangeValue.toLocaleLowerCase().trim().replace(/\s/g, '') == range.toLocaleLowerCase().trim().replace(/\s/g, '') || categoryValue.toLocaleLowerCase().trim() == category.toLocaleLowerCase().trim()
                }
                else if (item.name.includes('<')) {
                    var characterIndex: any = item.name.indexOf('<') ;
                    rangeValue = item.name.substring(characterIndex, item.name.length).replace(/\s/g,'');
                    categoryValue=item.name.substring(0,characterIndex);
                    return rangeValue.toLocaleLowerCase().trim().replace(/\s/g,'') == range.toLocaleLowerCase().trim().replace(/\s/g,'') || categoryValue.toLocaleLowerCase().trim().replace(/\s/g,'') == category.toLocaleLowerCase().trim().replace(/\s/g,'')
                  
                }
                else if (item.name.includes('>')) {
                    var characterIndex: any =  item.name.indexOf('>');
                    rangeValue = item.name.substring(characterIndex, item.name.length).replace(/\s/g,'');
                    categoryValue=item.name.substring(0,characterIndex);
                    return rangeValue.toLocaleLowerCase().trim().replace(/\s/g,'') == range.toLocaleLowerCase().trim().replace(/\s/g,'') || categoryValue.toLocaleLowerCase().trim().replace(/\s/g,'') == category.toLocaleLowerCase().trim().replace(/\s/g,'')
                  
                }
                else {
                    return item.category.toLocaleLowerCase().trim() == category.toLocaleLowerCase().trim()
                        || item.name.toLocaleLowerCase().trim().replace(/\s/g, '') == range.toLocaleLowerCase().trim().replace(/\s/g, '')
                }
            });



        if (isExists.length > 0) {
            this.notificationMessage.errorMessage = "Value already exists!"
        }
        else {

            this.lossAmountRangeModel = new LossAmountRangeModel();
            this.lossAmountRangeModel.name = this.categoryName;
            this.lossAmountRangeModel.category = this.range;

            var rangeCases = EldmParamConstant.RangeCases;
            var selectCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(this.selectedValue.name.toLocaleLowerCase()) > -1);
            if (selectCase.length > 0) {
                var customCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(this.selectedValue.name.toLocaleLowerCase()) > -1)[0].case;
                if (customCase) {
                    switch (customCase) {
                        case 1:
                            this.paramvalueModel.addLostAmountRange(this.lossAmountRangeModel)
                                .subscribe(response => {
                                    if (response) {
                                        this.lossAmountRangeModel.id = response;
                                        this.lossAmountRangeModel.category = null;
                                        this.lossAmountRangeModel.name = this.categoryName + '. ' + this.range;
                                        this.operationType.push(this.lossAmountRangeModel);
                                        this.pageOperationType.push(this.lossAmountRangeModel);
                                        this.categoryName = null;
                                        this.range = null;
                                        this.notificationMessage.successMessage = "Value has been added successfully!"
                                    }
                                });
                            break;
                        case 2:
                            this.paramvalueModel.addDepthCategory(this.lossAmountRangeModel)
                                .subscribe(response => {
                                    if (response) {
                                        this.lossAmountRangeModel.category = this.categoryName;
                                        this.lossAmountRangeModel.name = this.range;
                                        this.lossAmountRangeModel.id = response;
                                        this.operationType.push(this.lossAmountRangeModel);
                                        this.pageOperationType.push(this.lossAmountRangeModel);
                                        this.categoryName = null;
                                        this.range = null;
                                        this.notificationMessage.successMessage = "Value has been added successfully!"
                                    }
                                });
                            break;
                        case 3:
                            this.paramvalueModel.addPlatformAssetCategory(this.lossAmountRangeModel)
                                .subscribe(response => {
                                    if (response) {
                                        this.lossAmountRangeModel.id = response;
                                        this.lossAmountRangeModel.category = null;
                                        this.lossAmountRangeModel.name = this.categoryName + '. ' + this.range;
                                        this.operationType.push(this.lossAmountRangeModel);
                                        this.pageOperationType.push(this.lossAmountRangeModel);
                                        this.categoryName = null;
                                        this.range = null;
                                        this.notificationMessage.successMessage = "Value has been added successfully!"
                                    }
                                });
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    cancel() {
        this.isUpdate = false;
        this.isUpdateCostCategory = false;
        this.insertRangeError = false;
        this.updateRangeError = false;
    }

    cancelCostCat() {
        this.isUpdate = false;
        this.isUpdateCostCategory = false;
        this.insertRangeError = false;
        this.updateRangeError = false;
    }

    onSubSelect(item) {

        var val = this.selectedValue;
        var udpCases = EldmParamConstant.UdpCases;
        var selectCase = udpCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1);
        if (selectCase.length > 0) {
            var customCase = udpCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1)[0].case;
            if (customCase) {
                switch (customCase) {
                    case 1:
                        this.lossTypeBody = new LossTypeModel();
                        this.lossTypeBody.operationTypeId = item.unprotectedId;
                        this.getLossTypes(this.lossTypeBody);
                        this.isUpdate = false;
                        this.isUpstream = true;
                        break;
                    case 2:
                        this.causeBody = new CauseModel();
                        this.causeBody.operationTypeId = item.unprotectedId;
                        this.getCauses(this.causeBody);
                        this.isUpdate = false;
                        this.isUpstream = true;
                        break;
                    case 3:
                        var categoryName = this.selectedValue.name;
                        var catTypeId = categoryName.substr(categoryName.length - 1);
                        if (!isNaN(parseInt(catTypeId))) {
                            this.categoryBody = new CategoryParamModel();
                            this.categoryBody.categoryTypeId = parseInt(catTypeId);
                            this.categoryBody.operationTypeId = item.unprotectedId;
                            this.getCategoryParam(this.categoryBody);
                            this.isUpdate = false;
                            this.isUpstream = true;
                        }
                        break;
                    default:
                        break;

                }
            }
        }

    }

    onSelect() {
        //clear fields
        this.newValue = null;
        this.newupstream = null;
        this.categoryName = null;
        this.range = null;
        this.isUpdate = false;
        this.isUpdateCostCategory = false;
        this.isUpstream = false;
        this.list = this.udp;//these are dynamic values
        this.notificationMessage.successMessage = undefined;
        this.notificationMessage.errorMessage = undefined;
        //
        var paramType = EldmParamConstant.ParamType;
        var val = this.selectedValue;
        this.selectedUsp = undefined;
        var ParamCase = paramType.filter(item => item.case == val.parameterType)[0].case;
        switch (ParamCase) {
            case 1:
                this.isCostCategory = false;
                this.isSplitted = false;
                this.popUpCase = "general";
                this.getGeneralParam(val.id);
                break;
            case 2:
                this.isSplitted = true;
                this.isCostCategory = false;
                this.popUpCase = "udp";
                this.getOperationTypes();
                break;
            case 3:
                var val = this.selectedValue;
                this.isCostCategory = true;
                this.isSplitted = false;
                this.popUpCase = "range";
                var rangeCases = EldmParamConstant.RangeCases;
                var selectCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1);
                if (selectCase.length > 0) {
                    var customCase = rangeCases.filter(x => x.table.toLocaleLowerCase().indexOf(val.name.toLocaleLowerCase()) > -1)[0].case;
                    if (customCase) {
                        switch (customCase) {
                            case 1:
                                this.getLostAmountRanges();
                                break;
                            case 2:
                                this.getDepthCategory();
                                break;
                            case 3:
                                this.getPlatformAssetCategory();
                            default:
                                break;
                        }
                    }
                }
                break;
            default:
                break;

        }
    }

    onPageChange1(pageItem) {
        setTimeout(() => {
            this.isUpdate = false;
            this.pageGeneralParamList = pageItem;
        });
    }

    onPageChange2(pageItem) {
        setTimeout(() => {
            this.isUpdate = false;
            this.pageSubTypeList = pageItem;
        });
    }

    onPageChange3(pageItem) {
        setTimeout(() => {
            this.isUpdateCostCategory = false;
            this.pageOperationType = pageItem;
        });
    }

    //validation section
    _range(type, control) {
        switch (this.selectedValue.name) {
            case 'Cost Category':
            case 'Platform Asset Category':
                switch (type) {
                    case 'insert':
                        var reg1 = /^[$](\s+)?[0-9]+(\.[0-9]+)?(\s+)?[-](\s+)?[0-9]+(\.[0-9]+)?[M|B]$/;
                        var reg2 = /^[$](\s+)?[0-9]+(\.[0-9]+)?[M|B][+]$/;
                        var reg3 = /^[<|>](\s+)?[0-9]+(\.[0-9]+)?[M|B]$/;
                        var reg4 = /^[<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[M|B]$/;
                        var reg5 = /^[<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[M|B][+]$/;
                        var reg6 = /^[<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[B][N]$/;
                        //var reg = /^[$][0-9]+(\.[0-9]+)?[-][0-9]+(\.[0-9]+)?[M|B]|[<|>][0-9]+(\.[0-9]+)?[M|B]|[$][0-9]+(\.[0-9]+)?[M|B][+]|[<|>][$][0-9]+(\.[0-9]+)?[M|B]$/;//without space validation
                        //var reg = /^([$](\s+)?[0-9]+(\.[0-9]+)?(\s+)?[-](\s+)?[0-9]+(\.[0-9]+)?[M|B])|([<|>](\s+)?[0-9]+(\.[0-9]+)?[M|B])|([$](\s+)?[0-9]+(\.[0-9]+)?[M|B][+])|([<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[M|B])$/;//include spave validation
                        if (reg1.test(control.value.trim()) || reg2.test(control.value.trim()) || reg3.test(control.value.trim()) || reg4.test(control.value.trim()) || reg5.test(control.value.trim()) || reg6.test(control.value.trim())) {
                            this.insertRangeError = false;
                        } else {
                            this.insertRangeError = true;
                        }
                        break;
                    case 'update':
                        var reg1 = /^[$](\s+)?[0-9]+(\.[0-9]+)?(\s+)?[-](\s+)?[0-9]+(\.[0-9]+)?[M|B]$/;
                        var reg2 = /^[$](\s+)?[0-9]+(\.[0-9]+)?[M|B][+]$/;
                        var reg3 = /^[<|>](\s+)?[0-9]+(\.[0-9]+)?[M|B]$/;
                        var reg4 = /^[<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[M|B]$/;
                        var reg5 = /^[<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[M|B][+]$/;
                        var reg6 = /^[<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[B][N]$/;
                        // var reg = /^[$][0-9]+(\.[0-9]+)?[-][0-9]+(\.[0-9]+)?[M|B]|[<|>][0-9]+(\.[0-9]+)?[M|B]|[$][0-9]+(\.[0-9]+)?[M|B][+]|[<|>][$][0-9]+(\.[0-9]+)?[M|B]$/;//without space validation
                        //var reg = /^[$](\s+)?[0-9]+(\.[0-9]+)?(\s+)?[-](\s+)?[0-9]+(\.[0-9]+)?[M|B]|[<|>](\s+)?[0-9]+(\.[0-9]+)?[M|B]|[$](\s+)?[0-9]+(\.[0-9]+)?[M|B][+]|[<|>](\s+)?[$](\s+)?[0-9]+(\.[0-9]+)?[M|B]$/;//include space validation
                        if (reg1.test(control.value.trim()) || reg2.test(control.value.trim()) || reg3.test(control.value.trim()) || reg4.test(control.value.trim()) || reg5.test(control.value.trim()) || reg6.test(control.value.trim())) {
                            this.updateRangeError = false;
                        } else {
                            this.updateRangeError = true;
                        }
                        break;
                }
                break;
            case 'Depth Category':
                switch (type) {
                    case 'insert':
                        var reg = /^[0-9]+(\s+)?[-](\s+)?[0-9]+$/;
                        var reg2 = /^[0-9]+?[+]$/;
                        var reg3 = /^[0-9 ,]+(\s+)?[-](\s+)?[0-9 ,]+$/;

                        if (!reg.test(control.value.trim()) && !reg2.test(control.value.trim()) && !reg3.test(control.value.trim())) {
                            this.insertRangeError = true;
                        } else {
                            this.insertRangeError = false;
                        }
                        break;
                    case 'update':
                        var reg = /^[0-9]+(\s+)?[-](\s+)?[0-9]+$/;
                        var reg2 = /^[0-9]+?[+]$/;
                        var reg3 = /^[0-9 ,]+(\s+)?[-](\s+)?[0-9 ,]+$/;
                        if (!reg.test(control.value.trim()) && !reg2.test(control.value.trim()) && !reg3.test(control.value.trim())) {
                            this.updateRangeError = true;
                        } else {
                            this.updateRangeError = false;
                        }
                        break;
                }
                break;
            default:
                break;
        }


    }

    disableEditButton(val) {
        if (val.category == "TBA" || val.name == "Downstream" || val.name == "Power" || val.name == "Upstream") {
            let styles = {
                'color': 'currentColor',
                'cursor': 'not-allowed',
                'opacity': '0.5',
                'text-decoration': 'none',
                'pointer-events': 'none'
            };
            return styles;
        }
    }
    setUpstream(up) {
        if (up) {
            let styles = {
                'float': 'right'
            };
            return styles;
        }

    }
    disableInput(selectedValue) {
        if (selectedValue.name == "UpDownStream")
            return true;
    }

}
