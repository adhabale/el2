import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { YearOfLossComponent } from './year-of-loss/year-of-loss.component';
import { LocationComponent } from './location/location.component';
import { SummaryComponent } from './summary/summary.component';
import { SearchService } from './search.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LossDetailsComponent } from './loss-details/loss-details.component';
import { ClaimsComponent } from './claims/claims.component';
import { WellDetailsComponent } from './well-details/well-details.component';
import { CostCategoryComponent } from './cost-category/cost-category.component';
//import { MultiSelectComponent } from '../../user-controls/multi-select/multi-select.component';
import { AllowDecimalNumberDirective } from '../../user-controls/decimal-number.directive';


@NgModule({
  declarations: [
    SearchComponent,
    YearOfLossComponent,
    LocationComponent,
    LossDetailsComponent,
    ClaimsComponent,
    WellDetailsComponent,
    CostCategoryComponent,
    SummaryComponent,
    //MultiSelectComponent,
    AllowDecimalNumberDirective
  ],
  imports:[    
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule,
    SharedModule
  ],
  providers: [
    SearchService
  ]
})
export class SearchModule { }

