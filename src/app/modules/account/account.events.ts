import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AccountEventEmitter {

    showActivateAccountButtonEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    showUserMaintenanceTabOnCreateSubscription = new EventEmitter();

    disableUserMaintenanceTabOnCreateSubscription: EventEmitter<boolean> = new EventEmitter<boolean>();

    newSubscriptionAddedEvent = new EventEmitter();

    showAccountResults : EventEmitter<any>= new EventEmitter();

    isEnableButtonEvent :EventEmitter<boolean>=new EventEmitter<boolean>();

    isAnyEditAccount: EventEmitter<boolean>=new EventEmitter<boolean>();

    isUserAccessButton: EventEmitter<boolean>=new EventEmitter<boolean>();




}