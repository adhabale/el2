import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { KeyValuePair } from '../../../common/entity/key-value-pair';

@Component({
    selector: 'auto-complete-validate',
    host: {
        '(document:click)': 'validateAndClose($event)',
    },
    templateUrl: './auto-complete-validate.component.html',
    styleUrls: ['./auto-complete-validate.component.css']
})

export class AutoCompleteValidateComponent implements OnChanges, OnInit {

    @Input() items: any;

    @Input() selected: any;

    @Output() onItemSelect = new EventEmitter();

    @Output() onSearchItem = new EventEmitter();

    selectedItem: KeyValuePair = new KeyValuePair("", null);

    showFilteredList: boolean;

    showValidationMessage: boolean = false;

    filteredList: any[];
    ngOnInit() {
        //this.onSelectEdit(this.items);
        this.showValidationMessage = false;
    }
    ngOnChanges(changes: SimpleChanges) {
        //this.onSelectEdit(this.items)
        for (let propName in changes) {

            if (propName == "items" && changes[propName].currentValue != changes[propName].previousValue) {
                if (this.items != undefined) {
                    this.filteredList = [];

                    this.filteredList = _.map(this.items, (e) => {
                        return {
                            id: e,
                            name: e
                        };
                    });

                }
            }
            if (changes["selected"]) {
                if (propName == "selected" && changes[propName] && changes["selected"].currentValue) {
                    this.selectedItem.key = changes["selected"].currentValue;
                    this.showValidationMessage = false;
                }

                if (propName == "selected" && changes[propName] && changes["selected"].currentValue == "" || changes["selected"].currentValue == undefined) {
                    this.selectedItem.key = changes["selected"].currentValue;
                    this.filteredList = [];
                    this.showValidationMessage = true;
                }
            }

        }

    }

    onSearch() {


        this.showFilteredList = false;
        this.selectedItem.value = null;
        this.onItemSelect.emit(this.selectedItem.key);


        if (this.selectedItem.key != null && this.selectedItem.key != "" && this.selectedItem.key.length > 2) {

            this.onSearchItem.emit(this.selectedItem.key);
            this.showValidationMessage = false;
            this.showFilteredList = true;
        }
        else {
            this.filteredList = [];
            this.showValidationMessage = true;

        }

    }

    onSelect(item) {
        if (item) {
            this.selectedItem.key = item.name;
            this.selectedItem.value = item.id;
            this.showFilteredList = false;
            this.showValidationMessage = false;
            this.onItemSelect.emit(item.name);
        }

    }
    onSelectEdit(item) {
        if (item != undefined) {
            this.selectedItem.key = item[0].name;
            this.selectedItem.value = item[0].id;
            this.showFilteredList = false;
            this.showValidationMessage = false;
            this.onItemSelect.emit(item[0].name);
        }


    }

    validateAndClose(event) {

        if (event.target.className && event.target.className.indexOf("autocompleteList") < 0) {
            this.showFilteredList = false;
            this.showValidationMessage = this.selectedItem.value == null;
        }
    }
    
    checkForTab(event) {
        if (event.keyCode == 9) {
            this.showFilteredList = false;
        }
    }
}
