import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { isNumeric } from "rxjs/util/isNumeric";


@Component({
  selector: 'total-claim-calculator-v2',
  templateUrl: './total-claim-calculator-v2.component.html',
  styleUrls: ['./total-claim-calculator-v2.component.css']
})
export class TotalClaimCalculatorV2Component extends DecimalPipe implements OnInit, OnChanges {
  pd: number = 0;
  //   oee: number = 0;
  bi: number = 0;
  total: number = 0;
  valChange: boolean;
  @Input() resetFlag: boolean;
  @Input() readonlyFlag: boolean;
  @Input() pdLoss: number;
  @Input() biLoss: number;
  @Input() isPower: boolean;
  @Output() pdVal: EventEmitter<number> = new EventEmitter();
  @Output() biVal: EventEmitter<number> = new EventEmitter();
  @Output() inValidFlag: EventEmitter<boolean> = new EventEmitter<boolean>();
  isTotalGreaterThanTenDigits: boolean;


  convertToInt(val) {
    if (val != undefined && val != null)
      return parseInt(val.toString().replace(/,/g, ''));
    else
      return 0;
  }

  ngOnInit() {
    this.inValidFlag.emit(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetFlag'] !== undefined) {
      this.pd = 0;
      this.bi = 0;
      this.total = 0;
      this.valChange = false;
    }
    if (this.readonlyFlag) {

      this.total = this.convertToInt(this.pdLoss) + this.convertToInt(this.biLoss);
      this.total = this.transform(this.total);
      this.biLoss = this.transform(this.biLoss);
      this.pdLoss = this.transform(this.pdLoss);

    }
  }
  onChange() {
    // this.total = this.convertToInt(this.pd) + this.convertToInt(this.bi);
    this.bi = this.formatInput(this.bi);
    this.pd = this.formatInput(this.pd);
    this.calculateTotal();
    this.pdVal.emit(this.convertToInt(this.pd));
    this.biVal.emit(this.convertToInt(this.bi));
    this.valChange = true;
    if (this.total <= 0)
      this.inValidFlag.emit(true);
    else if (this.total > 9999999999999) {
      this.inValidFlag.emit(true);
      this.isTotalGreaterThanTenDigits = true;
    }
    else {
      this.inValidFlag.emit(false);
      this.isTotalGreaterThanTenDigits = false;
    }
    // this.total = this.pd + this.bi + this.oee;
  }

  transform(value: any): any {

    if (isNumeric(value))
      return super.transform(value);

    return value;
  }

  restrictDecimalInput(event){
    return (event.key!=".");
  }

  formatInput(input) {
    if (input) {
      if (input.length > 0) {
        input = input.replace(/^0+/, '');
        if (input.length == 0) {
          return 0;
        } else {
          return input;
        }
      } else {
        if (input == "") {
          return 0;
        }
        else {
          return input;
        }
      }
    }
    else {
      return 0;
    }
  }

  calculateTotal() {
    this.pd = this.transform(this.convertToInt(this.pd));
    this.bi = this.transform(this.convertToInt(this.bi));
    this.total = this.transform(this.convertToInt(this.pd) + this.convertToInt(this.bi));
  }

}
