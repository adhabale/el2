import { Observable } from 'rxjs/Rx';
import { Account } from '../entity/account';
import { AccountService } from '../services/account.service';
import { AccountUser } from '../entity/account-user';
import { Subscription } from '../entity/subscription';
import { UserSearchParams } from '../shared/account-user/user-search-params';
import { AccountConstants } from '../account.const';
import { AccountUserInfo } from '../entity/account-user-info';
import { AccountSummary } from '../entity/account-summary';
import { UserRole } from '../../../shared/user-profile/user-role';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { AccountStatus } from '../entity/account-status';
import { AccountStatusByMonth } from '../entity/account-status-bymonth';
import { AccountUserCountry } from '../entity/account-user.country';
import { AccountUserCity } from '../entity/account-user.city';
import { AccountNotifications } from '../entity/account-notifications';
import { AccountReports } from '../entity/account-reports';

export class AccountModel {

    constructor(private accountService: AccountService, private localWebStorage: LocalWebStorageService) {
    }

    setSubscription(value: Subscription) {
        this.localWebStorage.set(AccountConstants.SubscriptionInfo, value);
    }

    getSubscription() {
        return this.localWebStorage.get<Subscription>(AccountConstants.SubscriptionInfo);
    }

    setAccount(value: Account) {
        this.localWebStorage.set(AccountConstants.AccountInfo, value);
    }

    getAccount() {
        return this.localWebStorage.get<Account>(AccountConstants.AccountInfo);
    }

    setSessionStatus(value: Subscription) {
        this.localWebStorage.set(AccountConstants.Session, value);
    }

    getSessionStatus() {
        return this.localWebStorage.get(AccountConstants.Session);
    }

    setAccountUser(value: AccountUser) {
        //value.isInternal = value.emailAddress != undefined ? value.emailAddress.toLowerCase().indexOf(AccountConstants.WTW) > -1 || value.emailAddress.toLowerCase().indexOf(AccountConstants.Willis) > -1 : false;
        var accountUsers = this.localWebStorage.get<AccountUser[]>(AccountConstants.AccountUser);
       
        if (accountUsers != null) {
            accountUsers = accountUsers.filter(e => e.emailAddress != value.emailAddress);
            accountUsers.push(value);
        }
        else {
            accountUsers = [];
            accountUsers.push(value);
        }

        this.localWebStorage.set(AccountConstants.AccountUser, accountUsers); 
    }

    setPreviousAccount(value:Account)
    {
        this.localWebStorage.set("previousAccount",value);
    }

    getPreviousAccount():Account
    {
        return this.localWebStorage.get("previousAccount");
    }

    setEditFlag(value:boolean)
    {
        this.localWebStorage.set("editFlag",value);
    }

    getEditFlag():boolean
    {
        return this.localWebStorage.get("editFlag");
    }

    setModifyUserFlag(value:boolean)
    {
        this.localWebStorage.set("userFlag",value);
    }

    getModifyUserFlag():boolean
    {
        return this.localWebStorage.get("userFlag");
    }


    getAccountUser(emailAddress: string): AccountUser {
        let accountUsers = this.localWebStorage.get<AccountUser[]>(AccountConstants.AccountUser);
        return accountUsers != null ? accountUsers.find(e => e.emailAddress == emailAddress) : null;
    }

    getAllAccountUser(): AccountUser[] {
        return this.localWebStorage.get<AccountUser[]>(AccountConstants.AccountUser);
    }

    removeAccountUser(accountUser:AccountUser): void {

        let accountUsers = this.localWebStorage.get<AccountUser[]>(AccountConstants.AccountUser);
        if (accountUsers != null) {
            this.setDeletedUser(accountUser);
            this.localWebStorage.set(AccountConstants.AccountUser, accountUsers.filter(e => e.emailAddress != accountUser.emailAddress));
        }
       
    }

    setDeletedUser(accountUser:AccountUser)
    {
        
        var deletedUsers = this.localWebStorage.get<AccountUser[]>("deletedUsers");
        if(accountUser.userId!=undefined)
        {
        if (deletedUsers != null) {
            deletedUsers = deletedUsers.filter(e => e.emailAddress != accountUser.emailAddress);
            deletedUsers.push(accountUser);
        }
        else {
            deletedUsers = [];
            deletedUsers.push(accountUser);
        }
        this.localWebStorage.set("deletedUsers", deletedUsers)
    }

    }

