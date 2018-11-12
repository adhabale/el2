import { Observable } from 'rxjs/Rx';

export class LossDataSubmissionModel {
    readOnlyFlag: string;
    id: number;
    status: string;

    constructor() {
    }
    setValidationFormType(value) {
        this.readOnlyFlag = value;
    }

    getValidationFormType() {
        return this.readOnlyFlag;
    }

    setSubscriptionID(id) {
        this.id = id;
    }
    getSubscriptionID() {
        return this.id;
    }
    setStatus(status) {
        this.status = status;
    }
    getStatus() {
        return this.status;
    }

}