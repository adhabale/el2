import { Injectable } from '@angular/core';
import { CanLoad, Router, ActivatedRoute, Route, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AppModel } from './app.model';
import { ConfigurationService } from './shared/configuration/configuration.service';

@Injectable()
export class AppAuthGuard implements CanLoad {

    private _appModel: AppModel;

    constructor(private _router: Router, private _route: ActivatedRoute, private configurationService: ConfigurationService) {
        this._appModel = new AppModel(configurationService);
    }

    canLoad(route: Route)
        : boolean | Observable<boolean> | Promise<boolean> {
        return true;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this.configurationService.loggedInUserInfo) {

            if (route.url[0].path === 'reports') {
                return state.url.includes(route.url[1].path) ? this.checkPageAccess(route.url[1].path) : false;
            } else {
                return state.url.includes(route.url[0].path) ? this.checkPageAccess(route.url[0].path) : false;
            }

        } else {
            return false;
        }
    }

    checkPageAccess(pageName: string): boolean {

        const pageAccessDetail = this._appModel.getPageDetails(pageName);
        return pageAccessDetail[0].allowedRoles.includes(this._appModel.getUserRole());
    }
}
