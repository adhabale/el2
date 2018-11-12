import { Component, EventEmitter, Output, Input,DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'back-button-confirmation-modal',
    templateUrl: './back-button-confirmation-modal.component.html',
    styleUrls: ['./back-button-confirmation-modal.component.css']
})
export class BackButtonConfirmationModalComponent  {


    constructor(private router : Router){
    }
    @Output() onYesEvent = new EventEmitter();
    //@Output() onNoEvent = new EventEmitter();
    //@Input() status='';
    //@Input() isELDMMode:boolean;
    //statusName:string;

    onYes(): void {
        //this.onYesEvent.emit('Success');
        this.router.navigate(['validate-loss-data-submission/validation-list']);
    }
    // onNo(): void{
    //     this.onNoEvent.emit();
    //     if(!this.isELDMMode)
    //     this.router.navigate(['validate-loss-data-submission/validation-list']);
    // }
}
