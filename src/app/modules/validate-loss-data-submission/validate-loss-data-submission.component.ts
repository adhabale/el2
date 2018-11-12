import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'validate-loss-data-submission',
  templateUrl: './validate-loss-data-submission.component.html',
  styleUrls: ['./validate-loss-data-submission.component.css']
})
export class ValidateLossDataSubmissionComponent implements OnInit {


  constructor(private router: Router) {
  }
  selectedLossType: string;
  ngOnInit() {
    //this.router.navigate(['/validate-loss-data-submission/validation-list']);
  }
  openNewSubmissionModal() {
    document.getElementById('openSelectionModal').click();
  }
}
