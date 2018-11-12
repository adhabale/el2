import { Component, Input,Output,EventEmitter, DoCheck } from '@angular/core';
import { SearchCriteria } from '../entities/search-criteria';
declare var $: any;

@Component({
  selector: 'search-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements DoCheck{

  @Input() searchCriteria: SearchCriteria;

  @Output() onContinueEvent = new EventEmitter<string>();

  @Output() onBackEvent = new EventEmitter<string>();

  onLandOffshoreChange(option) {
    this.searchCriteria.selectedSearchCriteria.landOffShore=option;
  }

  ngDoCheck(){
    if($('#btnBack').hasClass('active')){
      $('#btnBack').removeClass('active')
    }
    if($('#btnContinuelocation').hasClass('active')) {
      $('#btnContinuelocation').removeClass('active');
    }
    
  }
  onContinue() {
    $('#lossOfDetailsTab').addClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#locationTab').removeClass('active');
    $('#claimTab').removeClass('active');
    $('#wellTab').removeClass('active');
    $('#costCategoryTab').removeClass('active');

    $('#lossOfDetails').addClass('in').addClass('active');
    $('#location').removeClass('in').removeClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#claim').removeClass('in').removeClass('active');
    $('#wellDetails').removeClass('in').removeClass('active');
    $('#costCategory').removeClass('in').removeClass('active');
  }

  onBack() {

    $('#yearOfLossTab').addClass('active');
    $('#locationTab').removeClass('active');
    $('#lossOfDetailsTab').removeClass('active');
    $('#claimTab').removeClass('active');
    $('#wellTab').removeClass('active');
    $('#costCategoryTab').removeClass('active');

    $('#yearOfLoss').addClass('in').addClass('active');
    $('#location').removeClass('in').removeClass('active');
    $('#lossOfDetails').removeClass('in').removeClass('active');
    $('#claim').removeClass('in').removeClass('active');
    $('#wellDetails').removeClass('in').removeClass('active');
    $('#costCategory').removeClass('in').removeClass('active');
  }
  onContinueMob() {
    this.onContinueEvent.emit('lossDetails');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').addClass('active').removeClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }
  onBackMob() {
    this.onBackEvent.emit('yearOfloss');

    $('#yearOflossMob').addClass('active').removeClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }

}
