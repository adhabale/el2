import { Component } from '@angular/core';
import { TermsOfUseService } from '../../terms-of-use/services/terms-of-use.service';
import { TermsOfUseModel } from '../../terms-of-use/models/terms-of-use.model';
import { TermsOfUse } from '../../terms-of-use/entity/terms-of-use';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent{


  openTermsOfUseModal()
  {
    document.getElementById("termsOfUsesFooter").click();
  }
  
  
}
