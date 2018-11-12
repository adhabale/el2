import { Component, Input ,Output,EventEmitter, DoCheck} from '@angular/core';
import { SearchCriteria } from '../entities/search-criteria';
declare var $: any;

@Component({
  selector: 'search-loss-details',
  templateUrl: './loss-details.component.html',
  styleUrls: ['./loss-details.component.css']
})

export class LossDetailsComponent implements DoCheck{

  @Input() searchCriteria: SearchCriteria;

  @Output() onContinueEvent = new EventEmitter<string>();

  @Output() onBackEvent = new EventEmitter<string>();

  ngDoCheck(){
    if($('#btnBackloss').hasClass('active')){
      $('#btnBackloss').removeClass('active')
    }

    if($('#btnContinueloss').hasClass('active')) {
      $('#btnContinueloss').removeClass('active');
    }
  }
  onContinue() {
    $('#claimTab').addClass('active');
    $('#lossOfDetailsTab').removeClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#locationTab').removeClass('active');
    $('#wellTab').removeClass('active');
    $('#costCategoryTab').removeClass('active'); 

    $('#claim').addClass('in').addClass('active');
    $('#lossOfDetails').removeClass('in').removeClass('active');
    $('#location').removeClass('in').removeClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#wellDetails').removeClass('in').removeClass('active'); 
    $('#costCategory').removeClass('in').removeClass('active'); 
    
  }

  onBack() {

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
    this.onContinueEvent.emit('claims');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').addClass('active').removeClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }
  onBackMob() {
    this.onBackEvent.emit('location');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').addClass('active').removeClass('inactive');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }

}