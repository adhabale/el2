import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from "lodash";

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationsComponent implements OnDestroy, OnChanges {

    @Input() allItems: any;

    @Input() pageSize: number = 100;

    @Input() currentPageIndex: number = 1;

    @Input() totalSize: any;

    @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();

    @Output() setCurrentPageIndex: EventEmitter<any> = new EventEmitter<any>();

    selectedIndex: number = 4
    middle: number;
    resetPage: number = 1;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.middleCounter();
        for (let propName in changes) {

            if (propName == "allItems") {

                let currentValue = changes[propName].currentValue;
                let previousValue = changes[propName].previousValue;

                if (currentValue == undefined && previousValue == undefined) {
                    this.setPage();
                    //this.setPageRange();
                }
                if (previousValue != undefined) {

                    if (currentValue != undefined)
                        currentValue = JSON.stringify(changes[propName].currentValue);

                    if (previousValue != undefined)
                        previousValue = JSON.stringify(changes[propName].previousValue);

                    if (currentValue != previousValue)
                        this.setPage();
                }
            }
        }
    }

    ngOnDestroy() {
        this.onPageChange.unsubscribe();
        this.setCurrentPageIndex.unsubscribe();
    }

    setPage(pageIndex?: any) {
        pageIndex = parseInt(pageIndex) || this.currentPageIndex;
        if (pageIndex <= this.totalPages) {
            this.setPageRange(pageIndex);
            this.currentPageIndex = pageIndex;
            this.onPageChange.emit(this.currentPageIndex);
        }
    }

    setPageRange(pageIndex?: any) {
        pageIndex = pageIndex || this.currentPageIndex;
        if (pageIndex > 0 && pageIndex <= this.totalPages) {
            if (pageIndex <= 3 || pageIndex > this.middle) {//for dropdown more than 10 records
                this.selectedIndex = 4
            }
            else {
                this.selectedIndex = pageIndex

            }
        }
        else {
            this.currentPageIndex = 1;
        }

        let startIndex = (this.currentPageIndex - 1) * this.pageSize;

        let endIndex = startIndex + this.pageSize - 1;
    }

    get totalPages(): number {

        if (this.totalSize) {

            if (this.totalSize <= this.pageSize)
                return 1;
            else
                return _.ceil(this.totalSize / this.pageSize);
        }

        return 0;
    }


    get pageRange(): Array<number> {


        let pageRange: Array<number> = [];
        if (this.totalSize) {

            for (let pageIndex = 1; pageIndex <= _.ceil(this.totalSize / this.pageSize); pageIndex++) {
                pageRange.push(pageIndex);
            }
        }


        return pageRange;
    }

    middleCounter() {//calculating -3 records from total
        if (this.totalPages > 10) {
            this.middle = this.totalPages - 3;
        }

    }


    get pageRangeForLargeData(): Array<number> {// data for dropdown 
        let pageRangel: Array<number> = [];

        for (let pageIndex = 4; pageIndex <= this.middle; pageIndex++) {
            pageRangel.push(pageIndex);
        }
        return pageRangel;
    }
    get pagefirstValue(): number {
        let pageRangel: Array<number> = [];

        for (let pageIndex = 4; pageIndex <= this.middle; pageIndex++) {
            pageRangel.push(pageIndex);
        }
        let firstValue = pageRangel[0];

        return firstValue;
    }

}