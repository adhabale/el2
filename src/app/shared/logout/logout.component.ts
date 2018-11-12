import { Component, SecurityContext, NgZone } from '@angular/core';
import { LogOutService } from './logout.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-logout',
    template: '<div></div>',
    styleUrls: ['./logout.component.css']

})

export class LogoutComponent {

    constructor(
        private zone: NgZone,
        private logoutService: LogOutService) {

        window['signOutComponent'] = {
            zone: this.zone,
            componentFn: () => this.LogOutUser(),
            component: this,
        };
	}

    LogOutUser() {
        this.logoutService.signOut().subscribe((response:any) => {
                window.location.href = response.logoutUrl;
                console.log('Sign out complete...')
        });
    }
}