    removeDeletedUser(accountUser:AccountUser)
    {
        var deletedUsers = this.localWebStorage.get<AccountUser[]>("deletedUsers");
        if (deletedUsers != null) {
            //this.setDeletedUser(accountUser);
            this.localWebStorage.set("deletedUsers", deletedUsers.filter(e => e.emailAddress != accountUser.emailAddress));
        }
    }

    isPreviouslyDeleted(accountUser:AccountUser):boolean
    {
        var deletedUsers = this.localWebStorage.get<AccountUser[]>("deletedUsers");
        var flag:boolean=false;
        if(deletedUsers!=null && deletedUsers.length>0)
        {
            deletedUsers.forEach(user=>{
                if(user.emailAddress==accountUser.emailAddress){
                    flag=true;
                }})
        }
        return flag;
    }

    getDeletedAccountUser():AccountUser[]{

        return this.localWebStorage.get<AccountUser[]>("deletedUsers");

    }

    clearAccountStore() {
        this.localWebStorage.remove(AccountConstants.AccountInfo);
        this.localWebStorage.remove(AccountConstants.AccountUser);
        this.localWebStorage.remove(AccountConstants.SubscriptionInfo);
        this.localWebStorage.remove(AccountConstants.UserRoles);
        this.localWebStorage.remove("deletedUsers");
        this.localWebStorage.remove("previousAccount");
        this.localWebStorage.remove("editFlag");
        this.localWebStorage.remove("userFlag");
    }

    clearAccountSession() {
        this.localWebStorage.remove(AccountConstants.Session);
    }

    setUserRoles(value: UserRole[]) {
        this.localWebStorage.set(AccountConstants.UserRoles, value);
    }

    getUserRoles() {
        return this.localWebStorage.get<UserRole[]>(AccountConstants.UserRoles);
    }


    getSubscriptionInfo(subscriptionId: string): Observable<Subscription> {
        return this.accountService.getSubscriptionInfo(subscriptionId);
    }

    getAccountInfo(accountId: string): Observable<Account> {
        return this.accountService.getAccountInfo(accountId);
    }

    getExistingUsers(accountId: string): Observable<AccountUser[]> {
        return this.accountService.getExistingUsers(accountId);
    }

    getILUsers(searchText: string): Observable<AccountUser[]> {
        return this.accountService.getILUsers(searchText);
    }

    getILUserInfo(principleId: string): Observable<AccountUserInfo> {
        return this.accountService.getILUserInfo(principleId);
    }

    searchExistingUsers(userList: AccountUser[], userSearchParams: UserSearchParams): AccountUser[] {

        let result = userList;

        if (userSearchParams.roleId != undefined && userSearchParams.roleId != parseInt("0"))
            result = result.filter(e => e.roleId == userSearchParams.roleId);

        if (userSearchParams.searchText != undefined && userSearchParams.searchText != null && userSearchParams.searchText.length > 0)
            result = result.filter(e => e.displayName.toLowerCase().indexOf(userSearchParams.searchText.toLowerCase()) > -1 || e.emailAddress.toLowerCase().indexOf(userSearchParams.searchText.toLowerCase()) > -1);

        if (userSearchParams.userType != undefined && userSearchParams.userType != "")
            result = result.filter(e => e.isInternal == (userSearchParams.userType == 'true'));

        return result;
    }

    checkUserExist(principalId: string): Observable<boolean> {
        return this.accountService.checkUserExist(principalId);
    }

    searchSubscriptions(searchText: string): Observable<Subscription[]> {
        return this.accountService.searchSubscriptions(searchText);
    }

    searchAccounts(searchText: string): Observable<AccountSummary[]> {
        return this.accountService.searchAccounts(searchText);
    }

    createAccount(): Observable<boolean> {

        let subscription = this.getSubscription();
        let account = this.getAccount();
        let accountUsers = this.getAllAccountUser();
    
        let createAccountObj =
            {
                "subscriptionId": subscription.subscriptionId,
                "subscriptionName": subscription.displayName,
                "customerName": account.customerName,
                "isNotificationSuppressed": account.isNotificationSuppressed,
                "isActive": true,
                "startDate": account.startDate,
                "endDate": account.endDate,
                "invoiceStatus": account.invoiceStatus,
                "accountContact":
                    {
                        "name": account.accountContact.name,
                        "email": account.accountContact.email,
                        "phone": account.accountContact.phone,
                        "address": account.accountContact.address,
                        "city": account.accountContact.city,
                        "country": account.accountContact.country,
                        "companyName": account.accountContact.companyName
                    },
                "users": []
            };

        for (let x in accountUsers) {
            createAccountObj.users.push
                ({
                    "roleId": accountUsers[x].roleId,
                    "isActive": accountUsers[x].isActive,
                    "email": accountUsers[x].emailAddress,
                    "firstName": accountUsers[x].accountUserInfo.firstName,
                    "lastName": accountUsers[x].accountUserInfo.lastName,
                    "country": accountUsers[x].accountUserInfo.countryName,
                    "principalId": accountUsers[x].principalId,
                    "isInternal": accountUsers[x].isInternal,
                    "displayName": accountUsers[x].displayName
                });
        }

        return this.accountService.createAccount(createAccountObj);
    }

