import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { ReportParameters } from '../entities/reportParameters';
import { CustomReportModel } from '../models/custom-report.model';
import { CustomReportService } from '../services/custom-report.service';
import { Report } from '../entities/report';
import { SaveReport } from '../entities/saveReport';
import { ReportService } from '../../services/report.service';
import * as _ from 'lodash';

@Component({
  selector: 'save-report',
  templateUrl: './save-report.component.html',
  styleUrls: ['./save-report.component.css']
})

export class SaveReportComponent {

  @Output() onSuccessEvent = new EventEmitter();

  @Input() reportParameters: ReportParameters[];

  @Input() reports: Report[];

  saveReport: SaveReport;

  isReportNameDuplicate: boolean;

  isReportNameInvalid: boolean;

  private customReportModel: CustomReportModel;

  constructor(private customReportService: CustomReportService, private reportService: ReportService) {
    this.customReportModel = new CustomReportModel(customReportService, reportService);
    this.saveReport = new SaveReport();
  }

  onSave() {
    if (this.saveReport && this.saveReport.reportName && this.saveReport.reportName.trim().length > 0) {
      this.isReportNameInvalid = false;
      if (this.reports)
        var rep = _.find(this.reports, (e) => e.reportName.toLowerCase() == this.saveReport.reportName.toLowerCase());

      if (rep)
        this.isReportNameDuplicate = true;
      else {
        this.saveReport.reportCriteria = this.reportParameters;
        this.customReportModel.saveReport(this.saveReport).subscribe(result => {
          let report: Report = new Report();
          report.id = result;
          report.reportName = this.saveReport.reportName;
          report.reportCriteria = this.saveReport.reportCriteria;
          this.onSuccessEvent.emit(report);
          document.getElementById('closeSaveModalBtn').click();
        })
      }
    } else {
      this.isReportNameInvalid = true;
    }
  }

  onClose() {
    this.saveReport = new SaveReport();
    this.isReportNameDuplicate = false;
    this.isReportNameInvalid = false;
  }

  checkInputValidation() {
    //check valid report name
    if (this.saveReport && this.saveReport.reportName && this.saveReport.reportName.trim().length > 0)
      this.isReportNameInvalid = false;
    else
      this.isReportNameInvalid = true;

    //check duplicate report name
    if (this.saveReport && this.saveReport.reportName && this.saveReport.reportName.trim().length > 0) {
      if (this.reports)
        var rep = _.find(this.reports, (e) => e.reportName.toLowerCase() == this.saveReport.reportName.toLowerCase());

      if (rep)
        this.isReportNameDuplicate = true;
      else
        this.isReportNameDuplicate = false;
    }
  }
}
