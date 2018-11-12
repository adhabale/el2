import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { FooterComponent } from './modules/common/footer/footer.component';
import { HttpClientService } from './shared/http/http-client-service';
import { GlobalExceptionHandler } from './shared/exception-handler/exception-handler';


import { ConfigurationService } from './shared/configuration/configuration.service';
import { DownloadFileService } from './shared/download-file/download-file.service';
import { InMemoryStorageService } from './shared/storage/in-memory-storage.service';
import { TokenService } from './shared/token/token.service';
import * as $ from 'jquery';
import { PopoverModule } from "ngx-popover";
import { TRANSLATION_PROVIDERS } from './shared/translate/translation';
import { TranslateService } from './shared/translate/translate.service';
import { HomeService } from '../app/modules/home/services/home.services';
import { TranslatePipe } from './shared/translate/translate.pipe';
import { AppRoutingModule } from './app.routing.module';
import { HttpRequestInterceptor } from './shared/http/http-interceptor';
import { AppInitializationFactory } from './startup/app-initialization.factory';
import { StartupService } from './startup/startup.service';
import { UserRoleService } from './shared/user-profile/user-role.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader/loader.service';
import { HttpClientWrapper } from './shared/http/http-client-wrapper';
import { AppAuthGuard } from './app.auth.guard';
import { LogoutComponent } from './shared/logout/logout.component';
import { LogOutService } from './shared/logout/logout.service';
import { SessionTimeoutComponent } from './shared/session-timeout/session-timeout.component';
import { AngularWebStorageModule } from 'angular-web-storage';
import { OverallLossesReportComponent } from './modules/reports/overall-losses/overall-losses-report.component';
import { ReportViewerComponent } from './modules/reports/shared/report-viewer/report-viewer.component';
//import { PaginationComponent } from './user-controls/pagination/pagination.component';
import { SessionWebStorageService } from './shared/storage/session-web-storage.service';
import { LocalWebStorageService } from './shared/storage/local-web-storage.service';
import { OEELossesReportComponent } from './modules/reports/oee-losses/oee-losses-report.component';
import { ExportReportComponent } from './modules/reports/shared/export-report/export-report.component';
import { ForbiddenComponent } from './shared/forbidden/forbidden.component';
import { RoundPipe } from './shared/filters/round.pipe';
import { NumberPipe } from './shared/filters/number.pipe';
import { TermsOfUseComponent } from './modules/terms-of-use/terms-of-use.component';
import { TermsOfUseService } from "./modules/terms-of-use/services/terms-of-use.service";
import * as alasql from 'alasql';
import * as XLSX from 'xlsx';
import { CustomReportComponent } from './modules/reports/custom-reports/custom-report.component';
import { SaveReportComponent } from './modules/reports/custom-reports/save-report/save-report.component';
import { ConfirmationModalComponent } from './user-controls/confirmation-modal/confirmation-modal.component';
import { SearchModule } from './modules/search/search.module';
import { LossDetailsComponent } from './modules/reports/loss-details/loss-details.component';
import { SearchSummaryComponent } from './modules/reports/shared/search-summary/search-summary.component';
import { ReportService } from './modules/reports/services/report.service';
import { BatchJobComponent } from './modules/batch-job/batch-job.component';
import { BatchJobService } from './modules/batch-job/services/batch-job.services';
import { ActivityLogDataService } from './modules/activity-log/services/activity-log-data.service';
import { AuditReportService } from './modules/reports/services/audit-report.service';
import { AuditTermsOfUseService } from './modules/terms-of-use/services/audit-terms-of-use.service';
import { AnnouncementComponent } from './modules/announcements/announcements.component';
import { AnnouncementService } from './modules/announcements/services/announcements.services';
import { CreateEditAnnouncementComponent } from './modules/announcements/create-edit-announcement/create-edit-announcement.component';
import { RichTextEditorComponent } from './modules/admin-terms-of-use/richTextEditor/richTextEditor.component';
import { AdminTermsOfUseComponent } from './modules/admin-terms-of-use/admin-terms-of-use.component';
import { AdminTermsOfUseService } from './modules/admin-terms-of-use/services/admin-terms-of-use.service';
import { SharedModule } from './shared/shared.module';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { BarGraphComponent } from './modules/dashboard/bar-graph/bar-graph.component';
import { PieChartComponent } from './modules/dashboard/pie-chart/pie-chart.component';
import { NotificationComponent } from './modules/dashboard/notification/notification.component';
import { RenewalReportsComponent } from './modules/dashboard/renewal-reports/renewal-reports.component';
import { SortableColumnComponent } from './modules/dashboard/sortable-column/sortable-column.component';
import { SortableTableDirective } from './modules/dashboard/sortable-column/sortable-column.directive';
import { SortService } from './modules/dashboard/services/sort.service';

