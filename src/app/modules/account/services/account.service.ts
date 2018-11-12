import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Subscription } from '../entity/subscription';
import { Account } from '../entity/account';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { AccountSummary } from '../entity/account-summary';
import { AccountUser } from '../entity/account-user';
import { AccountUserInfo } from '../entity/account-user-info';
import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { AccountStatus } from '../entity/account-status';
import { AccountStatusByMonth } from '../entity/account-status-bymonth';
import { AccountUserCountry } from '../entity/account-user.country';
import { AccountUserCity } from '../entity/account-user.city';
import { AccountNotifications } from '../entity/account-notifications';
import { AccountReports } from '../entity/account-reports';

@Injectable()
export class AccountService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    searchAccounts(searchText: string): Observable<AccountSummary[]> {
        let webRequestParams = new WebRequestParameter("accounts?search=" + encodeURIComponent(searchText));
        return this.httpClientWrapper.get<AccountSummary[]>(webRequestParams);
    }

    searchSubscriptions(searchText: string): Observable<Subscription[]> {
        let webRequestParams = new WebRequestParameter("subscriptions?searchText=" + searchText);
        return this.httpClientWrapper.get<Subscription[]>(webRequestParams);
    }

    getSubscriptionInfo(subscriptionId: string): Observable<Subscription> {
        let webRequestParams = new WebRequestParameter("subscriptions/" + subscriptionId);
        return this.httpClientWrapper.get<Subscription>(webRequestParams);
    }

    getAccountInfo(accountId: string): Observable<Account> {
        let webRequestParams = new WebRequestParameter("accounts/" + accountId + "/details");
        return this.httpClientWrapper.get<Account>(webRequestParams);
    }

    getExistingUsers(accountId: string): Observable<AccountUser[]> {
        let webRequestParams = new WebRequestParameter("accounts/" + accountId + "/users");
        return this.httpClientWrapper.get<AccountUser[]>(webRequestParams);
    }

    getILUsers(searchText: string): Observable<AccountUser[]> {
        let webRequestParams = new WebRequestParameter("users?searchText=" + searchText);
        return this.httpClientWrapper.get<AccountUser[]>(webRequestParams);
    }

    getILUserInfo(principleId: string): Observable<AccountUserInfo> {
        let webRequestParams = new WebRequestParameter("userProfile/" + principleId);
        return this.httpClientWrapper.get<AccountUserInfo>(webRequestParams);
    }

    createAccount(body: any): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("accounts/", JSON.stringify(body));
        return this.httpClientWrapper.post<boolean>(webRequestParams);
    }

    updateAccount(body: any): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("accounts/" + body.accountId, JSON.stringify(body));
        return this.httpClientWrapper.put<boolean>(webRequestParams);
    }

    checkUserExist(principleId: string): Observable<boolean> {
        let webRequestParams = new WebRequestParameter("accounts/checkUserExist/" + principleId);
        return this.httpClientWrapper.get<boolean>(webRequestParams);
    }

    getAccountBySubscriptionId(subscriptionId: string): Observable<Account> {
        let webRequestParams = new WebRequestParameter('accounts/' + subscriptionId + '/subscription');
        return this.httpClientWrapper.get<Account>(webRequestParams);
    }

    getAccountStatus(): Observable<AccountStatus> {
        let webRequestParams = new WebRequestParameter('accounts/active-inactive');
        return this.httpClientWrapper.get<AccountStatus>(webRequestParams);
    }

    getAccountStatusByMonth(): Observable<AccountStatusByMonth[]> {
        let webRequestParams = new WebRequestParameter('accounts/subscriptionByPeriod');
        return this.httpClientWrapper.get<AccountStatusByMonth[]>(webRequestParams);
    }

    getRenewalNotifications(): Observable<AccountNotifications[]> {
        let webRequestParams = new WebRequestParameter('accounts/dueForRenewal/notification');
        return this.httpClientWrapper.get<AccountNotifications[]>(webRequestParams);
    }

    getCountries(): Observable<AccountUserCountry[]> {
        let webRequestParams = new WebRequestParameter('countries');
        return this.httpClientWrapper.get<AccountUserCountry[]>(webRequestParams);
    }

    getCities(countryId: string, city: string): Observable<AccountUserCity[]> {

       /*  let a = Observable.of([{ id: 1, name: "Mumbai", code: "IN"}, { id: 2, name: "Pune", code: "PUN"},{ id: 3, name: "Ahmedabad", code: "AMD"},{ id: 4, name: "Hydrabad", code: "HYD"},{ id: 1, name: "Mumbai", code: "IN"}, { id: 2, name: "Pune", code: "PUN"},{ id: 3, name: "Ahmedabad", code: "AMD"},{ id: 4, name: "Hydrabad", code: "HYD"},{ id: 1, name: "Mumbai", code: "IN"}, { id: 2, name: "Pune", code: "PUN"},{ id: 3, name: "Ahmedabad", code: "AMD"},{ id: 4, name: "Hydrabad", code: "HYD"},{ id: 1, name: "Mumbai", code: "IN"}, { id: 2, name: "Pune", code: "PUN"},{ id: 3, name: "Ahmedabad", code: "AMD"},{ id: 4, name: "Hydrabad", code: "HYD"},{ id: 1, name: "Mumbai", code: "IN"}, { id: 2, name: "Pune", code: "PUN"},{ id: 3, name: "Ahmedabad", code: "AMD"},{ id: 4, name: "Hydrabad", code: "HYD"},{ id: 1, name: "Mumbai", code: "IN"}, { id: 2, name: "Pune", code: "PUN"},{ id: 3, name: "Ahmedabad", code: "AMD"},{ id: 4, name: "Hydrabad", code: "HYD"},{ id: 1, name: "Mumbai", code: "IN"}, { id: 2, name: "Pune", code: "PUN"},{ id: 3, name: "Ahmedabad", code: "AMD"},{ id: 4, name: "Hydrabad", code: "HYD"}]);
        return a; */
         let webRequestParams = new WebRequestParameter('country/'+countryId+'/'+city+'/cities');
         return this.httpClientWrapper.get<AccountUserCity[]>(webRequestParams);
    }

    getSubscriptionReports(): Observable<AccountReports[]> {
        let webRequestParams = new WebRequestParameter('accounts/subscriptionreports');
        return this.httpClientWrapper.get<AccountReports[]>(webRequestParams);
    }

    getSubscriptionReportContent(filename: string): Observable<any> {
        let webRequestParams = new WebRequestParameter('accounts/subscriptionreports/' + filename);
        return this.httpClientWrapper.get<any>(webRequestParams);
    }

    getRenewalReportContent(): Observable<any> {
        let webRequestParams = new WebRequestParameter('accounts/subscriptionRenewal');
        return this.httpClientWrapper.get<any>(webRequestParams);
    }
    getValidateUsers(accountId: string): Observable<AccountUser[]> {
        let webRequestParams = new WebRequestParameter("accounts/" + accountId + "/currentusers");
        return this.httpClientWrapper.get<AccountUser[]>(webRequestParams);
      }
    

}
