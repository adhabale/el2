import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivityLogSearch } from './activity-log-search'
import * as moment from 'moment/moment';
import * as _ from 'lodash';
import { ActivityLogModel } from './models/activity-log.model';
import { ActivityLogDataService } from './services/activity-log-data.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { AutocompleteComponent } from './auto-complete/auto-complete.component';
import { LogData } from './entities/log-data';
import { SearchCriteria } from './entities/search-criteria';
import { find } from '../../../../node_modules/rxjs/operator/find';
declare var $: any;

@Component({
  selector: 'activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})

export class ActivityLogComponent implements OnInit {

  public model1: string;
  count: any = 0;
  searchUserName: string = "";
  fromDate: any;
  toDate: any;
  isfromDateInvalid: boolean;
  istoDateInvalid: boolean;
  activityLogSearch: ActivityLogSearch;
  dateFlag: boolean;
  userNameFlag: boolean;
  actionFlag: boolean;
  detailsFlag: boolean;
  serverFlag: boolean;
  viewModuleFlag: boolean;
  scFlag: boolean;
  showResult: boolean = false;
  duplicate: boolean = false;


  selectedUserNames = [];
  isSelected: boolean = false;
  removedIndex: number;
  updatedList = []
  activityLogs: any[];
  activityLogModel: ActivityLogModel;
  actionData: any[];
  viewData: any[];
  logData: SearchCriteria = new SearchCriteria();
  resetCalled: boolean = false;
  checkArray: any[];


  constructor(service: ActivityLogDataService) {
    this.activityLogModel = new ActivityLogModel(service);
    this.logData.searchCriteria

  }

  ngOnInit() {
    this.getAllDropDownValues();
    this.logData = new SearchCriteria();
    var pastDate = new Date();
    var pastYear = pastDate.getFullYear() - 1;
    pastDate.setFullYear(pastYear);
    this.logData.pageNumber = 1;
    this.getActivityLogData(true);
  }

  getUserNames(searchText: string) {
    this.activityLogModel.getUserDetails(searchText).subscribe(response => {
      this.updatedList = response;

    })
  }

  getAllDropDownValues() {

    let view = this.activityLogModel.getModeValues();
    let action = this.activityLogModel.getActionValues();

    forkJoin([view, action]).subscribe(results => {
      if (results[0])
        this.viewData = results[0].sort();
      if (results[1])
        this.actionData = results[1].sort();
    });

  }

  setUsers() {
    if (this.selectedUserNames) {
      this.logData.userName = [];
      this.selectedUserNames.forEach(item => {
        this.logData.userName.push(item.principalId);
      });
    }
  }

  fetchData(pageNo) {
    this.setUsers();
    this.logData.pageNumber = pageNo;
  }

  onSearch() {
    this.logData.pageNumber = 1;
    this.getActivityLogData(true);
  }

  onReset() {
    this.selectedUserNames.forEach(uName => {
      this.remove(uName);
    })
    this.logData = new SearchCriteria();
    this.fromDate = this.toDate = {};
    this.logData.pageNumber = 1;
    this.resetSortFlag();//reset sort flag
    document.getElementById('resetButtonText').click();
    this.onSearch();
  }

  resetSortFlag() {
    //set flag to false
    this.dateFlag = false;
    this.actionFlag = false;
    this.scFlag = false;
    this.detailsFlag = false;
    this.serverFlag = false;
    this.userNameFlag = false;
    this.viewModuleFlag = false;
  }

  total: number = 2000;

  getActivityLogData(onload) {
    this.setUsers();
    this.activityLogModel.getActivitylogsData(this.logData).subscribe(response => {
      // if (!onload) {
      //   this.activityLogs = response.data;
      //   //below code - kept it for testing purpose 
      //   var i;
      //   for (i = 0; i < 100; i++) {
      //     this.activityLogs.push(response.data[0]);
      //   }
      // }
      //below code - kept it for testing purpose 
      this.activityLogs = response.data;
      if (onload) {
        //response.count = this.total;// = this.total + 100; // this is kept for testing purpose
        this.count = response.count;
        // this.activityLogs = response.data;
        // //below code - kept it for testing purpose 
        // var i;
        // for (i = 0; i < 50; i++) {
        //   this.activityLogs.push(response.data[0]);
        // }
        //this.logData.pageNumber = 1;
        //this.getActivityLogData(undefined);
      }
      this.showResult = true;
    }
      , error => {
        alert("Something Went Wrong..");
      }
    )
  }


  onExport() {

    this.logData.pageNumber = 1;
    this.setUsers();
    this.activityLogModel.getReportGeneration(this.logData).subscribe(data => {
      alert("Exported file will be sent to your email Id soon");
    });

  }

  public callBack(newVal1) {
    this.model1 = newVal1;
  }

  setfromDate(fromDate: string) {
    this.logData.fromDate = fromDate;
  }

  setToDate(toDate: string) {
    this.logData.toDate = toDate;
  }
  checkfromDateFormat(value: boolean) {
    if (value)
      this.isfromDateInvalid = false;
    else
      this.isfromDateInvalid = true;
  }

  checktoDateFormat(value: boolean) {
    if (value)
      this.istoDateInvalid = false;
    else
      this.istoDateInvalid = true;
  }

  checkDateValidation() {

    if (this.logData.fromDate && this.logData.toDate && !this.isfromDateInvalid && !this.istoDateInvalid) {
      return moment(this.logData.toDate).isBefore(this.logData.fromDate);
    } else {
      return false;
    }
  }

  sortByDate() {
    if (this.dateFlag) {
      this.logData.orderBy = 'EventDateTime asc';
    }
    else {
      this.logData.orderBy = 'EventDateTime desc';
    }
    this.dateFlag = !this.dateFlag;
    this.getActivityLogData(undefined);
  }

  sortByUserName() {
    if (this.userNameFlag) {
      this.logData.orderBy = 'DisplayName asc';
    }
    else {
      this.logData.orderBy = 'DisplayName desc';
    }
    this.userNameFlag = !this.userNameFlag;
    this.getActivityLogData(undefined);
  }

  sortByAction() {
    if (this.actionFlag) {
      this.logData.orderBy = 'Action asc';
    }
    else {
      this.logData.orderBy = 'Action desc';
    }
    this.actionFlag = !this.actionFlag;
    this.getActivityLogData(undefined);
  }

  sortByDetails() {
    if (this.detailsFlag) {
      this.logData.orderBy = 'Details asc';
    }
    else {
      this.logData.orderBy = 'Details desc';
    }
    this.detailsFlag = !this.detailsFlag;
    this.getActivityLogData(undefined);
  }

  sortByServer() {
    if (this.serverFlag) {
      this.logData.orderBy = 'ApplicationAddress asc';
    }
    else {
      this.logData.orderBy = 'ApplicationAddress desc';
    }
    this.serverFlag = !this.serverFlag;
    this.getActivityLogData(undefined);
  }


  sortByViewModule() {
    if (this.viewModuleFlag) {
      this.logData.orderBy = 'ModuleName asc';
    }
    else {
      this.logData.orderBy = 'ModuleName desc';
    }
    this.viewModuleFlag = !this.viewModuleFlag;
    this.getActivityLogData(undefined);
  }

  sortBySearchCriteria() {
    if (this.scFlag) {
      this.logData.orderBy = 'SearchCriteria asc';
    }
    else {
      this.logData.orderBy = 'SearchCriteria desc';
    }
    this.scFlag = !this.scFlag;
    this.getActivityLogData(undefined);
  }

  remove(item) {
    var index = this.selectedUserNames.indexOf(item);
    this.selectedUserNames[index].checked = false;
    this.selectedUserNames.splice(this.selectedUserNames.indexOf(item), 1);
    document.getElementById('resetButtonText').click();
  }

  onPageChange(pageIndex) {
    setTimeout(() => {
      this.logData.pageNumber = pageIndex;
      this.getActivityLogData(undefined);
    });
  }



  selectedUsers(list) {
    this.isSelected = true;
    this.selectedUserNames = list;
  }

}
