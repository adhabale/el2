import { Component, OnChanges, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { isNumeric } from "rxjs/util/isNumeric";


@Component({
  selector: 'total-claim-calculator',
  templateUrl: './total-claim-calculator.component.html',
  styleUrls: ['./total-claim-calculator.component.css']
})
export class TotalClaimCalculatorComponent extends DecimalPipe implements OnInit, OnChanges {
  pd: number = 0;
  oee: number = 0;
  bi: number = 0;
  total: number = 0;
  valChange: boolean;
  @Input() resetVal: boolean;
  @Input() readonlyFlag: boolean;
  @Input() pdLoss: number;
  @Input() biLoss: number;
  @Input() oeeLoss: number;
  @Output() pdVal: EventEmitter<any> = new EventEmitter<any>();
  @Output() biVal: EventEmitter<any> = new EventEmitter<any>();
  @Output() oeeVal: EventEmitter<any> = new EventEmitter<any>();
  @Output() inValidFlag: EventEmitter<boolean> = new EventEmitter<boolean>();
  isTotalGreaterThanTenDigits: boolean = false;

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
    if (changes['resetVal'] !== undefined) {
      this.pd = 0;
      this.oee = 0;
      this.bi = 0;
      this.total = 0;
      this.valChange = false;
    }

    if (this.readonlyFlag) {

      //this.total = this.pdLoss + this.biLoss + this.oeeLoss;
      this.total = this.convertToInt(this.pdLoss) + this.convertToInt(this.biLoss) + this.convertToInt(this.oeeLoss);
      this.total = this.transform(this.total);
      this.pdLoss = this.transform(this.pdLoss);
      this.oeeLoss = this.transform(this.oeeLoss);
      this.biLoss = this.transform(this.biLoss);

    }
  }

  restrictDecimalInput(event){
    return (event.key!=".");
  }
  


  onChange() {

    this.bi = this.formatInput(this.bi);
    this.oee = this.formatInput(this.oee);
    this.pd = this.formatInput(this.pd);
    this.calculateTotal();
    this.pdVal.emit(this.convertToInt(this.pd));
    this.oeeVal.emit(this.convertToInt(this.oee));
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

  transform(value: any): any {

    if (isNumeric(value))
      return super.transform(value);

    return value;
  }

  calculateTotal() {
    //this.total = this.convertToInt(this.pd) + this.convertToInt(this.bi) + this.convertToInt(this.oee);
    this.pd = this.transform(this.convertToInt(this.pd));
    this.bi = this.transform(this.convertToInt(this.bi));
    this.oee = this.transform(this.convertToInt(this.oee));
    this.total = this.transform(this.convertToInt(this.pd) + this.convertToInt(this.bi) + this.convertToInt(this.oee));
  }

}
