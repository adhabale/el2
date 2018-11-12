import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { UserSearchParams } from '../user-search-params';
import { AccountUser } from '../../../entity/account-user';
import { AccountModel } from '../../../models/account.model';
import { AccountService } from '../../../services/account.service';
import { AccountConstants } from '../../../account.const';
import { KeyValuePair } from '../../../../common/entity/key-value-pair';
import { NotificationMessage } from '../../../../common/entity/notification-message';
import { AccountEventEmitter } from '../../../account.events';
import { UserRole } from '../../../../../shared/user-profile/user-role';
import { UserRoleService } from '../../../../../shared/user-profile/user-role.service';
import { LocalWebStorageService } from '../../../../../shared/storage/local-web-storage.service';
import * as _ from 'lodash';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    templateUrl: './existing-user-list.component.html',
    styleUrls: ['./existing-user-list.component.css']
})

export class ExistingUserListComponent implements OnInit {

    userSearchParams: UserSearchParams = new UserSearchParams();

    userRoles: UserRole[] = [];

    userList: AccountUser[] = [];

    isUserListEmpty: boolean;

    selectedUser: AccountUser;

    notificationMessage: NotificationMessage = new NotificationMessage();

    isNewSubscription: boolean;

    isNewUser: boolean;

    isEnableButtonEvent: boolean;
    isAnyModification: boolean;


    private accountModel: AccountModel;

    private tempUserList: AccountUser[] = [];

    constructor(private localWebStorage: LocalWebStorageService, private accountService: AccountService, private userRoleService: UserRoleService, private router: Router, private activatedRoute: ActivatedRoute, private accountEvent: AccountEventEmitter) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    ngOnInit(): void {
        this.isNewSubscription = this.activatedRoute.parent.parent.snapshot.params.accountId == undefined;
        this.getUserRoles();
        this.loadAllUsers();
        /* this.accountEvent.isAnyEditAccount.subscribe((value)=>{ 
            this.isAnyModification=value;
            //this.accountEvent.isAnyEditAccount.
          }); */


    }

    checkValidation() {
        //console.log("Check Validation");
        if (!this.isNewSubscription) {

            let userList = this.accountModel.getAllAccountUser();

            if (userList != null && userList != undefined && userList.length > 0) {
                var activateFlag: boolean = false;
                this.accountEvent.isUserAccessButton.emit(false);
                userList.forEach(user => {
                    if (user.isActive)
                        activateFlag = true;
                })
                if (activateFlag) {
                    //if(this.isAnyModification)
                    //console.log(this.accountModel.getEditFlag());
                    //if(this.accountModel.getEditFlag())
                    this.accountEvent.isEnableButtonEvent.emit(true);

                }
            }

            else {
                this.accountEvent.isUserAccessButton.emit(true);
                this.accountEvent.isEnableButtonEvent.emit(false);
            }

        }
    }

    onReset(): void {
        this.loadAllUsers();
        this.userList = this.tempUserList;
        this.selectedUser = null;
        this.isUserListEmpty = false;
        this.userSearchParams = new UserSearchParams();
        this.notificationMessage = new NotificationMessage();
    }

    onSearch(): void {

        this.userList = [];
        this.selectedUser = null;
        this.notificationMessage = new NotificationMessage();

        this.userList = this.accountModel.searchExistingUsers(this.tempUserList, this.userSearchParams);
        if (this.userList.length == 0)
            this.isUserListEmpty = true;
        else
            this.isUserListEmpty = false;
    }

    onEdit(accountUser: AccountUser): void {
        this.selectedUser = accountUser;
    }

    onDelete(accountUser: AccountUser): void {
        this.selectedUser = accountUser;
    }

    isSearchBtnDisabled() {
        return !((this.userSearchParams.roleId != undefined && this.userSearchParams.roleId.toString() != '') || (this.userSearchParams.searchText != undefined && this.userSearchParams.searchText != null && this.userSearchParams.searchText.trim().length > 0) || (this.userSearchParams.userType != undefined && this.userSearchParams.userType != null));
    }

