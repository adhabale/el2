import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TermsOfUse } from './entity/terms-of-use';
import { AcceptedTermsOfUse } from './entity/accepted-terms-of-use';
import { TermsOfUseService } from './services/terms-of-use.service';
import { TermsOfUseModel } from './models/terms-of-use.model';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { LocalWebStorageService } from '../../shared/storage/local-web-storage.service';
import { AuditTermsOfUseService } from './services/audit-terms-of-use.service';
import { AuditTermsOfUseLog } from './entity/audit-terms-of-use-log';
import { SessionWebStorageService } from '../../shared/storage/session-web-storage.service';

@Component({
    selector: 'app-terms',
    templateUrl: './terms-of-use.component.html',
    styleUrls: ['./terms-of-use.component.css']
})
export class TermsOfUseComponent {

    private termsOfUseModel: TermsOfUseModel;
    private userInfo: any;
    termsOfUse: TermsOfUse = new TermsOfUse();
    acceptedTermsOfUse: AcceptedTermsOfUse = new AcceptedTermsOfUse();
    auditTermsOfUseLog: AuditTermsOfUseLog = new AuditTermsOfUseLog();
    isAccepted: boolean = false;
    isError: boolean = false;
    version: number;
    constructor(private auditTermsOfUseService: AuditTermsOfUseService,
        private localWebStorageService: LocalWebStorageService,
        private router: Router, private termsOfUseService: TermsOfUseService,
        private configurationService: ConfigurationService,
        private sessionWebStorageService: SessionWebStorageService) {
        this.termsOfUseModel = new TermsOfUseModel(termsOfUseService,localWebStorageService);
    }

    ngOnInit() {
        if (this.configurationService.loggedInUserInfo) {
            this.userInfo = JSON.parse(this.configurationService.loggedInUserInfo);
            this.termsOfUseModel.getLastAcceptedVersion(this.userInfo.PrincipalId).subscribe(response =>{
                this.version = response;
                this.getLatestTermsOfUse();
            });
        }
    }

    openTermsOfUseModal() {
        document.getElementById("termsOfUses").click();
    }


    getLatestTermsOfUse() {
       // this.version=this.termsOfUseModel.getVersion();
       this.termsOfUseModel.getTermsOfUseDetails().subscribe(result => {
            this.termsOfUse = result;
            if (this.version == null ||  this.version < this.termsOfUse.version ) {
                this.openTermsOfUseModal();;
            }
        })
    }

    onAcceptLatestTermsOfUse() {
        this.termsOfUseModel.setVersion(this.userInfo.LastAcceptedVersion);
        this.acceptedTermsOfUse.userId = this.userInfo.UserId;
        this.acceptedTermsOfUse.version = this.termsOfUse.version;
        this.acceptedTermsOfUse.principalId = this.userInfo.PrincipalId;
        this.auditTermsOfUseLog.version = this.termsOfUse.version;
        this.auditTermsOfUseLog.action = "Accept";
        this.auditTermsOfUseService.log(this.auditTermsOfUseLog);
        this.version =this.termsOfUse.version;
        this.userInfo.LastAcceptedVersion = this.version;

        this.termsOfUseModel.acceptLatestTermsOfUse(this.acceptedTermsOfUse).subscribe(
            res => {
                if (res) {
                    this.isError = false;
                    document.getElementById("termsOfUsesClose").click();
                }
                else {
                    this.isError = true;
                }
            }
        );
       

    }

    onDeclineLatestTermsOfUse() {
        document.getElementById("termsOfUsesClose").click();
        this.auditTermsOfUseLog.version = this.termsOfUse.version;
        this.auditTermsOfUseLog.action = "Decline";
        this.auditTermsOfUseService.log(this.auditTermsOfUseLog);
        this.router.navigate(["logout"]);
    }

}