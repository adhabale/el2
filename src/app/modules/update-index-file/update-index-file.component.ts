import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { NotificationMessage } from '../common/entity/notification-message';
import * as _ from 'lodash';
import { UpdateIndexFileService } from './services/update-index-file.service';
import { UpdateIndexFileModel } from './models/update-index-file.model';
import { UpdateIndexFile, SaveComment } from './entity/update-index-file';
declare var $: any;
import { DownloadFileService } from '../../shared/download-file/download-file.service';


@Component({
    selector: 'update-index-file',
    templateUrl: './update-index-file.component.html',
    styleUrls: ['./update-index-file.component.css']
  })

export class UpdateIndexFileComponent implements OnInit{
    currentIndex:number;
    date= new Date();
factor;
isCurrentIndex:boolean=false;
currentyear=this.date.getFullYear();
updateIndex:UpdateIndexFile[];
updateIndexPager:UpdateIndexFile[];
comment:SaveComment
factorArray=[];
 currentPageIndex: number = 1;
currentUpdateIndexFile:UpdateIndexFile;
toggleEdit:boolean=true;
ReportText:SaveComment;

private updateIndexFileModel: UpdateIndexFileModel;

constructor(private updateIndexFileService:UpdateIndexFileService,private downloadFileService:DownloadFileService){
    this.updateIndexFileModel = new UpdateIndexFileModel(updateIndexFileService);

}
ngOnInit(){

    this.getIndexList();
    this.getComment();
}

getComment(){
    this.updateIndexFileModel.getComment().subscribe(res=>{
this.ReportText=res;
    })
}
getIndexList() {
    this.updateIndexFileModel.getUpdateIndexFile().subscribe(result=>{
        let updateIndex: UpdateIndexFile[] = [];
        this.currentUpdateIndexFile=result[0]
        _.each(result, (object) => {
            updateIndex.push(this.mapToUpdateIndexResponse(object))
        });
    this.updateIndex=updateIndex;

    var currentIndex:number = this.updateIndex[0].index;

_.each(updateIndex,(obj,i) => {
    let index = this.updateIndex[i].index;
    this.updateIndex[i].factor=Number((currentIndex/index).toFixed(4));

})
});

}

mapToUpdateIndexResponse(o: any): UpdateIndexFile {
    return new UpdateIndexFile(o.year,o.index);
  }

  onSave(currentIndex:number){
        let year= this.currentyear;
        var currentIndex:number =currentIndex;
      
        var newIndex= new UpdateIndexFile(year,currentIndex);
            if(this.updateIndex[0].year!=year){
                this.updateIndex.splice(0,0,newIndex);

                this.updateIndexFileModel.saveIndex(newIndex).subscribe(res=>{
                    this.getIndexList();
                    this.updateIndex[0].isUpdated=true; 

                });
                this.currentUpdateIndexFile.isUpdated=true;
            }
        else{
            this.currentUpdateIndexFile.index=currentIndex;
            this.updateIndexFileModel.updateIndices(this.currentUpdateIndexFile.id,this.currentUpdateIndexFile).subscribe(res=>{
                          this.getIndexList();
            })

        }
        this.currentIndex=null;
  }

  edit() {
    this.toggleEdit = false;
    // $("#editor").eq(0).attr("disabled", true);
    $("[id='editor']").removeAttr('disabled');
}

save(value) {
    let text=new SaveComment(value);
    this.updateIndexFileModel.saveComment(text).subscribe(res=>{
        this.getComment();
    });
        this.toggleEdit = true;
    $("[id='editor']").attr('disabled', 'disabled');
}

onPageChange(pageItem) {
    setTimeout(() => {
        this.updateIndexPager = pageItem;
        //this.loaderService.hide();
    });
}


onExport(){

    let data=[];
    this.updateIndex.forEach(element => {
        data.push({"Year":element.year,"Index":element.index,"Factor":element.factor})
    });
    let content = JSON.stringify(data).replace(/null/g, '""');

    let title="Indexation used for the WTW Energy Loss Database";
    console.log(this.ReportText)
    this.updateIndexFileModel.exportPDF(content,title,this.ReportText).subscribe(res=>{
        this.downloadFileService.fetchFile(res);

    })

}

}