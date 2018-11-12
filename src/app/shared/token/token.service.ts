import { Injectable, Injector, Inject } from '@angular/core';
import { InMemoryStorageService } from '../storage/in-memory-storage.service';
import { LocalWebStorageService } from '../storage/local-web-storage.service';
import { SessionWebStorageService } from '../storage/session-web-storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TokenService {
  constructor(private _injector: Injector, private _storage: InMemoryStorageService, private _localStorage: LocalWebStorageService, private _sessionStorage: SessionWebStorageService) {
  }

  renewToken() {
    let http = this._injector.get(HttpClient);
    this._storage.clear();
    this._localStorage.clear();
    this._sessionStorage.clear();
    let router = this._injector.get(Router);
    http.get('clear-cookies').subscribe((result) => {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");
      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
      {
        window.location.href = window.location.href;
      }
      else {
        window.location.reload(true);
      }
      return false;

    },
      (error) => {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
          window.location.href = window.location.href;
        }
        else {
          window.location.reload(true);
        }
        return false;
      });
  }

  redirectToForbidden() {
    let router = this._injector.get(Router);
    router.navigate(['/forbidden']);
  }

  getAccessToken() {
    return this._storage.getItem("accessToken");
  }
}
