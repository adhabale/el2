import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'session-timeout',
    templateUrl: './session-timeout.component.html',
    styleUrls: ['./session-timeout.component.css']
})

export class SessionTimeoutComponent implements OnInit {

    constructor(private router:Router) {
    }

    ngOnInit() {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        setTimeout(() => {
            window.location.reload();
          }, 15000);    
    } 




}