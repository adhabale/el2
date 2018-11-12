import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { LocalWebStorageService } from '../../shared/storage/local-web-storage.service';
@Component({
    selector: 'multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.css']
})

export class MultiSelectComponent implements OnDestroy {

    @Input() availableItems: any[];

    @Input() selectedItems: any[];

    @Input() tabIn: any[];

    @Output() updateSelectedItems: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor(private localStorage: LocalWebStorageService) { }
    ngOnDestroy() {
        this.updateSelectedItems.unsubscribe();
    }

    onItemSelect() {
        this.localStorage.setModifiedflag(true);
        if (this.selectedItems.length > 1) {
            _.remove(this.selectedItems, (e) => e.id == null);

        }

        if (this.selectedItems && this.selectedItems.length === 0) {
            this.selectedItems.push(_.find(this.availableItems, (e) => e.id == null));
        }

        this.updateSelectedItems.emit(this.selectedItems);
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    onSelect(event, item) {

        if (event.ctrlKey) {
            this.localStorage.setModifiedflag(true);
            const itemObj = _.find(this.selectedItems, (e) => e.id === item.id);

            if (itemObj == null) {
                this.selectedItems.push(item);
            } else {
                const itemIndex = this.selectedItems.indexOf(itemObj);
                this.selectedItems.splice(itemIndex, 1);
            }
        } else {
            this.selectedItems = [];
            this.selectedItems.push(item);
        }

        if (this.selectedItems.length > 1) {
            this.selectedItems = _.filter(this.selectedItems, (e) => e.id != null);
        }

        if (this.selectedItems && this.selectedItems.length === 0) {
            this.selectedItems.push(_.find(this.availableItems, (e) => e.id == null));
        }

        this.updateSelectedItems.emit(this.selectedItems);
    }

    isSelected(item) {
        return _.find(this.selectedItems, (e) => e.id === item.id) != null;
    }

    isDisabled(item) {

        if (item.id != null) {
            return false;
        }

        if (this.selectedItems && this.selectedItems.length > 1) {
            return true;
        }

        return false;
    }
}
