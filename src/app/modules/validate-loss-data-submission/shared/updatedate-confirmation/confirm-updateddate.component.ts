import { Component, EventEmitter, Output, Input,  } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'confirm-updateddate-modal',
    templateUrl: './confirm-updatedate-modal.html',
    styleUrls: ['./confirm-updatedate-modal.css']
})
export class ConfirmUpdateDateModalComponent {

    @Output() onYesEvent = new EventEmitter();
    @Output() onNoEvent = new EventEmitter();
    @Input() URN = '';

    constructor(private router: Router) {
    }

    onYes(): void {
        this.onYesEvent.emit();
    }

    onNo(): void {
        this.onNoEvent.emit();
    }
}
