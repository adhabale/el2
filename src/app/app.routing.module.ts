import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AppAuthGuard } from './app.auth.guard';
import { OverallLossesReportComponent } from './modules/reports/overall-losses/overall-losses-report.component';
import { SessionTimeoutComponent } from './shared/session-timeout/session-timeout.component';
import { ForbiddenComponent } from './shared/forbidden/forbidden.component';
import { OEELossesReportComponent } from './modules/reports/oee-losses/oee-losses-report.component';
import { CustomReportComponent } from './modules/reports/custom-reports/custom-report.component';
import { SearchComponent } from './modules/search/search.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { BatchJobComponent } from './modules/batch-job/batch-job.component';
import { LossDetailsComponent } from './modules/reports/loss-details/loss-details.component';
import { SignOutComponent } from './shared/sign-out/sign-out.component';

import { AnnouncementComponent } from './modules/announcements/announcements.component';
import { AdminTermsOfUseComponent } from './modules/admin-terms-of-use/admin-terms-of-use.component';
import { ReferenceDocumentComponent } from './modules/reference-document/reference-document.component';
import { LossDataDashboardComponent } from './modules/loss-data-dashboard/loss-data-dashboard.component';

import { EldmParamValueComponent } from './modules/eldm-param-value/eldm-param-value.component';
import { ActivityLogComponent } from './modules/activity-log/activity-log.component';

import { ELDataManagementComponent } from "./modules/el-data-management/el-data-management.component";


import { ValidateLossDataSubmissionComponent } from './modules/validate-loss-data-submission//validate-loss-data-submission.component';
import { ValidationListComponent } from './modules/validate-loss-data-submission//validation-list/validation-list.component';
import { ValidateLossDataFormComponent } from './modules/validate-loss-data-submission//validate-LossDataForm/validate-LossDataForm.component';
import { UpdateIndexFileComponent } from './modules/update-index-file/update-index-file.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AppAuthGuard] },
  { path: 'subscription-dashboard', component: DashboardComponent, canActivate: [AppAuthGuard] },
  { path: 'accounts', loadChildren: 'app/modules/account/account.module#AccountModule', canLoad: [AppAuthGuard], canActivate: [AppAuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AppAuthGuard] },
  { path: 'reports/overall-losses', component: OverallLossesReportComponent, canActivate: [AppAuthGuard] },
  { path: 'reports/oee-losses', component: OEELossesReportComponent, canActivate: [AppAuthGuard] },
  { path: 'reports/custom', component: CustomReportComponent, canActivate: [AppAuthGuard] },
  { path: 'reports/loss-details', component: LossDetailsComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'session-timeout', component: SessionTimeoutComponent },
  { path: 'logout', component: SignOutComponent },
  //{ path: 'batch-job', component: BatchJobComponent, canActivate: [AppAuthGuard] },
  { path: 'announcements', component: AnnouncementComponent },
  { path: 'terms-of-use', component: AdminTermsOfUseComponent },
  { path: 'reference-document', component: ReferenceDocumentComponent },
  { path: 'loss-data-submission', loadChildren: 'app/modules/loss-data-submission/loss-data-submission.module#LossDataSubmissionModule', canActivate: [AppAuthGuard] },
  { path: 'loss-data-dashboard', component: LossDataDashboardComponent, canActivate: [AppAuthGuard] },
  {path:'eldm-param-value', component:EldmParamValueComponent},
  { path: 'activity-log', component: ActivityLogComponent },
  { path: 'update-index-file', component: UpdateIndexFileComponent },

  { path: 'eldm', component: ELDataManagementComponent},
  {
    path: 'validate-loss-data-submission', component: ValidateLossDataSubmissionComponent, children: [
        { path : 'validation-list', component : ValidationListComponent},
        { path: 'validate-LossDataForm', component: ValidateLossDataFormComponent }
    ]
},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
