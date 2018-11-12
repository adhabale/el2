import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router';
import { LossDataSubmissionComponent } from './loss-data-submission.component';
import { UpstreamLossComponent } from './upstream-loss/upstream-loss.component';
import { DownstreamLossComponent } from './downstream-loss/downstream-loss.component';
import { PowerLossComponent } from './power-loss/power-loss.component';
import { LossDataSubmissionHistoryComponent } from './loss-data-submission-history/loss-data-submission-history.component';

const LossDataSubmissionRoutes: Routes = [
    {
        path: '', component: LossDataSubmissionComponent, children: [
            { path : 'loss-data-submission-history', component : LossDataSubmissionHistoryComponent},
            { path: 'upstream-loss', component: UpstreamLossComponent },
            { path: 'downstream-loss', component: DownstreamLossComponent },
            { path: 'power-loss', component: PowerLossComponent },
            { path: '**', redirectTo: 'loss-data-submission-history' }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(LossDataSubmissionRoutes)],
    exports: [RouterModule]
})

export class LossDataSubmissionRoutingModule { }