import { ReferenceDocumentComponent } from "./modules/reference-document/reference-document.component";
import { UploadReferenceDocumentComponent } from "./modules/reference-document/upload-edit/upload-reference-document.component";
import { ReferenceDocumentService } from "./modules/reference-document/services/reference-document.service";
import { SignOutComponent } from './shared/sign-out/sign-out.component';
import { InactivityDirective } from './shared/inactivity-directive/inactivity.directive';
import { LossesByYearLargeChartComponent } from './modules/loss-data-dashboard/losses-by-years/large-view/losses-by-year-large-chart.component';
import { LossesByYearSmallChartComponent } from './modules/loss-data-dashboard/losses-by-years/small-view/losses-by-year-small-chart.component';
import { LossDataDashboardComponent } from './modules/loss-data-dashboard/loss-data-dashboard.component';
import { LossDataDashboardService } from './modules/loss-data-dashboard/loss-data-dashboard.service';
import { ValidateLossDataSubmissionService } from './modules/validate-loss-data-submission/validate-loss-data-submission.service';
import { StackedColumnChartComponent } from './user-controls/chart/stacked-column-chart/stacked-column-chart.component';
// import { IncidentByYearLargeChartComponent } from './modules/loss-data-dashboard/incident-by-years/large-view/incident-by-year-large-chart.component';
// import { IncidentByYearSmallChartComponent } from './modules/loss-data-dashboard/incident-by-years/small-view/incident-by-year-small-chart.component';
import { IncidentByLossTypeLargeChartComponent } from './modules/loss-data-dashboard/losses-by-claim-type/large-view/incident-by-loss-type-large-chart.component';
import { IncidentByLossTypeSmallChartComponent } from './modules/loss-data-dashboard/losses-by-claim-type/small-view/incident-by-loss-type-small-chart.component';
import { PieChartComponent1 } from './user-controls/chart/pie-chart/pie-chart.component';
import { IncidentByCategoryLargeChartComponent } from './modules/loss-data-dashboard/incident-by-category/large-view/incident-by-category-large-chart.component';
import { IncidentByCategorySmallChartComponent } from './modules/loss-data-dashboard/incident-by-category/small-view/incident-by-category-small-chart.component';

import { EldmParamValueComponent } from './modules/eldm-param-value/eldm-param-value.component';
import { ParamLookUp } from './modules/eldm-param-value/entities/ParamLookUp'
import { AutocompleteComponent } from './modules/activity-log/auto-complete/auto-complete.component';
import { MultiAutocompleteComponent } from './modules/activity-log/multi-autocomplete/multi-autocomplete.component';

import { ActivityLogComponent } from './modules/activity-log/activity-log.component';

import { ELDataManagementComponent } from "./modules/el-data-management/el-data-management.component";
import { ELDMRecordsComponent } from "./modules/el-data-management/eldm-records/eldm-records.component";
import { DeleteConfirmationModalComponent } from "./modules/el-data-management/eldm-records/delete-confirmation/delete-confirmation.component";
import { DeleteSuccessModalComponent } from "./modules/el-data-management/eldm-records/delete-success/delete-success.component";
import { ELDMFiltersComponent } from "./modules/el-data-management/eldm-filters/eldm-filters.component";

import { ValidateLossDataSubmissionComponent } from './modules/validate-loss-data-submission/validate-loss-data-submission.component';
import { TotalClaimCalculatorComponent } from './modules/validate-loss-data-submission/shared/total-claim-calculator/total-claim-calculator.component';
import { SuccessConfirmationModalComponent } from './modules/validate-loss-data-submission/shared/success-confirmation/success-confirmation.component';
import { ConfirmUpdateDateModalComponent } from './modules/validate-loss-data-submission/shared/updatedate-confirmation/confirm-updateddate.component';
import { BackButtonConfirmationModalComponent } from './modules/validate-loss-data-submission/shared/back-button-confirmation-modal/back-button-confirmation-modal.component';
import { ValidateLossDataSubmissionModel } from './modules/validate-loss-data-submission/shared/models/validatelossDataSubmission.model';
import { ValidationListComponent } from './modules/validate-loss-data-submission/validation-list/validation-list.component';
import { ValidateLossDataFormComponent } from './modules/validate-loss-data-submission/validate-LossDataForm/validate-LossDataForm.component';
import { SuccessModalComponent } from './modules/validate-loss-data-submission/shared/success-modal/success.component';
import { AutoCompleteValidateComponent } from './modules/validate-loss-data-submission/shared/auto-complete-validate/auto-complete-validate.component'
import { MultiSelectAutoCompleterComponent } from './user-controls/multi-select-with-checkbox/multi-select-with-checkbox-component';

import { UpdateIndexFileComponent } from './modules/update-index-file/update-index-file.component';
import { IncidentByYearSmallChartComponent } from './modules/loss-data-dashboard/incident-by-years/small-view/incident-by-year-small-chart.component';
import { IncidentByYearLargeChartComponent } from './modules/loss-data-dashboard/incident-by-years/large-view/incident-by-year-large-chart.component';
import { UpdateIndexFileService } from './modules/update-index-file/services/update-index-file.service';
import { LossesByLocationComponent } from './modules/loss-data-dashboard/losses-by-location/losses-by-location.component';

