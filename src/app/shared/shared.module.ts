import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatepickerComponent } from '../user-controls/datepicker/datepicker.component';
import { MultiSelectComponent } from '../user-controls/multi-select/multi-select.component';
import { PaginationComponent } from '../user-controls/pagination/pagination.component';
import { PaginationsComponent } from '../user-controls/pagination-v2/pagination.component';
//import { AutoCompleteComponent } from '../user-controls/auto-complete/auto-complete.component';
@NgModule({
 imports:      [ CommonModule,FormsModule ],
 declarations: [ DatepickerComponent,MultiSelectComponent,PaginationComponent,PaginationsComponent],
 exports:      [ DatepickerComponent,MultiSelectComponent,PaginationComponent,PaginationsComponent]
})
export class SharedModule { }