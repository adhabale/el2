import { Directive, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/merge';
import { Observable } from 'rxjs/Observable';

@Directive({
    selector: '[appInactivity]'
})

export class InactivityDirective implements OnInit, OnDestroy {

    @Input() inactivityTimeout = 15;

    @Output() inactivityCallback = new EventEmitter();

    private mousemove = new EventEmitter();

    private mousedown = new EventEmitter();

    private keypress = new EventEmitter();

    private scroll = new EventEmitter();

    private timeoutId: any;

    @HostListener('document:mousemove', ['$event'])
    onMousemove(event) {
        this.mousemove.emit(event);
    }

    @HostListener('document:mousedown', ['$event'])
    onMousedown(event) {
        this.mousedown.emit(event);
    }

    @HostListener('document:keypress', ['$event'])
    onKeypress(event) {
        this.keypress.emit(event);
    }

    @HostListener('document:scroll', ['$event'])
    onScroll(event) {
        this.scroll.emit(event);
    }

    constructor() {

        this.mousemove.merge(this.mousedown, this.keypress, this.scroll)            
            .subscribe(() => {
                this.reset();
                this.start();
            });
    }

    ngOnInit() {
        this.start();
    }

    ngOnDestroy(){
        // this.inactivityCallback.unsubscribe();
        // this.mousedown.unsubscribe();
        // this.mousemove.unsubscribe();
        // this.keypress.unsubscribe();
        // this.scroll.unsubscribe();
    }

    public start(): void {
        this.timeoutId = setTimeout(() => this.inactivityCallback.emit(true), this.inactivityTimeout * 60000);
    }

    public reset(): void {
        clearTimeout(this.timeoutId);
    }
}
