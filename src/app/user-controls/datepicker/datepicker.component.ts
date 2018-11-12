import { Component, OnInit, Input, Output, ElementRef, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
//import { WindowRefService } from '../../services/windowref/window-ref.service';

 // import { TranslateService } from '../../translate/translate.service';

@Component({
    selector: 'datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    host: {
        '(document:click)': 'hideDatepicker($event)'
    }
})
export class DatepickerComponent implements OnInit, OnChanges {
    @Input() label: string;
    @Input() isRequired: boolean;
    @Input() datepickerId: string;
    @Input() name: string;
    @Input() selectedDate: any;
    @Input() isResetCalled: boolean;
    @Output() dateChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() dateFormatValidation: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() dateChangeSF: EventEmitter<any> = new EventEmitter<any>();
    @Input() resetDate: boolean;
    datepicker: any;
    isDatepickerActive: boolean;
    selectedObj: any;
    startWeek: any;
    start: any;
    end: any;
    diff: number;
    current: any;
    currentMonth: string;
    currentYear: string;
    calendarHeaders: any;
    calendarRows: any;
    //selectedDate: string;
    locale: any;
    isDateValid: boolean;
    labelPolicy: any;

    constructor(
        el: ElementRef
        ///private windowRef: WindowRefService,
    ) {
        // this.locale = windowRef.nativeWindow.configSettings.user.locale;
        // this.labelPolicy = windowRef.nativeWindow.labelTranslation.policy;
        // moment.locale(this.locale);
        this.datepicker = el.nativeElement;
        this.isDatepickerActive = false;
        this.isRequired = false;
        this.selectedDate = '';
        this.selectedObj = {};
        this.current = moment();
        this.isDateValid = true;
        this.currentMonth = this.current.format('MMM');
        this.currentYear = this.current.format('YYYY');

        this.startWeek = moment().startOf('month').startOf('week');
        this.start = moment().startOf('month').startOf('week');
        this.end = moment().endOf('month').endOf('week');
        this.diff = this.end.diff(this.start, 'weeks');
    }

    ngOnInit() {
        this.calendarHeaders = this.getCalendarHeaders();
        this.calendarRows = this.getCalendarRows();
        this.selectLang('en');
    }

    ngOnChanges(changes: SimpleChanges) {
        // if setting selectedDate via @Input()
        // update selectedObj with correct value
        // if (this.resetDate) {
        //     this.selectedDate = "";
        // }
        // if (changes['resetDate'] !== undefined) {
        //     this.selectedDate = "";
        // }
        // else {
        if (changes['selectedDate']) {
            if (typeof changes['selectedDate'].currentValue == "object") {
                this.selectedDate = ""; return;
            }
            let parsedDate: any;
            parsedDate = moment(changes['selectedDate'].currentValue, 'DD-MMM-YYYY', this.locale, true);
            if (parsedDate.isValid()) {
                this.selectedObj = this.dateToObj(parsedDate);
            } else {
                // Handle a default date passed as 'YYYY-MM-DD
                parsedDate = moment(changes['selectedDate'].currentValue, 'MM/DD/YYYY', this.locale, true);
                //parsedDate = moment(changes['selectedDate'].currentValue, 'YYYY-MM-DD', this.locale, true);
                if (parsedDate.isValid()) {
                    this.selectedObj = this.dateToObj(parsedDate);
                    this.selectedDate = parsedDate.format("DD-MMM-YYYY");
                }
            }

            if (parsedDate.isValid()) {
                this.dateChangeSF.emit(this.selectedObj.sfFormat);
            } else {
                this.dateChangeSF.emit(undefined);
            }
        }
        // }
    }
    selectLang(lang: string) {
        // this._translate.use(lang);
    }
    showDatepickerToggle() {
        if (this.isDatepickerActive === true) {
            this.isDatepickerActive = false;
        } else {
            this.isDatepickerActive = true;

            // show correct month if there is already a date value
            if (this.selectedDate !== '') {
                this.current.set({
                    year: this.selectedObj.year,
                    month: this.selectedObj.monthIndex
                });
                this.resetCalendar();
                this.updateCalendar();
            }
        }
    }
    getCalendarRows() {
        let rows = [];
        let currentRow = [];
        let rowIterator = 7;

        for (let i = 0; i <= this.diff; i++) {
            currentRow = [];
            rowIterator = 7;

            while (rowIterator--) {
                currentRow.push({
                    year: this.start.format('YYYY'),
                    monthLabel: this.start.format('MMM'),
                    month: this.start.format('MM'),
                    monthIndex: this.start.month(),
                    day: this.start.format('DD'),
                    date: this.start.format('D'),
                    dateString: this.start.format('DD/MM/YYYY') // day-month-year
                });

                this.start.add(1, 'day');
            }

            rows.push(currentRow);
        }

        return rows;
    }

