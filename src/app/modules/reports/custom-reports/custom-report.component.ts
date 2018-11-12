import { Component, OnInit, Input } from '@angular/core';;
import { SaveReportComponent } from './save-report/save-report.component';
import { Router } from '@angular/router';
import { ReportParameters } from "./entities/reportParameters";
import { CustomReportService } from "./services/custom-report.service";
import { CustomReportModel } from "./models/custom-report.model";
import { SaveReport } from './entities/saveReport';
import { ModifyReport } from './entities/modifyReport';
import { Report } from './entities/report';
import * as _ from 'lodash';
import { ConfirmationModal } from './entities/confirmation-modal';
import { forkJoin } from "rxjs/observable/forkJoin";
import { CustomReportConfiguration } from './custom-report.configuration';
import { ReportResponse } from '../entities/report.response';
import { InMemoryStorageService } from '../../../shared/storage/in-memory-storage.service';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { ReportService } from '../services/report.service';
import { AuditReportService } from '../services/audit-report.service';
import { ReportAction } from '../entities/audit-report-log';


@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.css'],
  providers: [CustomReportService]
})

export class CustomReportComponent implements OnInit {
  isCaretToggle: boolean;

  sourceReportParameters: ReportParameters[] = [];

  selectedSourceReportParameters: ReportParameters[] = [];

  isSaved: boolean;

  isDeleted: boolean;

  isSaveError: boolean;

  isError: boolean;

  isReportGenerated: boolean;

  generateIndicator: boolean;

  savedReports: Report[];

  selectedReport: Report;

  targetReportParameters: ReportParameters[] = [];

  selectedTargetReportParameters: ReportParameters[] = [];

  private customReportModel: CustomReportModel;

  confirmationModal: ConfirmationModal;

  reportItems: ReportResponse[];

  selectedReportConfiguration: any;

  duplicateReportParameters: ReportParameters[];

  currentDate: Date = new Date();

  constructor(private _router: Router, private customReportService: CustomReportService, private reportService: ReportService, private inMemoryStorage: InMemoryStorageService, private localWebStorage: LocalWebStorageService, private auditReportLogService: AuditReportService) {
    this.customReportModel = new CustomReportModel(customReportService, reportService);
    this.confirmationModal = new ConfirmationModal();
    this.selectedReport = new Report();
    this.confirmationModal.headerMessage = '';
    this.confirmationModal.bodyMessage = '';
  }

  ngOnInit() {
    this.getData();
    this.isCaretToggle = true;
  }

  onReset() {
    this.isSaved = false;
    this.isDeleted = false;
    this.isError = false;
    this.isSaveError = false;
    this.selectedSourceReportParameters = [];
    this.targetReportParameters = [];
    this.selectedTargetReportParameters = [];
    this.selectedReport = new Report();
    this.confirmationModal.headerMessage = '';
    this.confirmationModal.bodyMessage = '';
    this.getReportParameters();
  }

  getData() {
    forkJoin([this.customReportModel.getReportParameters(), this.customReportModel.getSavedReports()]).subscribe(results => {
      this.savedReports = _.orderBy(results[1], [x => x.reportName.toLowerCase()], ['asc']);
      this.sourceReportParameters = results[0];
      this.sourceReportParameters = _.orderBy(this.sourceReportParameters, ['displayName'], ['asc']);
      this.handleSession();
    });
  }

  getReportParameters(): void {
    this.customReportModel.getReportParameters().subscribe(result => {
      this.sourceReportParameters = result;
      this.sourceReportParameters = _.orderBy(this.sourceReportParameters, ['displayName'], ['asc']);
    });
  }

  getSavedReports(): void {
    this.customReportModel.getSavedReports().subscribe(result => {
      this.savedReports =  _.orderBy(result, [x => x.reportName.toLowerCase()], ['asc']);
    });
  }

