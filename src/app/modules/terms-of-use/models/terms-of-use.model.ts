import { Observable } from "rxjs/Rx";
import { TermsOfUseService } from "../services/terms-of-use.service";
import { TermsOfUse } from "../entity/terms-of-use";
import { AcceptedTermsOfUse } from '../entity/accepted-terms-of-use';
import { LocalWebStorageService } from "../../../shared/storage/local-web-storage.service";

export class TermsOfUseModel
{
    constructor(private termsOfUseService : TermsOfUseService,private localWebStorage:LocalWebStorageService){

    }
    
    getTermsOfUseDetails():Observable<TermsOfUse>{
        return this.termsOfUseService.getTermsOfUse();
    }

    acceptLatestTermsOfUse(acceptedTermsOfUse:AcceptedTermsOfUse): Observable<boolean> {
         return this.termsOfUseService.updateTermsOfUse(acceptedTermsOfUse);

    }

    getLastAcceptedVersion(principalId: string): Observable<number> {
        return this.termsOfUseService.getLastAcceptedVersion(principalId);
    }

    setVersion(value:number)
    {
        this.localWebStorage.set("tou",value);
    }

    getVersion():number
    {
        return this.localWebStorage.get("tou");
    }
}