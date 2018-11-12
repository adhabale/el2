import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, ViewEncapsulation, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'multi-select-auto-completer',
    host: {
        '(document:click)': 'closeDropDown($event)',
    },
    templateUrl: './multi-select-with-checkbox-component.html',
    styleUrls: ['./multi-select-with-checkbox-component.css'],
    // encapsulation:ViewEncapsulation.Native
})

export class MultiSelectAutoCompleterComponent implements OnChanges,OnInit {

    @Input() items: any[];

    @Input() selectedItems: any[];

    @Output() onItemSelect = new EventEmitter();

    @Output() onItemRemove = new EventEmitter();

    searchText: string;

    showFilteredList: boolean;

    masterList: any[];

    filteredList: any[];

    ngOnInit(){
    
    }
    ngOnChanges(changes: SimpleChanges) {

        for (let propName in changes) {

            if (propName == "items" && changes[propName].currentValue != changes[propName].previousValue) {

                this.masterList = [];
                this.filteredList = [];

                this.masterList = _.map(this.items, (e) => {
                    return {
                        id: e.id,
                        displayName: e.displayName,
                        checked: false
                    };
                });

                this.filteredList = this.masterList;
            }

            if (propName == "selectedItems" && changes[propName].currentValue != changes[propName].previousValue) {

                if (this.filteredList) {

                    _.each(this.filteredList, (e) => {
                        e.checked = this.selectedItems != null && this.selectedItems != undefined && _.find(this.selectedItems, (a) => { return a.id == e.id }) != null
                    });

                    let allOptionObject = _.find(this.filteredList, (e) => { return e.id == null });

                    if (allOptionObject != null && allOptionObject.checked) {

                        _.each(this.filteredList, (e, index) => {
                            if (e.id != null) {
                                e.checked = true;
                                this.onItemSelect.emit({ id: e.id, reload: this.filteredList.length == index + 1 });
                            }
                        });
                    }
                }
            }
        }
    }

    onSearch() {

        this.showFilteredList = true;

        if (this.searchText != null && this.searchText != "") {
            this.filteredList = _.filter(this.masterList, (e) => { return e.displayName.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1; });
        }
        else {
            this.filteredList = this.masterList;
        }
    }

    onSelect(item) {

        if (item.checked) {
            item.checked = false;
            // if (item.id != null && _.find(this.filteredList, (e) => { return e.id != null && e.checked }) == null) {
            //     this.selectAllOptionWhenAllOptionsUnChecked(item);
            // }
            // if (item.id != null)
            if (item.id == null) {
                this.deselectAllIfAllOptionIsUnchecked(item);
            }
            else
                this.deSelectAllIfAnyOptionIsUnChecked(item);
        }
        else {

            item.checked = true;
            if (item.id == null) {
                this.selectAllIfAllOptionIsChecked(item);
            }
            else if (_.find(this.filteredList, (e) => { return e.id != null && !e.checked }) == null) {
                this.selectAllOptionWhenAllOptionsChecked(item);
            }
            else {
                item.checked = true;
                this.onItemSelect.emit({ id: item.id, reload: true });
            }
        }
    }

    closeDropDown(event) {
   if(event.target.className.baseVal=="highcharts-background"){
    this.showFilteredList = false;
   }
   else{
        var hasClass = Array.prototype.indexOf.call(event.target.classList, 'autocompleter') < 0;
         if (event.target.className!=null && hasClass)
             this.showFilteredList = false;
   }
    }

    private deSelectAllIfAnyOptionIsUnChecked(item) {
        // item.checked = false;
        _.find(this.filteredList, (e) => { return e.id == null }).checked = false;
        this.onItemRemove.emit({ id: item.id, reload: true });
    }

    private selectAllIfAllOptionIsChecked(item) {
        _.each(this.filteredList, (e, index) => {
            if (e.id != null) {
                e.checked = true;
                this.onItemSelect.emit({ id: e.id, reload: this.filteredList.length == index + 1 });
            }
        });
    }

    private selectAllOptionWhenAllOptionsChecked(item) {
        _.find(this.filteredList, (e) => { return e.id == null }).checked = true;
        this.onItemSelect.emit({ id: item.id, reload: true });
    }

    private selectAllOptionWhenAllOptionsUnChecked(item) {
        this.onItemRemove.emit({ id: item.id, reload: true });
        _.find(this.filteredList, (e) => { return e.id == null }).checked = true;
    }

    private deselectAllIfAllOptionIsUnchecked(item) {
        _.each(this.filteredList, (e, index) => {
            if (e.id != null) {
                e.checked = false;
                this.onItemRemove.emit({ id: e.id, reload: this.filteredList.length == index + 1 });
            }
        });
    }

}
