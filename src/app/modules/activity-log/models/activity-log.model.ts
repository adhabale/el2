import { Observable } from 'rxjs/Rx';
import { ActivityLogDataService } from "../services/activity-log-data.service";
import { UserDetails } from '../entities/user-details';
import { SearchCriteria } from '../entities/search-criteria';
import {ActivityLogReport} from '../entities/activity-log-report';


export class ActivityLogModel{
    constructor(private activityLogDataService:ActivityLogDataService){}

    getUserDetails(searchName:string) : Observable<UserDetails[]>{
        return this.activityLogDataService.getUserDetails(searchName);
    }

    getActionValues() :Observable<any[]>{
        return this.activityLogDataService.getActionDropDownValues();
    }

    getModeValues() : Observable<any[]>{
        return this.activityLogDataService.getModeDropDownValues();
    }

    getActivitylogsData(logData:SearchCriteria): Observable<ActivityLogReport>{
        return this.activityLogDataService.getActivitylogsData(logData);
    }
    getReportGeneration(reportData:SearchCriteria): Observable<any>{
        return this.activityLogDataService.getReportGeneration(reportData);
    }
}