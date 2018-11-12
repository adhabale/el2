import { Component, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { SearchCriteria, Range } from '../entities/search-criteria';
import * as _ from 'lodash';
import { SearchField } from '../entities/search-field';
import { LossAmountRange } from '../entities/lossAmountRange';
import { DepthCategory } from '../entities/depthCategory';
import { Country } from '../entities/country';

@Component({
  selector: 'search-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})

export class SummaryComponent implements OnDestroy {

  @Input() searchCriteria: SearchCriteria;

  @Output() onRemoveYearEvent = new EventEmitter();

  ngOnDestroy() {
    this.onRemoveYearEvent.unsubscribe();
  }

  removeAllSelectedYear() {

    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      decadeObj.isSelected = false;
      _.each(decadeObj.years, (yearObj: any) => {
        yearObj.isSelected = false;
      });
    });

    this.searchCriteria.selectedSearchCriteria.yearOfLoss = [];
    this.onRemoveYearEvent.emit();
  }

  removeSelectedYear(year) {
    year.isSelected = !year.isSelected;
    this.bindAllSelectedYear();
    this.onRemoveYearEvent.emit();
  }

  private bindAllSelectedYear() {

    this.searchCriteria.selectedSearchCriteria.yearOfLoss = _.filter(this.searchCriteria.selectedSearchCriteria.yearOfLoss, (yearObj: any) => { return yearObj.isSelected });

    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      _.each(decadeObj.years, (yearObj: any) => {
        if (_.includes(this.searchCriteria.selectedSearchCriteria.yearOfLoss, yearObj)) {
          yearObj.isSelected = true;
        }
      });
      decadeObj.isSelected = _.filter(decadeObj.years, (e: any) => !e.isSelected).length === 0;
    });
  }

  removeAllSelectedArea() {
    this.searchCriteria.selectedSearchCriteria.area = [];
    this.searchCriteria.selectedSearchCriteria.area.push(_.find(this.searchCriteria.masterSearchData.area, (e) => e.id == null));
  }

  removeAllSelectedCountry() {
    this.searchCriteria.selectedSearchCriteria.country = [];
    this.searchCriteria.selectedSearchCriteria.country.push(_.find(this.searchCriteria.masterSearchData.country, (e) => e.id == null));
  }

  removeSelectedLocation() {
    this.searchCriteria.selectedSearchCriteria.location = null;
  }

  removeAllSelectedGOMArea() {
    this.searchCriteria.selectedSearchCriteria.gomArea = [];
    this.searchCriteria.selectedSearchCriteria.gomArea.push(_.find(this.searchCriteria.masterSearchData.gomArea, (e) => e.id == null));
  }

  removeAllSelectedUSLocationCode() {
    this.searchCriteria.selectedSearchCriteria.usLocationCode = [];
    this.searchCriteria.selectedSearchCriteria.usLocationCode.push(
      _.find(this.searchCriteria.masterSearchData.usLocationCode, (e) => e.id == null)
    );
  }

  removeSelectedLandOffShore() {
    this.searchCriteria.selectedSearchCriteria.landOffShore = new SearchField(null, "Either");
  }

  removeSelectedUSLocationCode(usLocationCode) {
    _.remove(this.searchCriteria.selectedSearchCriteria.usLocationCode, usLocationCode);
    if (this.searchCriteria.selectedSearchCriteria.usLocationCode && this.searchCriteria.selectedSearchCriteria.usLocationCode.length === 0) {
      this.removeAllSelectedUSLocationCode();
    }
  }

  removeSelectedGOMArea(gomArea) {
    _.remove(this.searchCriteria.selectedSearchCriteria.gomArea, gomArea);
    if (this.searchCriteria.selectedSearchCriteria.gomArea && this.searchCriteria.selectedSearchCriteria.gomArea.length === 0) {
      this.removeAllSelectedGOMArea();
    }
  }

  removeSelectedCountry(country) {
    _.remove(this.searchCriteria.selectedSearchCriteria.country, country);
    if (this.searchCriteria.selectedSearchCriteria.country && this.searchCriteria.selectedSearchCriteria.country.length === 0) {
      this.removeAllSelectedCountry();
    }
  }

  removeSelectedArea(area) {
    _.remove(this.searchCriteria.selectedSearchCriteria.area, area);
    if (this.searchCriteria.selectedSearchCriteria.area && this.searchCriteria.selectedSearchCriteria.area.length === 0) {
      this.removeAllSelectedArea();
    }
  }

  removeAllLocationCriteria() {
    this.removeAllSelectedArea();
    this.removeAllSelectedCountry();
    this.searchCriteria.selectedSearchCriteria.location = null;
    this.removeAllSelectedGOMArea();
    this.removeAllSelectedUSLocationCode();
    this.removeSelectedLandOffShore();
  }

  removeSelectedEvent(event) {
    _.remove(this.searchCriteria.selectedSearchCriteria.event, event);
    if (this.searchCriteria.selectedSearchCriteria.event && this.searchCriteria.selectedSearchCriteria.event.length === 0) {
      this.removeAllEvent();
    }
  }

  removeAllEvent() {
    this.searchCriteria.selectedSearchCriteria.event = [];
    this.searchCriteria.selectedSearchCriteria.event.push(_.find(this.searchCriteria.masterSearchData.event, (e) => e.id == null));
  }

  removeSelectedUDP(upDownPower) {
    _.remove(this.searchCriteria.selectedSearchCriteria.upDownPower, upDownPower);
    if (this.searchCriteria.selectedSearchCriteria.upDownPower && this.searchCriteria.selectedSearchCriteria.upDownPower.length === 0) {
      this.removeAllUDP();
    }
  }

  removeAllUDP() {
    this.searchCriteria.selectedSearchCriteria.upDownPower = [];
    this.searchCriteria.selectedSearchCriteria.upDownPower.push(_.find(this.searchCriteria.masterSearchData.upDownPower, (e) => e.id == null));
  }

  removeSelectedCause(cause) {
    _.remove(this.searchCriteria.selectedSearchCriteria.cause, cause);
    if (this.searchCriteria.selectedSearchCriteria.cause && this.searchCriteria.selectedSearchCriteria.cause.length === 0) {
      this.removeAllCause();
    }
  }

  removeAllCause() {
    this.searchCriteria.selectedSearchCriteria.cause = [];
    this.searchCriteria.selectedSearchCriteria.cause.push(_.find(this.searchCriteria.masterSearchData.cause, (e) => e.id == null));
  }

  removeSelectedLossType(lossType) {
    _.remove(this.searchCriteria.selectedSearchCriteria.lossType, lossType);
  }

  removeAllLossType() {
    this.searchCriteria.selectedSearchCriteria.lossType = [];
    this.searchCriteria.selectedSearchCriteria.lossType.push(_.find(this.searchCriteria.masterSearchData.lossType, (e) => e.id == null));
  }

  removeSelectedCar_OP(car_op) {
    _.remove(this.searchCriteria.selectedSearchCriteria.car_op, car_op);
    if (this.searchCriteria.selectedSearchCriteria.car_op && this.searchCriteria.selectedSearchCriteria.car_op.length === 0) {
      this.removeAllCar_OP();
    }
  }

  removeAllCar_OP() {
    this.searchCriteria.selectedSearchCriteria.car_op = [];
    this.searchCriteria.selectedSearchCriteria.car_op.push(_.find(this.searchCriteria.masterSearchData.car_op, (e) => e.id == null));
  }

  removeSelectedCategory3(category3) {
    _.remove(this.searchCriteria.selectedSearchCriteria.category3, category3);
    if (this.searchCriteria.selectedSearchCriteria.category3 && this.searchCriteria.selectedSearchCriteria.category3.length === 0) {
      this.removeAllCategory3();
    }
  }

  removeAllCategory3() {
    this.searchCriteria.selectedSearchCriteria.category3 = [];
    this.searchCriteria.selectedSearchCriteria.category3.push(_.find(this.searchCriteria.masterSearchData.category3, (e) => e.id == null));
  }

  removeSelectedCategory2(category2) {
    _.remove(this.searchCriteria.selectedSearchCriteria.category2, category2);
    if (this.searchCriteria.selectedSearchCriteria.category2 && this.searchCriteria.selectedSearchCriteria.category2.length === 0) {
      this.removeAllCategory2();
    }
  }

  removeAllCategory2() {
    this.searchCriteria.selectedSearchCriteria.category2 = [];
    this.searchCriteria.selectedSearchCriteria.category2.push(_.find(this.searchCriteria.masterSearchData.category2, (e) => e.id == null));
  }

  removeSelectedCategory1(category1) {
    _.remove(this.searchCriteria.selectedSearchCriteria.category1, category1);
    if (this.searchCriteria.selectedSearchCriteria.category1 && this.searchCriteria.selectedSearchCriteria.category1.length === 0) {
      this.removeAllCategory1();
    }
  }

  removeAllCategory1() {
    this.searchCriteria.selectedSearchCriteria.category1 = [];
    this.searchCriteria.selectedSearchCriteria.category1.push(_.find(this.searchCriteria.masterSearchData.category1, (e) => e.id == null));
  }

  removeAllLossDetailsCriteria() {

    this.removeAllCategory1();
    this.removeAllCategory2();
    this.removeAllCategory3();
    this.removeAllCar_OP();
    this.removeAllLossType();
    this.removeAllUDP();
    this.removeAllCause();
    this.removeAllEvent();

  }

  removeTotalIndexedClaim() {
    this.searchCriteria.selectedSearchCriteria.totalIndexedClaim = new Range();
  }

  removeTotalClaim() {
    this.searchCriteria.selectedSearchCriteria.totalClaim = new Range();
  }

  removeBIClaim() {
    this.searchCriteria.selectedSearchCriteria.biClaim = new Range();
  }

  removeOEEClaim() {
    this.searchCriteria.selectedSearchCriteria.oeeClaim = new Range();
  }

  removePDClaim() {
    this.searchCriteria.selectedSearchCriteria.pdClaim = new Range();
  }

  removeAllClaimCriteria() {
    this.removeTotalIndexedClaim();
    this.removeTotalClaim();
    this.removeBIClaim();
    this.removeOEEClaim();
    this.removePDClaim();
  }

  removeAllRatingArea() {
    this.searchCriteria.selectedSearchCriteria.ratingAreas = [];
    this.searchCriteria.selectedSearchCriteria.ratingAreas.push(_.find(this.searchCriteria.masterSearchData.ratingAreas, (e) => e.id == null));
  }

  removeSelectedRatingArea(ratingArea) {
    _.remove(this.searchCriteria.selectedSearchCriteria.ratingAreas, ratingArea);
    if (this.searchCriteria.selectedSearchCriteria.ratingAreas && this.searchCriteria.selectedSearchCriteria.ratingAreas.length === 0) {
      this.removeAllRatingArea();
    }
  }

  removeAllWellTypes() {
    this.searchCriteria.selectedSearchCriteria.wellTypes = [];
    this.searchCriteria.selectedSearchCriteria.wellTypes.push(_.find(this.searchCriteria.masterSearchData.wellTypes, (e) => e.id == null));
  }

  removeSelectedWellType(wellType) {
    _.remove(this.searchCriteria.selectedSearchCriteria.wellTypes, wellType);
    if (this.searchCriteria.selectedSearchCriteria.wellTypes && this.searchCriteria.selectedSearchCriteria.wellTypes.length === 0) {
      this.removeAllWellTypes();
    }
  }

  removeAllDrillingStatus() {
    this.searchCriteria.selectedSearchCriteria.drillingStatues = [];
    this.searchCriteria.selectedSearchCriteria.drillingStatues.push(_.find(this.searchCriteria.masterSearchData.drillingStatues, (e) => e.id == null));
  }

  removeSelectedDrillingStatus(drillingStatus) {
    _.remove(this.searchCriteria.selectedSearchCriteria.drillingStatues, drillingStatus);
    if (this.searchCriteria.selectedSearchCriteria.drillingStatues && this.searchCriteria.selectedSearchCriteria.drillingStatues.length === 0) {
      this.removeAllDrillingStatus();
    }
  }

  removeAllUGBO() {
    this.searchCriteria.selectedSearchCriteria.ugbo = [];
    this.searchCriteria.selectedSearchCriteria.ugbo.push(_.find(this.searchCriteria.masterSearchData.ugbo, (e) => e.id == null));
  }

  removeSelectedUGBO(ugbo) {
    _.remove(this.searchCriteria.selectedSearchCriteria.ugbo, ugbo);
    if (this.searchCriteria.selectedSearchCriteria.ugbo && this.searchCriteria.selectedSearchCriteria.ugbo.length === 0) {
      this.removeAllUGBO();
    }
  }

  removeAllDepthCategory() {
    this.searchCriteria.selectedSearchCriteria.depthCategories = [];
    this.searchCriteria.selectedSearchCriteria.depthCategories.push(_.find(this.searchCriteria.masterSearchData.depthCategories, (e) => e.id == null));
  }

  removeSelectedDepthCategory(depthCategory) {
    _.remove(this.searchCriteria.selectedSearchCriteria.depthCategories, depthCategory);
    if (this.searchCriteria.selectedSearchCriteria.depthCategories && this.searchCriteria.selectedSearchCriteria.depthCategories.length === 0) {
      this.removeAllDepthCategory();
    }
  }

  removeSelectedPTD() {
    this.searchCriteria.selectedSearchCriteria.ptd = new Range();
  }

  removeAllWellDetailsCriteria() {

    this.removeAllRatingArea();
    this.removeAllDrillingStatus();
    this.removeAllWellTypes();
    this.removeAllUGBO();
    this.removeAllDepthCategory();
    this.removeSelectedPTD();

  }

  removeAllActualPDClaim() {
    this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory = [];
    this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory.push(_.find(this.searchCriteria.masterSearchData.lossAmountRanges, (e) => e.id == null));
  }

  removeSelectedActualPDClaim(actualPDLiabCategory) {
    _.remove(this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory, actualPDLiabCategory);
    if (this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory && this.searchCriteria.selectedSearchCriteria.actualPDLiabCategory.length === 0) {
      this.removeAllActualPDClaim();
    }
  }

  removeAllIndexedPDClaim() {
    this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory = [];
    this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory.push(_.find(this.searchCriteria.masterSearchData.lossAmountRanges, (e) => e.id == null));
  }

  removeSelectedIndexedPDClaim(indexedPDLiabCategory) {
    _.remove(this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory, indexedPDLiabCategory);
    if (this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory && this.searchCriteria.selectedSearchCriteria.indexedPDLiabCategory.length === 0) {
      this.removeAllIndexedPDClaim();
    }
  }

  removeAllActualOEEClaim() {
    this.searchCriteria.selectedSearchCriteria.actualOEECategory = [];
    this.searchCriteria.selectedSearchCriteria.actualOEECategory.push(_.find(this.searchCriteria.masterSearchData.lossAmountRanges, (e) => e.id == null));
  }

  removeSelectedActualOEEClaim(actualOEECategory) {
    _.remove(this.searchCriteria.selectedSearchCriteria.actualOEECategory, actualOEECategory);
    if (this.searchCriteria.selectedSearchCriteria.actualOEECategory && this.searchCriteria.selectedSearchCriteria.actualOEECategory.length === 0) {
      this.removeAllActualOEEClaim();
    }
  }

  removeAllIndexedOEEClaim() {
    this.searchCriteria.selectedSearchCriteria.indexedOEECategory = [];
    this.searchCriteria.selectedSearchCriteria.indexedOEECategory.push(_.find(this.searchCriteria.masterSearchData.lossAmountRanges, (e) => e.id == null));
  }

  removeSelectedIndexedOEEClaim(indexedOEECategory) {
    _.remove(this.searchCriteria.selectedSearchCriteria.indexedOEECategory, indexedOEECategory);
    if (this.searchCriteria.selectedSearchCriteria.indexedOEECategory && this.searchCriteria.selectedSearchCriteria.indexedOEECategory.length === 0) {
      this.removeAllIndexedOEEClaim();
    }
  }

  removeAllActualTotalClaim() {
    this.searchCriteria.selectedSearchCriteria.actualTotalCategory = [];
    this.searchCriteria.selectedSearchCriteria.actualTotalCategory.push(_.find(this.searchCriteria.masterSearchData.lossAmountRanges, (e) => e.id == null));
  }

  removeSelectedActualTotalClaim(actualTotalCategory) {
    _.remove(this.searchCriteria.selectedSearchCriteria.actualTotalCategory, actualTotalCategory);
    if (this.searchCriteria.selectedSearchCriteria.actualTotalCategory && this.searchCriteria.selectedSearchCriteria.actualTotalCategory.length === 0) {
      this.removeAllActualTotalClaim();
    }
  }

  removeAllIndexedTotalClaim() {
    this.searchCriteria.selectedSearchCriteria.indexedTotalCategory = [];
    this.searchCriteria.selectedSearchCriteria.indexedTotalCategory.push(_.find(this.searchCriteria.masterSearchData.lossAmountRanges, (e) => e.id == null));
  }

  removeSelectedIndexedTotalClaim(indexedTotalCategory) {
    _.remove(this.searchCriteria.selectedSearchCriteria.indexedTotalCategory, indexedTotalCategory);
    if (this.searchCriteria.selectedSearchCriteria.indexedTotalCategory && this.searchCriteria.selectedSearchCriteria.indexedTotalCategory.length === 0) {
      this.removeAllIndexedTotalClaim();
    }
  }

  removeAllCostCategoryCriteria() {

    this.removeAllActualPDClaim();
    this.removeAllIndexedPDClaim();
    this.removeAllActualOEEClaim();
    this.removeAllIndexedOEEClaim();
    this.removeAllActualTotalClaim();
    this.removeAllIndexedTotalClaim();

  }
}

