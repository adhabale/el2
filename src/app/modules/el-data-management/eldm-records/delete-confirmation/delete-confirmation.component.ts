import { Component, EventEmitter, Output, Input,DoCheck } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'delete-confirmation-modal',
    templateUrl: './delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationModalComponent implements DoCheck  {


    constructor(private router : Router){
    }
    @Output() onYesEvent = new EventEmitter();
    @Output() onNoEvent = new EventEmitter();
    @Input() URN='';


    ngDoCheck(): void {
     
      }

    onYes(): void {
        this.onYesEvent.emit();
    }
    onNo(): void{
        this.onNoEvent.emit();
    }
}
