import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateLossDataSubmissionModel } from '../shared/models/validatelossDataSubmission.model';
import { NotificationMessage } from '../../common/entity/notification-message';
import { ConfirmationModal } from '../../announcements/entities/confirmation-modal';
//import * as $ from 'jquery';
import { FormLookUp } from '../shared/entities/formLookUp';
import { FormFilter } from '../shared/entities/formFilter';
import { ValidateLossDataSubmissionService } from '../validate-loss-data-submission.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { IncidentInvolvement } from '../shared/entities/incident-involvement';
import { Exposure } from '../shared/entities/exposure';
import { LocationDetails } from '../shared/entities/location';
import { Loss } from '../shared/entities/loss';
import { PartyRole } from '../shared/entities/party-role';
import { LossSubmission } from '../shared/entities/lossSubmission';
import { LossClaims } from "../shared/entities/loss-claims";
import { SearchField } from '../../search/entities/search-field';
import { AutoCompleteComponent } from '../../../user-controls/auto-complete/auto-complete.component';
import { LatLong } from '../shared/entities/latLong';
import { YearIndexLookUp } from '../shared/entities/yearIndexLookUp';
import { SourceSubscriptionData } from '../shared/entities/sourceSubscirptionData';
import { LossRangesData } from '../shared/entities/lossRangesData';
import { NgForm } from '@angular/forms';
import * as moment from 'moment/moment';
import { CoverageClaim } from '../shared/entities/coverageClaim';
import { DecimalPipe } from '@angular/common';
import { SearchFieldWithType } from '../shared/entities/searchFieldWithType';
import { isNumeric } from "rxjs/util/isNumeric";
import { TabIndexService } from '../../../shared/TabIndex/tabindex.service';


declare var $: any;

