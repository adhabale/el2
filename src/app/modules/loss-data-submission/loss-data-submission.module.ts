import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LossDataSubmissionRoutingModule } from './loss-data-submission.routing.module';
import { LossDataSubmissionComponent } from './loss-data-submission.component';
import { UpstreamLossComponent } from './upstream-loss/upstream-loss.component';
import { DownstreamLossComponent } from './downstream-loss/downstream-loss.component';
import { PowerLossComponent } from './power-loss/power-loss.component';
import { LossDataSubmissionHistoryComponent } from './loss-data-submission-history/loss-data-submission-history.component';
import { TotalClaimCalculatorComponent } from './shared/total-claim-calculator/total-claim-calculator.component';
import { TotalClaimCalculatorV2Component } from './shared/total-claim-calculator-v2/total-claim-calculator-v2.component';

import { SuccessConfirmationModalComponent } from './shared/success-confirmation/success-confirmation.component';
import { LossDataSubmissionModel } from './shared/models/lossDataSubmission.model';
import { LossDataSubmissionService } from './services/loss-data-submission.service';
import { DecimalNumDirective } from './shared/decimalNum.directive';


@NgModule({
  declarations: [
    LossDataSubmissionComponent,
    UpstreamLossComponent,
    DownstreamLossComponent,
    PowerLossComponent,
    LossDataSubmissionHistoryComponent,
    TotalClaimCalculatorComponent,
    TotalClaimCalculatorV2Component,
    SuccessConfirmationModalComponent,
    DecimalNumDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    LossDataSubmissionRoutingModule,
    SharedModule


  ],
  exports: [
    SuccessConfirmationModalComponent
  ],
  providers: [LossDataSubmissionModel, LossDataSubmissionService]
})
export class LossDataSubmissionModule { }
