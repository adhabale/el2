import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core'
import { AccountUser } from '../../../entity/account-user';
import { AccountService } from '../../../services/account.service';
import { AccountModel } from '../../../models/account.model';
import { UserRole } from '../../../../../shared/user-profile/user-role';
import { UserRoleService } from '../../../../../shared/user-profile/user-role.service';
import { LocalWebStorageService } from '../../../../../shared/storage/local-web-storage.service';
import { AccountEventEmitter } from '../../../account.events';
import * as _ from 'lodash';
import { AccountUserInfo } from '../../../entity/account-user-info';
import { AccountConstants } from '../../../account.const';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent implements OnInit, OnChanges, OnDestroy {

    @Input() accountUser: AccountUser;

    @Input() isNewSubscription: boolean;

    @Input() isNewUser:boolean;

    @Output() onCloseEvent = new EventEmitter();

    @Output() onSuccessEvent: EventEmitter<string> = new EventEmitter<string>();

    @Output() onErrorEvent: EventEmitter<string> = new EventEmitter<string>();

    userRoles: UserRole[] = [];

    private accountModel: AccountModel;
    

    constructor(private userRoleService: UserRoleService, private localWebStorage: LocalWebStorageService, private accountService: AccountService, private accountEvent: AccountEventEmitter) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    ngOnInit() {

        this.getUserRoles();

    }

    ngOnChanges(changes: SimpleChanges) {

        for (let propName in changes) {

            if (propName == "accountUser" && changes[propName].currentValue != changes[propName].previousValue) {

                if (this.accountUser.accountUserInfo.firstName == undefined)
                    this.getUserDetails();
            }
        }
    }

    ngOnDestroy() {
        this.onSuccessEvent.unsubscribe();
        this.onErrorEvent.unsubscribe();
        this.onCloseEvent.unsubscribe();
    }

    onClose(): void {
        this.onCloseEvent.emit();
    }

    onChangeOfUserType(value) {
        this.accountUser.isInternal = value;
    }

    onChangeOfUserStatus(value) {
        this.accountUser.isActive = value;
    }

    onSave(): void {
        if (this.isNewUser) {
        
            if (!this.isUserAlreadyAdded()) {
                let accountUsers = this.accountModel.getAllAccountUser();
                this.accountUser.state="Added";
                this.accountUser.isNew=true;
                if(!this.accountModel.isPreviouslyDeleted(this.accountUser))
                {
                    this.accountModel.checkUserExist(this.accountUser.principalId).subscribe(result => {
                        if (!result) {
                            // if (accountUsers != undefined && accountUsers != null && accountUsers.length >= 10) {
                            //     this.onErrorEvent.emit("Subscription cannot have more than 10 users.");
                            // } else {
                                this.accountModel.setAccountUser(this.accountUser);
                                this.onSuccessEvent.emit("User "+this.accountUser.displayName+ " successfully added.");
                           // }
                        }
                        else {
                           
                            this.onErrorEvent.emit("User "+this.accountUser.displayName+ " already added to subscription");
                        }
                    }, error => {
                    });
                }
                else{
                    this.accountModel.setAccountUser(this.accountUser);
                    this.accountModel.removeDeletedUser(this.accountUser);
                    this.onSuccessEvent.emit("User "+this.accountUser.displayName+ " successfully added.");
                }
            }
            else {
              
                this.onErrorEvent.emit("User already added to subscription");
                //this.accountModel.setAccountUser(this.accountUser);
                
            }
        }
        else {
            
            let oldUser=this.accountModel.getAccountUser(this.accountUser.emailAddress);
            if(oldUser.roleId==this.accountUser.roleId && oldUser.isInternal==this.accountUser.isInternal && oldUser.isActive==this.accountUser.isActive)
            {
              this.accountUser=oldUser;
            }
            else
            {
                if(this.accountUser.userId==undefined)
                this.accountUser.state="Added";
                else
                {
                    this.accountUser.state="Modified";
                    
                }
                this.accountModel.setAccountUser(this.accountUser);
                this.onSuccessEvent.emit("User "+this.accountUser.displayName+ " successfully modified.")
                
            }
            /* if (!this.isUserAlreadyAdded()) {
                let accountUsers = this.accountModel.getAllAccountUser();
                this.accountModel.checkUserExist(this.accountUser.principalId).subscribe(result => {
                    if (!result) {
                        if (accountUsers != undefined && accountUsers != null && accountUsers.length >= 10) {
                            this.onErrorEvent.emit("Subscription cannot have more than 10 users.");
                        } else {
                            this.accountModel.setAccountUser(this.accountUser);
                            this.onSuccessEvent.emit("User "+this.accountUser.displayName+ " successfully added.");
                        }
                    }
                    else {
                        this.onErrorEvent.emit("User "+this.accountUser.displayName+ " already added to subscription");
                    }
                }, error => {
                });
            }

            else{
                this.accountModel.setAccountUser(this.accountUser);
            } */

           /*  else {
                this.onErrorEvent.emit("User already added to subscription");
            } */


            //this.accountModel.setAccountUser(this.accountUser);

            /* let userList = this.accountModel.getAllAccountUser();

            if (userList != null && userList != undefined && userList.length > 0) {
                let isActiveUserExist = _.find(userList, (e) => { return e.isActive })!=null;
                this.accountEvent.showActivateAccountButtonEvent.emit(isActiveUserExist);
            } */
        }
    }

    private getUserRoles(): void {

        this.userRoles = this.accountModel.getUserRoles();
        this.userRoles=this.userRoles.filter(e => e.code !="Adjuster");

        if (this.userRoles == null || this.userRoles.length == 0) {
            this.userRoleService.getUserProfiles().subscribe(result => {
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

    private isUserAlreadyAdded(): boolean {
        let accountUser = this.accountModel.getAccountUser(this.accountUser.emailAddress);
        return accountUser != null ? true : false;
    }

    private getUserDetails() {
        this.accountModel.getILUserInfo(this.accountUser.principalId)
            .subscribe(
                (result) => {
                    if (result)
                        this.accountUser.accountUserInfo = result;
                    //this.accountUser.isInternal = this.accountUser.emailAddress != undefined ? this.accountUser.emailAddress.toLowerCase().indexOf(AccountConstants.WTW) > -1 || this.accountUser.emailAddress.toLowerCase().indexOf(AccountConstants.Willis) > -1 : false;
                },
                error => {
                });
    }
}
