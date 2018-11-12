import { Observable } from 'rxjs/Rx';
import { LossDataSubmissionService } from '../services/loss-data-submission.service';
import { LossData } from "../entities/loss-data";
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { LossSubmission } from '../entities/loss-submission';

export class LossDataSubmissionModel
{
    readOnlyFlag: boolean;
    constructor(private lossDataSubmissionService:LossDataSubmissionService,private localWebStorageService:LocalWebStorageService){

    }

    setReadOnlyFlag(value) {
        this.readOnlyFlag = value;
        this.localWebStorageService.set("flag",value);
    }

    getReadOnlyFlag():boolean {
        //return this.readOnlyFlag;
        return this.localWebStorageService.get("flag");
    }
    setIncidentId(id:number)
    {
        this.localWebStorageService.set("incidentID",id);
    }

    getIncidentId():number
    {
        return this.localWebStorageService.get("incidentID");
    }
    setLossType(lossType:string):void{
        this.localWebStorageService.set("lType",lossType);
    }

    getLossType():string{
        return this.localWebStorageService.get("lType");
    }

    clearFlag()
    {
        this.localWebStorageService.remove("flag");
    }
    

    postLossData(lossData:LossData):Observable<number>{
        return this.lossDataSubmissionService.submitLossDetails(lossData);
    }

    getAllLossData():Observable<LossSubmission[]>{
        return this.lossDataSubmissionService.getAllLossDetailsData();
    }

    getLossData(id:number):Observable<any>{
        return this.lossDataSubmissionService.getLossDetails(id);
    }

    getLossSubmissionDrowDownValues():Observable<any>
    {
        return this.lossDataSubmissionService.getLossSubmissionDrowdownValues();
    }

    setDropDownValues(values:any)
    {
        this.localWebStorageService.set('DropDownValue',values);
    }

    getDropDownValues() {
        return this.localWebStorageService.get<any>('DropDownValue');
    }
}