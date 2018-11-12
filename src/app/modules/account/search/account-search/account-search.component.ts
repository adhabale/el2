import { Component, OnDestroy, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AccountSummary } from '../../entity/account-summary';
import { AccountModel } from '../../models/account.model';
import { Subscription } from '../../entity/subscription';
import { SearchParams } from '../../../common/entity/search-params';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';
import { AccountEventEmitter } from '../../account.events';
@Component({
    selector: "account-search",
    templateUrl: './account-search.component.html',
    styleUrls: ['./account-search.component.css']
})

export class AccountSearchComponent implements OnInit, OnDestroy {

    @Output() onContinueEvent: EventEmitter<string> = new EventEmitter<string>();

    @Output() onCloseEvent: EventEmitter<string> = new EventEmitter<string>();
 
    searchParams: SearchParams;

    // @Input() accountList: AccountSummary[];

    selectedAccount: AccountSummary;
    accountList: AccountSummary[];
    showNoRecordsFoundMessage: boolean;

    private accountModel: AccountModel;

    constructor(private accountEventEmitter: AccountEventEmitter, private localWebStorage: LocalWebStorageService, private accountService: AccountService) {
        this.accountModel = new AccountModel(accountService, localWebStorage)
    }

    ngOnInit() {
         this.accountList = [];
        this.selectedAccount = null;
        this.searchParams = new SearchParams();
        this.accountEventEmitter.showAccountResults.subscribe((value) =>
            {
            this.searchParams.searchText = value;
            this.onSearch();
        }
        )
    }

    ngOnDestroy(): void {
        this.onContinueEvent.unsubscribe();
    }

    onContinue(): void {

        document.getElementById("closeAccountSearchModal").click();

        if (this.accountModel.getSubscription())
            this.accountModel.setSessionStatus(this.accountModel.getSubscription());

        this.accountModel.clearAccountStore();

        let subscription = new Subscription();
        subscription.subscriptionId = this.selectedAccount.subscriptionId;
        subscription.displayName = this.selectedAccount.subscriptionName;

        this.accountModel.setSubscription(subscription);

        let accountId = this.selectedAccount.accountId;

        this.onReset();

        this.onContinueEvent.emit(accountId);
    }
    onSearch(): void {
        this.accountList = [];
        this.selectedAccount = null;
        this.showNoRecordsFoundMessage = false;

        if (this.searchParams.searchText != undefined && this.searchParams.searchText != null && this.searchParams.searchText != "") {

            this.accountModel.searchAccounts(this.searchParams.searchText)
                .subscribe(
                    result => {
                        this.accountList = result;
                        this.showNoRecordsFoundMessage = this.accountList == null || this.accountList.length == 0;
                    }, error => {

                    });
        }
    }

    onSelect(account: AccountSummary): void {
        this.selectedAccount = account;
    }

    onReset(): void {
        this.accountList = [];
        this.selectedAccount = null;
        this.showNoRecordsFoundMessage = false;
        this.searchParams = new SearchParams();
    }

    onClose(): void {
        this.onReset();
        this.onCloseEvent.emit();
    }
}