  onUpdate(value: string): void {
    if (this.targetReportParameters && this.targetReportParameters.length > 2) {
      this.isError = false;
      this.isSaveError = false;
      if (this.selectedReport.reportName) {
        if (this.duplicateReportParameters && (JSON.stringify(this.duplicateReportParameters) == JSON.stringify(this.targetReportParameters))) {
          this.isSaveError = true;
        }
        else {
          if (value == 'generate') {
            this.generateIndicator = true;
          }
          document.getElementById("saveCriteriaModalBtn").click();
          $(window).scrollTop(0);
        }
        // let report: ModifyReport = new ModifyReport();
        // report.id = this.selectedReport.id;
        // report.reportCriteria = this.targetReportParameters;
        // this.customReportModel.updateReport(report).subscribe(result => {
        //   if (result == null) {
        //     if (value == 'generate') {
        //       this.generateReport();
        //     }
        //     let index = _.findIndex(this.savedReports, (e) => e == this.selectedReport);
        //     if (index !== -1) {
        //       this.savedReports[index].reportCriteria = this.targetReportParameters;
        //     }
        //     this.duplicateReportParameters = _.cloneDeep(this.targetReportParameters);
        //     this.isSaved = true;
        //   } else {
        //     this.isSaved = false;
        //   }
        //})
      }
      else {
        if (value == 'generate') {
          this.generateIndicator = true;
        }
        document.getElementById("saveCriteriaModalBtn").click();
        $(window).scrollTop(0);
      }
    } else {
      this.isError = true;
      this.isSaveError = false;
    }
  }

  onSave(report: Report): void {
    this.isSaved = true;
    this.savedReports.push(report);
    this.savedReports =   _.orderBy(this.savedReports, [x => x.reportName.toLowerCase()], ['asc']);
    this.selectedReport = report;
    this.duplicateReportParameters = _.cloneDeep(this.targetReportParameters);

    this.auditReportLog(report.reportName, ReportAction.SAVE);

    if (this.generateIndicator) {
      this.generateIndicator = false;
      this.generateReport();
    }
  }

  onDelete(): void {
    this.customReportModel.deleteReport(this.selectedReport.id).subscribe((result) => {

      this.auditReportLog(this.selectedReport.reportName, ReportAction.DELETE);

      let index = this.getIndexOfSelectedReport(this.selectedReport, this.savedReports);
      if (index !== -1) {
        this.savedReports.splice(index, 1);
        this.isDeleted = true;
        this.isSaved = false;
        this.isError = false;
        this.isSaveError = false;
        this.selectedSourceReportParameters = [];
        this.targetReportParameters = [];
        this.selectedTargetReportParameters = [];
        this.selectedReport = new Report();
        this.confirmationModal.headerMessage = '';
        this.confirmationModal.bodyMessage = '';
        this.getReportParameters();
      }
    });
  }

  onAdd(): void {
    this.selectedSourceReportParameters.forEach((report) => {
      this.targetReportParameters.push(report);
      this.sourceReportParameters = _.filter(this.sourceReportParameters, (e) => { return e != report });
    });
    this.selectedSourceReportParameters = [];
  }

  onRemove(): void {
    this.selectedTargetReportParameters.forEach((report) => {
      this.sourceReportParameters.push(report);
      this.targetReportParameters = _.filter(this.targetReportParameters, (e) => { return e != report });
    });
    this.sourceReportParameters = _.orderBy(this.sourceReportParameters, ['displayName'], ['asc']);
    this.selectedTargetReportParameters = [];
  }


  getSelectedReport(report: Report) {
    this.selectedReport = report;
    this.duplicateReportParameters = _.cloneDeep(this.selectedReport.reportCriteria);
    this.targetReportParameters = report.reportCriteria;
    // this.sourceReportParameters=_.difference(this.sourceReportParameters,this.targetReportParameters);
    let i: number = 0;
    while (i < this.sourceReportParameters.length) {
      for (let report of this.targetReportParameters) {
        if (report.displayName === this.sourceReportParameters[i].displayName) {
          this.sourceReportParameters.splice(i, 1); // remove duplicated
          continue;
        }
      }
      i++;
    }
  }

  onMoveUp() {
    var previousIndex = -1;
    for (let report in this.selectedTargetReportParameters) {
      var index = this.targetReportParameters.indexOf(this.selectedTargetReportParameters[report]);
      if (index - 1 === previousIndex) {
        previousIndex = index;
      } else if (index > 0) {
        var itemToMove = this.targetReportParameters.splice(index, 1)
        this.targetReportParameters.splice(index - 1, 0, itemToMove[0]);
      }
    }
  }

  onMoveDown() {
    var nextIndex = this.targetReportParameters.length;
    for (var report = this.selectedTargetReportParameters.length; report-- > 0;) {
      var index = this.targetReportParameters.indexOf(this.selectedTargetReportParameters[report]);
      if (index + 1 === nextIndex) {
        nextIndex = index;
      } else if (index < nextIndex) {
        var itemToMove = this.targetReportParameters.splice(index, 1)
        this.targetReportParameters.splice(index + 1, 0, itemToMove[0]);
      }
    }
  }

