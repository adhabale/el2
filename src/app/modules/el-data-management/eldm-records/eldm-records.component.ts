import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ValidateLossDataSubmissionModel } from '../../validate-loss-data-submission/shared/models/validatelossDataSubmission.model';
import * as _ from 'lodash';
import { ValidateLossDataSubmissionService } from '../../validate-loss-data-submission/validate-loss-data-submission.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { SearchOutput } from '../eldm-filters/entities/search-output';
import { EldmRecordsModel } from './model/eldm-records-model';
@Component({
  selector: 'eldm-records',
  templateUrl: './eldm-records.component.html',
  styleUrls: ['./eldm-records.component.css'],
})

export class ELDMRecordsComponent implements OnInit {

  //input paremeter
  @Input() lossDataSubmissionData: SearchOutput = new SearchOutput();
  @Output() onPageEvent: EventEmitter<string> = new EventEmitter<string>();

  //private variables used
  currentPageIndex: number = 1;
  lossDataSubmission: any = [];
  eldmRecordsModel: EldmRecordsModel;
  isEditOn: any = false;
  isDeleted: boolean = false;
  isUpdated: Boolean = false;

  //model object defined
  private lossDataSubmissionModel: ValidateLossDataSubmissionModel;

  //constructor defined
  constructor(private lossService: ValidateLossDataSubmissionService, localWebStorage: LocalWebStorageService) {
    this.lossDataSubmissionModel = new ValidateLossDataSubmissionModel(lossService, localWebStorage);
  }

  //init event
  ngOnInit() {

  }

  //Page change event
  onPageChange($event) {
    this.lossDataSubmission = $event;
    this.onPageEvent.emit();
    this.isEditOn = false;
    window.scrollTo(0, 0);
  }

  //report change
  onReportTypeChange() {

  }

  //delete event
  onDelete(param) {
    this.lossDataSubmissionData.incidentId = this.lossDataSubmissionData.incidentId.filter(x => x != param);
    this.lossDataSubmission[0] = this.lossDataSubmissionData.incidentId[0]; this.currentPageIndex = 1;
  }

  //edit event
  onEdit() {
    this.isEditOn = {};// value set to {} because it is not called while ngOnChanges if i set it boolean
  }

  //cancel event
  onCancel() {
    this.isEditOn = false;
    window.scrollTo(0, 0);
  }

}
