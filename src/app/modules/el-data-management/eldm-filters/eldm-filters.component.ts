import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SearchFilterModel } from './model/el-filters-model';
import { FormLookUp } from './entities/formLookUp';
import { SearchLossService } from "../services/el-data-management-service";
import { Search } from './entities/search-input';
import { OperationTypeEnum } from '../../../shared/enum/global-enum';
import { LossSubmission } from './entities/lossSubmission';
import * as _ from 'lodash';
import { Dollar } from './entities/dollar-model';
import { TabIndexService } from '../../../shared/TabIndex/tabindex.service';

@Component({
  selector: 'eldm-filters',
  templateUrl: './eldm-filters.component.html',
  styleUrls: ['./eldm-filters.component.css']
})


export class ELDMFiltersComponent implements OnInit, AfterViewInit {

  //input object used on parent component
  @Input() search: Search;

  //date objects used in component
  dateObjects = {
    decadeList: [1950, 1960, 1970, 1980, 1990, 2000, 2010],
    yearList: [1972, 1973, 1974, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2018],
    dayList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    monthList: [{ value: 'January', id: 1 }, { value: 'February', id: 2 }, { value: 'March', id: 3 }, { value: 'April', id: 4 }, { value: 'May', id: 5 }, { value: 'June', id: 6 }, { value: 'July', id: 7 }, { value: 'August', id: 8 }, { value: 'September', id: 9 }, { value: 'October', id: 10 }, { value: 'November', id: 11 }, { value: 'December', id: 12 }]
  }

  //public variables
  public formLookUp: FormLookUp;
  public operationTypeEnum: typeof OperationTypeEnum;
  private searchFilterModel: SearchFilterModel;

  //constructor defined
  constructor(private searchLossService: SearchLossService, private tabIndexService: TabIndexService) {
    this.operationTypeEnum = OperationTypeEnum;
    this.searchFilterModel = new SearchFilterModel(searchLossService);
  }

  //On Init event
  ngOnInit() {
    this.getYearList(47);
    this.getDecadeList(10);
    this.getAllDropDownValues();
  }
  ngAfterViewInit() {
    //this.tabIndexService.assignTabIndex(true);
  }
  // on changes event
  // ngOnChanges(changes: SimpleChanges) {
  //   // changes.prop contains the old and the new value...
  //   console.log('on change filters', changes)
  // }

  //bind year dynamically
  getYearList(range) {
    var list = [];
    var current = (new Date()).getFullYear();
    for (var i = 0; i < range; i++) {
      list.push(current);
      current--;
    }
    this.dateObjects.yearList = list;
  }

  //bind decade dynamically
  getDecadeList(range) {
    var list = [];
    var current = (new Date()).getFullYear();
    while (range > 0) {
      if (current % 10 == 0) {
        list.push(current);
        range--;
      }
      current--;
    }
    this.dateObjects.decadeList = list;
  }

  //get all dropdown data
  private getAllDropDownValues() {
    this.searchFilterModel.getlLossInformation()
      .subscribe(response => {
        this.formLookUp = response;
      });
  }

}
