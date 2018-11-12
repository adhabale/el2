import { Component, OnInit, OnDestroy ,ChangeDetectorRef  } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountModel } from '../../models/account.model';
import { AccountEventEmitter } from '../../account.events';
import { Subscription } from 'rxjs';
import { LocalWebStorageService } from '../../../../shared/storage/local-web-storage.service';
import { NotificationMessage } from '../../../common/entity/notification-message';


@Component({
  templateUrl: './account-user.component.html',
  styleUrls: ['./account-user.component.css']
})

export class AccountUserComponent implements OnInit {
  notificationMessage: NotificationMessage = new NotificationMessage();
  isNewSubscription: boolean;
  showExistingUsersTab: boolean;
  showActivateAccountBtn: boolean;
  isEnableButtonEvent: boolean;
  isEnableUserAccess:boolean;
  subscriptionMessage: string;
  accountObj: any;
  isAnyModification: boolean;
  contactPerson : any;

  private accountModel: AccountModel;

  constructor(private cdref: ChangeDetectorRef,private localWebStorage: LocalWebStorageService, private accountService: AccountService, private router: Router, private activatedRoute: ActivatedRoute, private accountEvent: AccountEventEmitter) {
    this.accountModel = new AccountModel(accountService, localWebStorage);

    this.accountEvent.isEnableButtonEvent.subscribe((value) => {
      this.isEnableButtonEvent = value;
      /* console.log(value);
      if(this.isEnableButtonEvent && this.accountModel.getModifyUserFlag())
      this.isEnableButtonEvent=true;
      else
      this.isEnableButtonEvent=false; */
      //console.log(value);
      this.checkSaveButtonValidation();
      
    });
    this.accountEvent.isUserAccessButton.subscribe((value)=>{
      this.isEnableUserAccess=value;

    })
    

  }

  ngOnInit(): void {

    
  }

  ngAfterContentInit() :void
  {
    if (this.activatedRoute.parent.snapshot.params.accountId == undefined) {

      this.isNewSubscription = true;

      this.accountEvent.showActivateAccountButtonEvent.subscribe((value) => {
        

        this.showSubscriptionActivationButton(value);
      });

      /* this.accountEvent.isAnyEditAccount.subscribe((value)=>{ 
        this.isAnyModification=value;
      }); */


      let accountUsers = this.accountModel.getAllAccountUser();

      if (accountUsers != null && accountUsers.length > 0) {

        var activateFlag:boolean=false;

        accountUsers.forEach(user=>{
          if(user.isActive)
          activateFlag=true;
        })
        if(activateFlag)
        {
          this.showActivateAccountBtn = true;
        }
        this.showExistingUsersTab = true;
        

        this.router.navigate(['list'], { relativeTo: this.activatedRoute });

      }
      else {
        this.router.navigate(['new'], { relativeTo: this.activatedRoute });
      }

    }
    else {
      this.router.navigate(['list'], { relativeTo: this.activatedRoute });
      
      //this.checkSaveButtonValidation();
     
      


      this.accountObj=  this.accountModel.getAccount();
      if (this.accountObj == null || this.accountObj.customerName == undefined || this.accountObj.customerName == "")
      {
        
        this.accountModel.getAccountInfo(this.activatedRoute.parent.snapshot.params.accountId).subscribe(res=>
        {
          this.accountObj=res;
          this.accountModel.setAccount(this.accountObj);
        });

      }

     
      this.cdref.detectChanges();
       
         
    }
  }

  checkSaveButtonValidation()
  {
    
    if(this.accountModel.getEditFlag() && this.chececkUsersStatus())
      this.isAnyModification=true;
      else
     {
       if(this.accountModel.getModifyUserFlag() && this.chececkUsersStatus())
       this.isAnyModification=true;
       else
       this.isAnyModification=false;
     }
    
  }

  chececkUsersStatus()
  {
    let accountUsers = this.accountModel.getAllAccountUser();
    

      if (accountUsers != null && accountUsers.length > 0) {


        var activateFlag:boolean=false;

        accountUsers.forEach(user=>{
          if(user.isActive)
          activateFlag=true;
        })
        if(activateFlag)
        {
          //if(this.accountModel.getEditFlag)
          return true;
                    //else
                    //this.isEnableButtonEvent = false;
        }
        else
        return false;
      }
  }

  onBack(): void {
    this.router.navigate(['account-info'], { relativeTo: this.activatedRoute.parent });
  }

  createAccount(): void {

    this.accountModel.createAccount().subscribe(
      result => {

        if (result)
          this.subscriptionMessage = "Subscription activated successfully";
        else
          this.subscriptionMessage = "Failed to activated subscription";

        document.getElementById("loadModelBtn").click();

      }, error => {
        this.subscriptionMessage = "Failed to activated subscription";
        document.getElementById("loadModelBtn").click();
      });

  }

  updateAccount(): void {

    this.accountModel.updateAccount().subscribe(
      result => {


        if (!result) {
          this.subscriptionMessage = "Subscription Updated successfully";
        }

        else
          this.subscriptionMessage = "Failed to update subscription";

        document.getElementById("loadModelBtn").click();

      }, error => {
        this.subscriptionMessage = "Failed to update subscription";
        document.getElementById("loadModelBtn").click();

      });

  }

  showSubscriptionActivationButton(flag: boolean) {
    this.showActivateAccountBtn = flag;

    this.showExistingUsersTab = true;
  }

  navigateToHomePage() {
    this.accountModel.clearAccountSession();
    this.accountModel.clearAccountStore();
    this.router.navigate(['home']);
  }

  ngOnDestroy() {

  }
  onSuccess(message: string) {
    this.notificationMessage.successMessage = message;
  }
  validateUsers() {
    this.accountModel.getValidateUsers(this.accountObj.accountId)
      .subscribe(
        result => {
          if (result) {
            this.contactPerson = result;
              this.onSuccess("A notification has been send to "+this.contactPerson+" to validate Energy Losses access" );
          }
        })
  }

}

