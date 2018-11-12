import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import { LossDataSubmissionModel } from '../models/loss-data-submission.model';
import { LossDataSubmissionService } from '../services/loss-data-submission.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { LossData } from '../entities/loss-data';
import { IncidentInvolvement } from '../entities/incident-involvement';
import { Exposure } from '../entities/exposure';
import { LocationDetails } from '../entities/location';
import { Loss } from '../entities/loss';
import { PartyRole } from '../entities/party-role';
import { NgForm } from '@angular/forms';
import { LossClaims } from '../entities/loss-claims';
import { SearchFieldWithType } from '../../validate-loss-data-submission/shared/entities/searchFieldWithType';
import { TabIndexService } from '../../../shared/TabIndex/tabindex.service';


@Component({
  selector: 'downstream-loss',
  templateUrl: './downstream-loss.component.html',
  styleUrls: ['./downstream-loss.component.css']
})

export class DownstreamLossComponent implements OnInit, AfterViewInit {

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: any) {

    if (!this.lossDataSubmissionModel.getReadOnlyFlag())
      event.returnValue = "Data will be lost if you refresh or leave the page, are you sure?";

  }

  constructor(private router: Router, private lossDataSubmissionService: LossDataSubmissionService,
    private localWebStorageService: LocalWebStorageService, private tabIndexService: TabIndexService) {
    this.lossDataSubmissionModel = new LossDataSubmissionModel(lossDataSubmissionService, localWebStorageService
    );
  }

  dateData: any[] = [{ "day": [], "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], "year": ["1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "2019"] }];
  readOnlyFlag: boolean;
  day: string;
  month: string;
  year: string;
  pd: number = 0;
  bi: number = 0;
  lossTypes: any[] = [];
  private lossDataSubmissionModel: LossDataSubmissionModel;
  downStreamLossDatas: any = [];
  lossData: LossData = new LossData();
  lossClaims: LossClaims[] = [];
  resetFlag: boolean = false;
  msg: string;
  selectedItems: any[] = [];
  readonlyFlag: boolean;
  category1: string;
  category2: string;
  category3: string;
  area: string;
  country: string;
  cause: string;
  land: string;
  lossTypesName: string = "";
  oi: string;
  createIncidentInvolvement: IncidentInvolvement = new IncidentInvolvement();
  pInfo: any;
  claimBIFlag: boolean = false;
  claimOEEFlag: boolean = false;
  claimPDFlag: boolean = false;
  multiselectIndex: number = 16;


  ngOnInit() {
    this.readOnlyFlag = this.lossDataSubmissionModel.getReadOnlyFlag();
    this.lossData.incidentInvolvement = new IncidentInvolvement();
    this.lossData.incidentInvolvement.exposure = new Exposure();
    this.lossData.location = new LocationDetails();
    this.lossData.loss = new Loss();
    this.lossData.incidentInvolvement.adjusterInd = new PartyRole();
    this.downStreamLossDatas = this.lossDataSubmissionModel.getDropDownValues().lossSubmission;
    // this.setAllTypeIdsForFiltering();
    this.downStreamLossDatas.categories1 = this.downStreamLossDatas.categories1.filter(cat => cat.typeId == 2);
    this.downStreamLossDatas.categories2 = this.downStreamLossDatas.categories2.filter(cat => cat.typeId == 2);
    this.downStreamLossDatas.categories3 = this.downStreamLossDatas.categories3.filter(cat => cat.typeId == 2);
    this.downStreamLossDatas.cause = this.downStreamLossDatas.cause.filter(cat => cat.typeId == 2);
    this.downStreamLossDatas.lossType = this.downStreamLossDatas.lossType.filter(cat => cat.typeId == 2);

    this.dateData[0].year = this.generateYear();


    if (this.readOnlyFlag) {
      if (this.lossDataSubmissionModel.getIncidentId() && this.lossDataSubmissionModel.getLossType() == "Downstream") {
        this.getLossDetails(this.lossDataSubmissionModel.getIncidentId());
      }

      else {
        this.router.navigate(['/loss-data-submission']);
      }

      //this.lossData
    }
    else {
      /*  window.onbeforeunload = (ev) => {
         
 
         alert('goin to refresh');
 
         // finally return the message to browser api.
         var dialogText = 'Changes that you made may not be saved.';
         ev.returnValue = dialogText;
         
         return dialogText;
 }; */
    }
  }

  ngAfterViewInit() {
    // this.tabIndexService.assignTabIndex();
  }


  getLossDetails(incidentNo: number) {
    this.lossDataSubmissionModel.getLossData(incidentNo).subscribe(response => {

      //console.log(response);
      //console.log(pow)
      this.downStreamLossDatas.cause.forEach(data => {
        if (data.id == response.causeId)
          this.cause = data.displayName;
      })

      let exposure = response.createIncidentInvolvement.exposure;
      let location = response.incidentLocation;
      this.createIncidentInvolvement = response.createIncidentInvolvement;
      //this.lossData=response;
      this.lossData.loss = response.loss;
      this.lossData.incidentInvolvement.exposure = exposure;
      this.lossData.location = location;

      this.generateDateMonthYear();
      this.calculateLossClaims();
      this.pd = this.lossData.loss.pdAmount;
      this.bi = this.lossData.loss.biAmount;

      this.downStreamLossDatas.land_Offshore.forEach(data => {
        if (data.id == exposure.onShoreInd)
          this.land = data.displayName;
      });

      this.downStreamLossDatas.categories1.forEach(data => {
        if (data.id == exposure.exposureCategoryId1)
          this.category1 = data.displayName;
      });

      this.downStreamLossDatas.categories2.forEach(data => {
        if (data.id == exposure.exposureCategoryId2)
          this.category2 = data.displayName;
      });

      this.downStreamLossDatas.categories3.forEach(data => {
        if (data.id == exposure.exposureCategoryId3)
          this.category3 = data.displayName;
      });

      this.downStreamLossDatas.country.forEach(data => {
        if (data.id == location.countryId)
          this.country = data.displayName;
      });

      this.downStreamLossDatas.area.forEach(data => {
        if (data.id == location.areaId)
          this.area = data.displayName;
      });

      this.downStreamLossDatas.opeartionalStatus.forEach(data => {
        if (data.id == exposure.operationalStatusId)
          this.oi = data.displayName;
      });

      this.downStreamLossDatas.productInfo.forEach(data => {
        if (data.id == this.createIncidentInvolvement.productInformation)
          this.pInfo = data.displayName;
      })

    })

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

  calculateLossClaims() {
    this.lossData.loss.lossClaim.forEach(data => {
      this.downStreamLossDatas.lossType.forEach(element => {
        if (data.coverageTypeId == element.id) {
          /* if (element.displayName == "PD") {
            this.lossTypesName = this.lossTypesName + " " + element.displayName;
            this.pd = data.lossAmount;
          }

          if (element.displayName == "BI") {
            this.bi = data.lossAmount;
            this.lossTypesName = this.lossTypesName + " " + element.displayName;
          } */
          if (this.lossTypesName == "")
            this.lossTypesName = this.lossTypesName + " " + element.displayName;
          else
            this.lossTypesName = this.lossTypesName + ", " + element.displayName;
        }
      });
    })
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

  generateDateMonthYear() {
    var locale = "en-us";
    this.year = new Date(this.lossData.loss.reportDate).getFullYear().toString();
    this.day = new Date(this.lossData.loss.reportDate).getDate().toString();
    //this.lossData.incidentInvolvement.exposure.buildDate = new Date(this.lossData.incidentInvolvement.exposure.buildDate).getFullYear().toString();
    this.month = new Date(this.lossData.loss.reportDate).toLocaleString(locale, { month: "long" });
  }

  onBackToHistory() {
    this.router.navigate(['loss-data-submission/loss-data-submission-history']);
  }

  generateYear(): number[] {
    let years: number[] = [];
    for (var i = new Date().getFullYear(); i >= 1972; i--) {
      years.push(i);
    }
    return years;
  }

  onSubmit() {
    //document.getElementById('successButton').click();
    this.lossData.loss.lossClaim = this.createLossDetails();

    //For DownStream Loss
    this.lossData.incidentInvolvement.operationTypeId = 2;
    this.lossData.loss.reportDate = this.formatDate(this.day, this.month, this.year);
    //this.lossData.loss.status="Submitted";
    this.setMandatoryFields();
    this.lossData.loss.pdAmount = this.pd;
    this.lossData.loss.biAmount = this.bi;
    this.lossDataSubmissionModel.postLossData(this.lossData).subscribe(response => {
      this.msg = "Loss Data record submitted successfully" + " (Submission ID –" + response + ")";
      document.getElementById('successButton').click();

    }
      , error => {
        this.msg = "Something Went Wrong.. Try Again..";
        document.getElementById('successButton').click();
      });
  }

  onReset(downStreamForm: NgForm) {
    downStreamForm.resetForm();
    this.resetFlag = !this.resetFlag;
    this.selectedItems = [];
    this.lossTypes = [];
  }

  selectedLossType(event) {
    this.lossTypes = event;
  }

  validationCheckForClaims() {
    if (this.lossTypes.length == 0) {
      this.claimPDFlag = false;
      this.claimOEEFlag = false;
      this.claimBIFlag = false;
    }
    else {
      for (let count = 0; count < this.lossTypes.length; count++) {
        if (this.lossTypes.filter(x => x.displayName.toLowerCase() == 'pd').length != 0 ||
          this.lossTypes.filter(x => x.displayName.toLowerCase() == 's&p').length != 0) {
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

  }

  checkFormValidation(downStreamForm: NgForm): boolean {
    this.validationCheckForClaims();
    if (downStreamForm.valid && downStreamForm.value) {

      if (this.lossTypes.length > 0 && downStreamForm.value.lossDetails && downStreamForm.value.lyears && downStreamForm.value.category1 && downStreamForm.value.category2 && downStreamForm.value.land && downStreamForm.value.opeartionalStatus != undefined && downStreamForm.value.location && downStreamForm.value.area && downStreamForm.value.country && downStreamForm.value.cause) {
        if (this.claimPDFlag == true) {
          if (!this.pd || parseInt(this.pd.toString()) == 0) {
            return true;
          }
        }

        if (this.claimBIFlag == true) {
          if (!this.bi || parseInt(this.bi.toString()) == 0) {
            return true;
          }
        }
        return false;
      }
      else
        return true;
    }
    else {
      return downStreamForm.invalid;
    }
  }


  formatDate(day, month, year): string {
    // if (day || month) {
    //   return new Date(month+" "+day.toString()+","+year).toDateString();

    // }
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

  checkDate() {
    if (this.day == undefined) {
      var fromDate = moment(new Date(this.formatDate("01", this.month, this.year)), "dd-MMM-yyyy");
    }
    else {
      var fromDate = moment(new Date(this.formatDate(this.day, this.month, this.year)), "dd-MMM-yyyy");
    }

    var currentDate = moment(new Date(), "dd-MMM-yyy");
    return fromDate.isAfter(currentDate, 'day');
  }

  createLossDetails() {

    this.lossTypes.forEach(element => {

      let lossClaim = new LossClaims();

      /* if (element.displayName == "BI")
        lossClaim.lossAmount = this.bi;
      if (element.displayName == "PD")
        lossClaim.lossAmount = this.pd; */
      lossClaim.lossAmount = 0;
      lossClaim.coverageTypeId = element.id;
      lossClaim.status = "Submitted";
      lossClaim.statusComment = "NA";

      lossClaim.incomplete = null;
      lossClaim.closeFlag = null;
      this.lossClaims = this.lossClaims.filter(e => e.coverageTypeId != lossClaim.coverageTypeId);
      this.lossClaims.push(lossClaim);
    });

    return this.lossClaims;

  }

  setMandatoryFields() {
    this.lossData.eventId = null;
    this.lossData.location.gomAreaID = null;
    this.lossData.incidentInvolvement.source = null;
    this.lossData.location.locationCodeID = null;
    this.lossData.incidentInvolvement.exposure.name = null;
    this.lossData.incidentInvolvement.exposure.assetCategoryId = null;
    this.lossData.incidentInvolvement.exposure.towId = null;
    this.lossData.incidentInvolvement.exposure.wellTypeId = null;
    this.lossData.incidentInvolvement.exposure.drillingStatusId = null;
    this.lossData.incidentInvolvement.exposure.equipmentTypeId = null;
    this.lossData.incidentInvolvement.exposure.waterDepthCategoryId = null;
    this.lossData.incidentInvolvement.exposure.modelOEM = null;
    this.lossData.incidentInvolvement.exposure.assetDescriptionId = null;
    this.lossData.incidentInvolvement.exposure.buildDate = null;
    this.lossData.incidentInvolvement.exposure.countryManufactured = null;
    this.lossData.incidentInvolvement.exposure.fieldUnit = null;
    this.lossData.incidentInvolvement.exposure.generation = null;
    this.lossData.incidentInvolvement.exposure.inspectionDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.installationDate = null;
    this.lossData.incidentInvolvement.exposure.lastUpgradeDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.modelBuildYear = null;
    this.lossData.incidentInvolvement.exposure.oilMulti = null;
    this.lossData.incidentInvolvement.exposure.model = null;
    this.lossData.incidentInvolvement.exposure.plantCapacity = null;
    this.lossData.incidentInvolvement.exposure.purchaseDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.relatedWaterDepth = null;
    this.lossData.loss.submissionID = null;
    this.lossData.incidentInvolvement.adjusterInd.name = null;
    this.lossData.incidentInvolvement.adjusterInd.partyId = null;
    this.lossData.incidentInvolvement.adjusterInd.roleId = null;
    this.lossData.incidentInvolvement.exposure.drillingStatusId = null;
    this.lossData.incidentInvolvement.exposure.equipmentTypeId = null;
    this.lossData.incidentInvolvement.exposure.assetDescriptionId = null;
    this.lossData.incidentInvolvement.exposure.rigDescription = null;
    this.lossData.incidentInvolvement.exposure.transit = null;
    this.lossData.incidentInvolvement.exposure.userAtPurchase = null;
    this.lossData.loss.lossEndDate = new Date().toDateString();
    this.lossData.loss.lossStartDate = new Date().toDateString();
    this.lossData.loss.sanitisedDetails = null;
    this.lossData.loss.willis = null;
    this.lossData.loss.weldurn = null;
    this.lossData.loss.status = null;
    this.lossData.incidentInvolvement.exposure.transit = null;
    //this.lossData.incidentInvolvement.exposure.installationDate = new Date().toDateString();

  }

}
