import { Observable } from 'rxjs/Rx';

export class LossDataSubmissionModel {
    readOnlyFlag: boolean;
    constructor() {
    }
    setReadOnlyFlag(value) {
        this.readOnlyFlag = value;
    }

    getReadOnlyFlag() {
        return this.readOnlyFlag;
    }
}