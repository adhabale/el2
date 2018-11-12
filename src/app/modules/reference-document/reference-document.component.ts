import { Component, OnInit } from '@angular/core';
import { ConfirmationModal } from './entities/confirmation-modal';
import { ReferenceDocumentModel } from '././models/referenceDocument.model';
import { NotificationMessage } from '../common/entity/notification-message';
import { Router } from "@angular/router";
import { ReferenceDocument } from './entities/reference-document';
import { ReferenceDocumentService } from './services/reference-document.service';
import { DownloadFileService } from '../../shared/download-file/download-file.service';
import * as _ from 'lodash';
import { HomeService } from '../home/services/home.services';

@Component({
  selector: 'app-reference-document',
  templateUrl: './reference-document.component.html',
  styleUrls: ['./reference-document.component.css']
})
export class ReferenceDocumentComponent implements OnInit {
  confirmationModal: ConfirmationModal;
  refDoc: Array<any>;
  notificationMessage: NotificationMessage = new NotificationMessage();
  referenceDocumentModel: ReferenceDocumentModel;
  documents: ReferenceDocument[];
  allDocuments: ReferenceDocument[];
  referenceDocument: ReferenceDocument = new ReferenceDocument();
  modalHeader: string = "";
  typeFlag: boolean;
  titleFlag: boolean;
  logged: any;
  moduleName:string='reference-document'
  constructor(private referenceDocumentService: ReferenceDocumentService,  private homeService: HomeService,private downloadFileService: DownloadFileService) {
    this.referenceDocumentModel = new ReferenceDocumentModel(referenceDocumentService);
    this.confirmationModal = new ConfirmationModal();
    this.confirmationModal.headerMessage = '';
    this.confirmationModal.bodyMessage = '';
  }
  ngOnInit() {

    this.getAllDocuments();
  }

  getAllDocuments() {
    this.referenceDocumentModel.getAllDocuments().subscribe(res => {
      let oldData = JSON.stringify(res).replace(/application\//g, '');
      this.allDocuments = JSON.parse(oldData);
       this.allDocuments = _.orderBy(this.allDocuments, ['createdDate'], ['desc']);

    })
  }
  openDocumentUploadModal() {
    this.modalHeader = "New ";
    this.referenceDocument = new ReferenceDocument();
    document.getElementById('uploadReferenceDocumentsModalBtn').click();
  }
  onEdit(refDoc: ReferenceDocument) {
    this.modalHeader = "Edit ";
    this.referenceDocument = refDoc;
    this.notificationMessage = new NotificationMessage();
    document.getElementById('uploadReferenceDocumentsModalBtn').click();
  }
  onDelete(refDoc: ReferenceDocument) {
    document.getElementById('deleteBtn').click();
    this.notificationMessage = new NotificationMessage();
    //this._referenceDocumentModel.setReferenceDocumentDetails(this.refDoc);
    this.confirmationModal.headerMessage = 'Delete Document';
    this.confirmationModal.bodyMessage = 'Are you sure you want to delete ' + refDoc.title + ' ?';
    this.referenceDocument = refDoc;
  }

  deleteDocument() {
    this.referenceDocumentModel.deleteDocument(this.referenceDocument.filename, this.referenceDocument.title).subscribe(res => {

      this.referenceDocumentModel.logDeleteDocument(this.referenceDocument.title, this.referenceDocument.contentType).subscribe(response => {
        this.logged = response;
      });
      this.getAllDocuments();
      this.notificationMessage.successMessage = "Document " + this.referenceDocument.title + " Deleted";
      this.referenceDocument = new ReferenceDocument();
    });
  }
  onSuccess(message: string) {
    this.notificationMessage.successMessage = message;
    this.getAllDocuments();
    this.referenceDocument = new ReferenceDocument();
  }

  downloadDocument(document: ReferenceDocument) {

    this.referenceDocumentModel.getDocumentContent(document.filename).subscribe(result => {
      this.homeService.logGetDocument(document.filename,this.moduleName).subscribe(res=>{})

      this.downloadFileService.fetchFile(result);

    })
  }

  onError(message: string) {
    this.notificationMessage.errorMessage = message;
  }

  onClose(): void {
    this.referenceDocument = new ReferenceDocument();
  }

  sortByType() {
    this.titleFlag = false;
    if (this.typeFlag) {
      this.allDocuments = _.orderBy(this.allDocuments, ['contentType'], ['desc']);
      this.typeFlag = !this.typeFlag;
    }
    else {
      this.allDocuments = _.orderBy(this.allDocuments, ['contentType'], ['asc']);
      this.typeFlag = !this.typeFlag;
    }
  }

  sortByTitle() {
    this.typeFlag = false;
    if (this.titleFlag) {
      this.allDocuments = _.orderBy(this.allDocuments, ['title'], ['desc']);
      this.titleFlag = !this.titleFlag;
    }
    else {
      this.allDocuments = _.orderBy(this.allDocuments, ['title'], ['asc']);
      this.titleFlag = !this.titleFlag;
    }
  }

  onPageChange(pageItem) {
    setTimeout(() => {
      this.documents = pageItem;
      //this.loaderService.hide();
    });
  }
}
