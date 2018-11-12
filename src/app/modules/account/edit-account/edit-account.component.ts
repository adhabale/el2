import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountModel } from '../models/account.model';
import { AccountService } from '../services/account.service';
import { Account } from '../entity/account';
import { AccountEventEmitter } from "../account.events";
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';

@Component({
    templateUrl: './edit-account.component.html',
    styleUrls: ['./edit-account.component.css']
})

export class EditAccountComponent implements OnInit {

    selectedRoute: string;

    accountId:string;

    private accountModel: AccountModel;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private localWebStorage: LocalWebStorageService, private accountService: AccountService, private accountEvent:AccountEventEmitter) {
        this.accountModel = new AccountModel(accountService, localWebStorage)
    }

    ngOnInit() {

        let account = new Account();
        this.selectedRoute="subscription-info";
        account.setDefaultValue();
        account.accountId = this.activatedRoute.snapshot.params.accountId;
        this.accountId=account.accountId;
        this.accountModel.setAccount(account);
        this.router.navigate(['subscription-info'], { relativeTo: this.activatedRoute });

        this.activatedRoute.params.subscribe(params => {
           
           
            if(params['accountId'] != this.accountId)
            this.update();
        })
    }

    ngDoCheck() {
      if (this.router.url.includes('account-info')) {
        this.selectedRoute = "account-info";
      }
      else
        if (this.router.url.includes('subscription-info')) {
          this.selectedRoute = "subscription-info";
        }
        else
          if (this.router.url.includes('users')) {
            this.selectedRoute = "users";
          }
    }

    onNavigation(route) {
        this.selectedRoute=route;
        this.router.navigate([this.selectedRoute], { relativeTo: this.activatedRoute });   
    }

    update() {
        let account = new Account();
        this.selectedRoute="subscription-info";
        account.setDefaultValue();
        account.accountId = this.activatedRoute.snapshot.params.accountId;
        this.accountId=account.accountId;
        this.accountModel.setAccount(account);
        this.router.navigate(['subscription-info'], { relativeTo: this.activatedRoute });
    }
}