    getCalendarHeaders() {
        let headers = [];

        for (let i = 0; i < 7; i++) {
            headers.push({
                day: this.startWeek.format('ddd')
            });

            this.startWeek.add(1, 'day');
        }

        return headers;
    }

    updateCalendar(): void {
        this.calendarRows = this.getCalendarRows();
    }

    nextMonth(): void {
        this.current.add(1, 'month');

        this.resetCalendar();
        this.updateCalendar();
    }

    previousMonth(): void {
        this.current.subtract(1, 'month');

        this.resetCalendar();
        this.updateCalendar();
    }

    resetCalendar() {
        this.currentMonth = this.current.format('MMM');
        this.currentYear = this.current.format('YYYY');

        this.start.set({
            year: this.current.year(),
            month: this.current.month()
        });
        this.end.set({
            year: this.current.year(),
            month: this.current.month()
        });
        this.start = this.start.startOf('month').startOf('week');
        this.end = this.end.endOf('month').endOf('week');
        this.diff = this.end.diff(this.start, 'weeks');
    }

    selectDate(obj, $event): void {
        // if(this.isResetCalled){
        //     this.resetCalendar();
        // }
        this.selectedObj = obj;
        this.selectedDate = `${obj.day}/${obj.month}/${obj.year}`; // obj.day-obj.monthLabel-obj.year

        let parsedDate: any = moment(this.selectedDate, 'DD/MM/YYYY', this.locale, true);
        this.dateChange.emit(parsedDate.format("MM/DD/YYYY"));

        this.isDateValid = parsedDate.isValid()
        this.dateFormatValidation.emit(this.isDateValid);

        // the true parameter tells the method to set this.isDatepickerActive to false
        // and override the document:click event set by the host
        this.hideDatepicker($event, true);
    }

    showDatepicker() {
        this.isDatepickerActive = true;

        // show correct month if there is already a date value
        if (this.selectedDate !== '') {
            this.current.set({
                year: this.selectedObj.year,
                month: this.selectedObj.monthIndex
            });
            this.resetCalendar();
            this.updateCalendar();
        }
    }

    hideDatepicker($event, bool) {
        if (bool === true) {
            this.isDatepickerActive = false;
            return;
        }

        // close datepicker if clicked anywhere in the document except for the datepicker and its children
        if (!this.datepicker.contains($event.target)) {
            this.isDatepickerActive = false;
        }
    }

    validateDate($event, value) {
        this.isDateValid = moment(value, 'DD/MM/YYYY', this.locale, true).isValid();
        //console.log('Validate Date', value, this.isDateValid, this.locale);
        if (value == '') {
            this.isDateValid = true;
        }

        this.dateFormatValidation.emit(this.isDateValid);
    }

    private dateToObj(dt: moment.Moment) {
        return {
            year: dt.format('YYYY'),
            monthLabel: dt.format('MMM'),
            month: dt.format('MM'),
            monthIndex: dt.month(),
            day: dt.format('DD'),
            date: dt.format('D'),
            dateString: dt.format('DD-MMM-YYYY'), // day-month-year
            sfFormat: dt.format('YYYY-MM-DD'), // format used for SF backend
        };
    }
}
