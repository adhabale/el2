import { Observable } from 'rxjs/Rx';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';
import { ValidateLossDataSubmissionService } from '../../validate-loss-data-submission.service';
import { LossSubmission } from '../../../loss-data-submission/entities/loss-submission';
import { Injectable } from '@angular/core';

export class ValidateLossDataSubmissionModel {

    readOnlyFlag: string;
    id: number;
    status: string;
    displayName: string;
    submissionDate: string;
   
    constructor(public validateLossDataSubmissionService:ValidateLossDataSubmissionService, public localWebStorageService: LocalWebStorageService) {        
    }


    getAllLossData():Observable<LossSubmission[]>{
        return this.validateLossDataSubmissionService.getAllLossDetailsData();
    }

    setValidationFormType(value) {
        this.localWebStorageService.set("lossType", value);
        //this.readOnlyFlag = value;
    }

    getValidationFormType():string {
        return this.localWebStorageService.get("lossType");
        //return this.readOnlyFlag;
    }

    setSubscriptionID(id) {
        this.id = id;
    }
    getSubscriptionID() {
        return this.id;
    }
    setIncidentId(id: number) {
        this.localWebStorageService.set("incidentID", id);
    }

    getIncidentId(): number {
        return this.localWebStorageService.get("incidentID");
    }

    setStatus(status) {
        this.status = status;
    }
    getStatus() {
        return this.status;
    }

    setDisplayName(name) {
        this.localWebStorageService.set("createdBy", name);
    }

    getDisplayName(): string {
        return this.localWebStorageService.get("createdBy");
    }

    setDateOfSub(subDate) {
        this.localWebStorageService.set("createdOn", subDate);
    }

    getDateOfSub(): string {
        return this.localWebStorageService.get("createdOn");
    }

}