import { Component, EventEmitter, Output, Input } from '@angular/core';
 import { Router } from '@angular/router';

@Component({
    selector: 'success-confirmation-modal',
    templateUrl: './success-confirmation.component.html',
    styleUrls: ['./success-confirmation.component.css']
})
export class SuccessConfirmationModalComponent {

     constructor(private router : Router){
     }

    @Input() msg:string;
    @Output() onYesEvent = new EventEmitter();

    onYes(): void {
        this.onYesEvent.emit();
    }
}
