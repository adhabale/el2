import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClientWrapper } from '../../../shared/http/http-client-wrapper';
import { ReportResponse, ReportData } from '../entities/report.response';
import { ReportPayload } from '../entities/report.payload';
import { WebRequestParameter } from '../../../shared/http/web-request-parameter';
import { LocalWebStorageService } from '../../../shared/storage/local-web-storage.service';
import { SelectedSearchCriteria, Range } from '../../search/entities/search-criteria';
import * as _ from 'lodash';
import { LossAmountRange } from '../../search/entities/lossAmountRange';
import { SearchField } from '../../search/entities/search-field';



@Injectable()
export class ReportService {

  constructor(private httpClientWrapper: HttpClientWrapper, private localWebStorage: LocalWebStorageService) {
  }

  getLossDataExport(reportType: string): Observable<ReportData> {
    let reportPayload = this.getSearchCriteria();
    let webRequestParam = new WebRequestParameter(`reports/${reportType}/export`, JSON.stringify(reportPayload));
    var reportData = this.httpClientWrapper.post<ReportData>(webRequestParam);
    return reportData;
  }

  getLossDataJson(reportType: string): Observable<ReportData> {
    let reportPayload = this.getSearchCriteria();
    let webRequestParam = new WebRequestParameter(`reports/${reportType}/json`, JSON.stringify(reportPayload));
    var reportData = this.httpClientWrapper.post<ReportData>(webRequestParam);
    return reportData;
  }

  getLossData(reportType: string): Observable<ReportResponse[]> {
    let reportPayload = this.getSearchCriteria();
    let webRequestParam = new WebRequestParameter(`reports/${reportType}`, JSON.stringify(reportPayload));
    return this.httpClientWrapper.post<ReportResponse[]>(webRequestParam);
    //var reportData=this.httpClientWrapper.post<String>(webRequestParam);
    // var data=this.csvJSON(reportData);
    // return data;
    // return new Array<ReportResponse>();
  }

  csvJSON(csv) {

    csv=csv.slice(1,csv.length-1);
    var lines = csv.split("\\r\\n");

    var result: any[] = [];

    var headers = lines[0].split("|");

     if(lines[lines.length-1] == "")
      lines.splice(lines.length-1,1);

    for (var i = 1; i < lines.length; i++) {

      var obj = {};
      var currentline = lines[i].split("|");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      
      result.push(obj);
    }

    let reports: ReportResponse[] = [];
    _.each(result, (object) => {
      reports.push(this.mapToReportResponse(object))
    });

    return reports;
  }

  mapToReportResponse(o: any): ReportResponse {
    return new ReportResponse(o.ActualOEECategory, o.ActualPDLiabCategory, o.ActualTotalCategory, o.Area, o.BIClaim,
      o.CAR_OP, o.Category1, o.Category2, o.Category3, o.Cause, o.Country, o.DepthAtLoss, o.DateOfLoss, o.DepthCategoryDescription,
      o.DepthCategoryRange, o.DrillingStatus, o.Event, o.GOMArea, o.IndexedOEECategory, o.IndexedOEEClaim, o.IndexedPDLiabCategory,
      o.IndexedPDLiabClaim, o.IndexedTotalClaim, o.Location, o.LocationCode, o.LossType, o.OEEClaim, o.OnOffshore, o.PDLiabClaim,
      o.PTD, o.RatingArea, o.TotalClaim, o.UGBO, o.UpDownStream, o.WellType, o.DisplayOrder, o.IndexedTotalCategory);
  }

