import { Observable } from 'rxjs/Rx';
import { TermsOfUse } from '../entities/termsofuse'
import { AdminTermsOfUseService } from '../services/admin-terms-of-use.service';


export class AdminTermsOfUseModel
{
    constructor(private adminTermsOfUseService: AdminTermsOfUseService) {
    }

    getTermsOfUse(): Observable<TermsOfUse[]> {
        return this.adminTermsOfUseService.getAllTermsOfUse();
    }

    createTermsOfUse(termsOfUse:TermsOfUse):Observable<TermsOfUse>{
        return this.adminTermsOfUseService.addTermsOfUse(termsOfUse);
    }

    updateTermsOfUse(termsOfUse:TermsOfUse):Observable<boolean>
    {
        return this.adminTermsOfUseService.updateTermsOfUse(termsOfUse);
    }
}