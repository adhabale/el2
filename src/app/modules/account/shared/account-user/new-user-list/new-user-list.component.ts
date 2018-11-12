import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { UserSearchParams } from '../user-search-params';
import { AccountUser } from '../../../entity/account-user';
import { AccountModel } from '../../../models/account.model';
import { AccountService } from '../../../services/account.service';
import { NotificationMessage } from '../../../../common/entity/notification-message';
import { AccountEventEmitter } from '../../../account.events';
import { AccountUserInfo } from '../../../entity/account-user-info';
import { UserRoleService } from '../../../../../shared/user-profile/user-role.service';
import { UserRole } from '../../../../../shared/user-profile/user-role';
import { LocalWebStorageService } from '../../../../../shared/storage/local-web-storage.service';
import * as _ from 'lodash';
import { AccountConstants } from '../../../account.const';

@Component({
    templateUrl: './new-user-list.component.html',
    styleUrls: ['./new-user-list.component.css']
})

export class NewUserListComponent implements OnInit {

    @Output() onSaveUserEvent = new EventEmitter();

    userSearchParams: UserSearchParams = new UserSearchParams();

    userRoles: UserRole[] = [];

    userList: AccountUser[] = [];

    isUserListEmpty: boolean;

    selectedUser: AccountUser;

    notificationMessage: NotificationMessage = new NotificationMessage();

    isNewSubscription: boolean;

    isNewUser:boolean=true;

    private accountModel: AccountModel;

    constructor(private localWebStorage: LocalWebStorageService, private accountService: AccountService, private userRoleService: UserRoleService, private router: Router, private activatedRoute: ActivatedRoute, private accountEvent: AccountEventEmitter) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    ngOnInit(): void {
        this.getUserRoles();
        
        this.isNewSubscription = this.activatedRoute.parent.parent.snapshot.params.accountId == undefined;
       // this.accountEvent.isUserAccessButton.emit(false);
    }

    onReset(): void {
        this.userList = [];
        this.selectedUser = null;
        this.isUserListEmpty=false;
        this.getUserRoles();
        this.userSearchParams = new UserSearchParams();
        this.notificationMessage = new NotificationMessage();
    }

    onSearch(): void {

        this.userList = [];
        this.selectedUser = null;
        this.notificationMessage = new NotificationMessage();

        this.accountModel.getILUsers(this.userSearchParams.searchText)
            .subscribe(result => {
                this.userList = result;
                if(this.userList.length ==0)
                this.isUserListEmpty=true;
                else
                this.isUserListEmpty=false;
            }
                , error => { 
                    throw new Error(error);
            });

    }

    onAdd(accountUser: AccountUser): void {

        this.notificationMessage = new NotificationMessage();

        if (accountUser.accountUserInfo == undefined || accountUser.accountUserInfo == null)
            accountUser.accountUserInfo = new AccountUserInfo();

        accountUser.isActive = true;
        this.selectedUser = accountUser;
        this.selectedUser.roleId = this.userSearchParams.roleId;
    }

    getUserDetails(accountUser: AccountUser) {

        this.accountModel.getILUserInfo(accountUser.principalId)
            .subscribe(
                result => {
                    if (result){
                        accountUser.accountUserInfo = result;                   
                        //accountUser.isInternal = accountUser.emailAddress != undefined ? accountUser.emailAddress.toLowerCase().indexOf(AccountConstants.WTW) > -1 || accountUser.emailAddress.toLowerCase().indexOf(AccountConstants.Willis) > -1 : false;
                    }
                },
                error => {
                    //throw new Error(error);
                });
    }

    isSearchBtnDisabled() {
        return !((this.userSearchParams.roleId != undefined && this.userSearchParams.roleId.toString() != '') && (this.userSearchParams.searchText != undefined && this.userSearchParams.searchText != null && this.userSearchParams.searchText.trim().length > 0));
    }

    onClose() {
        this.selectedUser = null;
    }

    onSuccess(message: string) {

        this.notificationMessage.errorMessage = "";
        this.notificationMessage.successMessage = message;

        let userList = this.accountModel.getAllAccountUser();
        this.accountModel.setModifyUserFlag(true);

        if (userList != null && userList != undefined && userList.length > 0) {

            let isActiveUserExist = _.find(userList, (e) => { return e.isActive })!=null;
            this.accountEvent.showActivateAccountButtonEvent.emit(isActiveUserExist);
            this.accountEvent.isEnableButtonEvent.emit(isActiveUserExist);
            this.accountEvent.isUserAccessButton.emit(false);
        }
        else 
        {
            this.accountEvent.isUserAccessButton.emit(true);
        }
    }

    onError(message: string) {
        this.notificationMessage.successMessage = "";
        this.notificationMessage.errorMessage = message;
    }

    private getUserRoles(): void {

        this.userRoles = this.accountModel.getUserRoles();

        if (this.userRoles == null || this.userRoles.length == 0) {
            this.userRoleService.getUserProfiles().subscribe(result => {
                for(var i = result.length - 1; i >= 0; i--) {
                    if(result[i].code === 'Adjuster') {
                        result.splice(i, 1);
                    }
                }
                this.accountModel.setUserRoles(result);
                this.userRoles = result;
                this.userRoles.sort((a, b) => {
                    if (a.code.toLowerCase() < b.code.toLowerCase())
                        return -1;
                    if (a.code.toLowerCase() > b.code.toLowerCase())
                        return 1;
                    return 0;
                });
            });
        } else {
            this.userRoles.sort((a, b) => {
                if (a.code.toLowerCase() < b.code.toLowerCase())
                    return -1;
                if (a.code.toLowerCase() > b.code.toLowerCase())
                    return 1;
                return 0;
            });
        }
    }
}
