import { Component, OnInit, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import { LocalWebStorageService } from '../storage/local-web-storage.service';
import { SessionWebStorageService } from '../storage/session-web-storage.service';
import { InMemoryStorageService } from '../storage/in-memory-storage.service';
import { LogOutService } from '../logout/logout.service';

@Component({
    selector: 'signout',
    templateUrl: './sign-out.component.html',
    styleUrls: ['./sign-out.component.css']

})

export class SignOutComponent implements OnInit{


    constructor(private localWebStorage: LocalWebStorageService,
        private sessionWebStorageService: SessionWebStorageService,
        private inMemoryStorageService: InMemoryStorageService,private logoutService:LogOutService) {
    }

     ngOnInit() {
         this.signOut();
     }

    onLoginAgain() {
        window.location.reload();
    }

    signOut() {
        this.logoutService.signOut().subscribe((response:any) => {
            this.clearStorage();
    });
    }

    clearStorage() {
        this.localWebStorage.clear();
        this.sessionWebStorageService.clear();
        this.inMemoryStorageService.clear();
    }
}

