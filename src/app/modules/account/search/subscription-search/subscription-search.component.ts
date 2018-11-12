import { Component, OnInit, OnDestroy, EventEmitter, Output } from "@angular/core";
import { Subscription } from "../../entity/subscription";
import { SearchParams } from "../../../common/entity/search-params";
import { AccountModel } from "../../models/account.model";
import { AccountService } from "../../services/account.service";
import { LocalWebStorageService } from "../../../../shared/storage/local-web-storage.service";
import { NotificationMessage } from '../../../common/entity/notification-message';

@Component({
  selector: 'subscription-search',
  templateUrl: './subscription-search.component.html',
  styleUrls: ['./subscription-search.component.css']
})

export class SubscriptionSearchComponent implements OnInit, OnDestroy {

  @Output() onContinueEvent = new EventEmitter();

  @Output() onCloseEvent = new EventEmitter();

  searchParams: SearchParams;

  subscriptionList: Subscription[];

  selectedSubscription: Subscription;

  showNoRecordsFoundMessage: boolean;

  private accountModel: AccountModel;

  notificationMessage: NotificationMessage = new NotificationMessage();

  constructor(private localWebStorage: LocalWebStorageService, private accountService: AccountService) {
    this.accountModel = new AccountModel(accountService, localWebStorage)
  }

  ngOnInit() {
    this.subscriptionList = [];
    this.selectedSubscription = null;
    this.searchParams = new SearchParams();
  }

  ngOnDestroy(): void {
    this.onContinueEvent.unsubscribe();
  }

  onContinue(): void {
    this.accountModel.getAccountBySubscriptionId(this.selectedSubscription.subscriptionId).subscribe(result => {
      if(result){
        this.notificationMessage.errorMessage='Subscription already exists.';
      }
      
      else {

        this.notificationMessage.errorMessage=null;
        document.getElementById("closeSubscriptionSearchModal").click();
        
        if (this.accountModel.getSubscription())
          this.accountModel.setSessionStatus(this.accountModel.getSubscription());
          
        this.accountModel.clearAccountStore();
        this.accountModel.setSubscription(this.selectedSubscription);
        this.onReset();
        this.onContinueEvent.emit();

      }
    },error=> {
      console.log('Error is'+error);
    })
  }

  onSearch(): void {
    this.notificationMessage.errorMessage=null;

    this.subscriptionList = [];
    this.selectedSubscription = null;
    this.showNoRecordsFoundMessage = false;

    if (this.searchParams.searchText != undefined && this.searchParams.searchText != null && this.searchParams.searchText.length > 0) {

      this.accountModel.searchSubscriptions(this.searchParams.searchText)
        .subscribe(
          result => {
            this.subscriptionList = result;
            this.showNoRecordsFoundMessage = this.subscriptionList == null || this.subscriptionList.length == 0;
          }, error => {

          });
    }
  }

  onSelect(subscription: Subscription): void {
    this.selectedSubscription = subscription;
    this.notificationMessage.errorMessage=null;
  }

  onReset(): void {
    this.subscriptionList = [];
    this.selectedSubscription = null;
    this.showNoRecordsFoundMessage = false;
    this.searchParams = new SearchParams();
    this.notificationMessage.errorMessage=null;
  }

  onClose(): void {
    this.onReset();
    this.onCloseEvent.emit();
    this.notificationMessage.errorMessage=null;
  }
}
