import { Component, EventEmitter, Output ,Input } from '@angular/core';
import { ConfirmationModal } from '../../modules/reports/custom-reports/entities/confirmation-modal';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent  {

  @Output() onYesEvent = new EventEmitter();
  @Output() onNoEvent = new EventEmitter();

  @Input() confirmationModal:ConfirmationModal;

  onYes(): void {
    this.onYesEvent.emit();
  }

  onNo(): void {
    this.onNoEvent.emit();
  }
}
