import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { catchError, finalize, map } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { LoaderService } from '../loader/loader.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    private requestCount: number = 0;

    constructor(private loaderService: LoaderService,private tokenService: TokenService) {
    }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.requestCount++;

        if (this.requestCount > 0)
            this.loaderService.show();

        return next.handle(httpRequest)
            .pipe(

                map(event => {
                    return event;
                }),

                catchError(error => {    
                    this.requestCount = 0;
                    return Observable.throw(error);
                }),

                finalize(() => {

                    if (this.requestCount > 0)
                        this.requestCount--;

                    if (this.requestCount == 0)
                        this.loaderService.hide();
                }));
    }
}
