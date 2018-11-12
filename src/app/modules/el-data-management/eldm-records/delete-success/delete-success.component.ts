import { Component, EventEmitter, Output, Input } from '@angular/core';
 import { Router } from '@angular/router';

@Component({
    selector: 'delete-success-modal',
    templateUrl: './delete-success.component.html',
    styleUrls: ['./delete-success.component.css']
})
export class DeleteSuccessModalComponent {

     constructor(private router : Router){
     }
    @Output() onYesEvent = new EventEmitter();

    onYes(): void {
        this.onYesEvent.emit();
    }
}
