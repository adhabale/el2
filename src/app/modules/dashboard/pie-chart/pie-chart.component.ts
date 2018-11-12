import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';
import { chart } from 'highcharts';
import { AccountModel } from '../../account/models/account.model';
import { AccountService } from '../../account/services/account.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { AccountStatus } from '../../account/entity/account-status';

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css'],
    providers:[AccountService]
})

export class PieChartComponent implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild('pieChartTarget') pieChartTarget: ElementRef;
    chart: Highcharts.ChartObject;

    private accountModel:AccountModel;
    accountStatus:AccountStatus;

    constructor(private accountService:AccountService,private localWebStorage:LocalWebStorageService) { 
        this.accountModel = new AccountModel(accountService, localWebStorage);
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.accountModel.getAccountStatus().subscribe((result)=> {
            this.accountStatus=result;

            const options: Highcharts.Options = {
                chart: {
                    type: 'pie',
                     height:400
                },
                
        credits: {
            text: ``,
            href: '',
            position: {
                align: 'right'
            }
        },
                title: {
                    text: '',
                    align:'left'
                },
                tooltip: {
                    //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                    enabled:false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }                    
                },
    
                series: [{
                    name: 'Status',
                    data: [{
                        name: 'Active',
                        color: '#C111A0',
                        y: this.accountStatus.active
                    }, {
                        name: 'Inactive',
                        color: '#FFB81C',
                        y: this.accountStatus.inactive
                    }]                
                }]
            };
    
            this.chart = chart(this.pieChartTarget.nativeElement, options);
        })
        
    }

    ngOnDestroy() {
        this.chart = null;
    }
}
