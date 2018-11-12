import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LossDataSubmissionModel } from '../models/loss-data-submission.model';
import { LossDataSubmissionService } from '../services/loss-data-submission.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { LossData } from '../entities/loss-data';
import { Exposure } from '../entities/exposure';
import { IncidentInvolvement } from '../entities/incident-involvement';
import { Loss } from '../entities/loss';
import { LossClaims } from '../entities/loss-claims';
import { LocationDetails } from '../entities/location';
import { NgForm } from '@angular/forms';
import * as moment from 'moment/moment';
import { PartyRole } from '../entities/party-role';
import { DecimalPipe } from '@angular/common';
import { SearchFieldWithType } from '../../validate-loss-data-submission/shared/entities/searchFieldWithType';
import { TabIndexService } from '../../../shared/TabIndex/tabindex.service';

@Component({
  selector: 'upstream-loss',
  templateUrl: './upstream-loss.component.html',
  styleUrls: ['./upstream-loss.component.css'],
  providers: [DecimalPipe]
})
export class UpstreamLossComponent implements OnInit, AfterViewInit {


  constructor(private dp: DecimalPipe, private router: Router,
    private lossDataSubmissionService: LossDataSubmissionService,
    private localWebStorageService: LocalWebStorageService, private tabIndexService: TabIndexService) {
    this.lossDataSubmissionModel = new LossDataSubmissionModel(lossDataSubmissionService, localWebStorageService);

  }
  claimPDFlag: boolean = false;
  claimBIFlag: boolean = false;
  claimOEEFlag: boolean = false;
  claimSnPFlag: boolean = false;
  claimCBIFlag: boolean = false;
  msg: string;
  totalFlag: boolean;
  readOnlyFlag: boolean;
  upStreamLossData: any = new Object();
  lossData: LossData = new LossData();
  lossClaims: LossClaims[] = [];
  day: string;
  month: string;
  year: string;
  pd: number = 0;
  oee: number = 0;
  bi: number = 0;
  lossTypes: any[] = [];
  resetFlag: boolean = false;
  selectedItems: any[] = [];
  category1: string;
  category2: string;
  category3: string;
  area: string;
  country: string;
  cause: string;
  land: string;
  lossTypesName: string = "";
  createIncidentInvolvement: IncidentInvolvement = new IncidentInvolvement();
  wellType: string;
  os: string;
  dStatus: string;
  ugbo: string;
  shale: string;
  devlExpl: string;
  shaleFormation: string;
  installationDate: any;
  approxInsVal: any;
  dynamicallyPositioned: string;
  dateData: any[] = [{ "day": [], "month": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], "year": ["1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "2019"] }];
  private lossDataSubmissionModel: LossDataSubmissionModel;
  multiselectIndex: number = 19;

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: any) {
    if (!this.lossDataSubmissionModel.getReadOnlyFlag())
      event.returnValue = "Data will be lost if you refresh or leave the page, are you sure?";
  }

  ngOnInit() {
    this.lossData.incidentInvolvement = new IncidentInvolvement();
    this.lossData.incidentInvolvement.exposure = new Exposure();
    this.lossData.location = new LocationDetails();
    this.lossData.loss = new Loss();
    this.lossData.incidentInvolvement.adjusterInd = new PartyRole();

    this.readOnlyFlag = this.lossDataSubmissionModel.getReadOnlyFlag();
    this.upStreamLossData = this.lossDataSubmissionModel.getDropDownValues().lossSubmission;

    // this.setAllTypeIdsForFiltering();

    this.upStreamLossData.categories1 = this.upStreamLossData.categories1.filter(cat => cat.typeId == 1);
    this.upStreamLossData.categories2 = this.upStreamLossData.categories2.filter(cat => cat.typeId == 1);
    this.upStreamLossData.categories3 = this.upStreamLossData.categories3.filter(cat => cat.typeId == 1);
    this.upStreamLossData.cause = this.upStreamLossData.cause.filter(cat => cat.typeId == 1);
    this.upStreamLossData.lossType = this.upStreamLossData.lossType.filter(cat => cat.typeId == 1);
    // this.upStreamLossData.lossType = this.upStreamLossData.lossType.filter(cat => cat.typeId == 1);

    this.dateData[0].year = this.generateYear();
    //this.dateData[0].day=this.generateDays();

    if (this.readOnlyFlag) {
      if (this.lossDataSubmissionModel.getIncidentId() && this.lossDataSubmissionModel.getLossType() == "Upstream") {
        this.getLossDetails(this.lossDataSubmissionModel.getIncidentId());
      }

      else {
        this.router.navigate(['/loss-data-submission']);
      }

    }
  }

  ngAfterViewInit() {
    //this.tabIndexService.assignTabIndex();
  }

  getDays() {
    if (this.month && this.year) {
      this.dateData[0].day = this.generateDays();
    }
    else {
      this.dateData[0].day = [];
    }
  }

  getLossDetails(incidentNo: number) {
    this.lossDataSubmissionModel.getLossData(incidentNo).subscribe(response => {
      this.upStreamLossData.cause.forEach(data => {
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

      if (new Date(this.lossData.incidentInvolvement.exposure.installationDate).getFullYear() == 1) {
        this.lossData.incidentInvolvement.exposure.installationDate = " ";
      }
      else {
        //if(this.lossData.incidentInvolvement.exposure.installationDate)
        this.lossData.incidentInvolvement.exposure.installationDate = new Date(this.lossData.incidentInvolvement.exposure.installationDate).getFullYear().toString();
      }

      // Display commas in readonly mode
      this.lossData.incidentInvolvement.exposure.waterDepth = this.dp.transform(this.lossData.incidentInvolvement.exposure.waterDepth).toString();
      this.lossData.loss.lossDepth = this.dp.transform(this.lossData.loss.lossDepth).toString();
      this.lossData.incidentInvolvement.exposure.projectedTotalDepth = this.dp.transform(this.lossData.incidentInvolvement.exposure.projectedTotalDepth).toString();


      this.pd = this.lossData.loss.pdAmount;
      this.bi = this.lossData.loss.biAmount;
      this.oee = this.lossData.loss.oeeAmount;

      this.upStreamLossData.land_Offshore.forEach(data => {
        if (data.id == exposure.onShoreInd)
          this.land = data.displayName;
      });
      this.upStreamLossData.wellType.forEach(data => {
        if (data.id == exposure.wellTypeId)
          this.wellType = data.displayName;
      });
      this.upStreamLossData.categories1.forEach(data => {
        if (data.id == exposure.exposureCategoryId1)
          this.category1 = data.displayName;
      });
      this.upStreamLossData.drillingStatus.forEach(data => {
        if (data.id == exposure.drillingStatusId)
          this.dStatus = data.displayName;
      });

      this.upStreamLossData.ugbo.forEach(data => {
        if (data.id == this.lossData.loss.ugbo)
          this.ugbo = data.displayName;
      });

      this.upStreamLossData.dev_Exp.forEach(data => {
        if (data.id == exposure.devlExpl)
          this.devlExpl = data.displayName;
      })

      this.upStreamLossData.categories2.forEach(data => {
        if (data.id == exposure.exposureCategoryId2)
          this.category2 = data.displayName;
      });

      this.upStreamLossData.categories3.forEach(data => {
        if (data.id == exposure.exposureCategoryId3)
          this.category3 = data.displayName;
      })

      this.upStreamLossData.country.forEach(data => {
        if (data.id == location.countryId)
          this.country = data.displayName;
      });
      this.upStreamLossData.area.forEach(data => {
        if (data.id == location.areaId)
          this.area = data.displayName;
      });
      this.upStreamLossData.opeartionalStatus.forEach(data => {
        if (data.id == exposure.operationalStatusId)
          this.os = data.displayName;
      });

      this.upStreamLossData.shell.forEach(data => {
        if (data.id == exposure.shale)
          this.shale = data.displayName;
      });

      this.upStreamLossData.shaleFormation.forEach(data => {
        if (data.id == exposure.shaleFormation)
          this.shaleFormation = data.displayName;
      });

      this.upStreamLossData.dynamicallyPositioned.forEach(data => {
        if (data.id == exposure.dynamicallyPositioned)
          this.dynamicallyPositioned = data.displayName;
      });
    })

  }

  calculateLossClaims() {
    this.lossData.loss.lossClaim.forEach(data => {
      this.upStreamLossData.lossType.forEach(element => {

        if (data.coverageTypeId == element.id) {
          /* if (element.displayName == "PD") {
            this.lossTypesName = this.lossTypesName + " " + element.displayName;
            this.pd = data.lossAmount;
          }

          if (element.displayName == "BI") {
            this.bi = data.lossAmount;
            this.lossTypesName = this.lossTypesName + " " + element.displayName;
          }

          if (element.displayName == "OEE") {
            this.oee = data.lossAmount;
            this.lossTypesName = this.lossTypesName + " " + element.displayName;
          } */


          if (this.lossTypesName == "")
            this.lossTypesName = element.displayName;
          else
            this.lossTypesName = this.lossTypesName + ", " + element.displayName;
        }
      });
    })
  }

  checkValidYear() {
    if (this.installationDate) {
      if (this.installationDate.toString().length != 4) {

        return true;

      }
      else if (parseInt(this.installationDate.toString()) < 1901) {
        return true;
      }
      else {
        var currentYear = new Date().getFullYear();
        if (parseInt(this.installationDate) > currentYear)
          return true;
        else
          return false;
      }

    }
    else
      return false;
  }

  generateDateMonthYear() {
    var locale = "en-us";
    this.year = new Date(this.lossData.loss.reportDate).getFullYear().toString();
    this.day = new Date(this.lossData.loss.reportDate).getDate().toString();
    //this.lossData.incidentInvolvement.exposure.buildDate = new Date(this.lossData.incidentInvolvement.exposure.buildDate).getFullYear().toString();
    this.month = new Date(this.lossData.loss.reportDate).toLocaleString(locale, { month: "long" });
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

  onBackToHistory() {
    this.router.navigate(['loss-data-submission/loss-data-submission-history']);
  }

  selectedLossType(event) {
    this.lossTypes = event
  }

  createLossDetails() {

    this.lossTypes.forEach(element => {

      let lossClaim = new LossClaims();

      /*  if (element.displayName == "BI")
        lossClaim.lossAmount = this.bi;
      if (element.displayName == "OEE")
        lossClaim.lossAmount = this.oee;
      if (element.displayName == "PD")
        lossClaim.lossAmount = this.pd; */
      lossClaim.coverageTypeId = element.id;
      lossClaim.lossAmount = 0;
      lossClaim.status = "Submitted";
      lossClaim.statusComment = "NA";
      //Need To Change Later After Backend Changes
      lossClaim.incomplete = null;
      lossClaim.closeFlag = null;
      this.lossClaims = this.lossClaims.filter(e => e.coverageTypeId != lossClaim.coverageTypeId);
      this.lossClaims.push(lossClaim);
    });
    return this.lossClaims;

  }

  formatDate(day, month, year): string {
    // if (day || month) {
    //   return new Date(month + " " + day.toString() + "," + year).toDateString();

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
      var fromDate = moment(new Date(this.month + " " + this.day.toString() + "," + this.year), "dd-MMM-yyyy");
    }
    var currentDate = moment(new Date(), "dd-MMM-yyy");
    return fromDate.isAfter(currentDate, 'day');
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


  onSubmit() {

    this.lossData.loss.lossClaim = this.createLossDetails();
    //For Type Upstream
    this.lossData.incidentInvolvement.operationTypeId = 1;

    this.lossData.eventId = null;
    this.lossData.location.gomAreaID = null;
    this.lossData.incidentInvolvement.source = null;
    this.lossData.location.locationCodeID = null;
    this.lossData.incidentInvolvement.exposure.name = null;
    this.lossData.incidentInvolvement.exposure.assetCategoryId = null; //try
    this.lossData.incidentInvolvement.exposure.towId = null;  //try
    //this.lossData.incidentInvolvement.exposure.wellTypeId=7;
    //this.lossData.incidentInvolvement.exposure.drillingStatusId = 14;
    this.lossData.incidentInvolvement.exposure.equipmentTypeId = null;
    this.lossData.incidentInvolvement.exposure.waterDepthCategoryId = null;
    this.lossData.incidentInvolvement.exposure.modelOEM = null;
    this.lossData.incidentInvolvement.exposure.assetDescriptionId = null;
    this.lossData.incidentInvolvement.exposure.buildDate = null;
    this.lossData.incidentInvolvement.exposure.countryManufactured = null;
    this.lossData.incidentInvolvement.exposure.fieldUnit = null;
    this.lossData.incidentInvolvement.exposure.generation = null;
    this.lossData.incidentInvolvement.exposure.inspectionDate = new Date().toDateString();
    //this.lossData.incidentInvolvement.exposure.installationDate=new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.lastUpgradeDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.modelBuildYear = null;
    this.lossData.incidentInvolvement.exposure.oilMulti = null;
    this.lossData.incidentInvolvement.exposure.model = null;
    this.lossData.incidentInvolvement.exposure.plantCapacity = null;
    this.lossData.incidentInvolvement.exposure.purchaseDate = new Date().toDateString();
    this.lossData.incidentInvolvement.exposure.relatedWaterDepth = null;
    this.lossData.loss.submissionID = "123";
    this.lossData.incidentInvolvement.adjusterInd.name = "";
    this.lossData.incidentInvolvement.adjusterInd.partyId = null;  //try
    this.lossData.incidentInvolvement.adjusterInd.roleId = null; //try
    //this.lossData.incidentInvolvement.exposure.drillingStatusId=1;
    //this.lossData.incidentInvolvement.exposure.equipementTypeId = 14;
    this.lossData.incidentInvolvement.exposure.assetDescriptionId = 1;
    this.lossData.incidentInvolvement.exposure.rigDescription = null;
    this.lossData.incidentInvolvement.exposure.transit = null;
    this.lossData.incidentInvolvement.exposure.userAtPurchase = null;
    this.lossData.loss.lossEndDate = new Date().toDateString();
    this.lossData.loss.lossStartDate = new Date().toDateString();
    // this.lossData.loss.noOfDaysOutage = null;
    this.lossData.loss.sanitisedDetails = null;
    this.lossData.loss.willis = null;
    this.lossData.loss.weldurn = null;
    //this.lossData.loss.status="Submitted";
    this.lossData.incidentInvolvement.exposure.transit = null;//try

    if (this.installationDate)
      this.lossData.incidentInvolvement.exposure.installationDate = new Date("January 01," + this.installationDate).toDateString();
    else
      this.lossData.incidentInvolvement.exposure.installationDate = null;


    this.lossData.loss.reportDate = this.formatDate(this.day, this.month, this.year);
    this.lossData.loss.biAmount = this.bi;
    this.lossData.loss.pdAmount = this.pd;
    this.lossData.loss.oeeAmount = this.oee;
    if (this.approxInsVal) {
      this.lossData.incidentInvolvement.exposure.approxInsVal = parseInt(this.approxInsVal.toString().replace(/,/g, ''));
    }

    if (this.lossData.loss.ctl == undefined)
      this.lossData.loss.ctl = "false";
    //console.log(JSON.stringify(this.lossData));
    //console.log(this.lossData);
    // Making sure we have no commas while it is sent to the WebApi
    this.lossData.incidentInvolvement.exposure.waterDepth = this.convertToInt(this.lossData.incidentInvolvement.exposure.waterDepth).toString();
    this.lossData.loss.lossDepth = this.convertToInt(this.lossData.loss.lossDepth).toString();
    this.lossData.incidentInvolvement.exposure.projectedTotalDepth = this.convertToInt(this.lossData.incidentInvolvement.exposure.projectedTotalDepth).toString();

    this.lossDataSubmissionModel.postLossData(this.lossData).subscribe(response => {
      this.msg = "Loss Data record submitted successfully" + " (Submission ID –" + response + ")";
      document.getElementById('successButton').click();
    })

  }

  convertToInt(val) {
    if (val != undefined && val != null)
      return parseInt(val.toString().replace(/,/g, ''));
    else
      return 0;
  }

  onReset(upstreamForm: NgForm) {
    upstreamForm.reset();
    this.lossData = new LossData();
    this.lossData.incidentInvolvement = new IncidentInvolvement();
    this.lossData.incidentInvolvement.exposure = new Exposure();
    this.lossData.incidentInvolvement.adjusterInd = new PartyRole();
    this.lossData.location = new LocationDetails();
    this.lossData.loss = new Loss();
    this.lossData.loss.lossClaim = [];
    this.resetFlag = !this.resetFlag;
    this.selectedItems = [];
    this.lossTypes = [];
    //this.resetFlag=false;
    //this.month="";
    //this.year="";
    //this.day="";
  }

  formatInput() {
    this.approxInsVal = this.dp.transform(this.approxInsVal)
  }

  addCommaSeparator(){
    if (this.lossData.incidentInvolvement.exposure.waterDepth != null && this.lossData.incidentInvolvement.exposure.waterDepth != undefined) {
      this.lossData.incidentInvolvement.exposure.waterDepth = this.dp.transform(parseInt(this.lossData.incidentInvolvement.exposure.waterDepth.toString().replace(/,/g, '')));
    }
    if (this.lossData.loss.lossDepth != null && this.lossData.loss.lossDepth != undefined) {
      this.lossData.loss.lossDepth = this.dp.transform(parseInt(this.lossData.loss.lossDepth.toString().replace(/,/g, '')));
    }

    if (this.lossData.incidentInvolvement.exposure.projectedTotalDepth != null && this.lossData.incidentInvolvement.exposure.projectedTotalDepth != undefined) {
      this.lossData.incidentInvolvement.exposure.projectedTotalDepth = this.dp.transform(parseInt(this.lossData.incidentInvolvement.exposure.projectedTotalDepth.toString().replace(/,/g, '')));
    }
  }

  generateYear(): number[] {
    let years: number[] = [];
    for (var i = new Date().getFullYear(); i >= 1972; i--) {
      years.push(i);
    }
    return years;
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

  // checkValidation(upstreamForm: NgForm): boolean {
  //   if (upstreamForm.value) {

  //     if (!this.checkValidYear() && this.lossTypes.length > 0 && upstreamForm.value.lyears && upstreamForm.value.category1 && upstreamForm.value.category2 && upstreamForm.value.land && upstreamForm.value.opeartionalStatus && upstreamForm.value.location && upstreamForm.value.area && upstreamForm.value.lossDetails && upstreamForm.value.country && upstreamForm.value.cause) {
  //       return false;
  //     }
  //     else {
  //       return true;
  //     }
  //   }
  //   else {
  //     return upstreamForm.invalid;
  //   }
  // }

  checkValidation(upstreamForm: NgForm): boolean {
    this.validationCheckForClaims();
    if (upstreamForm.value && upstreamForm.valid) {

      if (!this.checkValidYear() && this.lossTypes.length > 0 && upstreamForm.value.lyears && upstreamForm.value.category1 && upstreamForm.value.category2 && upstreamForm.value.land && upstreamForm.value.opeartionalStatus && upstreamForm.value.location && upstreamForm.value.area && upstreamForm.value.lossDetails && upstreamForm.value.country && upstreamForm.value.cause) {
        if (this.claimPDFlag == true) {
          if (!this.pd || parseInt(this.pd.toString()) == 0) {
            return true;
          }
        }
        if (this.claimOEEFlag == true) {
          if (!this.oee || parseInt(this.oee.toString()) == 0) {
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

      else {
        return true;
      }
    }
    else {
      return upstreamForm.invalid;
    }
  }

}
