import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LossDataSubmissionModel } from '../models/loss-data-submission.model';
import { LossDataSubmissionService } from '../services/loss-data-submission.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import * as _ from 'lodash';
import { LossSubmission } from '../entities/loss-submission';
import { ConfigurationService } from '../../../shared/configuration/configuration.service';

@Component({
  selector: 'loss-data-submission-history',
  templateUrl: './loss-data-submission-history.component.html',
  styleUrls: ['./loss-data-submission-history.component.css']
})
export class LossDataSubmissionHistoryComponent implements OnInit {

  constructor(private configurationService: ConfigurationService,private router: Router, private lossDataSubmissionService: LossDataSubmissionService, private localWebStorageService:LocalWebStorageService )
  {
    this.lossDataSubmissionModel=new LossDataSubmissionModel(lossDataSubmissionService,localWebStorageService)
  }

  selectedLossType: string;
  idFlag: boolean; idFileRef: boolean; idName: boolean; idType: boolean; idSubmittedBy: boolean; idTime: boolean; idStatus: boolean; idStatusComment: boolean;
  lossDataSubmissionModel:LossDataSubmissionModel;
  allLossDataSubmissionData:LossSubmission[]=[];
  lossDataSubmissionData:LossSubmission[]=[];
  userInfo:any={};
  contactsUsUrl:string;
  ngOnInit() {
    this.lossDataSubmissionModel.setReadOnlyFlag(false);
    this.getLossDetails();
    this.userInfo = JSON.parse(this.configurationService.loggedInUserInfo);
    this.contactsUsUrl = this.configurationService.contactUsUrl;

  }

  onPageChange(pageItem) {
    setTimeout(() => {
        this.lossDataSubmissionData = pageItem;
        //this.loaderService.hide();
    });
}

  getLossDetails(){
    this.lossDataSubmissionModel.getAllLossData().subscribe(data=>
      {
        data.forEach(val=>
          {
            if(val.adjusterFileRef==null || val.adjusterFileRef==undefined)
            {
              val.adjusterFileRef="";
            }
            if(val.adjusterFileRef && val.adjusterFileRef.length >=9){
              val.adjusterFileRef=(val.adjusterFileRef).slice(0,9)+'...';
            }
          }
        )
        this.allLossDataSubmissionData=data;
        this.sortById();
     
      });
  }


  openNewSubmissionModal() {
    document.getElementById('openSelectionModal').click();
  }
  onLossTypeSelection(selectedLossType: string) {
    this.lossDataSubmissionModel.setReadOnlyFlag(false);
    switch (this.selectedLossType) {
      case "UP":
        this.router.navigate(['/loss-data-submission/upstream-loss']);
        break;
      case "DOWN":
        this.router.navigate(['/loss-data-submission/downstream-loss']);
        break;
      case "POWER":
        this.router.navigate(['/loss-data-submission/power-loss']);
        break;
    }
  }
  openReadOnlyMode(selectedLossType: string,id:number) {
    
    this.lossDataSubmissionModel.setReadOnlyFlag(true);
    this.lossDataSubmissionModel.setIncidentId(id);
    this.lossDataSubmissionModel.setLossType(selectedLossType);
   
    //console.log(this.lossDataSubmissionModel.getReadOnlyFlag());
    switch (selectedLossType) {
      case "Upstream":
        this.router.navigate(['/loss-data-submission/upstream-loss']);
        break;
      case "Downstream":
        this.router.navigate(['/loss-data-submission/downstream-loss']);
        break;
      case "Power":
        this.router.navigate(['/loss-data-submission/power-loss']);
        break;
    }
  }
  sortById() {
    if (this.idFlag) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['submissionId'], ['asc']);
      this.idFlag = !this.idFlag;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['submissionId'], ['desc']);
      this.idFlag = !this.idFlag;
    }
  }
  sortByFileRef() {
    if (this.idFileRef) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['adjusterFileRef'], ['asc']);
      this.idFileRef = !this.idFileRef;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['adjusterFileRef'], ['desc']);
      this.idFileRef = !this.idFileRef;
    }
  }
  sortByCustomerName() {
    if (this.idName) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['clientName'], ['asc']);
      this.idName = !this.idName;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['clientName'], ['desc']);
      this.idName = !this.idName;
    }
  }
  sortByType() {
    if (this.idType) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['lossType'], ['asc']);
      this.idType = !this.idType;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['lossType'], ['desc']);
      this.idType = !this.idType;
    }
  }
  sortBySubmittedBy() {
    if (this.idSubmittedBy) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['submittedBy'], ['asc']);
      this.idSubmittedBy = !this.idSubmittedBy;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['submittedBy'], ['desc']);
      this.idSubmittedBy = !this.idSubmittedBy;
    }
  }
  sortByTime() {
    if (this.idTime) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['submissionDate'], ['desc']);
      this.idTime = !this.idTime;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['submissionDate'], ['asc']);
      this.idTime = !this.idTime;
    }
  }
  sortByStatus() {
    if (this.idStatus) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['status'], ['asc']);
      this.idStatus = !this.idStatus;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['status'], ['desc']);
      this.idStatus = !this.idStatus;
    }
  }
  sortByStatusComment() {
    if (this.idStatusComment) {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['statusComment'], ['asc']);
      this.idStatusComment = !this.idStatusComment;
    }
    else {
      this.allLossDataSubmissionData = _.orderBy(this.allLossDataSubmissionData, ['statusComment'], ['desc']);
      this.idStatusComment = !this.idStatusComment;
    }
  }
  onClose():void{
  }
}
