import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { LocalWebStorageService } from '../../shared/storage/local-web-storage.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


    constructor(private localWebStorageService:LocalWebStorageService,private router:Router, private configurationService: ConfigurationService) {
        
    }

    ngOnInit() {
       
    }

    

}