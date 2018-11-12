import { Component, Input, Output, EventEmitter, DoCheck, OnInit } from '@angular/core';
import { SearchCriteria } from '../entities/search-criteria';
import { DecimalPipe } from '@angular/common';
import { isNumeric } from "rxjs/util/isNumeric";

@Component({
  selector: 'search-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})

export class ClaimsComponent extends DecimalPipe implements DoCheck {

  @Input() searchCriteria: SearchCriteria;

  @Output() onContinueEvent = new EventEmitter<string>();

  @Output() onBackEvent = new EventEmitter<string>();

  ngDoCheck() {
    if ($('#btnBackclaim').hasClass('active')) {
      $('#btnBackclaim').removeClass('active');

    }

    if ($('#btnContinueclaim').hasClass('active')) {
      $('#btnContinueclaim').removeClass('active');
    }

    if ($('#btnContinueclaim').hasClass('active')) {
      $('#btnContinueclaim').removeClass('active');
    }
  }

  formatInput(input) {
    if (input && input.length > 0) {
      input = input.replace(/^0+/, '');
      input = this.transform(this.ConvertToInt(input));
      if (input.length == 0) {
        return input = '0';
      } else {
        return input;
      }
    } else return input;

  }

  onValidate(value1, value2) {
    //this.onModelChange(event);
    let minValue: string = value1;
    let maxValue: string = value2;
    if (minValue != null && maxValue != null) {
      if ((minValue.indexOf(',') > -1) || (maxValue.indexOf(',') > -1)) {
        minValue = minValue.replace(/,/g, "");
        maxValue = maxValue.replace(/,/g, "");
        if (parseInt(minValue) >= parseInt(maxValue) || parseInt(maxValue) <= parseInt(minValue))
          return true;
        else
          return false;
      }
      else if (parseInt(minValue) >= parseInt(maxValue) || parseInt(maxValue) <= parseInt(minValue))
        return true;
      else
        return false;

    }
    else return false;
  }


  onContinue() {

    $('#wellTab').addClass('active');
    $('#lossOfDetailsTab').removeClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#locationTab').removeClass('active');
    $('#claimTab').removeClass('active');
    $('#costCategoryTab').removeClass('active');

    $('#wellDetails').addClass('in').addClass('active');
    $('#lossOfDetails').removeClass('in').removeClass('active');
    $('#location').removeClass('in').removeClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#claim').removeClass('in').removeClass('active');
    $('#costCategory').removeClass('in').removeClass('active');
  }

  onBack() {

    $('#lossOfDetailsTab').addClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#locationTab').removeClass('active');
    $('#claimTab').removeClass('active');
    $('#wellTab').removeClass('active');

    $('#costCategoryTab').removeClass('active');

    $('#lossOfDetails').addClass('in').addClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#location').removeClass('in').removeClass('active');
    $('#claim').removeClass('in').removeClass('active');
    $('#wellDetails').removeClass('in').removeClass('active');
    $('#costCategory').removeClass('in').removeClass('active');
  }
  onContinueMob() {
    this.onContinueEvent.emit('wellDetails');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').addClass('active').removeClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }
  onBackMob() {
    this.onBackEvent.emit('lossDetails');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').addClass('active').removeClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }
 
  transform(value: any): any {

    if (isNumeric(value))
      return super.transform(value);
    return value;
  }
  ConvertToInt(val) {
    if (val) {
      return parseInt(val.toString().replace(/,/g, ''));
    }
  }
}