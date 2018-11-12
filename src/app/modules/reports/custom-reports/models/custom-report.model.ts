import { Observable } from 'rxjs/Rx';
import { CustomReportService } from "../services/custom-report.service"
import { ReportParameters } from '../entities/reportParameters';
import { Report } from '../entities/report';
import { ModifyReport } from '../entities/modifyReport';
import { SaveReport } from '../entities/saveReport';
import { ReportService } from '../../services/report.service';

export class CustomReportModel {

    private _customReportService: CustomReportService;
    private _reportService: ReportService;

    constructor(private customReportService: CustomReportService, private reportService: ReportService) {

        this._customReportService = customReportService;
        this._reportService = reportService;
    }

    getReportParameters(): Observable<ReportParameters[]> {
        return this._customReportService.getReportParameters();
    }

    getSavedReports(): Observable<Report[]> {
        return this._customReportService.getSavedReports();
    }

    saveReport(report: SaveReport): Observable<string> {
        return this._customReportService.saveReport(report);
    }

    updateReport(report: ModifyReport): Observable<boolean> {
        return this._customReportService.updateReport(report);
    }

    deleteReport(id: string): Observable<boolean> {
        return this._customReportService.deleteReport(id);
    }

    getCustomReportData() {
        return this._reportService.getLossDataJson("Overall");
    }

}