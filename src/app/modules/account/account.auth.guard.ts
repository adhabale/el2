import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountModel } from './models/account.model';
import { AccountService } from './services/account.service';
import { LocalWebStorageService } from '../../shared/storage/local-web-storage.service';
import { AccountComponent } from './account.component';

@Injectable()
export class AccountChildAuthGuard implements CanActivateChild,CanDeactivate<AccountComponent> {

    private accountModel: AccountModel;

    constructor(private _router: Router, private _route: ActivatedRoute, private accountService: AccountService, private localWebStorage: LocalWebStorageService) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : boolean | Observable<boolean> | Promise<boolean> {
        if (this.accountModel.getSubscription())
            return true;
        else
            return false;
    }

    canDeactivate(component: AccountComponent):boolean {
        this.accountModel.clearAccountStore();
        this.accountModel.clearAccountSession();
        return true;
    }
}

