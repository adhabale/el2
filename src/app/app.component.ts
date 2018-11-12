import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppModel } from './app.model';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { InMemoryStorageService } from './shared/storage/in-memory-storage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck {
  
  showAdminNavigation: boolean;
  dropdownOpen: boolean;
  showLoader: boolean;
  isSessionOff: boolean;
  isAdminLoggedIn: boolean;
  isSubscriberLoggedIn:boolean;
  isSMELoggedIn:boolean;
  appModel:AppModel;
  isCustomReportPage:boolean;
  activateSME:boolean=false;
  activateAdmin:boolean=false;
  constructor(private _router: Router, private configurationService: ConfigurationService, private inMemoryStorage: InMemoryStorageService) {
    this.showAdminNavigation = false;
    this.dropdownOpen = false;
    this.appModel = new AppModel(configurationService);
  }

  handleUserInactivity() {    
    this._router.navigate(['logout']);
  }


  ngOnInit() {
    this._router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    $('#adminElem').hover(
      () => {
        $('.nav-vertical-submenu-admin').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu-admin').removeClass('active');
      }
    );
    $('#activeAdmin').hover(
      () => {
        $('.nav-vertical-submenu-admin').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu-admin').removeClass('active');
      }
    );
    $('#smeElem').hover(
      () => {
        $('.nav-vertical-submenu-sme').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu-sme').removeClass('active');
      }
    );

    $('#activeSme').hover(
      () => {
        $('.nav-vertical-submenu-sme').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu-sme').removeClass('active');
      }
    );
   
    
    this.isAdminLoggedIn=this.appModel.isAdminLoggedIn();
    this.isSubscriberLoggedIn=this.appModel.isSubscriberLoggedIn();    
    this.isSMELoggedIn=this.appModel.isSMELoggedIn();    
  }

  ngDoCheck() {

    this.isCustomReportPage = false;
    
    if (this._router.url.indexOf('/reports/custom') > -1) {
      this.isCustomReportPage = true;
    }
    else if (this._router.url.indexOf("reports/overall-losses") > -1 || this._router.url.indexOf("reports/oee-losses") > -1) {

      let reportName = this.inMemoryStorage.getItem("selectedReportNameToIgnoreIdleTimeout");
      if (reportName != null && reportName != "" && reportName != undefined && reportName.indexOf("Full List") > -1) {
        this.isCustomReportPage = true;
      }
    }

    this.isSessionOff=(this._router.url.includes('session-timeout')||this._router.url.includes('logout')||this._router.url.includes('forbidden'));
    this.isAdminLoggedIn=this.appModel.isAdminLoggedIn();
    this.isSubscriberLoggedIn=this.appModel.isSubscriberLoggedIn();
    this.isSMELoggedIn=this.appModel.isSMELoggedIn();

    $('#adminElem').hover(
      () => {
        $('.nav-vertical-submenu').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu').removeClass('active');
      }
    );
    $('#activeAdmin').hover(
      () => {
        $('.nav-vertical-submenu').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu').removeClass('active');
      }
    );
    $('#smeElem').hover(
      () => {
        $('.nav-vertical-submenu-sme').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu-sme').removeClass('active');
      }
    );

    $('#activeSme').hover(
      () => {
        $('.nav-vertical-submenu-sme').addClass('active');
      },
      () => {
        $('.nav-vertical-submenu-sme').removeClass('active');
      }
    );

    if(this._router.url.indexOf("eldm")>-1 || this._router.url.indexOf('update-index-file')>-1 ||
    this._router.url.indexOf('announcements')>-1 || this._router.url.indexOf('terms-of-use')>-1
    || this._router.url.indexOf('reference-document')>-1 || 
    this._router.url.indexOf('validate-loss-data-submission/validation-list')>-1
  ){
this.activateSME=true
    }
    else{
      this.activateSME=false;
    }


    if(this._router.url.indexOf("subscription-dashboard")>-1 || this._router.url.indexOf('accounts')>-1 ||
    this._router.url.indexOf('activity-log')>-1){
this.activateAdmin=true
    }
    else{
      this.activateAdmin=false;
    }

  }
  
  changeNavigation() {
    this.showAdminNavigation = true;
  }

  logout() {
    this._router.navigate(['logout']);
  }

  menuMobileToggle() {
    $('.navbar-toggler').toggleClass("opentime closedtime");
    $('.nav-mobile-text').toggleClass("hidden-sm-down hidden-sm-up");
  }
}
