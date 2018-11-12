import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SubscriptionInfoComponent } from './shared/subscription-info/subscription-info.component';
import { AccountInfoComponent } from './shared/account-info/account-info.component';
import { AccountUserComponent } from './shared/account-user/account-user.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { NewUserListComponent } from './shared/account-user/new-user-list/new-user-list.component';
import { ExistingUserListComponent } from './shared/account-user/existing-user-list/existing-user-list.component';
import { AccountChildAuthGuard } from './account.auth.guard';

const accountRoutes: Routes = [
    {
    path: '', component: AccountComponent, canActivateChild: [AccountChildAuthGuard], canDeactivate: [AccountChildAuthGuard],
    children: [
            {
                path: 'new', component: CreateAccountComponent,
                children: [                    
                    { path: 'subscription-info', component: SubscriptionInfoComponent },
                    { path: 'account-info', component: AccountInfoComponent },
                    {
                        path: 'users', component: AccountUserComponent,
                        children: [
                            { path: 'new', component: NewUserListComponent },
                            { path: 'list', component: ExistingUserListComponent }
                        ]
                    }
                ]
            },
            {
                path: ':accountId', component: EditAccountComponent,
                children: [                    
                    { path: 'subscription-info', component: SubscriptionInfoComponent },
                    { path: 'account-info', component: AccountInfoComponent },
                    {
                        path: 'users', component: AccountUserComponent,
                        children: [
                            { path: 'new', component: NewUserListComponent },
                            { path: 'list', component: ExistingUserListComponent }
                        ]
                    }
                ]
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(accountRoutes)],
    exports: [RouterModule]
})

export class AccountRoutingModule { }
