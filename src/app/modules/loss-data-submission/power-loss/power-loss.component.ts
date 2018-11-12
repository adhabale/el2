import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LossClaims } from '../entities/loss-claims';
import { LossDataSubmissionModel } from '../models/loss-data-submission.model';
import { LossDataSubmissionService } from '../services/loss-data-submission.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { LossData } from '../entities/loss-data';
import { Loss } from '../entities/loss';
import { IncidentInvolvement } from '../entities/incident-involvement';
import { LocationDetails } from '../entities/location';
import * as moment from 'moment/moment';
import { Exposure } from '../entities/exposure';
import { PartyRole } from '../entities/party-role';
import { SearchFieldWithType } from '../../validate-loss-data-submission/shared/entities/searchFieldWithType';
import { TabIndexService } from '../../../shared/TabIndex/tabindex.service';

@Component({
  selector: 'power-loss',
  templateUrl: './power-loss.component.html',
  styleUrls: ['./power-loss.component.css']
})
export class PowerLossComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private lossDataSubmissionService: LossDataSubmissionService,
    private localWebStorageService: LocalWebStorageService, private tabIndexService: TabIndexService) {
    this.lossDataSubmissionModel = new LossDataSubmissionModel(lossDataSubmissionService, localWebStorageService);
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: any) {
    if (!this.lossDataSubmissionModel.getReadOnlyFlag())
      event.returnValue = "Data will be lost if you refresh or leave the page, are you sure?";
  }

  readOnlyFlag: boolean;
  private lossDataSubmissionModel: LossDataSubmissionModel;
  dateData: any[] = [{ "day": [], "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], "year": ["1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "2019"] }];
  day: string;
  month: string;
  year: string;
  pd: number = 0;
  oee: number = 0;
  bi: number = 0;
  lossTypes: any[] = [];
  powerLossDatas: any = [];
  lossData: LossData = new LossData();
  lossClaims: LossClaims[] = [];
  resetFlag: boolean = false;
  msg: string;
  selectedItems: any[] = [];
  buildDate: any;
  category1: string;
  category2: string;
  category3: string;
  area: string;
  country: string;
  cause: string;
  land: string;
  lossTypesName: string = "";
  createIncidentInvolvement: IncidentInvolvement = new IncidentInvolvement();
  model: string;
  oem: string;
  counryM: string;
  equipment: string;
  os: string;
  claimPDFlag: boolean = false;
  claimBIFlag: boolean = false;
  multiselectIndex: number = 16;

  ngOnInit() {

    this.readOnlyFlag = this.lossDataSubmissionModel.getReadOnlyFlag();
    this.lossData.loss = new Loss();
    this.lossData.incidentInvolvement = new IncidentInvolvement();
    this.lossData.location = new LocationDetails();
    this.lossData.incidentInvolvement.exposure = new Exposure();
    this.lossData.incidentInvolvement.adjusterInd = new PartyRole();
    this.dateData[0].year = this.generateYear();
    this.setMandatoryFields();

    // For Fetching DropDown Values From Database
    this.powerLossDatas = this.lossDataSubmissionModel.getDropDownValues().lossSubmission;
    //console.log(this.powerLossDatas);
    // this.setAllTypeIdsForFiltering();
    this.powerLossDatas.categories1 = this.powerLossDatas.categories1.filter(cat => cat.typeId == 3);
    this.powerLossDatas.categories2 = this.powerLossDatas.categories2.filter(cat => cat.typeId == 3);
    this.powerLossDatas.categories3 = this.powerLossDatas.categories3.filter(cat => cat.typeId == 3);
    this.powerLossDatas.cause = this.powerLossDatas.cause.filter(cat => cat.typeId == 3);
    this.powerLossDatas.lossType = this.powerLossDatas.lossType.filter(cat => cat.typeId == 3);




    if (this.readOnlyFlag) {
      if (this.lossDataSubmissionModel.getIncidentId() && this.lossDataSubmissionModel.getLossType() == "Power") {
        this.getLossDetails(this.lossDataSubmissionModel.getIncidentId());
      }

      else {
        this.router.navigate(['/loss-data-submission']);
      }

      //this.lossData
    }


  }

  ngAfterViewInit() {
    // this.tabIndexService.assignTabIndex();
  }

  checkInvalidDate() {
    var dateFormat = 'DD-MM-YYYY';
    return moment(moment(this.formatDate(this.day, this.month, this.year)).format(dateFormat), dateFormat, true).isValid();
  }

  onBackToHistory() {
    this.router.navigate(['loss-data-submission/loss-data-submission-history']);
  }


  getLossDetails(incidentNo: number) {
    this.lossDataSubmissionModel.getLossData(incidentNo).subscribe(response => {
      //console.log(response);
      this.powerLossDatas.cause.forEach(data => {
        if (data.id == response.causeId)
          this.cause = data.displayName;
      })
      //this.readonlyFlag = true;
      let vara = response.createIncidentInvolvement.exposure;
      let location = response.incidentLocation;
      this.createIncidentInvolvement = response.createIncidentInvolvement;
      //this.lossData=response;
      this.lossData.loss = response.loss;
      this.lossData.incidentInvolvement.exposure = vara;
      this.lossData.location = location;


      this.generateDateMonthYear();
      this.calculateLossClaims();

      if (new Date(this.lossData.incidentInvolvement.exposure.buildDate).getFullYear() == 1) {
        this.lossData.incidentInvolvement.exposure.buildDate = " ";
      }
      else {
        this.lossData.incidentInvolvement.exposure.buildDate = new Date(this.lossData.incidentInvolvement.exposure.buildDate).getFullYear().toString();
      }

      this.pd = this.lossData.loss.pdAmount;
      this.bi = this.lossData.loss.biAmount;

      this.powerLossDatas.land_Offshore.forEach(data => {
        if (data.id == vara.onShoreInd)
          this.land = data.displayName;
      });

      this.powerLossDatas.categories1.forEach(data => {
        if (data.id == vara.exposureCategoryId1)
          this.category1 = data.displayName;
      });

      this.powerLossDatas.categories2.forEach(data => {
        if (data.id == vara.exposureCategoryId2)
          this.category2 = data.displayName;
      });

      this.powerLossDatas.categories3.forEach(data => {
        if (data.id == vara.exposureCategoryId3)
          this.category3 = data.displayName;
      });

      this.powerLossDatas.country.forEach(data => {
        if (data.id == location.countryId)
          this.country = data.displayName;
      });

      this.powerLossDatas.area.forEach(data => {
        if (data.id == location.areaId)
          this.area = data.displayName;
      });

      this.powerLossDatas.model.forEach(data => {
        if (data.id == vara.model)
          this.model = data.displayName;
      })
      this.powerLossDatas.modelOEM.forEach(data => {
        if (data.id == vara.modelOEM)
          this.oem = data.displayName;
      });

      this.powerLossDatas.countryManufactured.forEach(data => {
        if (data.id == vara.countryManufactured)
          this.counryM = data.displayName;
      });

      this.powerLossDatas.equipmentType.forEach(data => {
        if (data.id == vara.equipmentTypeId)
          this.equipment = data.displayName;
      });

      this.powerLossDatas.opeartionalStatus.forEach(data => {
        if (data.id == vara.operationalStatusId)
          this.os = data.displayName;
      });

    })

  }

  checkValidBuildYear() {
    if (this.buildDate) {
      if (this.buildDate.toString().length != 4) {

        return true;

      }
      else if (parseInt(this.buildDate.toString()) < 1901) {
        return true;
      }
      else {
        var currentYear = new Date().getFullYear();
        if (parseInt(this.buildDate) > currentYear)
          return true;
        else
          return false;
      }

    }
    else
      return false;
  }

  checkValidManYear() {
    if (this.lossData.incidentInvolvement.exposure.modelBuildYear) {
      if (this.lossData.incidentInvolvement.exposure.modelBuildYear.toString().length != 4) {

        return true;

      }
      else if (parseInt(this.lossData.incidentInvolvement.exposure.modelBuildYear.toString()) < 1901) {
        return true;
      }
      else {
        var currentYear = new Date().getFullYear();
        if (this.lossData.incidentInvolvement.exposure.modelBuildYear > currentYear)
          return true;
        else
          return false;
      }

    }
    else
      return false;
  }

  calculateLossClaims() {
    this.lossData.loss.lossClaim.forEach(data => {
      this.powerLossDatas.lossType.forEach(element => {
        if (data.coverageTypeId == element.id) {
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

  generateYear(): number[] {
    let years: number[] = [];
    for (var i = new Date().getFullYear(); i >= 1972; i--) {
      years.push(i);
    }
    return years;
  }
  /* 
    generateDaysAsPerMonth(date)
    {
      return moment("2012-02", "YYYY-MM").daysInMonth()
    }
   */
  onSubmit() {

    this.lossData.loss.lossClaim = this.createLossDetails();

    //For Power Loss
    this.lossData.incidentInvolvement.operationTypeId = 3;
    this.lossData.loss.reportDate = this.formatDate(this.day, this.month, this.year);

    if (this.buildDate) {
      this.lossData.incidentInvolvement.exposure.buildDate = this.formatDate(undefined, undefined, this.buildDate);

    }

    else {
      this.lossData.incidentInvolvement.exposure.buildDate = null;
    }

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

  onReset(powerLossForm: NgForm) {
    powerLossForm.resetForm();
    this.selectedItems = [];
    this.resetFlag = !this.resetFlag;
    this.lossTypes = [];
  }

  selectedLossType(event) {
    this.lossTypes = event;
  }
  validationCheckForClaims() {
    if (this.lossTypes.length == 0) {
      this.claimPDFlag = false;
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

  checkFormValidation(powerLossForm: NgForm): boolean {
    this.validationCheckForClaims();
    if (powerLossForm.valid && powerLossForm.value) {
      if (!this.checkValidManYear() && !this.checkValidBuildYear() && this.lossTypes.length > 0 && powerLossForm.value.lyears && powerLossForm.value.category1 && powerLossForm.value.category2 && powerLossForm.value.land && powerLossForm.value.opeartionalStatus != undefined && powerLossForm.value.location && powerLossForm.value.area && powerLossForm.value.lossDetails && powerLossForm.value.country && powerLossForm.value.cause) {
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
      return powerLossForm.invalid;
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
      var fromDate = moment(new Date(this.formatDate("01", this.month, this.year)), "dd-MMM-yyy");
    }
    else {
      var fromDate = moment(new Date(this.formatDate(this.day, this.month, this.year)), "dd-MMM-yyy");
    }

    var currentDate = moment(new Date(), "dd-MMM-yyy");
    return fromDate.isAfter(currentDate, 'day');
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
      //Need To Change Later After Backend Changes
      lossClaim.incomplete = false;
      lossClaim.closeFlag = false;  //try
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

    //this.lossData.incidentInvolvement.exposure.equipementTypeId = null;
    this.lossData.incidentInvolvement.exposure.waterDepthCategoryId = null;
    this.lossData.incidentInvolvement.exposure.assetDescriptionId = null;
    //this.lossData.incidentInvolvement.exposure.buildDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.fieldUnit = null;
    this.lossData.incidentInvolvement.exposure.generation = null;
    this.lossData.incidentInvolvement.exposure.inspectionDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.installationDate = null;
    this.lossData.incidentInvolvement.exposure.lastUpgradeDate = new Date().toDateString();
    this.lossData.incidentInvolvement.adjuster = null;
    this.lossData.incidentInvolvement.exposure.modelBuildYear = null;
    this.lossData.incidentInvolvement.exposure.model = null;
    this.lossData.incidentInvolvement.exposure.modelOEM = null;
    this.lossData.loss.noOfDaysOutage = null;
    this.lossData.incidentInvolvement.exposure.countryManufactured = null;

    this.lossData.causeId = null;
    this.lossData.incidentInvolvement.exposure.oilMulti = null;

    this.lossData.incidentInvolvement.exposure.purchaseDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.relatedWaterDepth = null;
    this.lossData.loss.submissionID = null;
    this.lossData.incidentInvolvement.adjusterInd.name = null;
    this.lossData.incidentInvolvement.adjusterInd.partyId = null;
    this.lossData.incidentInvolvement.adjusterInd.roleId = null;
    this.lossData.incidentInvolvement.exposure.drillingStatusId = null;
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
    this.lossData.incidentInvolvement.exposure.transit = null;  //try
    //this.lossData.incidentInvolvement.exposure.installationDate = new Date(this.lossData.incidentInvolvement.exposure.installationDate).toDateString();

  }

}
