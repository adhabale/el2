import { Component, Input,Output,EventEmitter ,DoCheck} from '@angular/core';
import { SearchCriteria } from '../entities/search-criteria';

@Component({
  selector: 'search-cost-category',
  templateUrl: './cost-category.component.html',
  styleUrls: ['./cost-category.component.css']
})

export class CostCategoryComponent implements DoCheck {

  @Input() searchCriteria: SearchCriteria;


  @Output() onBackEvent = new EventEmitter<string>();

  ngDoCheck(){
    if($('#btnBackcost').hasClass('active')){
      $('#btnBackcost').removeClass('active')
    }
  }
  onBack() {

    $('#wellTab').addClass('active');    
    $('#claimTab').removeClass('active');
    $('#lossOfDetailsTab').removeClass('active');
    $('#yearOfLossTab').removeClass('active');
    $('#locationTab').removeClass('active');            
    $('#costCategoryTab').removeClass('active'); 

    $('#wellDetails').addClass('in').addClass('active'); 
    $('#claim').removeClass('in').removeClass('active');
    $('#lossOfDetails').removeClass('in').removeClass('active');
    $('#yearOfLoss').removeClass('in').removeClass('active');
    $('#location').removeClass('in').removeClass('active');            
    $('#costCategory').removeClass('in').removeClass('active'); 
    
  }
  onBackMob() {
    this.onBackEvent.emit('wellDetails');

    $('#yearOflossMob').removeClass('active').addClass('inactive');
    $('#locationMob').removeClass('active').addClass('inactive');
    $('#lossOfDetailsMob').removeClass('active').addClass('inactive');
    $('#claimMob').removeClass('active').addClass('inactive');
    $('#wellMob').addClass('active').removeClass('inactive');
    $('#costCategoryMob').removeClass('active').addClass('inactive');
  }
}