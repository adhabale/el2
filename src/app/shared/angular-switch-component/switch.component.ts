import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
    @Input() on: string = 'Yes';
    @Input() off: string = 'No';
    @Input() type?: 'yesNo' | 'onOff';
    @Input() checked: boolean;
    @Input() disabled: boolean;
    @Output() checkedChange: EventEmitter<any> = new EventEmitter();

    id: string;

    constructor() {
        this.id = 'switch-' + Math.random().toString().substring(2);
    }

    ngOnInit() {
    }

}
