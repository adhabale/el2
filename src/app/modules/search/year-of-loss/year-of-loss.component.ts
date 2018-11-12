import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, DoCheck } from '@angular/core';
import { SearchCriteria } from '../entities/search-criteria';
import * as _ from 'lodash';
import { SearchModel } from '../search.model';
import { SearchService } from '../search.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';

@Component({
  selector: 'search-year-of-loss',
  templateUrl: './year-of-loss.component.html',
  styleUrls: ['./year-of-loss.component.css']
})

export class YearOfLossComponent implements OnChanges, DoCheck {

  @Input() searchCriteria: SearchCriteria;

  @Input() isModified: boolean;


  @Output() onContinueEvent = new EventEmitter<string>();

  @Output() onBackEvent = new EventEmitter<string>();
  showSelectAll: boolean = true;
  private searchModel: SearchModel;
  constructor(private searchService: SearchService, private localStorage: LocalWebStorageService) {
    this.searchModel = new SearchModel(searchService);
  }
  ngOnChanges(changes: SimpleChanges) {

    for (let propName in changes) {

      if (propName == "isModified" && changes[propName].currentValue != changes[propName].previousValue) {
        
        this.showSelectAll = _.filter(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
          return decadeObj.isSelected == false;
        }).length > 0;
      }
    }
  }

  ngDoCheck() {
    if ($('#btnContinueyear').hasClass('active')) {
      $('#btnContinueyear').removeClass('active');
    }
  }

  onDecadeToggle(decade) {

    decade.isSelected = !decade.isSelected;
    if(decade.isSelected == true){
      this.localStorage.setModifiedflag(true);
    }
    else{
      this.localStorage.setModifiedflag(false);
    }
    _.each(decade.years, (yearObj: any) => {

      if (!yearObj.ignore)
        yearObj.isSelected = decade.isSelected;
    });

    this.bindAllSelectedYear();
  }

  OnYearToggle(year) {

    if (!year.ignore) {
      year.isSelected = !year.isSelected;
      if(year.isSelected == true){
        this.localStorage.setModifiedflag(true);
      }
      else{
        this.localStorage.setModifiedflag(false);
      }
      this.bindAllSelectedYear();
    }
  }

  onToggleAll(isSelectAll) {
    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      decadeObj.isSelected = isSelectAll;
      _.each(decadeObj.years, (yearObj: any) => {
        if (!yearObj.ignore)
          yearObj.isSelected = isSelectAll;
          this.localStorage.setModifiedflag(true);
      });
    });
    this.bindAllSelectedYear();
  }

  onContinue() {

    $('#locationTab').addClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#lossOfDetailsTab').removeClass('active');
    $('#claimTab').removeClass('active');
    $('#wellTab').removeClass('active');
    $('#costCategoryTab').removeClass('active');

    $('#location').addClass('in').addClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#lossOfDetails').removeClass('in').removeClass('active');
    $('#claim').removeClass('in').removeClass('active');
    $('#wellDetails').removeClass('in').removeClass('active');
    $('#costCategory').removeClass('in').removeClass('active');

  }
  onContinueMob() {
    this.onContinueEvent.emit('location');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('inactive').addClass('active');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }

  private bindAllSelectedYear() {

    let selectedYears = [];

    _.each(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      decadeObj.isSelected = _.filter(decadeObj.years, (e: any) => { return !e.isSelected }).length == 0;
      let years = _.filter(decadeObj.years, (e: any) => { return e.isSelected });
      selectedYears = selectedYears.concat(years);
    });

    if (!this.searchCriteria.selectedSearchCriteria.yearOfLoss)
      this.searchCriteria.selectedSearchCriteria.yearOfLoss = [];

    this.searchCriteria.selectedSearchCriteria.yearOfLoss = selectedYears;

    this.showSelectAll = _.filter(this.searchCriteria.masterSearchData.yearOfLoss.decades, (decadeObj: any) => {
      return decadeObj.isSelected == false;
    }).length > 0;

  }
}