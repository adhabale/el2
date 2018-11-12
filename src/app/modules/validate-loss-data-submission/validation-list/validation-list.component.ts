import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateLossDataSubmissionModel } from '../shared/models/validatelossDataSubmission.model';
import * as _ from 'lodash';
import { LossSubmission } from '../../loss-data-submission/entities/loss-submission';
import { ValidateLossDataSubmissionService } from '../validate-loss-data-submission.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
@Component({
  selector: 'validation-list',
  templateUrl: './validation-list.component.html',
  styleUrls: ['./validation-list.component.css']
})
export class ValidationListComponent implements OnInit {

  lossDataSubmissionModel: ValidateLossDataSubmissionModel;

  constructor(private router: Router, private lossService: ValidateLossDataSubmissionService, localWebStorage: LocalWebStorageService) {
    this.lossDataSubmissionModel = new ValidateLossDataSubmissionModel(lossService, localWebStorage);
  }
  selectedLossType: any;
  idFlag: boolean; idFileRef: boolean; idName: boolean; idType: boolean; idSubmittedBy: boolean; idTime: boolean; idStatus: boolean; idStatusComment: boolean;
  idReviewDate: boolean
  lossDataSubmissionData: LossSubmission[] = [];
  lossDataSubmissionDataInPage: LossSubmission[] = [];
  ngOnInit() {
    // this.lossDataSubmissionModel.setValidationFormType(false);
    this.getLossDetails();

  }

  getLossDetails() {
    this.lossDataSubmissionModel.getAllLossData().subscribe(data => {
      data.forEach(val => {
        if (val.adjusterFileRef != null && val.adjusterFileRef != undefined) {
          if (val.adjusterFileRef.length >= 9) {
            val.adjusterFileRef = (val.adjusterFileRef).slice(0, 9) + '...';
          }
        }
      }
      )
      this.lossDataSubmissionData = data;
      this.lossDataSubmissionData = this.lossDataSubmissionData.filter(datum => datum.status == "OnHold" || datum.status == "Submitted");
      this.sortById();
    });
  }

  onPageChange(pageItem) {
    setTimeout(() => {
      this.lossDataSubmissionDataInPage = pageItem;
      //this.loaderService.hide();
    });
  }

  // public lossDataSubmissionData1 = [
  //   { subId: '12345', referenceFile: '21242', customerName: 'British Petroleum', lossType: 'UpStream', submittedBy: 'John Davis', Date: '25-Apr-2018 13:05', Status: 'Submitted', ReviewDate: '25-Apr-2018', StatusComment: 'All Information Valid' },
  //   { subId: '56524', referenceFile: '32312', customerName: 'Austria Oil and Gas', lossType: 'UpStream', submittedBy: 'John Davis', Date: '30-Apr-2018 13:10', Status: 'On-Hold', ReviewDate: '25-Apr-2018', StatusComment: 'Information not valid for further actions' },
  //   { subId: '32123', referenceFile: '54542', customerName: 'American Oil Inc.', lossType: 'Downstream', submittedBy: 'John Davis', Date: '30-Apr-2018 15:30', Status: 'Submitted', ReviewDate: '25-Apr-2018', StatusComment: 'Not Valid Loss Type' },
  //   { subId: '87872', referenceFile: '29876', customerName: 'British Petroleum', lossType: 'Power', submittedBy: 'John Davis', Date: '30-Apr-2018 09:30', Status: 'On-Hold', ReviewDate: '25-Apr-2018', StatusComment: 'Need More Information' },
  //   { subId: '98981', referenceFile: '98262', customerName: 'British Petroleum', lossType: 'Power', submittedBy: 'John Davis', Date: '30-Apr-2018 10:45', Status: 'Submitted', ReviewDate: '25-Apr-2018', StatusComment: 'Need More Information' },
  //   { subId: '76767', referenceFile: '64528', customerName: 'British Oil Inc.', lossType: 'UpStream', submittedBy: 'John Davis', Date: '30-Apr-2018 14:45', Status: 'Submitted', ReviewDate: '25-Apr-2018', StatusComment: 'Valid' },
  //   { subId: '12332', referenceFile: '19092', customerName: 'Antar Petroleum', lossType: 'UpStream', submittedBy: 'John Davis', Date: '30-Apr-2018 15:30', Status: 'On-Hold', ReviewDate: '25-Apr-2018', StatusComment: 'Not Valid Loss Type' },
  //   { subId: '24314', referenceFile: '67261', customerName: 'British Petroleum', lossType: 'Downstream', submittedBy: 'John Davis', Date: '30-Apr-2018 13:50', Status: 'On-Hold', ReviewDate: '25-Apr-2018', StatusComment: 'Need More Information' },
  //   { subId: '87171', referenceFile: '19802', customerName: 'British Oil and Gas', lossType: 'UpStream', submittedBy: 'John Davis', Date: '30-Apr-2018 17:30', Status: 'Submitted', ReviewDate: '25-Apr-2018', StatusComment: 'Need More Information' },
  //   { subId: '32123', referenceFile: '54542', customerName: 'Columbia Oil Inc.', lossType: 'Downstream', submittedBy: 'John Davis', Date: '30-Apr-2018 19:30', Status: 'Submitted', ReviewDate: '25-Apr-2018', StatusComment: 'Information Done and Verified' },
  //   { subId: '87872', referenceFile: '29876', customerName: 'Canada Petroleum', lossType: 'Power', submittedBy: 'John Davis', Date: '30-Apr-2018 16:00', Status: 'On-Hold', ReviewDate: '25-Apr-2018', StatusComment: 'Information not valid' },
  //   { subId: '98981', referenceFile: '98262', customerName: 'British Petroleum', lossType: 'Power', submittedBy: 'John Davis', Date: '30-Apr-2018 17:40', Status: 'Submitted', ReviewDate: '25-Apr-2018', StatusComment: 'Information corrected but not verified' }