  getSearchCriteria() {

    let reportPayload = new ReportPayload();

    let selectedSearchCriteria = this.localWebStorage.get<SelectedSearchCriteria>("searchCriteria");

    if (selectedSearchCriteria) {

      if (selectedSearchCriteria.yearOfLoss && selectedSearchCriteria.yearOfLoss.length > 0)
        reportPayload.yearOfLoss = this.filterNullValue(selectedSearchCriteria.yearOfLoss, "value");

      if (selectedSearchCriteria.area && selectedSearchCriteria.area.length > 0)
        reportPayload.area = this.filterNullValue(selectedSearchCriteria.area, "id");

      if (selectedSearchCriteria.country && selectedSearchCriteria.country.length > 0) {

        let itemsWithoutNull = _.filter(selectedSearchCriteria.country, e => { return e.id != null });

        if (itemsWithoutNull && itemsWithoutNull.length > 0)
          reportPayload.country = _.map(itemsWithoutNull, "id");
      }

      if (selectedSearchCriteria.location)
        reportPayload.location = selectedSearchCriteria.location;

      if (selectedSearchCriteria.gomArea && selectedSearchCriteria.gomArea.length > 0)
        reportPayload.gomArea = this.filterNullValue(selectedSearchCriteria.gomArea, "id");

      if (selectedSearchCriteria.usLocationCode && selectedSearchCriteria.usLocationCode.length > 0)
        reportPayload.usLocationCode = this.filterNullValue(selectedSearchCriteria.usLocationCode, "id");

      if (selectedSearchCriteria.landOffShore && selectedSearchCriteria.landOffShore.id) {
        reportPayload.landOffshore = [];
        reportPayload.landOffshore.push(selectedSearchCriteria.landOffShore.id);
      }

      if (selectedSearchCriteria.category1 && selectedSearchCriteria.category1.length > 0)
        reportPayload.category1 = this.filterNullValue(selectedSearchCriteria.category1, "id");

      if (selectedSearchCriteria.category2 && selectedSearchCriteria.category2.length > 0)
        reportPayload.category2 = this.filterNullValue(selectedSearchCriteria.category2, "id");

      if (selectedSearchCriteria.category3 && selectedSearchCriteria.category3.length > 0)
        reportPayload.category3 = this.filterNullValue(selectedSearchCriteria.category3, "id");

      if (selectedSearchCriteria.car_op && selectedSearchCriteria.car_op.length > 0)
        reportPayload.car_op = this.filterNullValue(selectedSearchCriteria.car_op, "id");

      if (selectedSearchCriteria.lossType && selectedSearchCriteria.lossType.length > 0)
        reportPayload.lossType = this.filterNullValue(selectedSearchCriteria.lossType, "id");

      if (selectedSearchCriteria.cause && selectedSearchCriteria.cause.length > 0)
        reportPayload.cause = this.filterNullValue(selectedSearchCriteria.cause, "id");

      if (selectedSearchCriteria.upDownPower && selectedSearchCriteria.upDownPower.length > 0)
        reportPayload.upDownPower = this.filterNullValue(selectedSearchCriteria.upDownPower, "id");

      if (selectedSearchCriteria.event && selectedSearchCriteria.event.length > 0)
        reportPayload.event = this.filterNullValue(selectedSearchCriteria.event, "id");

      if (selectedSearchCriteria.pdClaim && (selectedSearchCriteria.pdClaim.min || selectedSearchCriteria.pdClaim.max))
        reportPayload.pdclaim = selectedSearchCriteria.pdClaim;

      if (selectedSearchCriteria.oeeClaim && (selectedSearchCriteria.oeeClaim.min || selectedSearchCriteria.oeeClaim.max))
        reportPayload.oeeclaim = selectedSearchCriteria.oeeClaim;

      if (selectedSearchCriteria.biClaim && (selectedSearchCriteria.biClaim.min || selectedSearchCriteria.biClaim.max))
        reportPayload.biclaim = selectedSearchCriteria.biClaim;

      if (selectedSearchCriteria.totalClaim && (selectedSearchCriteria.totalClaim.min || selectedSearchCriteria.totalClaim.max))
        reportPayload.totalClaim = selectedSearchCriteria.totalClaim;

      if (selectedSearchCriteria.totalIndexedClaim && (selectedSearchCriteria.totalIndexedClaim.min || selectedSearchCriteria.totalIndexedClaim.max))
        reportPayload.totalIndexedClaim = selectedSearchCriteria.totalIndexedClaim;

      if (selectedSearchCriteria.ratingAreas && selectedSearchCriteria.ratingAreas.length > 0)
        reportPayload.ratingArea = this.filterNullValue(selectedSearchCriteria.ratingAreas, "id");

      if (selectedSearchCriteria.wellTypes && selectedSearchCriteria.wellTypes.length > 0)
        reportPayload.wellType = this.filterNullValue(selectedSearchCriteria.wellTypes, "id");

      if (selectedSearchCriteria.drillingStatues && selectedSearchCriteria.drillingStatues.length > 0)
        reportPayload.drillingStatus = this.filterNullValue(selectedSearchCriteria.drillingStatues, "id");

      if (selectedSearchCriteria.ugbo && selectedSearchCriteria.ugbo.length > 0)
        reportPayload.ugbo = this.filterNullValue(selectedSearchCriteria.ugbo, "id");

      if (selectedSearchCriteria.depthCategories && selectedSearchCriteria.depthCategories.length > 0) {

        let itemsWithoutNull = _.filter(selectedSearchCriteria.depthCategories, e => { return e.id != null });

        if (itemsWithoutNull && itemsWithoutNull.length > 0)
          reportPayload.depthCategory = _.map(itemsWithoutNull, "id");
      }

      if (selectedSearchCriteria.ptd && (selectedSearchCriteria.ptd.min || selectedSearchCriteria.ptd.max))
        reportPayload.ptd = selectedSearchCriteria.ptd;

      if (selectedSearchCriteria.actualPDLiabCategory && selectedSearchCriteria.actualPDLiabCategory.length > 0)
        reportPayload.actualPDLiabCategory = this.getMinAndMaxValues(selectedSearchCriteria.actualPDLiabCategory);

      if (selectedSearchCriteria.actualOEECategory && selectedSearchCriteria.actualOEECategory.length > 0)
        reportPayload.actualOEECategory = this.getMinAndMaxValues(selectedSearchCriteria.actualOEECategory);

      if (selectedSearchCriteria.actualTotalCategory && selectedSearchCriteria.actualTotalCategory.length > 0)
        reportPayload.actualTotalCategory = this.getMinAndMaxValues(selectedSearchCriteria.actualTotalCategory);

      if (selectedSearchCriteria.indexedPDLiabCategory && selectedSearchCriteria.indexedPDLiabCategory.length > 0)
        reportPayload.indexedPDLiabCategory = this.getMinAndMaxValues(selectedSearchCriteria.indexedPDLiabCategory);

      if (selectedSearchCriteria.indexedOEECategory && selectedSearchCriteria.indexedOEECategory.length > 0)
        reportPayload.indexedOEECategory = this.getMinAndMaxValues(selectedSearchCriteria.indexedOEECategory);

      if (selectedSearchCriteria.indexedTotalCategory && selectedSearchCriteria.indexedTotalCategory.length > 0)
        reportPayload.indexedTotalCategory = this.getMinAndMaxValues(selectedSearchCriteria.indexedTotalCategory);
    }

    return reportPayload;
  }

