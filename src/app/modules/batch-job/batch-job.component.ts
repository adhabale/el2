import { Component, OnInit } from '@angular/core';
import { BatchJobService } from './services/batch-job.services';
import { BatchJobModel } from './models/batch-job.model';
import { BatchJob } from './entity/batch-job';
import { NotificationMessage } from '../common/entity/notification-message';


@Component({
    templateUrl: './batch-job.component.html',
    styleUrls: ['./batch-job.component.css']
})
export class BatchJobComponent {

    file: File;
    private batchJob: BatchJob = new BatchJob();
    private batchJobModel: BatchJobModel;
    notificationMessage: NotificationMessage = new NotificationMessage();

    constructor(private batchJobService: BatchJobService) {
        this.batchJobModel = new BatchJobModel(batchJobService);
    }



    uploadBatchFile() {

        this.notificationMessage.successMessage = "";
        var fileExtension = this.file.name.split('.')[this.file.name.split('.').length - 1].toLowerCase();
        if (fileExtension != "csv") {
            this.notificationMessage.errorMessage = "Please Select Proper File Format";
        }
        else {
            this.notificationMessage.errorMessage = "";
            setTimeout(() => {

                this.batchJobModel.uploadFile(this.batchJob).subscribe(result => {
                    this.notificationMessage.successMessage = "File Uploaded";
                });

            }, 2000)

        }

    }

   
    fileUpload(event: EventTarget) {

        let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
        let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
        let files: FileList = target.files;

        this.file = files[0];
        this.batchJob.fileName = this.file.name;
        this.batchJob.contentType = "text/csv";
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

        this.batchJob.content = fileByteArray
    }

}