  // ]
  openNewSubmissionModal() {
    document.getElementById('openSelectionModal').click();
  }
  openValidatePage(lossDataSubmission) {
    this.lossDataSubmissionModel.setValidationFormType(lossDataSubmission.lossType);
    this.lossDataSubmissionModel.setSubscriptionID(lossDataSubmission.submissionId);
    this.lossDataSubmissionModel.setStatus(lossDataSubmission.status);
    this.lossDataSubmissionModel.setIncidentId(lossDataSubmission.incidentId);
    this.lossDataSubmissionModel.setDisplayName(lossDataSubmission.submittedBy);
    this.lossDataSubmissionModel.setDateOfSub(lossDataSubmission.submissionDate);
    this.router.navigate(['/validate-loss-data-submission/validate-LossDataForm']);
  }
  sortById() {
    if (this.idFlag) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['submissionId'], ['asc']);
      this.idFlag = !this.idFlag;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['submissionId'], ['desc']);
      this.idFlag = !this.idFlag;
    }
  }
  sortByFileRef() {
    if (this.idFileRef) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['adjusterFileRef'], ['asc']);
      this.idFileRef = !this.idFileRef;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['adjusterFileRef'], ['desc']);
      this.idFileRef = !this.idFileRef;
    }
  }
  sortByCustomerName() {
    if (this.idName) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['clientName'], ['asc']);
      this.idName = !this.idName;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['clientName'], ['desc']);
      this.idName = !this.idName;
    }
  }
  sortByType() {
    if (this.idType) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['lossType'], ['asc']);
      this.idType = !this.idType;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['lossType'], ['desc']);
      this.idType = !this.idType;
    }
  }
  sortBySubmittedBy() {
    if (this.idSubmittedBy) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['submittedBy'], ['asc']);
      this.idSubmittedBy = !this.idSubmittedBy;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['submittedBy'], ['desc']);
      this.idSubmittedBy = !this.idSubmittedBy;
    }
  }
  sortByTime() {
    if (this.idTime) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['submissionDate'], ['desc']);
      this.idTime = !this.idTime;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['submissionDate'], ['asc']);
      this.idTime = !this.idTime;
    }
  }
  sortByReviewDate() {
    if (this.idStatus) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['status'], ['asc']);
      this.idStatus = !this.idStatus;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['status'], ['desc']);
      this.idStatus = !this.idStatus;
    }
  }
  sortByStatus() {
    if (this.idStatus) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['status'], ['asc']);
      this.idStatus = !this.idStatus;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['status'], ['desc']);
      this.idStatus = !this.idStatus;
    }
  }
  sortByStatusComment() {
    if (this.idStatusComment) {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['statusComment'], ['asc']);
      this.idStatusComment = !this.idStatusComment;
    }
    else {
      this.lossDataSubmissionData = _.orderBy(this.lossDataSubmissionData, ['statusComment'], ['desc']);
      this.idStatusComment = !this.idStatusComment;
    }


  }
  onClose(): void {
  }
}
