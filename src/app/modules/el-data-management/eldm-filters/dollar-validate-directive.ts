
import { Directive, HostListener, ElementRef, Output, EventEmitter } from "@angular/core";

@Directive({
    selector: '[dollar]'
})

export class DollarDirective {

    @Output() valueChange = new EventEmitter();

    private regex: RegExp = new RegExp(/^[0-9,]+(\.[0-9]*){0,1}$/g);

    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft', 'Left', 'Right', 'Decimal'];

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {

        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        let current: string = this.el.nativeElement.value;

        let next: string = current.concat(event.key);

        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }

    @HostListener('input') onInput() {
        this.valueChange.emit(this.el.nativeElement.value.replace(/\,/g, ''));
    }


}