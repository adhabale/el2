import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LossDataSubmissionModel } from './models/loss-data-submission.model';
import { LossDataSubmissionService } from './services/loss-data-submission.service';
import { LocalWebStorageService } from '../../shared/storage/local-web-storage.service';


@Component({
  selector: 'loss-data-submission',
  templateUrl: './loss-data-submission.component.html',
  styleUrls: ['./loss-data-submission.component.css']
})
export class LossDataSubmissionComponent implements OnInit {
  private dropDownValues: any;
  private lossDataSubmissionModel: LossDataSubmissionModel;

  constructor(private router: Router, private lossDataSubmissionService: LossDataSubmissionService, private localWebStorageService: LocalWebStorageService) {
    this.lossDataSubmissionModel = new LossDataSubmissionModel(lossDataSubmissionService, localWebStorageService);
  }
  selectedLossType: string;

  ngOnInit() {
    this.lossDataSubmissionModel.getLossSubmissionDrowDownValues().subscribe(response => {
      this.dropDownValues = response;
      this.lossDataSubmissionModel.setDropDownValues(this.dropDownValues);

    })
    //this.router.navigate(['/loss-data-submission/loss-data-submission-history']);
  }
  openNewSubmissionModal() {
    document.getElementById('openSelectionModal').click();
  }
  onLossTypeSelected() {
    this.lossDataSubmissionModel.setReadOnlyFlag(false);
    switch (this.selectedLossType) {
      case "UP":
        this.router.navigate(['/loss-data-submission/upstream-loss']);
        break;
      case "DOWN":
        this.router.navigate(['/loss-data-submission/downstream-loss']);
        break;
      case "POWER":
        this.router.navigate(['/loss-data-submission/power-loss']);
        break;
    }
  }
}
