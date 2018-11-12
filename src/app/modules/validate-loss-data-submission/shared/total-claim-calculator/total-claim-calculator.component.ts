import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { isNumeric } from "rxjs/util/isNumeric";
//import { HostListener } from '@angular/compiler/src/core';
//import { EventEmitter } from 'events';

@Component({
  selector: 'total-claim-calculator',
  templateUrl: './total-claim-calculator.component.html',
  styleUrls: ['./total-claim-calculator.component.css']
})
export class TotalClaimCalculatorComponent extends DecimalPipe implements OnInit {
  @Input() editableMode: boolean = true;
  @Input() pd: number = 0;
  @Output() pdOutput: EventEmitter<number> = new EventEmitter<number>();
  @Input() oee: number = 0;
  @Output() oeeOutput: EventEmitter<number> = new EventEmitter<number>();
  @Input() bi: number = 0;
  @Output() biOutput: EventEmitter<number> = new EventEmitter<number>();
  @Input() total: number = 0;
  @Output() totalOutput: EventEmitter<number> = new EventEmitter<number>();
  @Input() pageType: number = 0;
  isTotalGreaterThanTenDigits: boolean = false;

  ConvertToInt(val) {
    if (val) {
      return parseInt(val.toString().replace(/,/g, ''));
    }
  }

  ngOnInit() {
    setTimeout(1000);
    this.ngOnChanges();
    // this.total = this.ConvertToInt(this.formatInput(this.pd)) + this.ConvertToInt(this.formatInput(this.bi)) + this.ConvertToInt(this.formatInput(this.oee));
  }
  onModelChange(e) {
    this.ngOnChanges();
    this.pdOutput.emit(this.ConvertToInt(this.pd));
    this.oeeOutput.emit(this.ConvertToInt(this.oee));
    this.biOutput.emit(this.ConvertToInt(this.bi));
    this.totalOutput.emit(this.ConvertToInt(this.total));
  }

  ngOnChanges() {
    if (!this.pd) {
      this.pd = 0;
      this.pd = this.transform(this.pd);
    }
    else {
      this.pd = this.transform(this.ConvertToInt(this.pd));
    }
    if (!this.bi) {
      this.bi = 0;
      this.bi = this.transform(this.bi);
    }
    else {
      this.bi = this.transform(this.ConvertToInt(this.bi));
    }
    if (!this.oee) {
      this.oee = 0;
      this.oee = this.transform(this.oee);
    }
    else {
      this.oee = this.transform(this.ConvertToInt(this.oee));
    }

    if (this.pageType > 1) {
      this.total = this.ConvertToInt(this.pd) + this.ConvertToInt(this.bi);
    }
    else {
      this.total = this.ConvertToInt(this.pd) + this.ConvertToInt(this.bi) + this.ConvertToInt(this.oee);
    }

    let totalAsNumber = this.ConvertToInt(this.total);

    if (totalAsNumber > 9999999999999) {
      this.isTotalGreaterThanTenDigits = true;   //do not change the position of this code
    }
    else {
      this.isTotalGreaterThanTenDigits = false;
    }

    this.total = this.transform(this.total);
  }

  onChange() {
    // this.pdOutput.emit(this.pd);
    // this.oeeOutput.emit(this.oee);
    // this.biOutput.emit(this.bi);
    // this.total = this.ConvertToInt((this.pd)) + this.ConvertToInt((this.bi)) + this.ConvertToInt((this.oee));
    // this.totalOutput.emit(this.total);
  }


  formatInput(input) {
    if (input && input.length > 0) {
      input = input.replace(/^0+/, '');
      if (input.length == 0) {
        return input = '0';
      } else {
        return input;
      }
    } else return input;

  }

  transform(value: any): any {

    if (isNumeric(value))
      return super.transform(value);

    return value;
  }
  calculateTotal() {
    // if (this.pd == undefined) {
    //   this.pd = 0;
    // }
    // if (this.bi == undefined) {
    //   this.bi = 0;
    // }
    // if (this.oee == undefined) {
    //   this.oee = 0;
    // }
    // this.total = this.ConvertToInt(this.pd) + this.ConvertToInt(this.bi) + this.ConvertToInt(this.oee);
    // this.totalOutput.emit(this.total);
    // // this.total = (this.ConvertToInt(this.pd) + this.ConvertToInt(this.bi)+ this.ConvertToInt(this.oee));
    // // this.pd=(this.ConvertToInt(this.pd));
    // // this.bi=(this.ConvertToInt(this.bi));
    // // this.oee=(this.ConvertToInt(this.oee));
    // this.total = this.transform(this.ConvertToInt(this.pd) + this.ConvertToInt(this.bi) + this.ConvertToInt(this.oee));
    // this.pd = this.transform(this.ConvertToInt(this.pd));
    // this.bi = this.transform(this.ConvertToInt(this.bi));
    // this.oee = this.transform(this.ConvertToInt(this.oee));
  }
}

