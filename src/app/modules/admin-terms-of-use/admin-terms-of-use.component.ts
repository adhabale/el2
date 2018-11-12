import { Component, OnInit } from '@angular/core';
import { NotificationMessage } from '../common/entity/notification-message';
import { ConfirmationModal } from './entities/confirmation-modal';
import { TermsOfUse } from './entities/termsofuse';
import { TermsOfUseComponent } from '../terms-of-use/terms-of-use.component';
import { AdminTermsOfUseModel } from './models/admin-terms-of-use.model';
import { AdminTermsOfUseService } from './services/admin-terms-of-use.service';
import * as _ from 'lodash';

@Component({
  selector: 'terms-of-use',
  templateUrl: './admin-terms-of-use.component.html',
  styleUrls: ['./admin-terms-of-use.component.css']
})
export class AdminTermsOfUseComponent implements OnInit {
  confirmationModal: ConfirmationModal;
  termsOfUse:TermsOfUse=new TermsOfUse();
  isLatest:boolean;
  editMode: boolean;
  notificationMessage: NotificationMessage = new NotificationMessage();
  adminTermsOfUseModel:AdminTermsOfUseModel;
  public termsOfUseData:TermsOfUse[]=new Array<TermsOfUse>() ;

  constructor(private adminTermsOfUseService:AdminTermsOfUseService) {
    this.adminTermsOfUseModel=new AdminTermsOfUseModel(adminTermsOfUseService);
    this.confirmationModal = new ConfirmationModal();
    this.confirmationModal.headerMessage = '';
    this.confirmationModal.bodyMessage = '';
    
  }
 
  ngOnInit() {

    this.isLatest=true;
    this.getAllTermsOfUse();
  }
 
 /*  toc:TermsOfUse=new TermsOfUse();
  toc1:TermsOfUse=new TermsOfUse(); */

  getAllTermsOfUse()
  {
    this.adminTermsOfUseModel.getTermsOfUse().subscribe(res=>{
      this.termsOfUseData=res;
      this.termsOfUse=this.termsOfUseData[0];
    })
  }
  onSuccess(response:TermsOfUse) {
    
      if(response.id==undefined)
      this.addTermsOfUse(response);
      else
      this.updateTermsOfUse(response);
    
  }

  addTermsOfUse(termsOfUse:TermsOfUse)
  {
    
    this.adminTermsOfUseModel.createTermsOfUse(termsOfUse).subscribe(res=>
    {
      this.notificationMessage.successMessage = "Terms Of Use has been saved successfully";
      this.getAllTermsOfUse();
    });
    
  }

  updateTermsOfUse(termsOfUse:TermsOfUse)
  {

    this.adminTermsOfUseModel.updateTermsOfUse(termsOfUse).subscribe(res=>{
      this.notificationMessage.successMessage = "Terms Of Use has been updated successfully";
      this.getAllTermsOfUse();

    });
  
  }

  onError(message: string) {
    this.notificationMessage.errorMessage = message;
  }
  onClose(): void {
  }
  onEdit(terms:TermsOfUse) {
    this.editMode = true;
    if(this.termsOfUseData[0].termsOfUseText==terms.termsOfUseText)
    {
      this.isLatest=true;
      this.termsOfUse=terms;
    }
    else{
      this.termsOfUse=terms;
      this.isLatest=false;
    }
    
}
onCancel() {
    this.editMode = false;
}
onCreateNew() {

}

innerHtmlText(terms){
  let text1=terms.termsOfUseText.replace(/(<.*?>\s*)/g,"")
  let text=(text1).slice(0,15)+'...';
  
  return text
}

}
