import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from './entity/subscription';
import { AccountSummary } from './entity/account-summary';
import { AccountModel } from './models/account.model';
import { AccountService } from './services/account.service';
import { AccountConstants } from './account.const';
import { SearchParams } from '../common/entity/search-params';
import { AccountEventEmitter } from './account.events';
import { LocalWebStorageService } from '../../shared/storage/local-web-storage.service';
import { Account } from './entity/account';

@Component({
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})

export class AccountComponent {

  selectedSubscriptionName: string;
  searchParams: SearchParams;
  searchView: boolean;
  showNoRecordsFoundMessage: boolean;
  private accountModel: AccountModel;
  accountList: AccountSummary[];

  selectedAccount: AccountSummary;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private localWebStorage: LocalWebStorageService, private accountService: AccountService, private accountEventEmitter: AccountEventEmitter) {


    this.accountModel = new AccountModel(accountService, localWebStorage)
    this.selectedSubscriptionName = 'Subscription Name';
    this.searchView = true;
  }
  ngOnInit() {
    this.accountList = [];
    this.selectedAccount = null;
    this.searchParams = new SearchParams();
    if (this.accountModel.getSubscription() && this.accountModel.getSubscription().displayName)
    this.searchParams.searchText = this.accountModel.getSubscription().displayName;
     
  
  }

  toggleSearchView() {
    this.searchView = !this.searchView;
    this.searchParams = new SearchParams();
  }

  onSearch(searchText: string): void {
    this.toggleSearchView();
    this.accountList = [];
    this.selectedAccount = null;
    document.getElementById("accountSearchModalBtn").click();
    this.accountEventEmitter.showAccountResults.emit(searchText);

  }
  onReset(): void {
    this.accountList = [];
    this.selectedAccount = null;
    this.showNoRecordsFoundMessage = false;
    this.searchParams = new SearchParams();
    this.accountModel.clearAccountSession();
    this.accountModel.clearAccountStore();

  }

  onAddSubscription() {
    this.toggleSearchView();
    document.getElementById("subscriptionSearchModalBtn").click();
  }

  navigateToSubscriptionInfoBySubscriptionId(): void {
    this.selectedSubscriptionName = this.accountModel.getSubscription().displayName;
    
    this.searchParams.searchText = this.selectedSubscriptionName;
    let sessionStatus = this.accountModel.getSessionStatus();
    if (sessionStatus != null && sessionStatus != undefined) {
      var account = new Account();
      account.setDefaultValue();
      this.accountModel.setAccount(account);
      this.router.navigate(['/accounts/new']);
     
    //this.accountEventEmitter.newSubscriptionAddedEvent.emit();
    }
    else
    {
      this.router.navigate(['new'], { relativeTo: this.activatedRoute });
      
    }
      
  }

  navigateToSubscriptionInfoByAccountId(accountId: string): void {
    this.selectedSubscriptionName = this.accountModel.getSubscription().displayName;
    this.searchParams.searchText = this.selectedSubscriptionName;
    let sessionStatus = this.accountModel.getSessionStatus();
    this.router.navigate([accountId + '/subscription-info'], { relativeTo: this.activatedRoute });
  }

  onCloseModal() {
    if (this.accountModel.getSubscription() && this.accountModel.getSubscription().displayName)
      this.searchParams.searchText = this.accountModel.getSubscription().displayName;
  }
}
