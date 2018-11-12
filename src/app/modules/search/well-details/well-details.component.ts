import { Component, Input ,Output,EventEmitter, DoCheck} from '@angular/core';
import { SearchCriteria } from '../entities/search-criteria';
declare var $: any;

@Component({
  selector: 'search-well-details',
  templateUrl: './well-details.component.html',
  styleUrls: ['./well-details.component.css']
})

export class WellDetailsComponent implements DoCheck{

  @Input() searchCriteria: SearchCriteria;

  @Output() onContinueEvent = new EventEmitter<string>();

  @Output() onBackEvent = new EventEmitter<string>();
  formatInput(input) {
    if(input && input.length>0) {
      input=input.replace(/^0+/, '');
    if(input.length==0) {
      return input='0';
    }else{
      return input;
    }
    }else return input;
    
  }

 
  onValidate(value1,value2){
    if(value1!='' && value2!=''){
    if(parseInt(value1)>=parseInt(value2) || parseInt(value2)<=parseInt(value1)){
    return true;
    }
    }
    else return false;
    }
    
    ngDoCheck(){
      if($('#btnBackwell').hasClass('active')){
        $('#btnBackwell').removeClass('active')
      }

      if($('#btnContinuewell').hasClass('active')) {
        $('#btnContinuewell').removeClass('active');
      }
    }

    
  onContinue() {

    $('#costCategoryTab').addClass('active');
    $('#wellTab').removeClass('active');
    $('#lossOfDetailsTab').removeClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#locationTab').removeClass('active');
    $('#claimTab').removeClass('active');

    $('#costCategory').addClass('in').addClass('active');
    $('#wellDetails').removeClass('in').removeClass('active');
    $('#lossOfDetails').removeClass('in').removeClass('active');
    $('#location').removeClass('in').removeClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#claim').removeClass('in').removeClass('active');
  }
  onBack() {
    $('#claimTab').addClass('active');
    $('#lossOfDetailsTab').removeClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#locationTab').removeClass('active');
    $('#wellTab').removeClass('active');
    $('#costCategoryTab').removeClass('active');

    $('#claim').addClass('in').addClass('active');
    $('#lossOfDetails').removeClass('in').removeClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#location').removeClass('in').removeClass('active');
    $('#wellDetails').removeClass('in').removeClass('active');
    $('#costCategory').removeClass('in').removeClass('active');
  }
  onContinueMob() {
    this.onContinueEvent.emit('costCategories');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').addClass('active').removeClass('inactive');

  }
  
  onBackMob() {
    this.onBackEvent.emit('claims');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').addClass('active').removeClass('inactive');
    $('#wellMob').removeClass('active').addClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }

}