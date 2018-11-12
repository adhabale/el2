import { ErrorHandler } from '@angular/core';
import { TokenService } from '../token/token.service';
import { Router } from '@angular/router';
import { LoaderService } from '../loader/loader.service';

export class GlobalExceptionHandler implements ErrorHandler {

  constructor(private tokenService: TokenService, private loaderService: LoaderService) { }

  handleError(errorResponse) {
    this.loaderService.hide();
    if (errorResponse.error !== undefined) {
      if (errorResponse.error.code === 'SessionExpired') {
        this.tokenService.renewToken();
      }
      else if (errorResponse.error.code === 'UnAuthorized') {
        this.tokenService.redirectToForbidden();
      }
      else {
        console.log(errorResponse);
      }
    }
    else {
      console.log(errorResponse);
    }
  }
}
