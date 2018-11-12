import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import 'rxjs/add/operator/map';
declare var $: any;
import * as _ from 'lodash';
import { SearchCriteria, Range, SelectedSearchCriteria } from './entities/search-criteria';
import { SearchModel } from './search.model';
import { SearchService } from './search.service';
import { SearchField } from './entities/search-field';
import { Country } from './entities/country';
import { DepthCategory } from './entities/depthCategory';
import { LossAmountRange } from './entities/lossAmountRange';
import { LocalWebStorageService } from '../../shared/storage/local-web-storage.service';
import { InMemoryStorageService } from '../../shared/storage/in-memory-storage.service';
import { LoaderService } from '../../shared/loader/loader.service';

import { SearchSaveCriteria } from './entities/saveSearchCriteria';
import { SearchCriteriaPayload } from './entities/searchCriteriapayload';
import { NotificationMessage } from '../common/entity/notification-message';
import { ReportService } from '../reports/services/report.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  selection: string;
  saveSearchCriteria: SearchSaveCriteria = new SearchSaveCriteria();
  searchCriteria: SearchCriteria = new SearchCriteria();
  isCaretToggle: boolean;
  isModified: boolean = false;
  private searchModel: SearchModel;
  searchTabMob: string;
  searchTemplateName: string;
  selectedCriteria: any;
  selectedSearchName: string;
  isSaveSuccess: boolean;
  isDeleteSuccess: boolean;
  setSaveFlag: boolean;
  searchCriteriaResult: SearchSaveCriteria[];
  modifiedFlag: any;
  deletedCriteriaName: string;
  selectedAreas; any;
  notificationMessage: NotificationMessage = new NotificationMessage();
  constructor(private router: Router, private searchService: SearchService, private loaderService: LoaderService, private localStorage: LocalWebStorageService, private inMemoryStorage: InMemoryStorageService, private reportService: ReportService) {
    this.searchModel = new SearchModel(searchService);
  }

  ngOnInit() {
    this.selectedSearchName = this.localStorage.getTemplateName();
    this.loadSearchData();
    this.isCaretToggle = true;
    this.searchTabMob = 'yearOfLoss';
    this.loadSearchCriteriaResult();
    this.setSaveFlag = true;
    this.localStorage.remove('sc');
    this.isCriteriaSaveDisabled();
  }

  onSelectedTab(tabName: string) {
    this.searchTabMob = tabName;
  }

  reset() {
    (<HTMLInputElement>document.getElementById('searchTemplateName')).value = '';
    this.notificationMessage.errorMessage = null;
    this.setSaveFlag = true;
    this.localStorage.setModifiedflag(false);
    this.isCriteriaSaveDisabled();
    this.selectedSearchName = '';
    this.loaderService.show();
    this.isSaveSuccess = false;
    this.isDeleteSuccess = false;
    this.isModified = true;
    this.localStorage.remove('sc');
    this.localStorage.remove("searchCriteria");
    this.localStorage.remove("OEELossReportItems");
    this.inMemoryStorage.setItem("OverallLossReportItems", null);

    this.searchCriteria.selectedSearchCriteria = new SelectedSearchCriteria();
    this.setDefaultOptions();

    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      decadeObj.isSelected = false;
      _.each(decadeObj.years, (yearObj: any) => {
        if (!yearObj.ignore)
          yearObj.isSelected = false;
      });
    });

    setTimeout(() => { this.loaderService.hide(); this.isModified = false; }, 1000);
  }

  search() {
    this.localStorage.remove("reportData");
    this.inMemoryStorage.setItem("reportData", null);
    this.localStorage.remove("OEELossReportItems");
    this.inMemoryStorage.setItem("OverallLossReportItems", null);
    this.localStorage.set("searchCriteria", this.searchCriteria.selectedSearchCriteria);
    this.localStorage.setTemplateName(this.selectedSearchName);

    let url = this.localStorage.get<string>("lastVisitedReportUrl");

    if (!url)
      url = "reports/overall-losses";

    this.router.navigate([url]);

  }

  loadSearchData() {

    this.searchModel.getSearchData()
      .subscribe(
        (result) => {
          if (result) {
            let yearOfLoss = result.yearOfLoss;
            this.searchCriteria.masterSearchData.yearOfLoss = this.loadYears(yearOfLoss);

            this.searchCriteria.masterSearchData.area = result.locations.area;
            this.searchCriteria.masterSearchData.area.splice(0, 0, new SearchField(null, "All Areas"));

            this.searchCriteria.masterSearchData.country = _.map(result.locations.countries, (e) => {
              return {
                id: e.id,
                alpha2Code: e.alpha2Code,
                alpha3Code: e.alpha3Code,
                numericCode: e.numericCode,
                displayName: e.name,
                lastUpdateTime: e.lastUpdateTime
              }
            });
            this.searchCriteria.masterSearchData.country.splice(0, 0, new Country(null, "All Countries"));

            this.searchCriteria.masterSearchData.gomArea = result.locations.gomArea;
            this.searchCriteria.masterSearchData.gomArea.splice(0, 0, new SearchField(null, "All GOM Areas"));

            this.searchCriteria.masterSearchData.landOffShore = result.locations.landOffShore;
            this.searchCriteria.masterSearchData.landOffShore.splice(0, 0, new SearchField(null, "Either"));

            this.searchCriteria.masterSearchData.usLocationCode = result.locations.usLocationCode;
            this.searchCriteria.masterSearchData.usLocationCode.splice(0, 0, new SearchField(null, "All US Location Codes"));

            this.searchCriteria.masterSearchData.category1 = result.lossDetails.categories1;
            this.searchCriteria.masterSearchData.category1.splice(0, 0, new SearchField(null, "All Categories"));

            this.searchCriteria.masterSearchData.category2 = result.lossDetails.categories2;
            this.searchCriteria.masterSearchData.category2.splice(0, 0, new SearchField(null, "All Categories"));

            this.searchCriteria.masterSearchData.category3 = result.lossDetails.categories3;
            this.searchCriteria.masterSearchData.category3.splice(0, 0, new SearchField(null, "All Categories"));

            this.searchCriteria.masterSearchData.car_op = result.lossDetails.carop;
            this.searchCriteria.masterSearchData.car_op.splice(0, 0, new SearchField(null, "Either"));

            this.searchCriteria.masterSearchData.lossType = result.lossDetails.lossType;
            this.searchCriteria.masterSearchData.lossType.splice(0, 0, new SearchField(null, "All Types"));

            this.searchCriteria.masterSearchData.cause = result.lossDetails.cause;
            this.searchCriteria.masterSearchData.cause.splice(0, 0, new SearchField(null, "All Causes"));

            this.searchCriteria.masterSearchData.event = result.lossDetails.event;
            this.searchCriteria.masterSearchData.event.splice(0, 0, new SearchField(null, "All Events"));

            this.searchCriteria.masterSearchData.upDownPower = result.lossDetails.upDownPower;
            this.searchCriteria.masterSearchData.upDownPower.splice(0, 0, new SearchField(null, "All Up/Down/Power"));

            this.searchCriteria.masterSearchData.depthCategories = _.map(result.wellDetails.depthCategories, (e) => {
              return {
                id: e.id,
                displayName: e.depthCategoryRange,
                depthCategoryDescription: e.depthCategoryDescription
              }
            });
            this.searchCriteria.masterSearchData.depthCategories.splice(0, 0, new DepthCategory(null, "All Categories"));

            this.searchCriteria.masterSearchData.drillingStatues = result.wellDetails.drillingStatus;
            this.searchCriteria.masterSearchData.drillingStatues.splice(0, 0, new SearchField(null, "All Status"));

            this.searchCriteria.masterSearchData.ratingAreas = result.wellDetails.ratingAreas;
            this.searchCriteria.masterSearchData.ratingAreas.splice(0, 0, new SearchField(null, "All Areas"));

            this.searchCriteria.masterSearchData.ugbo = result.wellDetails.ugbo;
            this.searchCriteria.masterSearchData.ugbo.splice(0, 0, new SearchField(null, "Either"));

            this.searchCriteria.masterSearchData.wellTypes = result.wellDetails.wellTypes;
            this.searchCriteria.masterSearchData.wellTypes.splice(0, 0, new SearchField(null, "All Types"));

            this.searchCriteria.masterSearchData.lossAmountRanges = _.map(result.lossAmountRanges, (e) => {
              return {
                id: e.id,
                displayName: e.name,
                minValue: e.minValue,
                maxValue: e.maxValue
              };
            });

            this.searchCriteria.masterSearchData.lossAmountRanges.splice(0, 0, new LossAmountRange(null, "All Categories"));

            const selectedSearchCriteria = this.localStorage.get<SelectedSearchCriteria>("searchCriteria");
            if (selectedSearchCriteria) {
              this.searchCriteria.selectedSearchCriteria = selectedSearchCriteria;
              this.bindAllSelectedYear();
            } else {
              this.setDefaultOptions();
              this.localStorage.set('all', this.searchCriteria.selectedSearchCriteria)
            }
          }

        });

  }

  private setDefaultOptions() {

    this.searchCriteria.selectedSearchCriteria.area.push(new SearchField(null, "All Areas"));
    this.searchCriteria.selectedSearchCriteria.country.push(new Country(null, "All Countries"));
    this.searchCriteria.selectedSearchCriteria.gomArea.push(new SearchField(null, "All GOM Areas"));
    this.searchCriteria.selectedSearchCriteria.landOffShore = new SearchField(null, "Either");
    this.searchCriteria.selectedSearchCriteria.usLocationCode.push(new SearchField(null, "All US Location Codes"));
    this.searchCriteria.selectedSearchCriteria.car_op.push(new SearchField(null, "Either"));
    this.searchCriteria.selectedSearchCriteria.category1.push(new SearchField(null, "All Categories"));
    this.searchCriteria.selectedSearchCriteria.category2.push(new SearchField(null, "All Categories"));
    this.searchCriteria.selectedSearchCriteria.category3.push(new SearchField(null, "All Categories"));
    this.searchCriteria.selectedSearchCriteria.lossType.push(new SearchField(null, "All Types"));
    this.searchCriteria.selectedSearchCriteria.cause.push(new SearchField(null, "All Causes"));
    this.searchCriteria.selectedSearchCriteria.event.push(new SearchField(null, "All Events"));
    this.searchCriteria.selectedSearchCriteria.upDownPower.push(new SearchField(null, "All Up/Down/Power"));
    this.searchCriteria.selectedSearchCriteria.drillingStatues.push(new SearchField(null, "All Status"));
    this.searchCriteria.selectedSearchCriteria.ratingAreas.push(new SearchField(null, "All Areas"));
    this.searchCriteria.selectedSearchCriteria.ugbo.push(new SearchField(null, "Either"));
    this.searchCriteria.selectedSearchCriteria.wellTypes.push(new SearchField(null, "All Types"));
    this.searchCriteria.selectedSearchCriteria.depthCategories.push(new DepthCategory(null, "All Categories"));

    const allCategories = new LossAmountRange(null, "All Categories");
    this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory.push(allCategories);
    this.searchCriteria.selectedSearchCriteria.actualOEECategory.push(allCategories);
    this.searchCriteria.selectedSearchCriteria.actualTotalCategory.push(allCategories);
    this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory.push(allCategories);
    this.searchCriteria.selectedSearchCriteria.indexedOEECategory.push(allCategories);
    this.searchCriteria.selectedSearchCriteria.indexedTotalCategory.push(allCategories);
  }

  private loadYears(yearOfLoss) {
    this.loaderService.show();
    setTimeout(() => { this.loaderService.hide(); this.isModified = false; }, 1000);
    return {
      decades:
        [
          {
            displayName: "1970s",
            isSelected: false,
            years: _.filter(yearOfLoss, (e: string) => { return parseInt(e) >= 1970 && parseInt(e) < 1980 }).map(o => { return { value: parseInt(o), isSelected: false }; })
          },
          {
            displayName: "1980s",
            isSelected: false,
            years: _.filter(yearOfLoss, (e: string) => { return parseInt(e) >= 1980 && parseInt(e) < 1990 }).map(o => { return { value: parseInt(o), isSelected: false }; })
          },
          {
            displayName: "1990s",
            isSelected: false,
            years: _.filter(yearOfLoss, (e: string) => { return parseInt(e) >= 1990 && parseInt(e) < 2000 }).map(o => { return { value: parseInt(o), isSelected: false }; })
          },
          {
            displayName: "2000s",
            isSelected: false,
            years: _.filter(yearOfLoss, (e: string) => { return parseInt(e) >= 2000 && parseInt(e) < 2010 }).map(o => { return { value: parseInt(o), isSelected: false }; })
          },
          {
            displayName: "2010s",
            isSelected: false,
            years: _.filter(yearOfLoss, (e: string) => { return parseInt(e) >= 2010 && parseInt(e) < 2020 }).map(o => { return { value: parseInt(o), isSelected: false }; })
          }
        ]
    };
  }

  private bindAllSelectedYear() {

    let selectedYears = [];

    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      _.each(decadeObj.years, (yearObj: any) => {

        yearObj.isSelected = _.find(this.searchCriteria.selectedSearchCriteria.yearOfLoss, (e: any) => { return parseInt(e.value) == parseInt(yearObj.value) }) != null;
      });
    });

    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      let isAllSelected = _.filter(decadeObj.years, (e: any) => { return e.isSelected == false }).length == 0;
      decadeObj.isSelected = isAllSelected;
    });
  }

  onMenuSelection(selectedMenu) {
    if (selectedMenu == 'yearOfLoss') {
      $('#yearOflossMob').addClass('active').removeClass('inactive');
      $('#locationMob').removeClass('active').addClass('inactive');
      $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
      $('#claimMob').removeClass('active').addClass('inactive');
      $('#wellMob').removeClass('active').addClass('inactive');
      $('#costCategoryMob').removeClass('active').addClass('inactive');

    }
    if (selectedMenu == 'location') {
      $('#yearOflossMob').removeClass('active').addClass('inactive');
      $('#locationMob').removeClass('inactive').addClass('active');
      $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
      $('#claimMob').removeClass('active').addClass('inactive');
      $('#wellMob').removeClass('active').addClass('inactive');
      $('#costCategoryMob').removeClass('active').addClass('inactive');
    }
    if (selectedMenu == 'lossDetails') {
      $('#yearOflossMob').removeClass('active').addClass('inactive');
      $('#locationMob').removeClass('active').addClass('inactive');
      $('#lossOfDetailsMob').addClass('active').removeClass('inactive');
      $('#claimMob').removeClass('active').addClass('inactive');
      $('#wellMob').removeClass('active').addClass('inactive');
      $('#costCategoryMob').removeClass('active').addClass('inactive');
    }
    if (selectedMenu == 'claims') {
      $('#yearOflossMob').removeClass('active').addClass('inactive');
      $('#locationMob').removeClass('active').addClass('inactive');
      $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
      $('#claimMob').addClass('active').removeClass('inactive');
      $('#wellMob').removeClass('active').addClass('inactive');
      $('#costCategoryMob').removeClass('active').addClass('inactive');
    }
    if (selectedMenu == 'wellDetails') {
      $('#yearOflossMob').removeClass('active').addClass('inactive');
      $('#locationMob').removeClass('active').addClass('inactive');
      $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
      $('#claimMob').removeClass('active').addClass('inactive');
      $('#wellMob').addClass('active').removeClass('inactive');
      $('#costCategoryMob').removeClass('active').addClass('inactive');
    }
    if (selectedMenu == 'costCategories') {
      $('#yearOflossMob').removeClass('active').addClass('inactive');
      $('#locationMob').removeClass('active').addClass('inactive');
      $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
      $('#claimMob').removeClass('active').addClass('inactive');
      $('#wellMob').removeClass('active').addClass('inactive');
      $('#costCategoryMob').addClass('active').removeClass('inactive');
    }
  }

  caretToggle() {
    this.isCaretToggle = !this.isCaretToggle;
  }

  onRemoveYearEvent() {
    this.isModified = !this.isModified;
  }
  loadSearchCriteriaResult() {
    this.searchModel.getSearchTemplates()
      .subscribe(
        (result) => {
          if (result) {
            let searchCriteriaResult1 = JSON.stringify(result);
            this.searchCriteriaResult = JSON.parse(searchCriteriaResult1);
          }
        }
      )
  }
  openSaveCriteriaFirstModal() {
    document.getElementById('openSaveCriteriaFirstModal').click();
  }
  openSaveCriteriaSecondModal() {
    document.getElementById('openSaveCriteriaSecondModal').click();
  }
  onSaveSearchCriteria() {
    this.saveSearchCriteria.TemplateName = this.searchTemplateName;
    this.selectedSearchName = this.saveSearchCriteria.TemplateName;
    this.loaderService.show();
    let newTemplateName = _.filter(this.searchCriteriaResult, (item: any) => {
      return item.templateName.toLowerCase() === this.selectedSearchName.toLowerCase();
    })
    if (newTemplateName.length != 0) {
      $("#saveBtn2").removeAttr("data-dismiss");
      this.notificationMessage.errorMessage = 'Search Criteria Name already exists.';
      this.selectedSearchName = '';
    }
    else {
      this.saveNewSearchCriteria();
      this.notificationMessage.errorMessage = null;
      $("#saveBtn2").attr("data-dismiss","modal");
    }
    setTimeout(() => { this.loaderService.hide(); this.isModified = false; }, 1000);

  }

  saveNewSearchCriteria() {
    this.notificationMessage.errorMessage = null;
    (<HTMLInputElement>document.getElementById('searchTemplateName')).value = '';
    this.saveSearchCriteria.TemplateName = this.searchTemplateName;
    this.selectedSearchName = this.saveSearchCriteria.TemplateName;
    let searchPayload: any = this.getSearchPayload();
    this.saveSearchCriteria.SearchCriteria = searchPayload;
    this.searchModel.saveSearchCriteria(this.saveSearchCriteria).subscribe(res => {
      if (res) {
        this.isDeleteSuccess = false;
        this.isSaveSuccess = true;
        (<HTMLInputElement>document.getElementById('searchTemplateName')).value = '';
        this.loadSearchCriteriaResult();

        //audit log - saved search criteria
        let search: any;
        search = new Object();
        search.templateName = this.selectedSearchName;
        search.SearchCriteria = this.reportService.getSearchCriteria();
        this.searchService.logSavedSearchData(search).subscribe(response => {

        })
      }
    });
  }
  getSearchPayload() {
    let searchCriteriaPayload = new SearchCriteriaPayload();
    let selectedSearchCriteria = this.searchCriteria.selectedSearchCriteria;
    if (selectedSearchCriteria.yearOfLoss && selectedSearchCriteria.yearOfLoss.length > 0)
      searchCriteriaPayload.yearOfLoss = this.filterNullValue(selectedSearchCriteria.yearOfLoss, "value");

    if (selectedSearchCriteria.area && selectedSearchCriteria.area.length > 0)
      searchCriteriaPayload.area = this.filterNullValue(selectedSearchCriteria.area, "id");

    if (selectedSearchCriteria.country && selectedSearchCriteria.country.length > 0) {

      let itemsWithoutNull = _.filter(selectedSearchCriteria.country, e => { return e.id != null });

      if (itemsWithoutNull && itemsWithoutNull.length > 0)
        searchCriteriaPayload.country = _.map(itemsWithoutNull, "id");
    }

    if (selectedSearchCriteria.location)
      searchCriteriaPayload.location = selectedSearchCriteria.location;

    if (selectedSearchCriteria.gomArea && selectedSearchCriteria.gomArea.length > 0)
      searchCriteriaPayload.gomArea = this.filterNullValue(selectedSearchCriteria.gomArea, "id");

    if (selectedSearchCriteria.usLocationCode && selectedSearchCriteria.usLocationCode.length > 0)
      searchCriteriaPayload.usLocationCode = this.filterNullValue(selectedSearchCriteria.usLocationCode, "id");

    if (selectedSearchCriteria.landOffShore && selectedSearchCriteria.landOffShore.id) {
      searchCriteriaPayload.landOffShore = [];
      searchCriteriaPayload.landOffShore.push(selectedSearchCriteria.landOffShore.id);
    }

    if (selectedSearchCriteria.category1 && selectedSearchCriteria.category1.length > 0)
      searchCriteriaPayload.category1 = this.filterNullValue(selectedSearchCriteria.category1, "id");

    if (selectedSearchCriteria.category2 && selectedSearchCriteria.category2.length > 0)
      searchCriteriaPayload.category2 = this.filterNullValue(selectedSearchCriteria.category2, "id");

    if (selectedSearchCriteria.category3 && selectedSearchCriteria.category3.length > 0)
      searchCriteriaPayload.category3 = this.filterNullValue(selectedSearchCriteria.category3, "id");

    if (selectedSearchCriteria.car_op && selectedSearchCriteria.car_op.length > 0)
      searchCriteriaPayload.car_op = this.filterNullValue(selectedSearchCriteria.car_op, "id");

    if (selectedSearchCriteria.lossType && selectedSearchCriteria.lossType.length > 0)
      searchCriteriaPayload.lossType = this.filterNullValue(selectedSearchCriteria.lossType, "id");

    if (selectedSearchCriteria.cause && selectedSearchCriteria.cause.length > 0)
      searchCriteriaPayload.cause = this.filterNullValue(selectedSearchCriteria.cause, "id");

    if (selectedSearchCriteria.upDownPower && selectedSearchCriteria.upDownPower.length > 0)
      searchCriteriaPayload.upDownPower = this.filterNullValue(selectedSearchCriteria.upDownPower, "id");

    if (selectedSearchCriteria.event && selectedSearchCriteria.event.length > 0)
      searchCriteriaPayload.event = this.filterNullValue(selectedSearchCriteria.event, "id");

    if (selectedSearchCriteria.pdClaim && (selectedSearchCriteria.pdClaim.min || selectedSearchCriteria.pdClaim.max))
      searchCriteriaPayload.pdClaim = selectedSearchCriteria.pdClaim;

    if (selectedSearchCriteria.oeeClaim && (selectedSearchCriteria.oeeClaim.min || selectedSearchCriteria.oeeClaim.max))
      searchCriteriaPayload.oeeClaim = selectedSearchCriteria.oeeClaim;

    if (selectedSearchCriteria.biClaim && (selectedSearchCriteria.biClaim.min || selectedSearchCriteria.biClaim.max))
      searchCriteriaPayload.biClaim = selectedSearchCriteria.biClaim;

    if (selectedSearchCriteria.totalClaim && (selectedSearchCriteria.totalClaim.min || selectedSearchCriteria.totalClaim.max))
      searchCriteriaPayload.totalClaim = selectedSearchCriteria.totalClaim;

    if (selectedSearchCriteria.totalIndexedClaim && (selectedSearchCriteria.totalIndexedClaim.min || selectedSearchCriteria.totalIndexedClaim.max))
      searchCriteriaPayload.totalIndexedClaim = selectedSearchCriteria.totalIndexedClaim;

    if (selectedSearchCriteria.ratingAreas && selectedSearchCriteria.ratingAreas.length > 0)
      searchCriteriaPayload.ratingArea = this.filterNullValue(selectedSearchCriteria.ratingAreas, "id");

    if (selectedSearchCriteria.wellTypes && selectedSearchCriteria.wellTypes.length > 0)
      searchCriteriaPayload.wellType = this.filterNullValue(selectedSearchCriteria.wellTypes, "id");

    if (selectedSearchCriteria.drillingStatues && selectedSearchCriteria.drillingStatues.length > 0)
      searchCriteriaPayload.drillingStatus = this.filterNullValue(selectedSearchCriteria.drillingStatues, "id");

    if (selectedSearchCriteria.ugbo && selectedSearchCriteria.ugbo.length > 0)
      searchCriteriaPayload.ugbo = this.filterNullValue(selectedSearchCriteria.ugbo, "id");

    if (selectedSearchCriteria.depthCategories && selectedSearchCriteria.depthCategories.length > 0) {

      let itemsWithoutNull = _.filter(selectedSearchCriteria.depthCategories, e => { return e.id != null });

      if (itemsWithoutNull && itemsWithoutNull.length > 0)
        searchCriteriaPayload.depthCategory = _.map(itemsWithoutNull, "id");
    }

    if (selectedSearchCriteria.ptd && (selectedSearchCriteria.ptd.min || selectedSearchCriteria.ptd.max))
      searchCriteriaPayload.ptd = selectedSearchCriteria.ptd;

    if (selectedSearchCriteria.actualPDLiabCategory && selectedSearchCriteria.actualPDLiabCategory.length > 0)
      searchCriteriaPayload.actualPDLiabCategory = this.getMinAndMaxValues(selectedSearchCriteria.actualPDLiabCategory);

    if (selectedSearchCriteria.actualOEECategory && selectedSearchCriteria.actualOEECategory.length > 0)
      searchCriteriaPayload.actualOEECategory = this.getMinAndMaxValues(selectedSearchCriteria.actualOEECategory);

    if (selectedSearchCriteria.actualTotalCategory && selectedSearchCriteria.actualTotalCategory.length > 0)
      searchCriteriaPayload.actualTotalCategory = this.getMinAndMaxValues(selectedSearchCriteria.actualTotalCategory);

    if (selectedSearchCriteria.indexedPDLiabCategory && selectedSearchCriteria.indexedPDLiabCategory.length > 0)
      searchCriteriaPayload.indexedPDLiabCategory = this.getMinAndMaxValues(selectedSearchCriteria.indexedPDLiabCategory);

    if (selectedSearchCriteria.indexedOEECategory && selectedSearchCriteria.indexedOEECategory.length > 0)
      searchCriteriaPayload.indexedOEECategory = this.getMinAndMaxValues(selectedSearchCriteria.indexedOEECategory);

    if (selectedSearchCriteria.indexedTotalCategory && selectedSearchCriteria.indexedTotalCategory.length > 0)
      searchCriteriaPayload.indexedTotalCategory = this.getMinAndMaxValues(selectedSearchCriteria.indexedTotalCategory);

    return searchCriteriaPayload;

  }
  private filterNullValue(items: SearchField[], fieldName: string) {

    let itemsWithoutNull = _.filter(items, e => { return e[fieldName] != null });

    if (itemsWithoutNull && itemsWithoutNull.length > 0) {
      return _.map(itemsWithoutNull, fieldName);
    }

    return null;
  }
  private getMinAndMaxValues(items: LossAmountRange[]) {

    let tempItems = _.filter(items, e => e.id != null);

    if (tempItems.length == 0)
      return null;

    let lossAmountRange = [];
    _.each(tempItems, (item) => {
      let range = new Range();
      range.min = item.minValue;
      range.max = item.maxValue;
      lossAmountRange.push(range);
    });

    return lossAmountRange;
  }
  loadSearchPageTabs(searchTemplate) {
    this.setSaveFlag = true;
    this.isCriteriaSaveDisabled();
    this.selectedSearchName = searchTemplate.templateName;
    this.searchModel.setSearchCriteria(searchTemplate);
    this.loadUpdatedSearchCriteria(searchTemplate);
    this.localStorage.set('sc', this.searchCriteria.selectedSearchCriteria)
  }
  deleteSearchCriteria() {
    this.localStorage.setModifiedflag(false);
    this.setSaveFlag = true;
    this.isCriteriaSaveDisabled();
    this.searchTabMob = 'yearOfLoss';
    this.selectedCriteria = this.searchModel.getSearchCriteria();
    this.localStorage.remove("searchCriteria");
    this.localStorage.remove("OEELossReportItems");
    this.inMemoryStorage.setItem("OverallLossReportItems", null);
    this.searchCriteria.selectedSearchCriteria = new SelectedSearchCriteria();

    this.setDefaultOptions();

    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      decadeObj.isSelected = false;
      _.each(decadeObj.years, (yearObj: any) => {
        if (!yearObj.ignore)
          yearObj.isSelected = false;
      });
    });

    if (this.selectedCriteria != undefined) {
      if (this.selectedCriteria.templateName == this.selectedSearchName) {
        setTimeout(() => { this.loaderService.hide(); this.isModified = false; }, 1000);
        this.deletedCriteriaName = this.selectedCriteria.templateName;
        this.searchModel.deleteSearchCriteria(this.selectedCriteria.id).subscribe(res => {
          this.selectedCriteria = new SearchSaveCriteria();
          this.selectedSearchName = '';

          this.loadSearchCriteriaResult();
          this.isDeleteSuccess = true;
          this.isSaveSuccess = false;
        });
      }
    }
    else {
      let selectedCriteriaToDelete = _.filter(this.searchCriteriaResult, (item: any) => {
        return item.templateName === this.saveSearchCriteria.TemplateName;
      })
      setTimeout(() => { this.loaderService.hide(); this.isModified = false; }, 1000);
      this.deletedCriteriaName = this.saveSearchCriteria.TemplateName;
      this.searchModel.deleteSearchCriteria(selectedCriteriaToDelete[0].id).subscribe(res => {
        this.selectedCriteria = new SearchSaveCriteria();
        this.selectedSearchName = '';

        this.loadSearchCriteriaResult();
        this.isDeleteSuccess = true;
        this.isSaveSuccess = false;
      });

    }
  }

  loadUpdatedSearchCriteria(searchTemplate) {
    this.setSaveFlag = true;
    this.isCriteriaSaveDisabled();
    this.loaderService.show();
    this.isDeleteSuccess = false;
    this.isSaveSuccess = false;
    let savedSearchPayload = JSON.parse(searchTemplate.searchCriteria);
    this.searchCriteria.selectedSearchCriteria = new SelectedSearchCriteria();
    if (savedSearchPayload.YearOfLoss != null) {
      this.searchCriteria.selectedSearchCriteria.yearOfLoss = _.map(savedSearchPayload.YearOfLoss, e => { return { value: e, isSelected: true } });
      //$("#yearOfLoss").load(location.href + " #yearOfLoss"); 
      this.bindAllSelectedYear();
    }
    else {
      _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
        let isAllSelected = _.filter(decadeObj.years, (e: any) => { return e.isSelected == false }).length == 0;
        decadeObj.isSelected = isAllSelected;
      });
    }
    if (savedSearchPayload.Area != null) {
      var selectedAreas = _.filter(this.searchCriteria.masterSearchData.area, (item: any) => {
        return savedSearchPayload.Area.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.area = _.map(selectedAreas, e => {
        return { id: e.id, displayName: e.displayName }
      });
    }
    else {
      this.searchCriteria.selectedSearchCriteria.area.push(new SearchField(null, "All Areas"));
    }
    if (savedSearchPayload.Country != null) {
      var selectedCountries = _.filter(this.searchCriteria.masterSearchData.country, (item: any) => {
        return savedSearchPayload.Country.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.country = _.map(selectedCountries, e => {
        return {
          id: e.id,
          alpha2Code: e.alpha2Code,
          alpha3Code: e.alpha3Code,
          numericCode: e.numericCode,
          displayName: e.displayName,
          lastUpdateTime: e.lastUpdateTime
        }
      });
    } else {
      this.searchCriteria.selectedSearchCriteria.country.push(new Country(null, "All Countries"));
    }
    if (savedSearchPayload.GOMArea != null) {
      var selectedGOMAreas = _.filter(this.searchCriteria.masterSearchData.gomArea, (item: any) => {
        return savedSearchPayload.GOMArea.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.gomArea = _.map(selectedGOMAreas, e => {
        return {
          id: e.id,
          displayName: e.displayName
        }
      })
    } else {
      this.searchCriteria.selectedSearchCriteria.gomArea.push(new SearchField(null, "All GOM Areas"));
    }
    if (savedSearchPayload.LandOffshore != null) {
      var selectedLandOffshore = _.filter(this.searchCriteria.masterSearchData.landOffShore, (item: any) => {
        return savedSearchPayload.LandOffshore.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.landOffShore = selectedLandOffshore[0];

    } else {
      this.searchCriteria.selectedSearchCriteria.landOffShore = new SearchField(null, "Either");
    }
    if (savedSearchPayload.Location) {
      this.searchCriteria.selectedSearchCriteria.location = savedSearchPayload.Location;
    }
    if (savedSearchPayload.USLocationCode != null) {
      var selectedUSLocationCode = _.filter(this.searchCriteria.masterSearchData.usLocationCode, (item: any) => {
        return savedSearchPayload.USLocationCode.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.usLocationCode = _.map(selectedUSLocationCode, e => {
        return { id: e.id, displayName: e.displayName }
      })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.usLocationCode.push(new SearchField(null, "All US Location Codes"));
    }
    if (savedSearchPayload.CAR_OP != null) {
      var selectedCAR_OP = _.filter(this.searchCriteria.masterSearchData.car_op, (item: any) => {
        return savedSearchPayload.CAR_OP.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.car_op = _.map(selectedCAR_OP, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.car_op.push(new SearchField(null, "Either"));
    }
    if (savedSearchPayload.Category1 != null) {
      var selectedCategory1 = _.filter(this.searchCriteria.masterSearchData.category1, (item: any) => {
        return savedSearchPayload.Category1.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.category1 = _.map(selectedCategory1, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.category1.push(new SearchField(null, "All Categories"));
    }
    if (savedSearchPayload.Category2 != null) {
      var selectedCategory2 = _.filter(this.searchCriteria.masterSearchData.category2, (item: any) => {
        return savedSearchPayload.Category2.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.category2 = _.map(selectedCategory2, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.category2.push(new SearchField(null, "All Categories"));
    }
    if (savedSearchPayload.Category3 != null) {
      var selectedCategory3 = _.filter(this.searchCriteria.masterSearchData.category3, (item: any) => {
        return savedSearchPayload.Category3.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.category3 = _.map(selectedCategory3, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.category3.push(new SearchField(null, "All Categories"));
    }

    if (savedSearchPayload.LossType != null) {
      var selectedLossType = _.filter(this.searchCriteria.masterSearchData.lossType, (item: any) => {
        return savedSearchPayload.LossType.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.lossType = _.map(selectedLossType, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.lossType.push(new SearchField(null, "All Types"));
    }

    if (savedSearchPayload.Cause != null) {
      var selectedCause = _.filter(this.searchCriteria.masterSearchData.cause, (item: any) => {
        return savedSearchPayload.Cause.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.cause = _.map(selectedCause, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.cause.push(new SearchField(null, "All Causes"));
    }

    if (savedSearchPayload.Event != null) {
      var selectedEvent = _.filter(this.searchCriteria.masterSearchData.event, (item: any) => {
        return savedSearchPayload.Event.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.event = _.map(selectedEvent, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.event.push(new SearchField(null, "All Events"));
    }
    if (savedSearchPayload.UpDownPower != null) {
      var selectedUpDownPower = _.filter(this.searchCriteria.masterSearchData.upDownPower, (item: any) => {
        return savedSearchPayload.UpDownPower.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.upDownPower = _.map(selectedUpDownPower, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {

      this.searchCriteria.selectedSearchCriteria.upDownPower.push(new SearchField(null, "All Up/Down/Power"));
    }

    if (savedSearchPayload.DrillingStatus != null) {
      var selectedDrillingStatus = _.filter(this.searchCriteria.masterSearchData.drillingStatues, (item: any) => {
        return savedSearchPayload.DrillingStatus.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.drillingStatues = _.map(selectedDrillingStatus, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.drillingStatues.push(new SearchField(null, "All Status"));
    }
    if (savedSearchPayload.RatingArea != null) {
      var selectedRatingArea = _.filter(this.searchCriteria.masterSearchData.ratingAreas, (item: any) => {
        return savedSearchPayload.RatingArea.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.ratingAreas = _.map(selectedRatingArea, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.ratingAreas.push(new SearchField(null, "All Areas"));
    }
    if (savedSearchPayload.UGBO != null) {
      var selectedUGBO = _.filter(this.searchCriteria.masterSearchData.ugbo, (item: any) => {
        return savedSearchPayload.UGBO.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.ugbo = _.map(selectedUGBO, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.ugbo.push(new SearchField(null, "Either"));
    }
    if (savedSearchPayload.WellType != null) {
      var selectedWellType = _.filter(this.searchCriteria.masterSearchData.wellTypes, (item: any) => {
        return savedSearchPayload.WellType.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.wellTypes = _.map(selectedWellType, e => { return { id: e.id, displayName: e.displayName } })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.wellTypes.push(new SearchField(null, "All Types"));
    }
    if (savedSearchPayload.DepthCategory != null) {
      var selectedDepthCategory = _.filter(this.searchCriteria.masterSearchData.depthCategories, (item: any) => {
        return savedSearchPayload.DepthCategory.indexOf(item.id) > -1;
      })
      this.searchCriteria.selectedSearchCriteria.depthCategories = _.map(selectedDepthCategory, e => {
        return {
          id: e.id,
          displayName: e.displayName,
          depthCategoryDescription: e.depthCategoryDescription
        }
      })
    }
    else {
      this.searchCriteria.selectedSearchCriteria.depthCategories.push(new DepthCategory(null, "All Categories"));
    }
    if (savedSearchPayload.PTD != null) {
      this.searchCriteria.selectedSearchCriteria.ptd.min = savedSearchPayload.PTD.Min;
    }
    if (savedSearchPayload.PTD != null) {
      this.searchCriteria.selectedSearchCriteria.ptd.max = savedSearchPayload.PTD.Max;
    }
    if (savedSearchPayload.PDClaim != null) {
      this.searchCriteria.selectedSearchCriteria.pdClaim.min = savedSearchPayload.PDClaim.Min;
    }
    if (savedSearchPayload.PDClaim != null) {
      this.searchCriteria.selectedSearchCriteria.pdClaim.max = savedSearchPayload.PDClaim.Max;
    }
    if (savedSearchPayload.OEEClaim != null) {
      this.searchCriteria.selectedSearchCriteria.oeeClaim.min = savedSearchPayload.OEEClaim.Min;
    }
    if (savedSearchPayload.OEEClaim != null) {
      this.searchCriteria.selectedSearchCriteria.oeeClaim.max = savedSearchPayload.OEEClaim.Max;
    }
    if (savedSearchPayload.BIClaim != null) {
      this.searchCriteria.selectedSearchCriteria.biClaim.min = savedSearchPayload.BIClaim.Min;
    }
    if (savedSearchPayload.BIClaim != null) {
      this.searchCriteria.selectedSearchCriteria.biClaim.max = savedSearchPayload.BIClaim.Max;
    }
    if (savedSearchPayload.TotalClaim != null) {
      this.searchCriteria.selectedSearchCriteria.totalClaim.min = savedSearchPayload.TotalClaim.Min;
    }
    if (savedSearchPayload.TotalClaim != null) {
      this.searchCriteria.selectedSearchCriteria.totalClaim.max = savedSearchPayload.TotalClaim.Max;
    }
    if (savedSearchPayload.TotalIndexedClaim != null) {
      this.searchCriteria.selectedSearchCriteria.totalIndexedClaim.min = savedSearchPayload.TotalIndexedClaim.Min;
    }
    if (savedSearchPayload.TotalIndexedClaim != null) {
      this.searchCriteria.selectedSearchCriteria.totalIndexedClaim.max = savedSearchPayload.TotalIndexedClaim.Max;
    }

    const allCategories = new LossAmountRange(null, "All Categories");
    if (savedSearchPayload.ActualPDLiabCategory != null || savedSearchPayload.ActualPDLiabCategory != undefined) {
      var selectedActualPDLiabCategory = _.filter(this.searchCriteria.masterSearchData.lossAmountRanges, (item: any) => {
        return item.minValue == savedSearchPayload.ActualPDLiabCategory[0].Min && item.maxValue == savedSearchPayload.ActualPDLiabCategory[0].Max;
      })
      this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory = _.map(selectedActualPDLiabCategory, (e) => {
        return {
          id: e.id,
          displayName: e.displayName,
          minValue: e.minValue,
          maxValue: e.maxValue
        };
      });
    }
    else {
      this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory.push(allCategories);
    }
    if (savedSearchPayload.ActualOEECategory != null || savedSearchPayload.ActualOEECategory != undefined) {
      var selectedActualOEECategory = _.filter(this.searchCriteria.masterSearchData.lossAmountRanges, (item: any) => {
        return item.minValue == savedSearchPayload.ActualOEECategory[0].Min && item.maxValue == savedSearchPayload.ActualOEECategory[0].Max;
      })
      this.searchCriteria.selectedSearchCriteria.actualOEECategory = _.map(selectedActualOEECategory, (e) => {
        return {
          id: e.id,
          displayName: e.displayName,
          minValue: e.minValue,
          maxValue: e.maxValue
        };
      });
    }
    else {
      this.searchCriteria.selectedSearchCriteria.actualOEECategory.push(allCategories);
    }
    if (savedSearchPayload.ActualTotalCategory != null || savedSearchPayload.ActualTotalCategory != undefined) {
      var selectedActualTotalCategory = _.filter(this.searchCriteria.masterSearchData.lossAmountRanges, (item: any) => {
        return item.minValue == savedSearchPayload.ActualTotalCategory[0].Min && item.maxValue == savedSearchPayload.ActualTotalCategory[0].Max;
      })
      this.searchCriteria.selectedSearchCriteria.actualTotalCategory = _.map(selectedActualTotalCategory, (e) => {
        return {
          id: e.id,
          displayName: e.displayName,
          minValue: e.minValue,
          maxValue: e.maxValue
        };
      });
    }
    else {
      this.searchCriteria.selectedSearchCriteria.actualTotalCategory.push(allCategories);
    }
    if (savedSearchPayload.IndexedPDLiabCategory != null || savedSearchPayload.IndexedPDLiabCategory != undefined) {
      var selectedIndexedPDLiabCategory = _.filter(this.searchCriteria.masterSearchData.lossAmountRanges, (item: any) => {
        return item.minValue == savedSearchPayload.IndexedPDLiabCategory[0].Min && item.maxValue == savedSearchPayload.IndexedPDLiabCategory[0].Max;
      })
      this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory = _.map(selectedIndexedPDLiabCategory, (e) => {
        return {
          id: e.id,
          displayName: e.displayName,
          minValue: e.minValue,
          maxValue: e.maxValue
        };
      });
    }
    else {
      this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory.push(allCategories);
    }
    if (savedSearchPayload.IndexedOEECategory != null || savedSearchPayload.IndexedOEECategory != undefined) {
      var selectedIndexedOEECategory = _.filter(this.searchCriteria.masterSearchData.lossAmountRanges, (item: any) => {
        return item.minValue == savedSearchPayload.IndexedOEECategory[0].Min && item.maxValue == savedSearchPayload.IndexedOEECategory[0].Max;
      })
      this.searchCriteria.selectedSearchCriteria.indexedOEECategory = _.map(selectedIndexedOEECategory, (e) => {
        return {
          id: e.id,
          displayName: e.displayName,
          minValue: e.minValue,
          maxValue: e.maxValue
        };
      });
    }
    else {
      this.searchCriteria.selectedSearchCriteria.indexedOEECategory.push(allCategories);
    }
    if (savedSearchPayload.IndexedTotalCategory != null || savedSearchPayload.IndexedTotalCategory != undefined) {
      var selectedIndexedTotalCategory = _.filter(this.searchCriteria.masterSearchData.lossAmountRanges, (item: any) => {
        return item.minValue == savedSearchPayload.IndexedTotalCategory[0].Min && item.maxValue == savedSearchPayload.IndexedTotalCategory[0].Max;
      })
      this.searchCriteria.selectedSearchCriteria.indexedTotalCategory = _.map(selectedIndexedTotalCategory, (e) => {
        return {
          id: e.id,
          displayName: e.displayName,
          minValue: e.minValue,
          maxValue: e.maxValue
        };
      });
    }
    else {
      this.searchCriteria.selectedSearchCriteria.indexedTotalCategory.push(allCategories);
    }

    setTimeout(() => { this.loaderService.hide(); this.isModified = true; }, 1000);
  }
  isSaveDisabled() {
    return !(this.searchTemplateName != undefined && this.searchTemplateName != null && this.searchTemplateName.trim().length > 0);
  }
  isDeleteDisabled() {
    return !(this.selectedSearchName != undefined && this.selectedSearchName != null && this.selectedSearchName.trim().length > 0);
  }
  // isCriteriaSaveDisabled() {
  //   if (this.setSaveFlag && this.selectedSearchName == undefined) {
  //     return true;
  //   else {
  //     return false;
  //   }
  // }

  isCriteriaSaveDisabled(): boolean {
    let c: string = JSON.stringify(this.localStorage.get('sc'));
    let d: string = JSON.stringify(this.searchCriteria.selectedSearchCriteria);
    let all = JSON.stringify(this.localStorage.get('all'));

    if (c == 'null' && d != all) {
      return false;
    }

    if (c == 'null' || c == d) {

      return true;
    }

    //  else{
    //   return false;
    //  }

  }


  deleteConfirmation() {
    document.getElementById('openDeleteModal').click();
  }

}

