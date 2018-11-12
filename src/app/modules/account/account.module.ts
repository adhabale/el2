import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account.routing.module';
import { AccountComponent } from './account.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { AccountSearchComponent } from './search/account-search/account-search.component';
import { SubscriptionSearchComponent } from './search/subscription-search/subscription-search.component';
import { SubscriptionInfoComponent } from './shared/subscription-info/subscription-info.component';
import { AccountInfoComponent } from './shared/account-info/account-info.component';
import { AccountUserComponent } from './shared/account-user/account-user.component';
import { UserDetailsComponent } from './shared/account-user/user-details/user-details.component';
import { DeleteUserComponent } from './shared/account-user/existing-user-list/delete-user/delete-user.component';
import { AccountService } from './services/account.service';
import { NewUserListComponent } from './shared/account-user/new-user-list/new-user-list.component';
import { ExistingUserListComponent } from './shared/account-user/existing-user-list/existing-user-list.component';
import { AccountEventEmitter } from './account.events';
import { AccountChildAuthGuard } from './account.auth.guard';
import { SwitchComponent } from '../../shared/angular-switch-component/switch.component';
import { SharedModule } from '../../shared/shared.module';
import { AutoCompleteComponent } from '../../user-controls/auto-complete/auto-complete.component';
//import { DatepickerComponent } from '../../user-controls/datepicker/datepicker.component';

@NgModule({
    declarations: [
        AccountComponent,
        CreateAccountComponent,
        EditAccountComponent,
        AccountSearchComponent,
        SubscriptionSearchComponent,
        SubscriptionInfoComponent,
        AccountInfoComponent,
        AccountUserComponent,
        NewUserListComponent,
        ExistingUserListComponent,
        UserDetailsComponent,
        SwitchComponent,
        DeleteUserComponent,
        AutoCompleteComponent
    ],
    imports: [
        CommonModule,        
        FormsModule,                
        AccountRoutingModule,
        SharedModule    
    ],
    providers: [
        AccountService,      
        AccountEventEmitter,
        AccountChildAuthGuard
    ]
})

export class AccountModule { }