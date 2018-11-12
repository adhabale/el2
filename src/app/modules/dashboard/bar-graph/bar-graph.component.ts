import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnDestroy } from '@angular/core';

import { chart } from 'highcharts';
import { AccountModel } from '../../account/models/account.model';
import { AccountService } from '../../account/services/account.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { AccountStatusByMonth } from '../../account/entity/account-status-bymonth';
import * as _ from 'lodash';

@Component({
  selector: 'bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.css'],
  providers:[AccountService]
})

export class BarGraphComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('chartTarget') chartTarget: ElementRef;
  chart: Highcharts.ChartObject;
  private accountModel:AccountModel;
  accountStatusByMonth:AccountStatusByMonth[];
  month=[];
  count=[];

  constructor(private accountService:AccountService,private localWebStorage:LocalWebStorageService) { 
      this.accountModel = new AccountModel(accountService, localWebStorage);
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.accountModel.getAccountStatusByMonth().subscribe(result => {
      this.accountStatusByMonth=result;
      _.forEach(this.accountStatusByMonth,(status)=>{
        this.month.push(status.month);
        this.count.push(status.count);
      })
      const options: Highcharts.Options = {
        chart: {
          type: 'column'
        },
        credits: {
          text: `${new Date().getFullYear()} WTW © All Rights Reserved`,
          href: '',
          position: {
              align: 'right'
          }
      },
        title: {
          text: 'New EL Subscriptions',
          align:'left'
        },
        xAxis: {
          categories: this.month,
          title: {
            text: 'Years'
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Number of subscriptions'
          },
          labels: {
            formatter: function() {
              if(Number(this.value) === this.value && this.value % 1 === 0)
                return this.value;
            }
        },
        },
        series: [{
          name: 'New Subscriptions',
          color: '#5D63D3',
          data: this.count
        }]
      };
  
      this.chart = chart(this.chartTarget.nativeElement, options);
    });
  }

  ngOnDestroy() {
    this.chart = null;
  }
}