  generateReport() {
    let lossReportItems = this.getLossDataFromStore();
    if (!lossReportItems)
      this.customReportModel.getCustomReportData().subscribe(
        (result) => {
          //var data: any = this.reportService.csvJSON(result.value);
          let data = JSON.parse(result.value);
          this.getSelectedReportConfiguration();
          this.inMemoryStorage.setItem("OverallLossReportItems", data);
          this.reportItems = _.orderBy(data, [this.selectedReportConfiguration.columns[0].key, "dateOfLoss"], ["asc", "asc"]);
        });
  }

  private getLossDataFromStore() {
    let lossReportItems = this.inMemoryStorage.getItem("OverallLossReportItems");
    if (lossReportItems) {
      this.getSelectedReportConfiguration();
      this.reportItems = _.orderBy(lossReportItems, [this.selectedReportConfiguration.columns[0].key, "dateOfLoss"], ["asc", "asc"]);
    }
    return lossReportItems;
  }

  getSelectedReportConfiguration() {
    let reportConfiguration: any = _.cloneDeep(CustomReportConfiguration);
    let columns = [];
    _.each(this.targetReportParameters, (e) => {
      let col = _.find(reportConfiguration.columns, (column) => (e.columnName.toLowerCase() == column.key.toLowerCase()) || (e.columnName.toLowerCase() == 'dateofloss' && column.key == 'year'));
      columns.push(col);
    })
    reportConfiguration.columns = columns;
    this.selectedReportConfiguration = reportConfiguration;
    this.isReportGenerated = true;
    this.localWebStorage.set('isReportGenerated', true);
    if (this.selectedReport.reportName)
      this.localWebStorage.set('savedReport', this.selectedReport.reportName);
    else
      this.localWebStorage.remove('savedReport');
    this.localWebStorage.set('targetReportParameters', this.targetReportParameters);
  }

  onReselect() {
    // this.localWebStorage.set('isReportGenerated',false);
    this.isReportGenerated = false;
    this.isSaved = false;
    this.isDeleted = false;
  }

  openConfirmationModal(value: string) {
    if (value == 'delete') {
      this.confirmationModal.headerMessage = 'Delete Report';
      this.confirmationModal.bodyMessage = 'Are you sure you want to delete this report?';
      setTimeout(() => {
        document.getElementById('reportSearchModalBtn').click();
      }, 1000);

    } else {
      if (this.targetReportParameters && this.targetReportParameters.length > 2) {
        if (this.duplicateReportParameters && (JSON.stringify(this.duplicateReportParameters) == JSON.stringify(this.targetReportParameters))) {
          this.generateReport();
          this.isError = false;
          this.isSaveError = false;
        } else {
          this.isError = false;
          this.isSaveError = false;
          this.confirmationModal.headerMessage = 'Save Report';
          this.confirmationModal.bodyMessage = 'Would you like to save the selected report criteria ?';
          setTimeout(() => {
            document.getElementById('reportSearchModalBtn').click();
          }, 1000);
        }
      }
      else {
        this.isError = true;
        this.isSaveError = false;
      }
    }
  }

  getIndexOfSelectedReport(report: Report, reports: Report[]): number {
    return reports.findIndex((Report) => Report == report);
  }

  private auditReportLog(customReportName, actionName) {
    this.auditReportLogService.log("Custom", "", customReportName, actionName);
  }

  handleSession() {
    var generateReportStatus = this.localWebStorage.get('isReportGenerated');
    if (generateReportStatus == true) {
      let reportName = this.localWebStorage.get('savedReport');
      if (reportName) {
        this.selectedReport = _.find(this.savedReports, (e) => e.reportName == reportName);
        this.duplicateReportParameters = _.cloneDeep(this.selectedReport.reportCriteria);
      }
      this.selectedSourceReportParameters = this.localWebStorage.get('targetReportParameters');
      // this.onAdd();
      this.selectedSourceReportParameters.forEach((report) => {
        this.targetReportParameters.push(report);
      });
      _.each(this.targetReportParameters, (report) => {
        this.sourceReportParameters = _.filter(this.sourceReportParameters, (e) => { return e.displayName != report.displayName });
      })
      this.selectedSourceReportParameters = [];
      this.generateReport();
    } else {
      this.isReportGenerated = false;
    }
  }

  caretToggle() {
    this.isCaretToggle = !this.isCaretToggle;
  }
}
