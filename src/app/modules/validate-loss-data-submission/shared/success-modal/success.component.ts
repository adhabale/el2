import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'success-modal',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.css']
})
export class SuccessModalComponent {

    constructor(private router: Router) {
    }
    @Input() isELDMMode: boolean;
    @Input() status: string;
    @Input() msg: string;
    @Input() errorOccured: boolean;
    @Output() onYesEvent = new EventEmitter();

    onYes(): void {
        this.onYesEvent.emit();
        if (!this.isELDMMode)
            this.router.navigate(['validate-loss-data-submission/validation-list']);

    }
}
