import { Component, OnInit, DoCheck } from '@angular/core'
import { Subscription } from '../../entity/subscription';
import { AccountModel } from '../../models/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AccountConstants } from '../../account.const';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';

@Component({
    templateUrl: './subscription-info.component.html',
    styleUrls: ['./subscription-info.component.css']
})

export class SubscriptionInfoComponent implements OnInit,DoCheck {

    subscription: Subscription;

    private accountModel: AccountModel;

    constructor(private localWebStorage: LocalWebStorageService, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    ngOnInit(): void {

        let subscription = this.accountModel.getSubscription();

        if (this.activatedRoute.parent.snapshot.params.accountId == undefined || (subscription.primaryParty != undefined && subscription.primaryParty.name != undefined)) {
            this.subscription = subscription;
        }
        else {
            this.getSubscription(subscription.subscriptionId);
        }
    }

    ngDoCheck():void {
        //this.ngOnInit();
    }

    onContinue(): void {
        this.router.navigate(['account-info'], { relativeTo: this.activatedRoute.parent });
    }

    private getSubscription(subscriptionId: string) {

        this.accountModel.getSubscriptionInfo(subscriptionId)
            .subscribe(result => {
                this.subscription = result;
                this.accountModel.setSubscription(this.subscription);
            }, error => {

            });
    }
}
