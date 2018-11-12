import { Injectable } from "@angular/core";
import { ChartFilter } from "./entities/chart-filter";
import { Observable } from 'rxjs/Rx';
import { HttpClientWrapper } from "../../shared/http/http-client-wrapper";
import { WebRequestParameter } from "../../shared/http/web-request-parameter";
import { ChartLookup } from "./entities/chart-lookup";
import { ChartData } from "../../user-controls/chart/entities/chart-data";
import { GeographicData } from "./entities/geographic-data";

@Injectable()
export class LossDataDashboardService {

    constructor(private httpClientWrapper: HttpClientWrapper) {
    }

    getLossesByYearFilters(): Observable<ChartLookup> {
        const webRequestParam = new WebRequestParameter("loss-data/lossesByYearFilters");
        return this.httpClientWrapper.get<ChartLookup>(webRequestParam);
    }

    getIncidentByYearFilters(): Observable<ChartLookup> {
        const webRequestParam = new WebRequestParameter("loss-data/incidentByYearFilters");
        return this.httpClientWrapper.get<ChartLookup>(webRequestParam);
    }

    getMajorLossesByYearFilters(): Observable<ChartLookup> {
        const webRequestParam = new WebRequestParameter("loss-data/majorLossesByYearFilters");
        return this.httpClientWrapper.get<ChartLookup>(webRequestParam);
    }

    getIncidentByCategoryFilters(): Observable<ChartLookup> {
        const webRequestParam = new WebRequestParameter("loss-data/incidentByCategoryFilters");
        return this.httpClientWrapper.get<ChartLookup>(webRequestParam);
    }

    getLossesByYear(chartFilter: ChartFilter): Observable<ChartData> {
        let url = `loss-data/lossesByYear?fromYear=${chartFilter.fromYear}&toYear=${chartFilter.toYear}&isAreaSelected=${chartFilter.isAreaSelected}`;
        if(chartFilter.areaId != null){
            url = `${url}&areaId=${chartFilter.areaId}`;
        }
        if (chartFilter.upDownPowerStreamId != null) {
            url = `${url}&upDownPowerStreamId=${chartFilter.upDownPowerStreamId}`;
        }

        const webRequestParam = new WebRequestParameter(url);
        return this.httpClientWrapper.get<ChartData>(webRequestParam);
    }

    getIncidentByYear(chartFilter: ChartFilter): Observable<ChartData> {
        let url = `loss-data/incidentByYear?fromYear=${chartFilter.fromYear}&toYear=${chartFilter.toYear}&isAreaSelected=${chartFilter.isAreaSelected}`;

        if(chartFilter.areaId != null){
            url = `${url}&areaId=${chartFilter.areaId}`;
        }
        if (chartFilter.upDownPowerStreamId != null) {
            url = `${url}&upDownPowerStreamId=${chartFilter.upDownPowerStreamId}`;
        }

        const webRequestParam = new WebRequestParameter(url);
        return this.httpClientWrapper.get<ChartData>(webRequestParam);
    }

    getMajorLossesByYear(chartFilter: ChartFilter): Observable<ChartData> {
        let url = `loss-data/majorLossesByYear?fromYear=${chartFilter.fromYear}&toYear=${chartFilter.toYear}&majorIncidentLossValue=${chartFilter.majorIncidentLossValue}`;
        if(chartFilter.areaId != null){
            url = `${url}&areaId=${chartFilter.areaId}`;
        }
        if (chartFilter.upDownPowerStreamId != null) {
            url = `${url}&upDownPowerStreamId=${chartFilter.upDownPowerStreamId}`;
        }

        const webRequestParam = new WebRequestParameter(url);
        return this.httpClientWrapper.get<ChartData>(webRequestParam);
    }

    getIncidentByCategory(chartFilter: ChartFilter): Observable<any> {

        let url = `loss-data/incidentByCategory?fromYear=${chartFilter.fromYear}&toYear=${chartFilter.toYear}&upDownPowerStreamId=${chartFilter.upDownPowerStreamId}&isCategory1Selected=${chartFilter.isCategory1Selected}`;

        if (chartFilter.isCategory1Selected && chartFilter.category1 != null) {
            url = `${url}&category1=${chartFilter.category1}`;
        }
        else if (chartFilter.category2 != null) {
            url = `${url}&category2=${chartFilter.category2}`;
        }

        const webRequestParam = new WebRequestParameter(url);
        return this.httpClientWrapper.get<any>(webRequestParam);
    }

    getLossesByLocation(): Observable<GeographicData[]> {
        const webRequestParam = new WebRequestParameter("loss-data/lossesByLocation");
        return this.httpClientWrapper.get<GeographicData[]>(webRequestParam);
    }

    logDashboardData(details: any): Observable<any> {
        const webRequestParam = new WebRequestParameter("audit/loss-data", JSON.stringify(details));
        return this.httpClientWrapper.post<any[]>(webRequestParam);
    }
}
