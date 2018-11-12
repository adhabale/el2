import { Component, ElementRef, Output, EventEmitter, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
declare var $: any;
@Component({
    selector: 'multi-autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    template: `
         <div class="hidden-sm-down" >
            <div class="input-field">
              <input id="country" type="text" class="validate filter-input form-control" [(ngModel)]=query (keyup)=filter()>
              <button type="button" id='resetButtonText' hidden='true' (click)="clearQuery()" class="btn btn-primary"></button>
           
            </div>
             <div class="suggestions" *ngIf="filteredList.length > 0"> 
                <ul class="none">
                    <li *ngFor="let item of filteredList" >
                       <input type="checkbox" [value]="item.userName" [checked]="item.checked" (change)="select(item)" [id]="item.principalId">
                        <a data-toggle="tooltip" title="{{item.userName}}">{{item.userName}}</a>
                    </li>
                </ul>
             </div> 
        </div>  	 

           <div class="hidden-sm-up" >
            <div class="input-field">
              <input id="country" type="text" class="validate form-control" [(ngModel)]=query (keyup)=filter()>
              <button type="button" id='resetButtonText' hidden='true' (click)="clearQuery()" class="btn btn-primary"></button>
            </div>
             <div class="suggestions-mbl" *ngIf="filteredList.length > 0"> 
                <ul class="none">
                   <li *ngFor="let item of filteredList" >
                       <input type="checkbox" [value]="item.userName" [checked]="item.checked" (change)="select(item)" [id]="item.principalId">
                        <a data-toggle="tooltip" title="{{item.userName}}">{{item.userName}}</a>
                    </li>
                </ul>
             </div> 
        </div>

`,
    styleUrls: ['./multi-autocomplete.css']


})


export class MultiAutocompleteComponent implements OnChanges {
    public query = '';
    public selected = [];
    public filteredList = [];
    public elementRef;
    isChecked: boolean = false;
    //list=[];

    @Input() list;
    @Input() removedIndex;

    @Output() onUserSelection = new EventEmitter();
    @Output() onSearch = new EventEmitter();
    @Output() onRemove = new EventEmitter();
    constructor(myElement: ElementRef) {
        this.elementRef = myElement;
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName == "list" && changes[propName].currentValue != changes[propName].previousValue) {
                if (this.query && this.filteredList) {
                    this.filteredList = this.list.filter(function (el) {
                        return el.userName.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
                    }.bind(this));
                }

            }

        }

    }


    filter() {
        if (this.query !== "") {
            if (this.query.length > 3) {
                this.onSearch.emit(this.query);
            }

        } else {
            this.filteredList = [];
        }
    }


    select(item) {

        if (this.selected.indexOf(item) == -1) {
            if (this.selected.filter(x => x.principalId == item.principalId).length == 0) {
                var objIndex = this.list.indexOf(item)
                this.list[objIndex].checked = !this.list[objIndex].checked;
                console.log(this.list);
                this.selected.push(item);
            }
            this.onUserSelection.emit(this.selected);
        }
        else {
            var objIndex = this.list.indexOf(item)
            this.list[objIndex].checked = !this.list[objIndex].checked;
            var index = this.selected.indexOf(item);
            this.selected.splice(index, 1);
            this.onUserSelection.emit(this.selected);

        }

    }


    handleClick(event) {
        this.clearQuery();
        var clickedComponent = event.target;
        var inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
    }

    clearQuery() {
        this.query = ""
    }


}