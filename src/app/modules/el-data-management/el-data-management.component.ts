import { Component, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import * as _ from 'lodash';
import { InMemoryStorageService } from '../../shared/storage/in-memory-storage.service';
import { ELDMReportFilters } from "./eldm-report-filters.const";
import { ELReportConfiguration } from './eldm-report.configuration';
import { ReportViewer } from '../reports/shared/report-viewer/report-viewer';
import { ReportViewerModel } from '../reports/shared/report-viewer/report-viewer.model';
import { Search } from './eldm-filters/entities/search-input';
import { SearchOutput } from './eldm-filters/entities/search-output';
import { SearchLossService } from './services/el-data-management-service'
import { EldmMainModel } from './model/eldm-main-model';
import { DownloadFileService } from '../../shared/download-file/download-file.service';
import { Dollar } from './eldm-filters/entities/dollar-model';
import { DropdownModel } from './eldm-filters/entities/dropdown-model';
import { DropDownStringModel } from './eldm-filters/entities/dropdown-string-model';
import {TabIndexService} from '../../shared/TabIndex/tabindex.service';

@Component({
  selector: 'app-eldm',
  templateUrl: './el-data-management.component.html',
  styleUrls: ['./el-data-management.component.css'],
})

export class ELDataManagementComponent implements AfterViewInit{

  sortCriteria = [
    { name: 'Month', value: 'Month' },
    { name: 'Year', value: 'Year' },
    { name: 'Category 1', value: 'Category1' },
    { name: 'Category 2', value: 'Category2' },
    { name: 'Category 3', value: 'Category3' },
    { name: 'Operational Status', value: 'OperationalStatus' },
    { name: 'Assured', value: 'Assured' },
    { name: 'Land/Offshore', value: 'LandOffshore' },
    { name: 'Location', value: 'Location' },
    { name: 'Country', value: 'Country' },
    { name: 'Asset Category', value: 'AssetCategory' },
    { name: 'Loss Type', value: 'LossType' },
    { name: 'Cause', value: 'Cause' },
    { name: 'Area', value: 'Area' },
    { name: 'Source', value: 'Source' },
    { name: 'Adjuster', value: 'Adjuster' },
    { name: 'Water Depth Category', value: 'WaterDepthCategory' },
    { name: 'Install/Build Year Category', value: 'BuildYearCategory' },
    { name: 'Water Depth ft', value: 'WaterDepth' },
    { name: 'Install/built Year', value: 'BuiltYear' },
    { name: 'PD claim US$', value: 'PDclaim' },
    { name: 'OEE claim US$', value: 'OEEclaim' },
    { name: 'BI claim US$', value: 'BIclaim' },
    { name: 'Total claim US$', value: 'Totalclaim' },
    { name: 'Total Indexed Claim US$', value: 'TotalIndexedClaim' },
    { name: 'Total Indexed OEE Claim US$', value: 'TotalIndexedOEEClaim' },
    { name: 'TL/CTL', value: 'CTL' },
    { name: 'Created Date', value: 'CreatedDate' },
    { name: 'Updated Date', value: 'UpdatedDate' },
    { name: 'Rating Area', value: 'RatingArea' },
    { name: 'WellType', value: 'WellType' },
    { name: 'DrillingStatus', value: 'DrillingStatus' },
    { name: 'U/G Blowout', value: 'UGBlowout' },
    { name: 'US Loc Code', value: 'USLocCode' },
    { name: 'Shale Well', value: 'ShaleWell' },
    { name: 'Developmental/Exploratory', value: 'DevelopmentalExploratory' },
    { name: 'Shale Formation', value: 'ShaleFormation' },
    { name: 'Loss Depth ft', value: 'LossDepthft' },
    { name: 'Loss Depth ft category', value: 'LossDepthftcategory' },
    { name: 'Proj. Tot Depth', value: 'ProjTotDepth' },
    { name: 'Days of Outage', value: 'DaysofOutage' },
    { name: 'TOW', value: 'TOW' },
    { name: 'Rated WD ft', value: 'RatedWDft' },
    { name: 'Generation', value: 'Generation' },
    { name: 'Year rebuilt', value: 'YearRebuilt' },
    { name: 'Product', value: 'Product' },
    { name: 'PD Actual Cost Category', value: 'PDActualCostCategory' },
    { name: 'OEE Actual Cost Category', value: 'OEEActualCostCategory' },
    { name: 'Total Actual Cost Category', value: 'TotalActualCostCategory' },
    { name: 'PD Indexed Cost Category', value: 'PDIndexedCostCategory' },
    { name: 'OEE Indexed Cost Category', value: 'OEEIndexedCostCategory' },
    { name: 'Total Indexed Cost Category', value: 'TotalIndexedCostCategory' },
    { name: 'UP/DOWN/POWER', value: 'OperationType' },
    { name: 'Field/Unit', value: 'FieldUnit' },
    { name: 'GOM Area', value: 'GOMArea' },
    { name: 'WELD URN', value: 'WELDURN' },
    { name: 'Adjuster Individual', value: 'AdjusterIndividual' },
    { name: 'Adjuster File Ref', value: 'AdjusterFileRef' },
    { name: 'Close', value: 'Close' },
    { name: 'Transit', value: 'Transit' },
    { name: 'Willis', value: 'Willis' },
    { name: 'OIL URN', value: 'OILURN' },
    { name: 'OIL MULTI', value: 'OILMULTI' },
    { name: 'Event', value: 'Event' },
    { name: 'Plant Build Year', value: 'PlantBuildYear' },
    { name: 'Plant Capacity MW', value: 'PlantCapacityMW' },
    { name: 'Equipment Type', value: 'EquipmentType' },
    { name: 'Model', value: 'Model' },
    { name: 'Model build year of Manuf', value: 'ModelbuildyearofManuf' },
    { name: 'Model OEM', value: 'ModelOEM' },
    { name: 'Country Manufacture', value: 'CountryManufacture' },
    { name: 'Incomplete Checkbox', value: 'IncompleteCheckbox' },
    { name: 'DOL (Date of Loss)', value: 'DOL' }
  ];

  //search object
  search: Search = new Search();

  //define all required object
  showObject: any;
  pageIndex: number;
  isCaretToggle: boolean = true;
  isSortToggle: boolean = true;
  eldmMainModel: EldmMainModel;
  searchOut: SearchOutput = new SearchOutput();
  reportItems: any = '';
  isSearchTriggered: boolean;
  selectedReportName: string;
  isSearchOn: boolean;
  currentDate: Date = new Date();
  selectedReportConfiguration: any = {};
  reportTypes: any = ELDMReportFilters;
  allTableItems: ReportViewer;
  reportViewerModel: ReportViewerModel;
  public sortOrderList: any = [];



  //constructor defination
  constructor(private router: Router, private inMemoryStorage: InMemoryStorageService,
    searchLossService: SearchLossService, private downloadFileService: DownloadFileService,private tabIndexService: TabIndexService) {
    this.reportViewerModel = new ReportViewerModel();
    this.eldmMainModel = new EldmMainModel(searchLossService);
  }
  ngAfterViewInit() {
    //this.tabIndexService.assignTabIndex();
  }

  Sort() {
    this.sortCriteria.sort(function (a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
  }

  ngOnInit() {
    this.Sort();
  }

  //search click method
  onSearch() {
    //remove object if null
    this.sanitizeObject();
    //call search api
    this.eldmMainModel.getSearchInformation(this.search)
      .subscribe(response => {
        this.searchOut.count = response.count;
        this.searchOut.incidentId = response.incidentId;//.sort(function(a, b){return b-a});
        this.pageIndex = 1;
        this.isSearchOn = true;
        this.selectedReportName = '';
        this.isSearchTriggered = true;
        this.resetObject();
        if (!this.isCaretToggle) {
          document.getElementById('recordFilters').click();
        }
        if (!this.isSortToggle) {
          document.getElementById('sortRecords').click();
        }
      });
  }

  //search orderBy prepared
  public sequence: any;

  onChange(value) {
    var localSeq = this.sequence;
    var localSort = this.sortOrderList;
    //initially add single value to sequence object  
    if (!localSeq) {
      localSeq = [];
      localSeq.push(localSort[0]);
    }
    //else push list of object to sequence object
    else {
      //restrict length of sort upto 5
      if (localSort && localSort.length > 5) {
        this.sortOrderList = localSeq;
        if (value.currentTarget.options) {
          var loop = value.currentTarget.options;
          for (var j = 0; j < loop.length; j++) {
            if (this.sequence) {
              if (!(this.sequence.indexOf(loop[j].getAttribute('ng-reflect-value')) > -1))
                value.currentTarget.options[j].selected = false;
              else
                value.currentTarget.options[j].selected = true;
            }
          }
        }
      }
      //if single sort field is selected remove last object
      else if (localSort && localSort.length == 1) {
        localSeq.splice(0, localSeq.length)
        localSeq.push(localSort[0]);
      }
      //if selected sort is greater than old sequence
      else if (localSort.length > localSeq.length) {
        localSort.filter(function (item) { if (localSeq.indexOf(item) == -1) localSeq.push(item) });
      }
      //if old sequence is greater than selected sort
      else {
        localSeq.filter(function (item) { if (localSort.indexOf(item) == -1) localSeq.splice(localSeq.indexOf(item), 1) });
      }
    }
    this.sequence = localSeq;
    this.search.orderBy = localSeq.join(',');
  }

  //reset click - refresh search & hide panel
  onReset() {
    this.isSearchOn = false;
    this.selectedReportName = '';
    this.isSearchTriggered = false;
    this.sortOrderList = [];
    this.searchOut = new SearchOutput();
    this.search = new Search();
    this.sequence = null;
    if (!this.isCaretToggle) {
      document.getElementById('recordFilters').click();
    }
    if (!this.isSortToggle) {
      document.getElementById('sortRecords').click();
    }
  }

  //not in use
  onEdit() {

  }

  //not in use
  onDelete() {

  }

  //not in use
  redirectToSearchPage() {
    this.onSearch();
  }


  downloadReport(reportType, extension) {
    //remove object if null
    this.sanitizeObject();
    //download report call
    var isInternetExplorer: boolean = false;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("Trident");
    // if (msie > 0) {
    //   isInternetExplorer = true;
    // }
    this.eldmMainModel.downloadReport(reportType, extension, this.search, msie).subscribe((result) => {
      this.downloadFileService.fetchFile(result);
    })
    this.resetObject();
  }

  sanitizeObject() {
    //remove object if null
    for (var key in this.search) {
      if (this.search.hasOwnProperty(key)) {
        //check dollar objects
        if (this.search[key] instanceof Dollar && !(this.search[key].model)) {
          this.search[key] = new Dollar();
        }
        //check dropdown objects
        else if (this.search[key] instanceof DropdownModel && !(this.search[key].id)) {
          this.search[key] = new DropdownModel();
        }
        //check dropdown objects
        else if (this.search[key] instanceof DropDownStringModel && !(this.search[key].id)) {
          this.search[key] = new DropDownStringModel();
        }
        else if (!(this.search[key])) {
          delete this.search[key];
        }
      }
    }
  }

  resetObject() {
    var s = new Search();
    for (var key in s) {
      if (!this.search.hasOwnProperty(key))
        this.search[key] = null
    }
  }

  pageEvent() {
    if (!this.isCaretToggle) {
      document.getElementById('recordFilters').click();
    }
    if (!this.isSortToggle) {
      document.getElementById('sortRecords').click();
    }
  }

}