@Component({
  selector: 'validate-LossDataForm',
  templateUrl: './validate-LossDataForm.component.html',
  styleUrls: ['./validate-LossDataForm.component.css'],
  providers: [DecimalPipe]
})
export class ValidateLossDataFormComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() subscriptionId: number;
  @Input() subscriptionStatus: string = '';
  @Input() isEditOn: any = true;
  @Input() isELDMMode: boolean = false;
  @Input() pdOutput: number;
  @Input() oeeOutput: number;
  @Input() biOutput: number;
  @Output() onEditEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCancelEvent: EventEmitter<string> = new EventEmitter<string>();
  notificationMessage: NotificationMessage = new NotificationMessage();
  confirmationModal: ConfirmationModal;
  pd: any;
  oee: any;
  status: string;
  createdBy: string;
  createdOn: string;
  updatedOn: string;
  dmeters: number;
  dfeet: number;
  msg: string;
  errorOccured: boolean = false;
  possInsVal: string;
  actInsVal: string;
  invalidLatError: boolean;
  invalidLongError: boolean;
  @Input() incidentId: number;


  private lossDataSubmissionModel: ValidateLossDataSubmissionModel;

  totalClaim: number;
  claimPDFlag: boolean = false;
  claimBIFlag: boolean = false;
  claimOEEFlag: boolean = false;
  claimCBIFlag: boolean = false;
  claimSnPFlag: boolean = false;

  iTotalClaim: number;
  iOee: number;
  day: string;
  month: string;
  year: string;
  selectedDate: string[];
  isDynamicallyPositioned: boolean;
  oilMulti: boolean;
  sourceExists: boolean;

  formLookUp: FormLookUp = new FormLookUp();
  formFilter: FormFilter = new FormFilter();
  latLongData: LatLong = new LatLong();

  lossTypeId: number = 0;
  lossTypeDisplayName: string = "";

  selectedItems: SearchField[] = [];
  coverageTypeIds: any[] = [];
  lossTypes: any[] = [];
  lossAmount: number;

  lossSubmissionStatus: string;
  lossSubmissionStatusComment: string;
  incompleteFlag: boolean;
  closeFlag: boolean;
  lossClaimId: number;

  lossId: number;
  waterDepthCategory: string;
  depthCategory: string;

  upDownPower: string;
  country: string;
  location: string;
  disableLatLong: boolean = false;
  indexFactor: number;
  pdClaimCategory: string;
  oeeClaimCategory: string;
  totalClaimCategory: string;
  pdIndexedClaimCategory: string;
  oeeIndexedClaimCategory: string;
  totalIndexedClaimCategory: string;
  isSelectedLossTypeFired: boolean = false;
  staticStatus: string;

  // sourceSubscriptionData: SourceSubscriptionData[];
  sourceSubscriptionData: any[];
  sourceList: string[] = [];
  installBuildYearCategory: string;
  lat: string;
  long: string;
  rebuiltYear: string;
  installationYear: string;
  manufactureYear: string;
  successButtonClicked: boolean = false;
  yearIndexLookUp: YearIndexLookUp[];
  allRoleData: any[];
  lossRangesData: LossRangesData[];
  lossClaimOriginal: LossClaims[];
  coverageClaim: CoverageClaim[];
  coverageClaimItem: CoverageClaim = new CoverageClaim();
  coverageIds: number[];
  dateData: any[] = [{ "day": [], "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], "year": ["1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "2019"] }];
  monthNames: string[] = ["January", "Febuary", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  submitButton: string = 'Save';
  lossType: number;
  multiselectIndex: number = 22;
  constructor(private dp: DecimalPipe, private router: Router,
    private localWebStorageService: LocalWebStorageService, private validateLossDataSubmissionService: ValidateLossDataSubmissionService,
    private tabIndexService: TabIndexService) {

    this.confirmationModal = new ConfirmationModal();
    this.confirmationModal.headerMessage = '';
    this.confirmationModal.bodyMessage = '';
    this.lossDataSubmissionModel = new ValidateLossDataSubmissionModel(validateLossDataSubmissionService, localWebStorageService);

    var lType: string = this.lossDataSubmissionModel.getValidationFormType();
    if (lType == "Upstream")
      this.lossType = 1;
    else if (lType == "Downstream")
      this.lossType = 2;
    else if (lType == "Power")
      this.lossType = 3;
  }

  prevIncident: number;
  loop: number = 0;

  ngOnInit() {
    //console.log('ngOnInit');
    this.onLoad();
  }

  //used in eldm module - for paging
  ngOnChanges(changes: SimpleChanges) {
    //console.log('ngOnChanges');
    for (let propName in changes) {
      if (propName == "incidentId") {
        let currentValue = changes[propName].currentValue;
        let previousValue = changes[propName].previousValue;
        if (currentValue != previousValue) {
          this.selectedItems = [];
          this.lossTypes = [];
          this.ngOnInit();
          this.isEditOn = false;
        }
      }
      //below logic added - ngOnChanges called only when @input data type is object
      if (propName == "isEditOn") {
        let currentValue = changes[propName].currentValue;
        if (typeof (currentValue) == 'object')
          currentValue == true;
      }
    }
  }


  ngAfterViewInit() {
    // this.assignTabIndex();
  }

  assignTabIndex() {
    this.tabIndexService.assignTabIndex();
    // $('#basic2,#basic3,#basic4').attr("aria-expanded", "false");
  }
  onLoad() {
    //console.log('onLoad Started');
    this.incidentId = (this.incidentId) ? this.incidentId : this.lossDataSubmissionModel.getIncidentId();
    this.formLookUp.lossSubmission = new LossSubmission();
    this.formFilter.createIncidentInvolvement = new IncidentInvolvement();
    this.formFilter.incidentInvolvement = new IncidentInvolvement();
    this.formFilter.createIncidentInvolvement.exposure = new Exposure();
    this.formFilter.incidentInvolvement.exposure = new Exposure();
    this.formFilter.createIncidentInvolvement.adjusterInd = new PartyRole();
    this.formFilter.incidentInvolvement.adjusterInd = new PartyRole();
    this.formFilter.incidentLocation = new LocationDetails();
    this.formFilter.location = new LocationDetails();
    this.formFilter.loss = new Loss();
    this.formFilter.loss.lossClaim = [new LossClaims()];
    this.lossClaimOriginal = [new LossClaims()];
    this.sourceList = [];
    this.selectedItems = [new SearchField(this.lossTypeId, this.lossTypeDisplayName)];
    this.coverageClaim = [new CoverageClaim()];
    this.coverageClaimItem = new CoverageClaim();
    this.coverageIds = [];
    this.sourceSubscriptionData = [new SourceSubscriptionData()];
    this.yearIndexLookUp = [new YearIndexLookUp()];
    this.allRoleData = [];
    this.lossRangesData = [new LossRangesData()];
    this.sourceExists = false;
    this.formFilter.createIncidentInvolvement.exposure.transit = false;

    this.latLongData = new LatLong();

    if (this.formFilter.createIncidentInvolvement.operationTypeId == 1) {
      this.upDownPower = "Upstream";
    }
    else if (this.formFilter.createIncidentInvolvement.operationTypeId == 2) {
      this.upDownPower = "Downstream";
    }
    else if (this.formFilter.createIncidentInvolvement.operationTypeId == 3) {
      this.upDownPower = "Power";
    }
    this.dateData[0].year = this.generateYear();
    this.getAllDropDownValues();
    this.getLossRanges();

    this.getAllIndices();
    this.getAllRoles();



    this.subscriptionId = (Number)(this.formFilter.loss.submissionId);



    //     var x=document.getElementsByClassName('disabled');
    //     var i;
    // for (i = 0; i < x.length; i++) {
    //     x[i].setAttribute('disabled','true');
    // }
  }
  // checkButton() {
  //   if (this.formFilter.loss.lossClaim[0].status == 'Approved' || this.formFilter.loss.lossClaim[0].status == 'Rejected') {
  //     this.submitButton = "Submit"
  //   }
  //   else this.submitButton = "Save"
  // }

  onBackToHistory(validateForm: NgForm) {
    //document.getElementById('backButton').click();
    if (validateForm.dirty) {
      $("#backButtonPopup").modal('show');
    }
    else
      this.router.navigate(['validate-loss-data-submission/validation-list']);
    // if(this.router.) {

    // }    
  }



  onSubmit(status) {
    if (this.isELDMMode) {
      $("#confirmUpdatedDate").modal('show');
    }
    else {
      document.getElementById('successButton').click();
      this.status = status;
    }
  }

  generateYear(): number[] {
    let years: number[] = [];
    for (var i = new Date().getFullYear(); i >= 1972; i--) {
      years.push(i);
    }
    return years;
  }

  getDays() {
    if (this.month && this.year) {
      this.dateData[0].day = this.generateDays();
    }
    else {
      this.dateData[0].day = [];
    }
  }

  generateDays() {
    let days: number[] = [];
    for (var i = 1; i <= this.daysInMonth(this.year, this.month); i++) {
      days.push(i);
    }
    return days;
  }

  daysInMonth(year, month) {
    return moment(year + "-" + month, "YYYY-MMM").daysInMonth();
  }

  changeIndexFactor() {
    this.indexFactor = Number((this.getIndexValue((new Date().getFullYear())) / this.getIndexValue((Number)(this.year))).toFixed(4));
    this.pdClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.pdAmount));
    this.oeeClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.oeeAmount));
    this.totalClaimCategory = this.checkForCostCategory((this.formatNumber(this.formFilter.loss.pdAmount) + this.formatNumber(this.formFilter.loss.oeeAmount) + this.formatNumber(this.formFilter.loss.biAmount)));
    this.pdIndexedClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.pdAmount) * this.indexFactor);
    this.oeeIndexedClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.oeeAmount) * this.indexFactor);
    this.totalIndexedClaimCategory = this.checkForCostCategory((this.formatNumber(this.formFilter.loss.pdAmount) + this.formatNumber(this.formFilter.loss.oeeAmount) + this.formatNumber(this.formFilter.loss.biAmount)) * this.indexFactor);
    //calculate indexed values here
    this.iTotalClaim = this.transform(Number((this.totalClaim * this.indexFactor).toFixed(0)));
    this.iOee = this.transform(Number((this.formFilter.loss.oeeAmount * this.indexFactor).toFixed(0)));
  }

  changeCostCategories() {
    this.pdClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.pdAmount));
    this.oeeClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.oeeAmount));
    this.totalClaimCategory = this.checkForCostCategory((this.formatNumber(this.formFilter.loss.pdAmount) + this.formatNumber(this.formFilter.loss.oeeAmount) + this.formatNumber(this.formFilter.loss.biAmount)));
    this.pdIndexedClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.pdAmount) * this.indexFactor);
    this.oeeIndexedClaimCategory = this.checkForCostCategory(this.formatNumber(this.formFilter.loss.oeeAmount) * this.indexFactor);
    this.totalIndexedClaimCategory = this.checkForCostCategory((this.formatNumber(this.formFilter.loss.pdAmount) + this.formatNumber(this.formFilter.loss.oeeAmount) + this.formatNumber(this.formFilter.loss.biAmount)) * this.indexFactor);
    this.totalClaim = this.formatNumber(this.formFilter.loss.pdAmount) + this.formatNumber(this.formFilter.loss.oeeAmount) + this.formatNumber(this.formFilter.loss.biAmount);
    //calculate indexed values here
    this.iTotalClaim = this.transform(Number((this.totalClaim * this.indexFactor).toFixed(0)));
    this.iOee = this.transform(Number((this.formFilter.loss.oeeAmount * this.indexFactor).toFixed(0)));

  }

  formatNumber(value: number): number {
    if (value == null || value == undefined) {
      return 0;
    }

    let formattedNumberString: string = "";
    let formattedNumber: number = 0;
    formattedNumberString = value.toString();
    if (formattedNumberString.indexOf(",") > -1) {
      // for (let charNum = 0; charNum < formattedNumber.length; charNum++) {
      //   if (formattedNumber[charNum] == ",") {
      //     formattedNumber[charNum] = "a";
      // }
      //formattedNumberString.replace(/,/g, '');
      formattedNumberString = formattedNumberString.replace(/\,/g, '');
      formattedNumber = (Number)(formattedNumberString);
    }
    else {
      formattedNumber = (Number)(formattedNumberString);
    }
    return formattedNumber;
  }

  transform(value: any): any {

    if (isNumeric(value))
      return this.dp.transform(value);

    return value;
  }

  checkDate() {

    if (this.day == undefined) {
      var fromDate = moment(new Date(this.formatDate("01", this.month, this.year)), "dd-MMM-yyyy");
    }
    else {
      var fromDate = moment(new Date(this.month + " " + this.day.toString() + "," + this.year), "dd-MMM-yyyy");
    }
    var currentDate = moment(new Date(), "dd-MMM-yyy");
    return fromDate.isAfter(currentDate, 'day');
  }

  formatDate(day, month, year): string {
    if (day || month) {
      if (month && !day) {
        return new Date(month + " " + "01" + "," + year).toDateString();
      }
      else if (!month && day) {
        return new Date("January" + " " + day.toString() + "," + year).toDateString();
      }
      else if (day && month) {
        return new Date(month + " " + day.toString() + "," + year).toDateString();
      }
    }
    else {
      return new Date("January 01," + year).toDateString();
    }
  }

  showPopover() {
    $(function () {
      ($('[data-toggle="popover"]') as any).popover({
        container: 'body'
      });
    });
  }

  getIndexValue(year: number) {
    let index: number;
    for (let indexValue of this.yearIndexLookUp) {
      if (year == indexValue.year) {
        index = indexValue.index;
      }
    }
    return index;
  }

  onSourceSelect(src: string) {
    this.formFilter.createIncidentInvolvement.subscriptionName = '';
    this.formFilter.createIncidentInvolvement.source = src;
    for (let srcSubData of this.sourceSubscriptionData) {
      if (srcSubData.source == src) {
        this.sourceExists = true;
        this.formFilter.createIncidentInvolvement.subscriptionName = srcSubData.subscription;
      }
      else {
        this.sourceExists = false;
        this.formFilter.createIncidentInvolvement.subscriptionName = this.formFilter.createIncidentInvolvement.subscriptionName;
      }
    }
  }

  getSourceList(sourceName: string) {
    // sourceName = "";
    this.validateLossDataSubmissionService.getSourceSubscriptionData(sourceName).subscribe(result => {
      this.sourceSubscriptionData = result;
      if (this.sourceSubscriptionData != null) {
        this.sourceList = [];
        for (let srcSubData of this.sourceSubscriptionData) {
          this.sourceList.push(srcSubData.source);
        }
      }
    });
  }

  selectedLossType(event) {
    this.isSelectedLossTypeFired = true;
    this.lossTypes = event
  }

  total() {
    return (this.formFilter.loss.pdAmount + this.formFilter.loss.oeeAmount + this.formFilter.loss.biAmount)
  }
  getAllIndices() {
    this.validateLossDataSubmissionService.getAllIndices().subscribe
      (response => {
        this.yearIndexLookUp = response;
      }
      )
  }

  getAllRoles() {
    this.validateLossDataSubmissionService.getRoles().subscribe
      (response => {
        this.allRoleData = response;
      }
      )
  }

  private getAllDropDownValues() {
    this.validateLossDataSubmissionService.getAdditionalLossInformation()
      .subscribe(response => {
        this.formLookUp = response;
        this.setAllTypeIdsForFiltering();
        this.getAllData();
      });
  }

  setAllTypeIdsForFiltering() {
    this.assignIdForOperationType(this.formLookUp.lossSubmission.categories1);
    this.assignIdForOperationType(this.formLookUp.lossSubmission.categories2);
    this.assignIdForOperationType(this.formLookUp.lossSubmission.categories3);
    this.assignIdForOperationType(this.formLookUp.lossSubmission.cause);
    this.assignIdForOperationType(this.formLookUp.lossSubmission.lossType);
  }

  assignIdForOperationType(searchFieldWithType: SearchFieldWithType[]) {
    searchFieldWithType.forEach(cat => {
      if (cat.type == "Upstream") {
        cat.typeId = 1;
      }
      else if (cat.type == "Downstream")
        cat.typeId = 2;
      else if (cat.type == "Power")
        cat.typeId = 3;
    })
  }

  private getLatLongData(location: string, country: string) {
    this.validateLossDataSubmissionService.getLatLongData(location, country)
      .subscribe(response => {
        if (response != null) {
          this.latLongData = response;
          this.lat = this.latLongData.lattitude;
          this.long = this.latLongData.longitude;
          this.disableLatLong = true;
          this.invalidLatError = false;
          this.invalidLongError = false;
        }
        else {
          this.lat = this.latLongData.lattitude = undefined;
          this.long = this.latLongData.longitude = undefined;
          this.disableLatLong = false;
        }
      })
  }

  formatInputPos() {
    if (this.possInsVal != null && this.possInsVal != undefined) {
      this.possInsVal = this.dp.transform(parseInt(this.possInsVal.toString().replace(/,/g, '')))
    }

  }

  formatInputAct() {
    if (this.actInsVal != null && this.actInsVal != undefined) {
      this.actInsVal = this.dp.transform(parseInt(this.actInsVal.toString().replace(/,/g, '')))
    }
  }

  private getAllData() {
    this.validateLossDataSubmissionService.getAllData(this.incidentId)
      .subscribe(response => {
        this.formFilter = response;


        if (this.formFilter.createIncidentInvolvement.operationTypeId == 1) {
          this.formLookUp.lossSubmission.categories1 = this.formLookUp.lossSubmission.categories1.filter(cat => cat.typeId == 1);
          this.formLookUp.lossSubmission.categories2 = this.formLookUp.lossSubmission.categories2.filter(cat => cat.typeId == 1);
          this.formLookUp.lossSubmission.categories3 = this.formLookUp.lossSubmission.categories3.filter(cat => cat.typeId == 1);
          this.formLookUp.lossSubmission.cause = this.formLookUp.lossSubmission.cause.filter(cat => cat.typeId == 1);
          this.formLookUp.lossSubmission.lossType = this.formLookUp.lossSubmission.lossType.filter(cat => cat.typeId == 1);
        }
        if (this.formFilter.createIncidentInvolvement.operationTypeId == 2) {
          this.formLookUp.lossSubmission.categories1 = this.formLookUp.lossSubmission.categories1.filter(cat => cat.typeId == 2);
          this.formLookUp.lossSubmission.categories2 = this.formLookUp.lossSubmission.categories2.filter(cat => cat.typeId == 2);
          this.formLookUp.lossSubmission.categories3 = this.formLookUp.lossSubmission.categories3.filter(cat => cat.typeId == 2);
          this.formLookUp.lossSubmission.cause = this.formLookUp.lossSubmission.cause.filter(cat => cat.typeId == 2);
          this.formLookUp.lossSubmission.lossType = this.formLookUp.lossSubmission.lossType.filter(cat => cat.typeId == 2);
        }
        if (this.formFilter.createIncidentInvolvement.operationTypeId == 3) {
          this.formLookUp.lossSubmission.categories1 = this.formLookUp.lossSubmission.categories1.filter(cat => cat.typeId == 3);
          this.formLookUp.lossSubmission.categories2 = this.formLookUp.lossSubmission.categories2.filter(cat => cat.typeId == 3);
          this.formLookUp.lossSubmission.categories3 = this.formLookUp.lossSubmission.categories3.filter(cat => cat.typeId == 3);
          this.formLookUp.lossSubmission.cause = this.formLookUp.lossSubmission.cause.filter(cat => cat.typeId == 3);
          this.formLookUp.lossSubmission.lossType = this.formLookUp.lossSubmission.lossType.filter(cat => cat.typeId == 3);
        }

        this.pdClaimCategory = this.checkForCostCategory(this.formFilter.loss.pdAmount);
        this.oeeClaimCategory = this.checkForCostCategory(this.formFilter.loss.oeeAmount);
        this.totalClaimCategory = this.checkForCostCategory(this.formFilter.loss.pdAmount + this.formFilter.loss.oeeAmount + this.formFilter.loss.biAmount);

        //if (this.formFilter.loss.lossClaim[0].status != 'Approved')
        //this.formFilter.loss.lossClaim[0].status = "OnHold";

        this.staticStatus = this.formFilter.loss.lossClaim[0].status;
        if (this.isELDMMode)
          this.formFilter.loss.lossClaim[0].status = "Approved";
        else
          this.formFilter.loss.lossClaim[0].status = "OnHold";

        this.totalClaim = this.formatNumber(this.formFilter.loss.pdAmount) + this.formatNumber(this.formFilter.loss.oeeAmount) + this.formatNumber(this.formFilter.loss.biAmount);


        //test 

        this.populateSelectedItems();

        this.lossClaimOriginal = this.formFilter.loss.lossClaim;

        // for (let item of this.formFilter.loss.lossClaim) {
        //   this.coverageClaimItem = new CoverageClaim();
        //   this.coverageClaimItem.coverageId = item.coverageTypeId;
        //   this.coverageClaimItem.claimId = item.lossClaimId;
        //   this.coverageClaim.push(this.coverageClaimItem);
        // }

        //this.lossClaimId = this.formFilter.loss.lossClaim[0].lossClaimID;
        this.lossId = this.formFilter.loss.lossClaim[0].lossId;
        this.createdOn = this.formFilter.createdOn;
        this.updatedOn = this.formFilter.updatedDate;

        setTimeout(2000);
        for (let ctry of this.formLookUp.lossSubmission.country) {
          if (ctry.id == this.formFilter.incidentLocation.countryId) {
            this.country = ctry.displayName;
          }
        }
        this.getLatLongData(this.formFilter.incidentLocation.location, this.country);
        this.indexFactor = this.getIndexValue((new Date().getFullYear())) / this.getIndexValue(new Date(this.formFilter.loss.reportDate).getFullYear());

        this.pdIndexedClaimCategory = this.checkForCostCategory(this.formFilter.loss.pdAmount * this.indexFactor);
        this.oeeIndexedClaimCategory = this.checkForCostCategory(this.formFilter.loss.oeeAmount * this.indexFactor);
        this.totalIndexedClaimCategory = this.checkForCostCategory((this.formFilter.loss.pdAmount + this.formFilter.loss.oeeAmount + this.formFilter.loss.biAmount) * this.indexFactor);

        this.indexFactor = Number((this.indexFactor).toFixed(4));

        //calculate indexed values here
        this.iTotalClaim = this.transform(Number((this.totalClaim * this.indexFactor).toFixed(0)));
        this.iOee = this.transform(Number((this.formFilter.loss.oeeAmount * this.indexFactor).toFixed(0)));


        this.rebuiltYear = new Date(this.formFilter.createIncidentInvolvement.exposure.rebuiltYear).getFullYear().toString();
        if (this.rebuiltYear == "1") {
          this.formFilter.createIncidentInvolvement.exposure.rebuiltYear = undefined;
          this.rebuiltYear = undefined;
        }
        // else {
        //   this.formFilter.createIncidentInvolvement.exposure.rebuiltYear = this.rebuiltYear.toString();
        // }
        this.installationYear = new Date(this.formFilter.createIncidentInvolvement.exposure.installationDate).getFullYear().toString();
        if (this.installationYear == "1") {
          this.formFilter.createIncidentInvolvement.exposure.installationDate = undefined;
          this.installationYear = undefined;
        }
        // else {
        //   this.formFilter.createIncidentInvolvement.exposure.installationDate = this.installationYear.toString();
        // }
        this.manufactureYear = new Date(this.formFilter.createIncidentInvolvement.exposure.buildDate).getFullYear().toString();
        if (this.manufactureYear == "1") {
          this.formFilter.createIncidentInvolvement.exposure.buildDate = undefined;
          this.manufactureYear = undefined;
        }

        // this.year = new Date(this.createdOn).getFullYear().toString();
        this.year = this.formFilter.loss.reportDate.substr(0, 4);
        // this.month = new Date(this.createdOn).getMonth().toString();
        this.month = this.formFilter.loss.reportDate.substr(5, 2);
        this.month = this.setMonth(this.month);
        if (this.year && this.month) {
          this.getDays();
        }
        if (this.formFilter.createIncidentInvolvement.exposure.approxInsVal) {
          this.possInsVal = this.formFilter.createIncidentInvolvement.exposure.approxInsVal.toString();
          this.formatInputPos();
        }
        else { this.possInsVal = null } //reseting apx ins val


        if (this.formFilter.createIncidentInvolvement.exposure.possInsVal) {
          this.actInsVal = this.formFilter.createIncidentInvolvement.exposure.possInsVal.toString();
          this.formatInputAct();
        }
        else { this.actInsVal = null } //reseting act ins val


        // this.day = new Date(this.createdOn).getDate().toString();
        // this.day = this.formFilter.loss.reportDate.substr(8, 2);
        this.day = new Date(this.formFilter.loss.reportDate).getDate().toString();
        this.waterDepthCategory = this.checkForWaterDepthCategory((Number)(this.formFilter.createIncidentInvolvement.exposure.waterDepth));
        this.depthCategory = this.checkForDepthCategory(this.formFilter.loss.lossDepth);
        this.formatDepthCategory();
        if (this.formFilter.createIncidentInvolvement.exposure.installationDate != undefined) {
          this.installBuildYearCategory = this.getInstallBuildYearCategory((Number)((this.formFilter.createIncidentInvolvement.exposure.installationDate).substr(0, 4)));
        }
        else {
          this.installBuildYearCategory = "NA";
        }
        if (this.formFilter.createIncidentInvolvement.subscriptionName) {
          this.sourceExists = true;
        }
      });

  }

  updateInstallBuildCategory() {
    if (!this.checkValidYear(this.installationYear))  // !this.checkValidYear will return true if the year is valid
      this.installBuildYearCategory = this.getInstallBuildYearCategory((Number)(this.installationYear));
    else
      this.installBuildYearCategory = "NA";
  }

  checkValidYear(yearPart) {
    if (yearPart) {
      if (yearPart.toString().length != 4) {

        return true;


      }
      else {
        var currentYear = new Date().getFullYear();
        if (parseInt(yearPart.toString()) > currentYear)
          return true;
        else if (parseInt(yearPart.toString()) < 1901) {
          return true;
        }
        else
          return false;
      }

    }
    else
      return false;
  }

  private populateSelectedItems() {
    for (let claimNumber = 0; claimNumber < this.formFilter.loss.lossClaim.length; claimNumber++) {
      //this.coverageTypeIds.push(this.formFilter.loss.lossClaim[claimNumber].coverageTypeId);
      this.lossTypes.push(this.formFilter.loss.lossClaim[claimNumber].coverageTypeId);
    }
    if (this.selectedItems.length > 0)
      this.selectedItems.splice(0, this.selectedItems.length);
    for (let claimNumber = 0; claimNumber < this.lossTypes.length; claimNumber++) {
      for (let typeNumber = 0; typeNumber < this.formLookUp.lossSubmission.lossType.length; typeNumber++) {
        if (this.lossTypes[claimNumber] == this.formLookUp.lossSubmission.lossType[typeNumber].id) {

          this.lossTypeId = this.formLookUp.lossSubmission.lossType[typeNumber].id;
          this.lossTypeDisplayName = this.formLookUp.lossSubmission.lossType[typeNumber].displayName;

          let item = new SearchField(this.lossTypeId, this.lossTypeDisplayName);

          this.selectedItems.push(item);
        }
      }
    }
  }

  private updateAllLossClaims() {

  }

  private updateWaterDepthCategory() {
    this.waterDepthCategory = this.checkForWaterDepthCategory((Number)(this.convertToInt(this.formFilter.createIncidentInvolvement.exposure.waterDepth)));
    this.formatDepthCategory();
  }

  private updateDepthCategory() {
    this.depthCategory = this.checkForDepthCategory(this.convertToInt(this.formFilter.loss.lossDepth));
    this.formatDepthCategory();
  }

  convertToInt(val) {
    if (val != undefined && val != null)
      return parseInt(val.toString().replace(/,/g, ''));
    else
      return 0;
  }

  createLossDetails() {
    this.formFilter.loss.lossClaim = [];

    // let coverageClaimItems = this.coverageClaim;
    this.coverageIds = [];
    // for (let item of coverageClaimItems) {
    //   coverageIds.push(item.coverageId);
    // }

    // this.coverageClaim.forEach(item => {
    //   this.coverageIds.push(item.coverageId);
    // })

    this.lossClaimOriginal.forEach(item => {
      this.coverageIds.push(item.coverageTypeId);
    });

    this.lossTypes.forEach(element => {

      let lossClaim = new LossClaims();

      if (this.isSelectedLossTypeFired == true) {
        if (this.coverageIds.indexOf(element.id) > -1) {
          lossClaim.coverageTypeId = element.id;
          lossClaim.lossAmount = this.lossAmount;
          lossClaim.status = this.lossSubmissionStatus;
          lossClaim.statusComment = this.lossSubmissionStatusComment;
          lossClaim.incomplete = this.incompleteFlag;
          lossClaim.closeFlag = this.closeFlag;
          for (let item of this.lossClaimOriginal) {
            if (item.coverageTypeId == element.id) {
              lossClaim.lossClaimId = item.lossClaimId;
            }
          }
          lossClaim.lossId = this.lossId;
        }
        else {
          lossClaim.coverageTypeId = element.id;
          lossClaim.lossAmount = this.lossAmount;
          lossClaim.status = this.lossSubmissionStatus;
          lossClaim.statusComment = this.lossSubmissionStatusComment;
          lossClaim.incomplete = this.incompleteFlag;
          lossClaim.closeFlag = this.closeFlag;
        }
      }
      else {
        if (this.coverageIds.indexOf(element) > -1) {
          lossClaim.coverageTypeId = element;
          lossClaim.lossAmount = this.lossAmount;
          lossClaim.status = this.lossSubmissionStatus;
          lossClaim.statusComment = this.lossSubmissionStatusComment;
          lossClaim.incomplete = this.incompleteFlag;
          lossClaim.closeFlag = this.closeFlag;
          for (let item of this.lossClaimOriginal) {
            if (item.coverageTypeId == element) {
              lossClaim.lossClaimId = item.lossClaimId;
            }
          }
          lossClaim.lossId = this.lossId;
        }
        else {
          lossClaim.coverageTypeId = element;
          lossClaim.lossAmount = this.lossAmount;
          lossClaim.status = this.lossSubmissionStatus;
          lossClaim.statusComment = this.lossSubmissionStatusComment;
          lossClaim.incomplete = this.incompleteFlag;
          lossClaim.closeFlag = this.closeFlag;
        }
      }

      this.formFilter.loss.lossClaim = this.formFilter.loss.lossClaim.filter(e => e.coverageTypeId != lossClaim.coverageTypeId);
      this.formFilter.loss.lossClaim.push(lossClaim);
    });
    return this.formFilter.loss.lossClaim;
  }

  private getLossRanges() {
    this.validateLossDataSubmissionService.getLossRanges().subscribe((response) => {
      this.lossRangesData = response;
    });
  }

  private setMonth(month: string) {
    if (month == "01") {
      return "January";
    }
    else if (month == "02") {
      return "February";
    }
    else if (month == "03") {
      return "March";
    }
    else if (month == "04") {
      return "April";
    }
    else if (month == "05") {
      return "May";
    }
    else if (month == "06") {
      return "June";
    }
    else if (month == "07") {
      return "July";
    }
    else if (month == "08") {
      return "August";
    }
    else if (month == "09") {
      return "September";
    }
    else if (month == "10") {
      return "October";
    }
    else if (month == "11") {
      return "November";
    }
    else {
      return "December";
    }
  }

  private submitUpdatedDetails(lossClaimStatus) {
    if (this.allRoleData != undefined && this.allRoleData != null) {
      this.formFilter.createIncidentInvolvement.adjusterInd.roleId = (this.allRoleData.find(x => x.description == 'Adjuster')).id;
    }
    this.formFilter.incidentInvolvement = this.formFilter.createIncidentInvolvement;
    this.formFilter.loss.lossCategoryId = this.formFilter.loss.categoryId;
    this.formFilter.loss.noOfDaysOutage = this.formFilter.loss.outageDays;
    this.formFilter.loss.pDAmount = this.formFilter.loss.pdAmount;
    this.formFilter.loss.bIAmount = this.formFilter.loss.biAmount;
    this.formFilter.loss.oEEAmount = this.formFilter.loss.oeeAmount;
    this.formFilter.location = this.formFilter.incidentLocation;
    this.formFilter.location.locationId = this.formFilter.incidentLocation.id;
    this.formFilter.location.name = this.formFilter.incidentLocation.location;
    this.formFilter.loss.reportDate = this.formatDate(this.day, this.month, this.year);
    if (this.formFilter.loss.lossClaim[0].closeFlag == null) {
      this.formFilter.loss.lossClaim[0].closeFlag = false;
    }
    if (this.formFilter.loss.lossClaim[0].incomplete == null) {
      this.formFilter.loss.lossClaim[0].incomplete = false;
    }
    if (this.formFilter.createIncidentInvolvement.exposure.transit == null) {
      this.formFilter.createIncidentInvolvement.exposure.transit = false;
    }
    // if (this.formFilter.createIncidentInvolvement.exposure.dynamicallyPositioned == null) {
    //   this.formFilter.createIncidentInvolvement.exposure.dynamicallyPositioned = false;
    // }
    this.lossAmount = this.formFilter.loss.lossClaim[0].lossAmount;
    this.lossSubmissionStatus = lossClaimStatus;
    this.lossSubmissionStatusComment = this.formFilter.loss.lossClaim[0].statusComment;
    this.incompleteFlag = this.formFilter.loss.lossClaim[0].incomplete;
    this.closeFlag = this.formFilter.loss.lossClaim[0].closeFlag;
    if (this.rebuiltYear != undefined && this.rebuiltYear != "" && !this.checkValidYear(this.rebuiltYear)) {
      //this.formFilter.createIncidentInvolvement.exposure.rebuiltYear = this.formatDate(this.formFilter.createIncidentInvolvement.exposure.rebuiltYear.substr(8, 2), this.formFilter.createIncidentInvolvement.exposure.rebuiltYear.substr(5, 2), this.rebuiltYear);
      this.formFilter.createIncidentInvolvement.exposure.rebuiltYear = new Date("January 01," + this.rebuiltYear).toDateString();
    }
    else {
      this.formFilter.createIncidentInvolvement.exposure.rebuiltYear = undefined;
    }
    if (this.installationYear != undefined && this.installationYear != "" && !this.checkValidYear(this.installationYear)) {
      //this.formFilter.createIncidentInvolvement.exposure.installationDate = this.formatDate(this.formFilter.createIncidentInvolvement.exposure.installationDate.substr(8, 2), this.formFilter.createIncidentInvolvement.exposure.installationDate.substr(5, 2), this.installationYear);
      this.formFilter.createIncidentInvolvement.exposure.installationDate = this.formatDate("01", "January", this.installationYear);
    }
    else {
      this.formFilter.createIncidentInvolvement.exposure.installationDate = undefined;
    }
    if (this.manufactureYear != undefined && this.manufactureYear != "" && !this.checkValidYear(this.manufactureYear)) {
      //this.formFilter.createIncidentInvolvement.exposure.installationDate = this.formatDate(this.formFilter.createIncidentInvolvement.exposure.installationDate.substr(8, 2), this.formFilter.createIncidentInvolvement.exposure.installationDate.substr(5, 2), this.installationYear);
      this.formFilter.createIncidentInvolvement.exposure.buildDate = this.formatDate("01", "January", this.manufactureYear);
    }
    else {
      this.formFilter.createIncidentInvolvement.exposure.buildDate = undefined;
    }
    if (this.formFilter.createIncidentInvolvement.exposure.modelBuildYear != undefined && this.formFilter.createIncidentInvolvement.exposure.modelBuildYear != null && !this.checkValidYear(this.formFilter.createIncidentInvolvement.exposure.modelBuildYear)) {
      //this.formFilter.createIncidentInvolvement.exposure.installationDate = this.formatDate(this.formFilter.createIncidentInvolvement.exposure.installationDate.substr(8, 2), this.formFilter.createIncidentInvolvement.exposure.installationDate.substr(5, 2), this.installationYear);
      this.formFilter.createIncidentInvolvement.exposure.modelBuildYear = this.formFilter.createIncidentInvolvement.exposure.modelBuildYear;
    }
    if (this.formFilter.createIncidentInvolvement.exposure.modelBuildYear == undefined || this.formFilter.createIncidentInvolvement.exposure.modelBuildYear == null || this.checkValidYear(this.formFilter.createIncidentInvolvement.exposure.modelBuildYear)) {
      this.formFilter.createIncidentInvolvement.exposure.modelBuildYear = undefined;
    }
    if (this.possInsVal) {
      this.formFilter.incidentInvolvement.exposure.approxInsVal = parseInt(this.possInsVal.toString().replace(/,/g, ''));
    }
    if (this.actInsVal) {
      this.formFilter.incidentInvolvement.exposure.possInsVal = parseInt(this.actInsVal.toString().replace(/,/g, ''));
    }
    // Making sure we have no commas while it is sent to the WebApi
    this.formFilter.createIncidentInvolvement.exposure.waterDepth = this.convertToInt(this.formFilter.createIncidentInvolvement.exposure.waterDepth).toString();
    this.formFilter.loss.lossDepth = this.convertToInt(this.formFilter.loss.lossDepth).toString();
    this.formFilter.createIncidentInvolvement.exposure.projectedTotalDepth = this.convertToInt(this.formFilter.createIncidentInvolvement.exposure.projectedTotalDepth).toString();


    this.createLossDetails();
    this.formFilter.eldmFlag = this.isELDMMode;
    var str = "-"
    if (this.lat.includes('S'))
      this.lat = str.concat(this.lat);
    else if (this.long.includes('W'))
      this.long = str.concat(this.long);

    if (this.lat.includes('N') || this.lat.includes('S'))
      this.lat = this.lat.substring(0, this.lat.length - 1);
    if (this.long.includes('W') || this.long.includes('E'))
      this.long = this.long.substring(0, this.long.length - 1);
    this.validateLossDataSubmissionService.updateLossSubmissionData(this.incidentId, this.lat, this.long, this.country, this.formFilter)
      .subscribe(response => {
        if (response) {
          //below activity used in - remove object from eldm page - pagination
          if (this.isELDMMode) {
            switch (lossClaimStatus) {
              case 'Rejected':
              case 'OnHold':
                this.showSubmitSuccessModel();
                this.onDeleteEvent.emit();
                break;
              case 'Deleted':
                this.showDeleteSuccessModal();
                this.onDeleteEvent.emit();
                break;
              case 'Approved':
                this.showSubmitSuccessModel();
                break;
              default:
                break;
            }
            this.isEditOn = false;
          }
          else {
            this.showSubmitSuccessModel();
          }
        }
        //this.router.navigate(['validate-loss-data-submission/validation-list']);
      }
        , error => {
          this.errorOccured = true;
          this.msg = "Something Went Wrong.. Try Again..";
          this.showSubmitSuccessModel();
        }
      )
  }

  private checkForCostCategory(value: number) {
    let category: string;
    for (let categoryItem of this.lossRangesData) {
      if ((categoryItem.minValue != 0 && categoryItem.minValue != null && categoryItem.minValue != undefined) && (categoryItem.maxValue == undefined || categoryItem.maxValue == null || categoryItem.maxValue == 0)) {
        if (value >= categoryItem.minValue) {
          category = categoryItem.name;
        }
      }
      else {
        if (value > categoryItem.minValue && value <= categoryItem.maxValue) {
          category = categoryItem.name;
        }
      }
    }
    return category;
  }

  checkForWaterDepthCategory(waterDepth: number): string {
    if (waterDepth == null || waterDepth == undefined || waterDepth == 0) {
      this.updateWaterDepthCategoryId("NA");
      return "NA";
    }
    else {
      for (let category of this.formLookUp.lossSubmission.waterDepthCategory) {
        if (category.ranges.indexOf("-") > -1 || category.ranges.indexOf("+") > -1) {
          if (!(category.ranges.indexOf("+") > -1)) {
            var rangeArray = category.ranges.split("-");
            rangeArray[0] = (rangeArray[0].trim()).replace(/\,/g, '');
            rangeArray[1] = (rangeArray[1].trim()).replace(/\,/g, '');
            if (waterDepth >= (Number)(rangeArray[0]) && waterDepth < (Number)(rangeArray[1])) {
              this.updateWaterDepthCategoryId(category.displayName);
              return category.displayName;
            }
          }
          else {
            rangeArray = category.ranges.split("+");
            rangeArray[0] = (rangeArray[0].trim()).replace(/\,/g, '');
            if (waterDepth >= (Number)(rangeArray[0])) {
              this.updateWaterDepthCategoryId(category.displayName);
              return category.displayName;
            }
          }
        }
      }
    }
  }

  checkForDepthCategory(lossDepth: number) {

    if (!lossDepth) {
      this.updateDepthCategoryId('TBA');
      return 'TBA';
    }

    for (let category of this.formLookUp.lossSubmission.depthCategory) {
      if (category.ranges.indexOf("-") > -1 || category.ranges.indexOf("+") > -1) {
        if (!(category.ranges.indexOf("+") > -1)) {
          var rangeArray = category.ranges.split("-");
          rangeArray[0] = (rangeArray[0].trim()).replace(/\,/g, '');
          rangeArray[1] = (rangeArray[1].trim()).replace(/\,/g, '');
          if (lossDepth >= (Number)(rangeArray[0]) && lossDepth < (Number)(rangeArray[1])) {
            this.updateDepthCategoryId(category.displayName);
            return category.displayName;
          }
        }
      }
      else {
        rangeArray = category.ranges.split("+");
        rangeArray[0] = (rangeArray[0].trim()).replace(/\,/g, '');
        if (lossDepth >= this.formatNumber((Number)(rangeArray[0]))) {
          this.updateDepthCategoryId(category.displayName);
          return category.displayName;
        }
      }
    }
  }

  private updateWaterDepthCategoryId(waterDepthCategory) {
    for (let count = 0; count < this.formLookUp.lossSubmission.waterDepthCategory.length; count++) {
      if (this.formLookUp.lossSubmission.waterDepthCategory[count].displayName.toLocaleLowerCase() == waterDepthCategory.toLocaleLowerCase()) {
        this.formFilter.createIncidentInvolvement.exposure.waterDepthCategoryId = this.formLookUp.lossSubmission.waterDepthCategory[count].id;
      }
    }
  }

  private updateDepthCategoryId(depthCategory) {
    for (let count = 0; count < this.formLookUp.lossSubmission.depthCategory.length; count++) {
      if (this.formLookUp.lossSubmission.depthCategory[count].displayName.toLocaleLowerCase() == depthCategory.toLocaleLowerCase()) {
        this.formFilter.loss.categoryId = this.formLookUp.lossSubmission.depthCategory[count].id;
      }
    }
  }

  getInstallBuildYearCategory(installYear: number) {
    if (installYear == null || installYear == 0) {
      return "NA";
    }
    if (installYear < 1980) {
      let installCat: string;
      installCat = installYear.toString();
      let requiredPart: string = installCat.substr(0, 3);
      requiredPart += "0";
      return "pre 1980s";
    }
    else {
      let installCat: string;
      installCat = installYear.toString();
      let requiredPart: string = installCat.substr(0, 3);
      requiredPart += "0";
      return requiredPart + "s";
    }
  }

  onNo() {
    this.router.navigate(['validate-loss-data-submission/validation-list']);
  }

  onYes(message: string) {
    var lossStatus = this.formFilter.loss.lossClaim[0].status;
    this.submitUpdatedDetails(lossStatus);
  }
  onChange() {

  }

  onBackButtonModalYes(message: string) {
    this.router.navigate(['/validate-loss-data-submission/validation-list']);
  }

  onConfirmUpdateDateYes() {
    this.formFilter.updatedDate = null;
    document.getElementById('successButton').click();
    this.status = status;
  }

  onConfirmUpdateDateNo() {
    document.getElementById('successButton').click();
    this.status = status;
  }
  validationCheckForClaims() {
    if (this.lossTypes) {
      if (this.isSelectedLossTypeFired == true) {
        for (let count = 0; count < this.lossTypes.length; count++) {
          if (this.lossTypes.filter(x => x.displayName.toLowerCase() == 'pd').length != 0 ||
            this.lossTypes.filter(x => x.displayName.toLowerCase() == 's&p').length != 0
          ) {
            this.claimPDFlag = true;
          }
          else {
            this.claimPDFlag = false;
          }
          if (this.lossTypes.filter(x => x.displayName.toLowerCase() == 'oee').length != 0) {
            this.claimOEEFlag = true;
          }
          else {
            this.claimOEEFlag = false;
          }
          if (this.lossTypes.filter(x => x.displayName.toLowerCase() == 'bi').length != 0 ||
            this.lossTypes.filter(x => x.displayName.toLowerCase() == 'cbi').length != 0) {
            this.claimBIFlag = true;
          }
          else {
            this.claimBIFlag = false;
          }

        }
      }
      else {
        if (this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'pd').length != 0) {
          var pdId: number = this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'pd')[0].id;
        }
        if (this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'oee').length != 0) {
          var oeeId: number = this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'oee')[0].id;
        }
        if (this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'bi').length != 0) {
          var biId: number = this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'bi')[0].id;
        }
        if (this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'cbi').length != 0) {
          var cbiId: number = this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 'cbi')[0].id;
        }
        if (this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 's&p').length != 0) {
          var snpId: number = this.formLookUp.lossSubmission.lossType.filter(x => x.displayName.toLowerCase() == 's&p')[0].id;
        }

        if (this.lossTypes.indexOf(pdId) > -1 || this.lossTypes.indexOf(snpId) > -1) {
          this.claimPDFlag = true;
        }
        else {
          this.claimPDFlag = false;
        }
        if (this.lossTypes.indexOf(oeeId) > -1) {
          this.claimOEEFlag = true;
        }
        else {
          this.claimOEEFlag = false;
        }
        if (this.lossTypes.indexOf(biId) > -1 || this.lossTypes.indexOf(cbiId) > -1) {
          this.claimBIFlag = true;
        }
        else {
          this.claimBIFlag = false;
        }

      }
    }
  }


  checkValidation(validateForm: NgForm): boolean {
    this.validationCheckForClaims();
    if (validateForm.value && validateForm.valid) {
      if (validateForm.value.category1 && validateForm.value.category2 && validateForm.value.landOff && validateForm.value.opStatus && validateForm.value.location && this.lat && this.long && ((this.formFilter.createIncidentInvolvement.source) && (this.formFilter.createIncidentInvolvement.source.trim() != "")) && validateForm.value.area && (validateForm.value.lossDetails && (validateForm.value.lossDetails.toString().trim() != "")) && validateForm.value.country && this.lossTypes && validateForm.value.cause) {
        if (this.claimPDFlag == true) {
          if (!this.formFilter.loss.pdAmount) {
            return true;
          }
        }
        if (this.claimOEEFlag == true) {
          if (!this.formFilter.loss.oeeAmount) {
            return true;
          }
        }
        if (this.claimBIFlag == true) {
          if (!this.formFilter.loss.biAmount) {
            return true;
          }
        }

        return false;
      }

      else {
        return true;
      }
    }
    else {
      return validateForm.invalid;
    }
  }

  checkValidTotal() {
    if (this.totalClaim == 0 || this.totalClaim > 9999999999999) {
      // if (this.totalClaim == 0) {
      return true;
    }
    else {
      return false;
    }
  }

  checkIfInputIsDecimal(inputField: any) {
    if (inputField != null && inputField != undefined) {
      let inputFieldString: string = inputField.toString();
      if (inputFieldString.indexOf(",") > -1) {
        inputFieldString = inputFieldString.replace(/\,/g, '');
      }
      if (inputFieldString.indexOf(".") > -1) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  //since the method is reused for both, location and country change, to incorporate blanking of location
  // on country change, deleteLocation flag is used
  onCountryChange(deleteLocation: boolean) {
    for (let ctry of this.formLookUp.lossSubmission.country) {
      if (ctry.id == this.formFilter.incidentLocation.countryId) {
        this.country = ctry.displayName;
      }
    }
    if (deleteLocation) {
      this.formFilter.incidentLocation.location = "";
    }
    if (this.formFilter.incidentLocation.location != null && this.country != null) {
      this.getLatLongData(this.formFilter.incidentLocation.location, this.country);
    }
  }

  inFeet: number;
  inMeters: number;
  res: number
  onConverttoMeters(value: number) {
    this.dmeters = value / 3.2808;
    this.dmeters = Number((this.dmeters).toFixed(0))
  }
  onConverttoFeet(value: number) {
    this.dfeet = value * 3.2808;
    this.dfeet = Number((this.dfeet).toFixed(0))

  }

  onEdit() {
    this.onEditEvent.emit();
  }

  onCancel() {
    this.isSelectedLossTypeFired = false;
    this.lossTypes = [];
    this.onLoad();
    window.scrollTo(0, 0);
    this.onCancelEvent.emit();
  }

  showSubmitSuccessModel() {
    document.getElementById('successModalButton').click();
  }

  showDeleteConfirmationModal() {
    document.getElementById('deleteConfirmationModalButton').click();
  }

  showDeleteSuccessModal() {
    document.getElementById('deleteSuccessModalButton').click();
  }

  onDelete() {
    var lossStatus = "Deleted";
    this.submitUpdatedDetails(lossStatus);
  }

  statusChanged(status) {
    if (status == 'Approved' || status == 'Rejected') {
      this.submitButton = "Submit"
    }
    else this.submitButton = "Save"
  }

  setSubmitButtonFlag() {
    this.successButtonClicked = true;
  }

  validateCoordinate(coordinate, direction) {
    var reg1 = /^[0-9]+[.][0-9]+[N|S]$/;
    var reg2 = /^[0-9]+[.][0-9]+[E|W]$/;
    switch (direction) {
      case 'Latitude':
        if (reg1.test(coordinate.trim()))
          this.invalidLatError = false;
        else
          this.invalidLatError = true;
        break;
      case 'Longitude':
        if (reg2.test(coordinate.trim()))
          this.invalidLongError = false;
        else
          this.invalidLongError = true;
        break;
    }
  }

  formatDepthCategory() {
    if (this.formFilter.createIncidentInvolvement.exposure.waterDepth != null && this.formFilter.createIncidentInvolvement.exposure.waterDepth != undefined) {
      this.formFilter.createIncidentInvolvement.exposure.waterDepth = this.dp.transform(parseInt(this.formFilter.createIncidentInvolvement.exposure.waterDepth.toString().replace(/,/g, '')));
    }
    if (this.formFilter.loss.lossDepth != null && this.formFilter.loss.lossDepth != undefined) {
      this.formFilter.loss.lossDepth = this.dp.transform(parseInt(this.formFilter.loss.lossDepth.toString().replace(/,/g, '')));
    }

    if (this.formFilter.createIncidentInvolvement.exposure.projectedTotalDepth != null && this.formFilter.createIncidentInvolvement.exposure.projectedTotalDepth != undefined) {
      this.formFilter.createIncidentInvolvement.exposure.projectedTotalDepth = this.dp.transform(parseInt(this.formFilter.createIncidentInvolvement.exposure.projectedTotalDepth.toString().replace(/,/g, '')));
    }
  }

}