import { DecimalNumberDirective } from './modules/update-index-file/shared/decimal.directive';
import { DecimalNumberDirectiveVal } from './modules/validate-loss-data-submission/shared/decimal-validate.directive';
import { DollarDirective } from './modules/el-data-management/eldm-filters/dollar-validate-directive';
import { NumberDirective } from './modules/el-data-management/eldm-filters/number-directive';

import { ParamValueModel } from './modules/eldm-param-value/model/param-value.model';
import { ParamValueService } from './modules/eldm-param-value/services/eldm-param-value.service';
import { SearchLossService } from './modules/el-data-management/services/el-data-management-service';
import { RangePipe } from './modules/eldm-param-value/range-pipe';
import { OptgroupPipe } from './modules/el-data-management/eldm-filters/eldm-opt-group-pipe';
import { TabIndexService } from './shared/TabIndex/tabindex.service';

@NgModule({
  declarations: [
    RangePipe,
    OptgroupPipe,
    DollarDirective,
    NumberDirective,
    AppComponent,
    BatchJobComponent,
    LossDetailsComponent,
    TermsOfUseComponent,
    HomeComponent,
    FooterComponent,
    TranslatePipe,
    LoaderComponent,
    CreateEditAnnouncementComponent,
    OverallLossesReportComponent,
    OEELossesReportComponent,
    ReportViewerComponent,
    ExportReportComponent,
    SearchSummaryComponent,
    LogoutComponent,
    SignOutComponent,
    SessionTimeoutComponent,
    ForbiddenComponent,
    RoundPipe,
    NumberPipe,
    CustomReportComponent,
    SaveReportComponent,
    ConfirmationModalComponent,
    ConfirmationModalComponent,
    AnnouncementComponent,
    DashboardComponent,
    RenewalReportsComponent,
    NotificationComponent,
    PieChartComponent,
    BarGraphComponent,
    SortableColumnComponent,
    SortableTableDirective,
    RichTextEditorComponent,
    AdminTermsOfUseComponent,
    ReferenceDocumentComponent,
    UploadReferenceDocumentComponent,
    //PaginationComponent,
    InactivityDirective,

    LossDataDashboardComponent,
    StackedColumnChartComponent,
    PieChartComponent1,

    LossesByYearLargeChartComponent,
    LossesByYearSmallChartComponent,


    ELDataManagementComponent,
    ELDMRecordsComponent,
    DeleteConfirmationModalComponent,
    DeleteSuccessModalComponent,
    ELDMFiltersComponent,
    IncidentByCategoryLargeChartComponent,
    IncidentByCategorySmallChartComponent,

    IncidentByYearSmallChartComponent,
    IncidentByYearLargeChartComponent,

    IncidentByLossTypeSmallChartComponent,
    IncidentByLossTypeLargeChartComponent,

    LossesByLocationComponent,

    MultiSelectAutoCompleterComponent,

    EldmParamValueComponent,
    MultiAutocompleteComponent,
    AutocompleteComponent,
    ActivityLogComponent,
    ValidateLossDataSubmissionComponent,
    ValidationListComponent,
    TotalClaimCalculatorComponent,
    SuccessConfirmationModalComponent,
    ConfirmUpdateDateModalComponent,
    BackButtonConfirmationModalComponent,
    ValidateLossDataFormComponent,
    SuccessModalComponent,
    AutoCompleteValidateComponent,

    UpdateIndexFileComponent,
    DecimalNumberDirective,
    DecimalNumberDirectiveVal
  ],
  imports: [
    PopoverModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularWebStorageModule,
    SearchModule,
    SharedModule
  ],
  exports: [
    SuccessConfirmationModalComponent
  ],
  providers: [
    InMemoryStorageService,
    SessionWebStorageService,
    LocalWebStorageService,
    StartupService,
    ConfigurationService,
    HttpClientWrapper,
    HttpClientService,
    UserRoleService,
    LoaderService,
    TokenService,
    HomeService,
    TermsOfUseService,
    DownloadFileService,
    BatchJobService,
    ReportService,
    AppAuthGuard,
    AuditReportService,
    AuditTermsOfUseService,
    AnnouncementService,
    AdminTermsOfUseService,
    ActivityLogDataService,
    ReferenceDocumentService,
    SortService,
    LogOutService,
    LossDataDashboardService,
    ParamValueService,
    ValidateLossDataSubmissionService,
    UpdateIndexFileService,
    SearchLossService,
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializationFactory,
      deps: [StartupService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      deps: [LoaderService],
      multi: true
    },
    {
      useClass: GlobalExceptionHandler,
      provide: ErrorHandler,
      deps: [TokenService, LoaderService]
    },
    [TRANSLATION_PROVIDERS, TranslateService],
    TabIndexService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
