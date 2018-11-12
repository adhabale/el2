import { Component, OnInit, DoCheck } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';
import { AccountModel } from '../models/account.model';
import { Account } from '../entity/account';
import { AccountEventEmitter } from '../account.events';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';

@Component({
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.css']
})

export class CreateAccountComponent implements OnInit ,DoCheck{

   

    selectedRoute: string;

    showUserMaintenanceTab: boolean;

    isUserMaintenanceDisabled: boolean = false;

    private accountModel: AccountModel;

    
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private localWebStorage: LocalWebStorageService, private accountService: AccountService, private accountEvent: AccountEventEmitter) {
        this.accountModel = new AccountModel(accountService, localWebStorage)
    }

    ngOnInit() {

        var account = new Account();
        this.selectedRoute = "subscription-info";

        if(this.accountModel.getAccount()){
            account=this.accountModel.getAccount();
        }else{  
            account.setDefaultValue();
        this.accountModel.setAccount(account);
        }

        if(this.router.url.includes('users'))
        this.showUserMaintenanceTab=true;

        this.accountEvent.showUserMaintenanceTabOnCreateSubscription.subscribe(() => this.showUserMaintenance());
        this.accountEvent.disableUserMaintenanceTabOnCreateSubscription.subscribe((value) => this.isUserMaintenanceTabDisabled(value));
        this.accountEvent.newSubscriptionAddedEvent.subscribe(() => this.update());
      
        this.router.navigate([this.selectedRoute], { relativeTo: this.activatedRoute });
    }


    ngDoCheck(){
        if(this.router.url.includes('account-info')){
        this.selectedRoute="account-info";
        }
        else
          if  (this.router.url.includes('subscription-info')){
            this.selectedRoute="subscription-info";
        }
        else if(this.router.url.includes('users')){
            this.selectedRoute="users";

        }
    }
    onNavigation(route) {
        this.selectedRoute = route;
        this.router.navigate([this.selectedRoute], { relativeTo: this.activatedRoute });
    }

    showUserMaintenance() {
        this.showUserMaintenanceTab = true;
    }

    isUserMaintenanceTabDisabled(value: boolean) {
        this.isUserMaintenanceDisabled = value;
    }

    update() {

        this.selectedRoute = "subscription-info";

        var account = new Account();
        account.setDefaultValue();
        this.accountModel.setAccount(account);
        
        this.router.navigate([this.selectedRoute], { relativeTo: this.activatedRoute });
        //,, { relativeTo: this.activatedRoute }
    }
}
