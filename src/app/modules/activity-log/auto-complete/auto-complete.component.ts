 import{Component,ElementRef,Input} from '@angular/core';

 @Component({
    selector: 'autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    template:`
        <div class="container hidden-sm-down" >
            <div class="input-field">
              <input id="country" type="text" class="validate filter-input form-control" [(ngModel)]=query (keyup)=filter()>
           
            </div>
             <div class="suggestions" *ngIf="filteredList.length > 0"> 
            <ul class="none">
                    <li *ngFor="let item of filteredList" >
                      <a (click)="select(item)">{{item}}</a>
                    </li>
             </ul>

             </div> 
        </div> 
        
          <div class="hidden-sm-up" >
            <div class="input-field">
              <input id="country" type="text" class="validate filter-input-mobile form-control" [(ngModel)]=query (keyup)=filter()>
           
            </div>
             <div class="suggestions-mbl" *ngIf="filteredList.length > 0"> 
            <ul class="none">
                    <li *ngFor="let item of filteredList" >
                      <a (click)="select(item)">{{item}}</a>
                    </li>
             </ul>

             </div> 
        </div> 
         	
`,
  styleUrls: ['./auto-complete.css']

          
})


export class AutocompleteComponent {
    public query = '';
    // public countries = [ "Albania","Andorra","Armenia","Austria","Azerbaijan","Belarus",
    //                     "Belgium","Bosnia & Herzegovina","Bulgaria","Croatia","Cyprus",
    //                     "Czech Republic","Denmark","Estonia","Finland","France","Georgia",
    //                     "Germany","Greece","Hungary","Iceland","Ireland","Italy","Kosovo",
    //                     "Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia","Malta",
    //                     "Moldova","Monaco","Montenegro","Netherlands","Norway","Poland",
    //                     "Portugal","Romania","Russia","San Marino","Serbia","Slovakia","Slovenia",
    //                     "Spain","Sweden","Switzerland","Turkey","Ukraine","United Kingdom","Vatican City"];
    public filteredList = [];
    public elementRef;
 
    @Input() list;
    constructor(myElement: ElementRef) {
        this.elementRef = myElement;
    }

    filter() {
    if (this.query !== ""){
        this.filteredList = this.list.filter(function(el){
            return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }.bind(this));
    }else{
        this.filteredList = [];
    }
}
 
select(item){
    this.query = item;
    this.filteredList = [];
}

handleClick(event){
   var clickedComponent = event.target;
   var inside = false;
   do {
       if (clickedComponent === this.elementRef.nativeElement) {
           inside = true;
       }
      clickedComponent = clickedComponent.parentNode;
   } while (clickedComponent);
    if(!inside){
        this.filteredList = [];
    }
}


}