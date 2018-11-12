import { Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.services';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { DownloadFileService } from '../../shared/download-file/download-file.service';
import { Announcement } from './entity/announcement';
import { Document } from './entity/document';
import { HomeModel } from './models/home.model';
import * as FileSaver from 'file-saver';
import * as _ from 'lodash';
import { forkJoin } from "rxjs/observable/forkJoin";


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private _homeModel: HomeModel;
  announcements: Announcement[];
  documents: Document[];
  contactsUsUrl: string;
  serviceDeskUrl: string;
moduleName:string='home'
  constructor(
    private homeService: HomeService, private configurationService: ConfigurationService, private downloadFileService: DownloadFileService) {
    this._homeModel = new HomeModel(homeService);
  }

  ngOnInit() {
    this.getAll();
    this.contactsUsUrl = this.configurationService.contactUsUrl;
    this.serviceDeskUrl = this.configurationService.serviceDeskUrl;
  }


  getAll() {

    let announcement = this._homeModel.getAnnouncements();
    let document = this._homeModel.getDocuments();

    forkJoin([announcement, document]).subscribe(results => {
      // this.announcements = results[0];
      this.announcements = _.orderBy(results[0]).reverse();
      console.log(results[1])
      this.documents = _.orderBy(results[1], ['createdDate'], ['desc']);
    });

  }


  downloadDocument(document: Document) {

    this._homeModel.getDocumentContent(document.filename).subscribe(result => {
      this._homeModel.logGetDocument(document.filename,this.moduleName).subscribe(res=>{})

      this.downloadFileService.fetchFile(result);

    })
  }

  logContactUs(isServiceDesk) {
    let email: any;
    email = new Object();
    if (isServiceDesk) {
      email.email = this.serviceDeskUrl;
    }
    else {
      email.email = this.contactsUsUrl;
    }
    this._homeModel.logContactUs(email).subscribe(response => {

    })
  }

}
