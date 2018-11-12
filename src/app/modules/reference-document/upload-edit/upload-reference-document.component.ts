import { Component, EventEmitter, Output, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReferenceDocument } from '../entities/reference-document';
import { ReferenceDocumentModel } from '../models/referenceDocument.model';
import { ReferenceDocumentService } from '../services/reference-document.service';

@Component({
  selector: 'upload-reference-document',
  templateUrl: './upload-reference-document.component.html',
  styleUrls: ['./upload-reference-document.component.css']
})
export class UploadReferenceDocumentComponent implements OnDestroy {
  @Output() onSaveEvent = new EventEmitter();
  @Output() onCloseEvent = new EventEmitter();
  @Output() onErrorEvent = new EventEmitter();
  @Input() document: ReferenceDocument;
  @Input() modalHeader: string;

  referenceDocumentModel: ReferenceDocumentModel;
  file: File;
  isInvalid: boolean;
  errMsg: string = "";


  constructor(private referenceDocumentService: ReferenceDocumentService) {
    this.referenceDocumentModel = new ReferenceDocumentModel(referenceDocumentService);
  }
  onSave(): void {

    if (this.checkValidation()) {
      this.isInvalid = true;
      this.errMsg = "Please select file/name the document before upload";
    }
    else {

      if (this.document.filename == undefined) {

        setTimeout(() => {

          this.referenceDocumentModel.addDocument(this.document).subscribe(result => {
            this.onSaveEvent.emit(this.document.title + " uploaded successfully");
            this.document = new ReferenceDocument();
          });

        }, 2000)

      }

      else {

        setTimeout(() => {

          this.referenceDocumentModel.updateDocument(this.document).subscribe(result => {
            this.onSaveEvent.emit(this.document.title + " updated successfully");
            this.document = new ReferenceDocument();
          });

        }, 2000)

      }

    }



  }
  onError(): void {
    this.onErrorEvent.emit("Error in uploading document");
  }

  onClose(): void {
    this.document = new ReferenceDocument();
    this.isInvalid = false;
    this.onCloseEvent.emit();
  }

  fileUpload(event: EventTarget) {

    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;

    this.file = files[0];
    /* if(this.document.title==undefined || this.document.title=="")
    this.document.title = this.file.name; */

    //this.document.contentType = this.file.type;
    if ((this.file.size / 1024 / 1024) > 10) {

      this.isInvalid = true;
      this.errMsg = "Max File Size Exceeds";
    }
    else {
      this.isInvalid = false;
      var fileExtension = this.file.name.split('.')[this.file.name.split('.').length - 1].toLowerCase();

      if (fileExtension == "pdf" || fileExtension == "xlsx" || fileExtension == "docx" || fileExtension == "pptx") {
        this.document.title = this.file.name;
        this.document.contentType = "application/" + fileExtension.toUpperCase();
        var reader = new FileReader();
        var fileByteArray = [];
        reader.readAsArrayBuffer(this.file);
        reader.onloadend = function (evt: any) {
          if (evt.target.readyState == reader.DONE) {
            var arrayBuffer = evt.target.result,
              array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < array.length; i++) {
              fileByteArray.push(array[i]);
            }
          }
        }

        this.document.content = fileByteArray;
      }
      else {
        this.isInvalid = true;
        this.errMsg = "Current file format not supported. Supported file formats are - .docx, .xlsx, .pptx, and .pdf";
      }
    }

  }

  checkValidation() {
    if (this.document.title.trim().length == 0 || this.document.content == undefined || this.document.content.length == 0) {
      return true;
    }
    else
      return false;
  }

  ngOnDestroy() {
    this.onSaveEvent.unsubscribe();
    this.onErrorEvent.unsubscribe();
    this.onCloseEvent.unsubscribe();
  }
}

