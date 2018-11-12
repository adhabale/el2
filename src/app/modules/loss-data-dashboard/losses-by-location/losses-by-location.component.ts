import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { GeographicData } from '../entities/geographic-data';
import { LossDataDashboardService } from '../loss-data-dashboard.service';
import * as _ from 'lodash';
import { Action } from 'rxjs/scheduler/Action';
import * as html2canvas from 'html2canvas';
import { Attribute } from '@angular/compiler';
import canvg from 'canvg-browser';
import { DecimalPipe } from '@angular/common';
import { isNumeric } from "rxjs/util/isNumeric";

@Component({
    selector: 'losses-by-location',
    templateUrl: './losses-by-location.component.html',
    styleUrls: ['./losses-by-location.component.css'],
    providers: [DecimalPipe]
})

export class LossesByLocationComponent implements OnInit {

    geographicData: GeographicData[];

    @Output() mapLoaded = new EventEmitter<boolean>();

    @ViewChild('mapViewNode') private mapViewEl: ElementRef;
    year: number

    constructor(private dp: DecimalPipe, private lossDataDashboardService: LossDataDashboardService) {
    }

    ngOnInit() {
        this.getLossesByLocation();
        this.year = new Date().getFullYear();
    }

    private getLossesByLocation() {

        this.lossDataDashboardService.getLossesByLocation()
            .subscribe((response) => {
                this.geographicData = response;
                this.geographicData.forEach(x => {
                    x.value = this.transform(x.value);
                })
                this.loadMap();
            });
    }

    private loadMap() {

        loadModules([
            'esri/Map',
            'esri/views/MapView',
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/Graphic",
            "esri/widgets/Popup",
            "esri/widgets/Attribution",
            "dojo/_base/array",
            "dojo/dom-style",
            "esri/widgets/Print",
            "esri/WebMap",
            "esri/widgets/Legend",
            "esri/widgets/Expand",
            "dojo/dom",
            "dijit/form/Button",
            "dojo/domReady!",
            "esri/widgets/Widget",
            "esri/tasks/PrintTask"
        ])
            .then(([EsriMap,
                EsriMapView,
                EsriPoint,
                SimpleMarkerSymbol,
                Graphic,
                Popup,
                Attribution,
                arrayUtils,
                domStyle, Print, WebMap, Legend, Expand, dom, Button, PrintTask]) => {

                const mapProperties: esri.MapProperties = {
                    basemap: "osm"
                };

                let map: esri.Map = new EsriMap(mapProperties);

                const mapViewProperties: esri.MapViewProperties = {
                    container: this.mapViewEl.nativeElement,
                    map: map,
                    zoom: 2,
                    constraints: {
                        maxZoom: 2
                    },
                    popup: {
                        autoCloseEnabled: true,
                        dockOptions: {
                            buttonEnabled: false
                        },
                    }
                };

                let mapView: esri.MapView = new EsriMapView(mapViewProperties);
                let list: any[] = [];
                let size: number = 5;

                function mapLoaded(geographicData) {

                    arrayUtils.forEach(geographicData, function (point: GeographicData) {

                        let item = _.find(list, (e) => { return e.value == point.value });
                        if (item == null) {
                            size = size + 0.5;
                            item = { value: point.value, size: `${size}px` };
                            list.push(item);
                        }
                        var graphic = new Graphic({
                            geometry: new EsriPoint([point.longitude, point.latitude]),
                            symbol: createSymbol(item.size),
                            attributes: {
                                "Total Actual Losses": point.value,
                                "Location": point.location
                            },

                            popupTemplate: {
                                title: "",
                                content: [{
                                    type: "fields",
                                    fieldInfos: [
                                        {
                                            fieldName: "Total Actual Losses"
                                        },
                                        {
                                            fieldName: "Location"
                                        }
                                    ]
                                }]
                            }

                        });

                        mapView.graphics.add(graphic);
                    });
                }

                function createSymbol(size) {

                    let symbol: any = {
                        type: "simple-marker",
                        style: "circle",
                        color: "black",
                        size: size,
                        outline: {
                            color: [255, 255, 255]
                        }
                    };

                    return symbol;
                }

                mapView.when(() => {
                    var date = new Date();
                    var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    var month = monthArray[date.getMonth()];

                    mapLoaded(this.geographicData);
                    mapView.ui.remove(["attribution"]);
                });
                this.mapLoaded.emit(true);
            }, err => {
                console.error(err);
            });
    }

    transform(value: any): any {

        if (isNumeric(value))
          return this.dp.transform(value);
    
        return value;
      }    

    //below exportGraph() method is obsolete
    exportGraph() {
        var date = new Date();
        var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var month = monthArray[date.getMonth()];
        html2canvas(document.getElementById('map'),
            {
                useCORS: true,
                allowTaint: false,
                logging: false,
            }).then(function (canvas) {
                var ctx = canvas.getContext("2d");
                var filename = "Total losses By location_" + date.getDate() + '_' + month + '_' + date.getFullYear() + '_' + date.getHours() + '_' + date.getMinutes();
                if (canvas.msToBlob) { //for IE
                    var blob = canvas.msToBlob();
                    window.navigator.msSaveBlob(blob, filename + '.jpg');
                }
                else {
                    var a = document.createElement('a');
                    a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                    a.download = filename + '.jpg';
                    a.click();
                }
            });
    }

}


