import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Chart } from 'highcharts';

@Component({
    templateUrl: './loss-data-dashboard.component.html',
    styleUrls: ['./loss-data-dashboard.component.css']
})

export class LossDataDashboardComponent {

    mapLoadedEvent(status: boolean) {
        console.log('The map loaded: ' + status);
    }
    
    isMobile = false;
 
    ngOnInit() {
        if (window.screen.width <= 460){
            this.isMobile = true;
        }
    };
}