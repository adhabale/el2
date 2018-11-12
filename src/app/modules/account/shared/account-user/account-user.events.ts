import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class AccountUserEventEmitter {
    ActivateAccountButtonEvent: EventEmitter<any> = new EventEmitter();
}