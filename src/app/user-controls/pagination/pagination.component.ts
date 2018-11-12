import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import * as _ from "lodash";

@Component({
    selector: 'pager',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnDestroy, OnChanges {

    @Input() allItems: any;

    @Input() pageSize: number = 50;

    @Input() currentPageIndex: number = 1;

    @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();

    @Output() setCurrentPageIndex: EventEmitter<any> = new EventEmitter<any>();

    selectedIndex:number=4
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

                if (currentValue != undefined)
                    currentValue = JSON.stringify(changes[propName].currentValue);

                if (previousValue != undefined)
                    previousValue = JSON.stringify(changes[propName].previousValue);

                if (currentValue != previousValue)
                   this.setPage(this.resetPage);
            }
        }
    }

    ngOnDestroy() {
        this.onPageChange.unsubscribe();
        this.setCurrentPageIndex.unsubscribe();
    }

    setPage(pageIndex?: any) {
        let index = parseInt(pageIndex)
        index = index || this.currentPageIndex 
        //window.scrollTo(0, 0);

        if (index > 0 && index <= this.totalPages) {
            this.currentPageIndex = index;
         if(index<=3 || index>this.middle ){//for dropdown more than 10 records
            this.selectedIndex=4
         }
         else{
            this.selectedIndex=index
             
         }
        }
        else {
            this.currentPageIndex = 1;
        }

        let startIndex = (this.currentPageIndex - 1) * this.pageSize;

        let endIndex = startIndex + this.pageSize - 1;

        if (this.allItems) {

            let pageItems = this.allItems.slice(startIndex, endIndex + 1);

            this.onPageChange.emit(pageItems);
            this.setCurrentPageIndex.emit(this.currentPageIndex);
        }

    
    }

    get totalPages(): number {

        if (this.allItems) {

            if (this.allItems.length <= this.pageSize)
                return 1;
            else
                return _.ceil(this.allItems.length / this.pageSize);
        }

        return 0;
    }

    get pageRange(): Array<number> {

        let pageRange: Array<number> = [];

        for (let pageIndex = 1; pageIndex <= this.totalPages; pageIndex++) {
            pageRange.push(pageIndex);
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

        for (let pageIndex =4; pageIndex <= this.middle; pageIndex++) {
            pageRangel.push(pageIndex);
        }
        return pageRangel;
    }
    get pagefirstValue():number {
                let pageRangel: Array<number> = [];
        
                for (let pageIndex = 4; pageIndex <= this.middle; pageIndex++) {
                    pageRangel.push(pageIndex);
                }
                let firstValue = pageRangel[0]

                return firstValue;
            }
}