  private filterNullValue(items: SearchField[], fieldName: string) {

    let itemsWithoutNull = _.filter(items, e => { return e[fieldName] != null });

    if (itemsWithoutNull && itemsWithoutNull.length > 0) {
      return _.map(itemsWithoutNull, fieldName);
    }

    return null;
  }

  private getMinAndMaxValues(items: LossAmountRange[]) {

    let tempItems = _.filter(items, e => e.id != null);

    if (tempItems.length == 0)
      return null;

    let lossAmountRange = [];
    _.each(tempItems, (item) => {
      let range = new Range();
      range.min = item.minValue;
      range.max = item.maxValue;
      lossAmountRange.push(range);
    });

    return lossAmountRange;
  }

  getPDFdocument(reportContent,allTableItems, reportTitle, reportFilter): Observable<any> {
    let filter: string = this.getFormattedReportFilter(reportFilter);
  var total=[];
    let length=allTableItems.tableRows.length;
    if(allTableItems.tableRows[length-1].rowType=='TotalRow') {
      for(let i in allTableItems.tableRows[length-1].tableCells) {
        var totalObj={};
        for(let j in allTableItems.tableColumns) {
          if(allTableItems.tableColumns[j] && allTableItems.tableRows[length-1].tableCells[j].value)
          totalObj[allTableItems.tableColumns[j]] = allTableItems.tableRows[length-1].tableCells[j].value;
        }
        total.push(totalObj);
        break;
      }
    }
    let body = {
      'ReportContent': JSON.stringify(reportContent),
      'ReportTitle': reportTitle,
      'ReportFilter': filter,
      'ReportTotal' : JSON.stringify(total)
    }
    let webRequestParam = new WebRequestParameter('documents/pdf', JSON.stringify(body));
    return this.httpClientWrapper.post<ReportResponse[]>(webRequestParam);
  }