    updateAccount():Observable<boolean>
    {
        let account = this.getAccount();
        let accountUsers = this.getAllAccountUser();
        let updateAccountObj={
            "accountId": account.accountId,
            "accountBillingId": account.accountBillingId,
            "customerName": account.customerName,
            "subscriptionName": account.subscriptionName,
            "isNotificationSuppressed": account.isNotificationSuppressed,
            "subscriptionStatus": account.subscriptionStatus,
            "startDate": account.startDate,
            "endDate": account.endDate,
            "invoiceStatus": account.invoiceStatus,
            "accountContact":
            {
                "accountContactId": account.accountContact.accountContactId,
                "name": account.accountContact.name,
                "email": account.accountContact.email,
                "phone": account.accountContact.phone,
                "address": account.accountContact.address,
                "city": account.accountContact.city,
                "country": account.accountContact.country,
                "companyName": account.accountContact.companyName
            },
            "users": [],
            "updateUsers":[],
            "deleteUsers":[]

        };
        let users:any[];
        let updatedUsers:any[];
        let deletedUsers=this.localWebStorage.get("deletedUsers");
        users=accountUsers.filter((e)=>e.state=="Added");
        updatedUsers=accountUsers.filter((e)=>e.state=="Modified");
        
        for (let x in users) {
            updateAccountObj.users.push
                ({
                    "roleId": users[x].roleId,
                    "isActive": users[x].isActive,
                    "email": users[x].emailAddress,
                    "firstName": users[x].accountUserInfo.firstName,
                    "lastName": users[x].accountUserInfo.lastName,
                    "country": users[x].accountUserInfo.countryName,
                    "principalId": users[x].principalId,
                    "isInternal": users[x].isInternal,
                    "state":users[x].state,
                    "displayName": users[x].displayName
                });
        }

        for (let x in updatedUsers) {
            updateAccountObj.updateUsers.push
                ({
                    "id":updatedUsers[x].id,
                    "userId":updatedUsers[x].userId,
                    "roleId": updatedUsers[x].roleId,
                    "isActive": updatedUsers[x].isActive,
                    "principalId": updatedUsers[x].principalId,
                    "isInternal": updatedUsers[x].isInternal,
                    "state":updatedUsers[x].state,
                    "displayName": updatedUsers[x].displayName
                });
        }

        for (let x in deletedUsers) {
            
            updateAccountObj.deleteUsers.push
                ({
                    "id": deletedUsers[x].id,
                    "userId": deletedUsers[x].userId,
                    "roleId": deletedUsers[x].roleId,
                    "principalId": deletedUsers[x].principalId,
                    "state":deletedUsers[x].state
                });
        }
        
        this.localWebStorage.remove(AccountConstants.AccountUser);
        this.localWebStorage.remove("deletedUsers");
        return this.accountService.updateAccount(updateAccountObj);
       

    }


    

    getAccountBySubscriptionId(subscriptionId: string): Observable<Account> {
        return this.accountService.getAccountBySubscriptionId(subscriptionId);
    }

    getAccountStatus():Observable<AccountStatus> {
      return this.accountService.getAccountStatus();
    }

    getAccountStatusByMonth():Observable<AccountStatusByMonth[]> {
      return this.accountService.getAccountStatusByMonth();
    }

    getRenewalNotifications():Observable<AccountNotifications[]> {
      return this.accountService.getRenewalNotifications();
    }

    getCountries():Observable<AccountUserCountry[]> {
        return this.accountService.getCountries();
    }

    getCities(countryId:string,city:string):Observable<AccountUserCity[]> {
        return this.accountService.getCities(countryId,city);
    }

    getSubscriptionReports():Observable<AccountReports[]> {
        return this.accountService.getSubscriptionReports();
      }

    getSubscriptionReportContent(filename:string):Observable<any> {
        return this.accountService.getSubscriptionReportContent(filename);
      }

    getRenewalReportContent():Observable<any> {
        return this.accountService.getRenewalReportContent();
      }
      getValidateUsers(accountId: string): Observable<AccountUser[]> {
        return this.accountService.getValidateUsers(accountId);
      }
    
}
