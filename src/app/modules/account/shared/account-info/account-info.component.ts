import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AccountModel } from '../../models/account.model';
import { Account } from '../../entity/account';
import { AccountEventEmitter } from '../../account.events';
import { NgForm } from '@angular/forms';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';
import * as moment from 'moment/moment';
import * as _ from 'lodash';
import { AccountUserCountry } from '../../entity/account-user.country';
import { AccountUserCity } from '../../entity/account-user.city';


@Component({
    templateUrl: './account-info.component.html',
    styleUrls: ['./account-info.component.css']
})

export class AccountInfoComponent implements OnInit {
    cityEmpty: boolean;

    account: Account;

    isFormEditable: boolean;

    isNewSubscription: boolean;

    private accountModel: AccountModel;

    isStartDateInvalid: boolean;

    isEndDateInvalid: boolean;

    countryList: AccountUserCountry[] = [];

    cityList: AccountUserCity[] = [];
    // cityList : any;

    isAnyEditAccount: boolean;

    constructor(private localWebStorage: LocalWebStorageService, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute, private accountEvent: AccountEventEmitter) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    ngOnInit(): void {

        let account = this.accountModel.getAccount();
        this.getCountries();
        this.accountModel.setEditFlag(false);

        if (this.activatedRoute.parent.snapshot.params.accountId == undefined) {
            this.isNewSubscription = true;
            this.isFormEditable = true;
            this.account = account;
        }
        else {

            this.isNewSubscription = false;
            this.isFormEditable = false;

            if (account == null || account.customerName == undefined || account.customerName == "")
                this.getAccount(this.activatedRoute.parent.snapshot.params.accountId);
            else
                this.account = account;
        }
    }


    onContinue(accountInfoForm: NgForm): void {

        if (!this.isFormEditable)
            this.router.navigate(['users'], { relativeTo: this.activatedRoute.parent });

        if (accountInfoForm.form.valid) {

            if (this.activatedRoute.parent.snapshot.params.accountId == undefined) {
                this.saveAccount();
            }
            else {


                if (JSON.stringify(this.accountModel.getPreviousAccount()) == JSON.stringify(this.account)) {   //console.log("Hi Fro If");
                    //this.accountEvent.isAnyEditAccount.emit(false);
                   
                    this.accountModel.setEditFlag(false);

                }
                else {
                    if(this.accountModel.getPreviousAccount()==undefined || this.accountModel.getPreviousAccount()==null)
                    this.accountModel.setEditFlag(false);
                    //this.accountEvent.isAnyEditAccount.emit(true);
                    //console.log("From Else");
                    else
                    this.accountModel.setEditFlag(true);
                }
            }
            this.saveAccount();
            this.router.navigate(['users'], { relativeTo: this.activatedRoute.parent });
        }
    }

    onChangeOfNotificationSuppressed(value) {
        this.account.isNotificationSuppressed = value;
    }

    onChangeOfSubscriptionStatus(value) {
        this.account.subscriptionStatus = value;
    }
    onCountryChange(selectedCountry) {
        if (selectedCountry) {
            //this.getCities(selectedCountry, 'test');
            this.account.accountContact.city="";
            

        }
    }

    onBack(): void {
        if (!this.isFormEditable)
            this.router.navigate(['subscription-info'], { relativeTo: this.activatedRoute.parent });
        else {
            this.accountModel.setAccount(this.account);
            this.router.navigate(['subscription-info'], { relativeTo: this.activatedRoute.parent });
        }

    }

    onCancel(): void {
        this.isFormEditable = false;
        this.account = this.accountModel.getAccount();
    }

    onEdit(): void {
        this.isFormEditable = true;
        this.getCities(this.account.accountContact.country, this.account.accountContact.city);
        //if(this.accountModel.getPreviousAccount()==null)
        this.accountModel.setPreviousAccount(this.account);
    }

    private getAccount(accountId: string) {

        this.accountModel.getAccountInfo(accountId)
            .subscribe(
                result => {
                    this.account = result;
                    this.accountModel.setAccount(this.account);
                }, error => {

                });
    }

    private saveAccount() {
        this.accountModel.setAccount(this.account);
        this.accountEvent.showUserMaintenanceTabOnCreateSubscription.emit();
    }

    setStartDate(startDate: string) {
        this.account.startDate = startDate;
    }

    setEndDate(endDate: string) {
        this.account.endDate = endDate;
    }

    isContinueButtonDisabled(accountForm: NgForm): boolean {
        if (this.isNewSubscription)
            this.accountEvent.disableUserMaintenanceTabOnCreateSubscription.emit(accountForm.form.invalid);

        if (accountForm.form.value && this.isFormEditable) {
            if (this.account.accountContact.city == null)
                this.cityEmpty = true;
            else
                this.cityEmpty = false;
            if (this.account.accountContact.city && accountForm.form.value.address &&
                accountForm.form.value.companyName && accountForm.form.value.country &&
                accountForm.form.value.customerName && accountForm.form.value.email &&
                this.account.endDate && accountForm.form.value.invoiceStatus &&
                accountForm.form.value.name && accountForm.form.value.phone &&
                this.account.startDate) {
                if (accountForm.form.value.address.trim() == '' ||
                    accountForm.form.value.companyName.trim() == '' ||
                    accountForm.form.value.customerName.trim() == '' || accountForm.form.value.email.trim() == '' ||
                    accountForm.form.value.name.trim() == '' || accountForm.form.value.phone.trim() == '') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        } else {
            return accountForm.form.invalid;
        }
    }

    checkStartDateFormat(value: boolean) {
        if (value)
            this.isStartDateInvalid = false;
        else
            this.isStartDateInvalid = true;
    }

    checkEndDateFormat(value: boolean) {
        if (value)
            this.isEndDateInvalid = false;
        else
            this.isEndDateInvalid = true;
    }

    checkDateValidation() {
        if (this.account)
            if (this.account.startDate && this.account.endDate && !this.isStartDateInvalid && !this.isEndDateInvalid) {
                return !(moment(this.account.startDate).isBefore(this.account.endDate));
            } else {
                return false;
            }
    }

    getCountries() {
        this.accountModel.getCountries().subscribe(result => {
            this.countryList = result;
            if (this.account && this.account.accountContact.country) {
                this.getCities(this.account.accountContact.country, this.account.accountContact.city);
            }
        })
    }

    getCities(countryName: string, city: string) {
        let index = _.findIndex(this.countryList, (country) => {
            return country.name == countryName;
        })
        this.accountModel.getCities(this.countryList[index].id, city).subscribe(result => {
            if (this.account.accountContact.city != undefined) {
                let selectedCity = _.filter(result, (item: any) => {
                    return item.name == this.account.accountContact.city;
                })

                this.cityList = selectedCity;
            }
            else {
                let selectedCity = _.filter(result, (item: any) => {
                    return item.name == city;
                })
                this.cityList = selectedCity;
            }
        })

    }


    getCityList(cityName: string) {

        if (this.account.accountContact.country !== null) {

            let countryObj = _.find(this.countryList, (e) => { return e.name === this.account.accountContact.country; });

            if (countryObj != null) {

                this.accountModel.getCities(countryObj.id, cityName).subscribe(result => {
                    this.cityList = result;
                });
            }
        }
    }

    onCitySelect(cityName: string) {
        this.account.accountContact.city = cityName;
    }
}
