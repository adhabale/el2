import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AccountService } from '../../account/services/account.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { AccountModel } from '../../account/models/account.model';
import { AccountNotifications } from '../../account/entity/account-notifications';

@Component({
    selector: 'notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css'],
    providers:[AccountService]
})
export class NotificationComponent {

    currentPageIndex: number = 1;

    searchText:string='';

    notificationList:any=[];

    private accountModel:AccountModel;

    notificationData:AccountNotifications[] = [];
    
    notificationOriginalData:AccountNotifications[] = [];

constructor(private router:Router, private accountService:AccountService,private localWebStorage:LocalWebStorageService) { 
    this.accountModel = new AccountModel(accountService, localWebStorage);
}

    ngOnInit() {
        this.accountModel.getRenewalNotifications().subscribe((result) => {
            this.notificationData=result;
            this.notificationOriginalData=result;
        })
    }

    onSearch() {
        if(this.searchText) {
            this.notificationData = _.filter(this.notificationData,(notification) => 
                notification.clientName.toLowerCase().includes(this.searchText.toLowerCase())
            )
        }else {
            this.notificationData = _.cloneDeep(this.notificationOriginalData);
        }
    }

    onSorted(event) {
        this.notificationList = _.orderBy(this.notificationList, [event.sortColumn], [event.sortDirection]);
    }

    onPageChange(event) {
        this.notificationList=event;
        this.notificationList = _.orderBy(this.notificationList, ['sentDate'], ['desc']);
    }

    

}