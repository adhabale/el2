import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'
import { AccountUser } from '../../../../entity/account-user';
import { AccountService } from '../../../../services/account.service';
import { AccountModel } from '../../../../models/account.model';
import { LocalWebStorageService } from '../../../../../../shared/storage/local-web-storage.service';
import { AccountEventEmitter } from '../../../../account.events';
import * as _ from 'lodash';

@Component({
    selector: 'delete-user',
    templateUrl: './delete-user.component.html',
    styleUrls :['./delete-user.component.css']
})

export class DeleteUserComponent implements OnInit, OnDestroy {

    @Input() accountUser: AccountUser;

    @Output() onDeleteEvent: EventEmitter<AccountUser> = new EventEmitter<AccountUser>();

    private accountModel: AccountModel;

    constructor(private localWebStorage: LocalWebStorageService, private accountService: AccountService, private accountEvent: AccountEventEmitter) {
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    ngOnInit() {

        
    }

    ngOnDestroy() {
        
    }

    onDelete() {
        this.onDeleteEvent.emit(this.accountUser);
    }

}