    onRemove(accountUser: AccountUser): void {
        accountUser.state = "Removed";
        this.accountModel.setModifyUserFlag(true);
        this.accountModel.removeAccountUser(accountUser);

        //this.loadAllUsers();
        this.userList = this.accountModel.getAllAccountUser();

        if (this.userList == null || this.userList == undefined || this.userList.length == 0) {
            this.accountEvent.showActivateAccountButtonEvent.emit(false);
            this.accountEvent.isUserAccessButton.emit(true);
            this.accountEvent.isEnableButtonEvent.emit(false);
        }
        else {
            let isActiveUserExist = _.find(this.userList, (e) => { return e.isActive }) != null;
            this.accountEvent.showActivateAccountButtonEvent.emit(isActiveUserExist);
            this.accountEvent.isUserAccessButton.emit(false);
            this.accountEvent.isEnableButtonEvent.emit(isActiveUserExist);
        }

        this.isEditBtnEnabled();
        this.notificationMessage.errorMessage = "User " + accountUser.displayName + " successfully deleted.";

    }

    private loadAllUsers_old() {

        if (this.isNewSubscription) {
            this.tempUserList = this.accountModel.getAllAccountUser();
            this.userList = this.tempUserList;
        }
        else {
            this.tempUserList = this.accountModel.getAllAccountUser();

            /* this.tempUserList.forEach(element => { element.isNew=true;
            }); */

            this.accountModel.getExistingUsers(this.activatedRoute.parent.parent.snapshot.params.accountId)
                .subscribe(
                    result => {

                        if (result == null) {
                            this.userList = this.tempUserList;
                        }
                        else {

                            result.forEach(e => { this.accountModel.setAccountUser(e) });
                            this.userList = this.accountModel.getAllAccountUser();
                            /*  if(this.tempUserList==null)
                             this.userList=result;
                             else
                             {
                                 
                             }
                             this.userList=result.concat(this.tempUserList)
                             this.userList.forEach(user=>{
                                 this.accountModel.setAccountUser(user);
                             }) */
                        }

                    }, error => {

                    });
        }
    }

    private loadAllUsers() {

        if (this.isNewSubscription) {
            this.tempUserList = this.accountModel.getAllAccountUser();
            this.userList = this.tempUserList;
            this.checkValidation();
        }
        else {
            this.tempUserList = this.accountModel.getAllAccountUser();
            if (this.tempUserList != null) {
                this.tempUserList.forEach(e => { this.accountModel.setAccountUser(e) })
                this.userList = this.accountModel.getAllAccountUser();
                this.checkValidation();

            }
            else {
                this.accountModel.getExistingUsers(this.activatedRoute.parent.parent.snapshot.params.accountId)
                    .subscribe(
                        result => {

                            if (result == null) {
                                this.userList = this.tempUserList;

                                this.checkValidation();
                            }
                            else {

                                result.forEach(e => { this.accountModel.setAccountUser(e) });
                                this.userList = this.tempUserList = this.accountModel.getAllAccountUser();
                                this.checkValidation();


                                /*  if(this.tempUserList==null)
                                 this.userList=result;
                                 else
                                 {
                                     
                                 }
                                 this.userList=result.concat(this.tempUserList)
                                 this.userList.forEach(user=>{
                                     this.accountModel.setAccountUser(user);
                                 }) */

                            }


                        }, error => {

                        });
            }

        }
    }
    onClose() {
        this.selectedUser = null;
    }

    onSuccess(message: string) {
        this.notificationMessage.successMessage = message;

        let userList = this.accountModel.getAllAccountUser();
        this.accountModel.setModifyUserFlag(true);

        if (userList != null && userList != undefined && userList.length > 0) {

            let isActiveUserExist = _.find(userList, (e) => { return e.isActive }) != null;
            this.accountEvent.showActivateAccountButtonEvent.emit(isActiveUserExist);
            this.accountEvent.isEnableButtonEvent.emit(isActiveUserExist)
            this.isEditBtnEnabled();
        }
    }


    isEditBtnEnabled() {
        let btnFlag: boolean = false;
        if (this.userList && this.userList.length > 0) {
            this.userList.forEach(user => {
                if (user.isActive) {
                    btnFlag = true;
                }
            });
            this.accountEvent.isEnableButtonEvent.emit(btnFlag);
        }
    }

    onError(message: string) {
        this.notificationMessage.errorMessage = message;
    }

    private getUserRoles(): void {
        this.userRoles = this.accountModel.getUserRoles();

        if (this.userRoles == null || this.userRoles.length == 0) {
            this.userRoleService.getUserProfiles().subscribe(result => {
                for (var i = result.length - 1; i >= 0; i--) {
                    if (result[i].code === 'Adjuster') {
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

    getRoleName(roleId: number) {

        if (this.userRoles != undefined && this.userRoles.length > 0) {

            let profile = this.userRoles.find(e => e.id == roleId);
            if (profile != null)
                return profile.code;
        }
    }
}