  getFormattedReportFilter(reportFilter) {
    let filter: string = '';
    if (reportFilter) {
      if (reportFilter.yearOfLoss && reportFilter.yearOfLoss.length > 0) {
        filter = filter.concat('Year Of Loss : ');
        _.each(reportFilter.yearOfLoss, (e, index) => {
          if (parseInt(index) < (reportFilter.yearOfLoss.length - 1))
            filter = filter.concat(e.value + ', ');
          else
            filter = filter.concat(e.value + '    ');
        })
      }
      if (reportFilter.area && reportFilter.area.length > 0 && reportFilter.area[0].displayName!='All Areas') {
        filter = filter.concat('Area : ');
        _.each(reportFilter.area, (e, index) => {
          if (parseInt(index) < (reportFilter.area.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.country && reportFilter.country.length > 0 && reportFilter.country[0].displayName!='All Countries') {
        filter = filter.concat('Country : ');
        _.each(reportFilter.country, (e, index) => {
          if (parseInt(index) < (reportFilter.country.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.location) {
        filter = filter.concat('Location : ' + reportFilter.location + '  ');
      }
      if (reportFilter.gomArea && reportFilter.gomArea.length > 0 && reportFilter.gomArea[0].displayName!='All GOM Areas') {
        filter = filter.concat('GOM Area : ');
        _.each(reportFilter.gomArea, (e, index) => {
          if (parseInt(index) < (reportFilter.gomArea.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.usLocationCode && reportFilter.usLocationCode.length > 0  && reportFilter.usLocationCode[0].displayName!='All US Location Codes') {
        filter = filter.concat('US Location Code : ');
        _.each(reportFilter.usLocationCode, (e, index) => {
          if (parseInt(index) < (reportFilter.usLocationCode.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.landOffShore && reportFilter.landOffShore.displayName!='Either') {
        filter = filter.concat('Land/Offshore : ' + reportFilter.landOffShore.displayName + '  ');
      }
      if (reportFilter.category1 && reportFilter.category1.length > 0  && reportFilter.category1[0].displayName!='All Categories') {
        filter = filter.concat('Category1 : ');
        _.each(reportFilter.category1, (e, index) => {
          if (parseInt(index) < (reportFilter.category1.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.category2 && reportFilter.category2.length > 0 && reportFilter.category2[0].displayName!='All Categories') {
        filter = filter.concat('Category2 : ');
        _.each(reportFilter.category2, (e, index) => {
          if (parseInt(index) < (reportFilter.category2.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.category3 && reportFilter.category3.length > 0 && reportFilter.category3[0].displayName!='All Categories') {
        filter = filter.concat('Category3 : ');
        _.each(reportFilter.category3, (e, index) => {
          if (parseInt(index) < (reportFilter.category3.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.car_op && reportFilter.car_op.length > 0 && reportFilter.car_op[0].displayName!='Either') {
        filter = filter.concat('CAR/OP : ');
        _.each(reportFilter.car_op, (e, index) => {
          if (parseInt(index) < (reportFilter.car_op.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.lossType && reportFilter.lossType.length > 0  && reportFilter.lossType[0].displayName!='All Types') {
        filter = filter.concat('Loss Type : ');
        _.each(reportFilter.lossType, (e, index) => {
          if (parseInt(index) < (reportFilter.lossType.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.cause && reportFilter.cause.length > 0  && reportFilter.cause[0].displayName!='All Causes') {
        filter = filter.concat('Causes : ');
        _.each(reportFilter.cause, (e, index) => {
          if (parseInt(index) < (reportFilter.cause.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.upDownPower && reportFilter.upDownPower.length > 0  && reportFilter.upDownPower[0].displayName!='All Up/Down/Power') {
        filter = filter.concat('Up/Down/Power : ');
        _.each(reportFilter.upDownPower, (e, index) => {
          if (parseInt(index) < (reportFilter.upDownPower.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.event && reportFilter.event.length > 0  && reportFilter.event[0].displayName!='All Events') {
        filter = filter.concat('Event : ');
        _.each(reportFilter.event, (e, index) => {
          if (parseInt(index) < (reportFilter.event.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.pdClaim.min ) {
        filter = filter.concat('PD Claim Min: ' + reportFilter.pdClaim.min + '  ');
      }
      if (reportFilter.pdClaim.max) {
        filter = filter.concat('PD Claim Max: ' + reportFilter.pdClaim.max + '  ');
      }
      if (reportFilter.oeeClaim.min) {
        filter = filter.concat('OEE Claim Min: ' + reportFilter.oeeClaim.min + '  ');
      }
      if (reportFilter.oeeClaim.max) {
        filter = filter.concat('OEE Claim Max: ' + reportFilter.oeeClaim.max + '  ');
      }
      if (reportFilter.biClaim.min) {
        filter = filter.concat('BI Claim Min: ' + reportFilter.biClaim.min + '  ');
      }
      if (reportFilter.biClaim.max) {
        filter = filter.concat('BI Claim Max: ' + reportFilter.biClaim.max + '  ');
      }
      if (reportFilter.totalClaim.min) {
        filter = filter.concat('Total Claim Min: ' + reportFilter.totalClaim.min + '  ');
      }
      if (reportFilter.totalClaim.max) {
        filter = filter.concat('Total Claim Max: ' + reportFilter.totalClaim.max + '  ');
      }
      if (reportFilter.totalIndexedClaim.min) {
        filter = filter.concat('Total Indexed Claim Min: ' + reportFilter.totalIndexedClaim.min + '  ');
      }
      if (reportFilter.totalIndexedClaim.max) {
        filter = filter.concat('Total Indexed Claim Max: ' + reportFilter.totalIndexedClaim.max + '  ');
      }
      if (reportFilter.ratingAreas && reportFilter.ratingAreas.length > 0 && reportFilter.ratingAreas[0].displayName!='All Areas') {
        filter = filter.concat('Rating Area : ');
        _.each(reportFilter.ratingAreas, (e, index) => {
          if (parseInt(index) < (reportFilter.ratingAreas.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.wellTypes && reportFilter.wellTypes.length > 0 && reportFilter.wellTypes[0].displayName!='All Types') {
        filter = filter.concat('Well Types : ');
        _.each(reportFilter.wellTypes, (e, index) => {
          if (parseInt(index) < (reportFilter.wellTypes.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.drillingStatues && reportFilter.drillingStatues.length > 0 && reportFilter.drillingStatues[0].displayName!='All Status') {
        filter = filter.concat('Drilling Status : ');
        _.each(reportFilter.drillingStatues, (e, index) => {
          if (parseInt(index) < (reportFilter.drillingStatues.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.ugbo && reportFilter.ugbo.length > 0 && reportFilter.ugbo[0].displayName!='Either') {
        filter = filter.concat('UGBO : ');
        _.each(reportFilter.ugbo, (e, index) => {
          if (parseInt(index) < (reportFilter.ugbo.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.depthCategories && reportFilter.depthCategories.length > 0 && reportFilter.depthCategories[0].displayName!='All Categories') {
        filter = filter.concat('Depth Category : ');
        _.each(reportFilter.depthCategories, (e, index) => {
          if (parseInt(index) < (reportFilter.depthCategories.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.ptd.min) {
        filter = filter.concat('PTD Min : ' + reportFilter.ptd.min + '  ');
      }
      if (reportFilter.ptd.max) {
        filter = filter.concat('PTD Max: ' + reportFilter.ptd.max + '  ');
      }
      if (reportFilter.actualPDLiabCategory && reportFilter.actualPDLiabCategory.length > 0 && reportFilter.actualPDLiabCategory[0].displayName!='All Categories') {
        filter = filter.concat('PD Claim-Actual : ');
        _.each(reportFilter.actualPDLiabCategory, (e, index) => {
          if (parseInt(index) < (reportFilter.actualPDLiabCategory.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.actualOEECategory && reportFilter.actualOEECategory.length > 0 && reportFilter.actualOEECategory[0].displayName!='All Categories') {
        filter = filter.concat('OEE Claim-Actual : ');
        _.each(reportFilter.actualOEECategory, (e, index) => {
          if (parseInt(index) < (reportFilter.actualOEECategory.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.actualTotalCategory && reportFilter.actualTotalCategory.length > 0 && reportFilter.actualTotalCategory[0].displayName!='All Categories') {
        filter = filter.concat('Total Claim-Actual : ');
        _.each(reportFilter.actualTotalCategory, (e, index) => {
          if (parseInt(index) < (reportFilter.actualTotalCategory.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.indexedPDLiabCategory && reportFilter.indexedPDLiabCategory.length > 0 && reportFilter.indexedPDLiabCategory[0].displayName!='All Categories') {
        filter = filter.concat('PD Claim-Indexed : ');
        _.each(reportFilter.indexedPDLiabCategory, (e, index) => {
          if (parseInt(index) < (reportFilter.indexedPDLiabCategory.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.indexedOEECategory && reportFilter.indexedOEECategory.length > 0 && reportFilter.indexedOEECategory[0].displayName!='All Categories') {
        filter = filter.concat('OEE Claim-Indexed : ');
        _.each(reportFilter.indexedOEECategory, (e, index) => {
          if (parseInt(index) < (reportFilter.indexedOEECategory.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
      if (reportFilter.indexedTotalCategory && reportFilter.indexedTotalCategory.length > 0 && reportFilter.indexedTotalCategory[0].displayName!='All Categories') {
        filter = filter.concat('Total Claim-Indexed : ');
        _.each(reportFilter.indexedTotalCategory, (e, index) => {
          if (parseInt(index) < (reportFilter.indexedTotalCategory.length - 1))
            filter = filter.concat(e.displayName + ', ');
          else
            filter = filter.concat(e.displayName + '    ');
        })
      }
    }
    return filter;
  }
}
