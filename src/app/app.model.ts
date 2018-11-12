import { Observable } from 'rxjs/Rx';
import { ConfigurationService } from './shared/configuration/configuration.service';

export class AppModel {

    _configurationService: ConfigurationService

    constructor( private configurationService: ConfigurationService) {
        this._configurationService=configurationService;
    }

    

    isAdminLoggedIn():boolean{
        if(this._configurationService.loggedInUserInfo) {
           let user=JSON.parse(this._configurationService.loggedInUserInfo);
           if(user.Role=='Admin') 
            return true;
            else
            return false;
        }
        else
        return false;
    }

    isSMELoggedIn():boolean{
        if(this._configurationService.loggedInUserInfo) {
           let user=JSON.parse(this._configurationService.loggedInUserInfo);
           if(user.Role=='SME') 
            return true;
            else
            return false;
        }
        else
        return false;
    }

    isSubscriberLoggedIn():boolean {
        if(this._configurationService.loggedInUserInfo) {
            let user=JSON.parse(this._configurationService.loggedInUserInfo);
            if(user.Role=='Subscriber') 
             return true;
             else
             return false;
         }
         else
         return false;
    }

    getUserRole():string {
        if(this._configurationService.loggedInUserInfo) {
            let user=JSON.parse(this._configurationService.loggedInUserInfo);
           return user.Role;
         }
         else
         return null;
    }

    getPageDetails(page) {
        let roleMatrix:any=this._configurationService.roleMatrix;
        return roleMatrix.roleMatrix.pageAccessLevels.filter(pageDetail => pageDetail.pageName==page)
    }

}
