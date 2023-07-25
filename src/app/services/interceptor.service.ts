import { Injectable } from "@angular/core";
import {
HttpErrorResponse,
HttpEvent,
HttpHandler,
HttpInterceptor,
HttpRequest,
HttpResponse,
} from "@angular/common/http";
import { Observable, from, throwError } from "rxjs";
import { Router } from "@angular/router";
import { catchError, map, switchMap } from "rxjs/operators";
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  key:''
  protected debug = true;
  constructor(
    private router: Router,
    private storage: Storage
  ) {

  }
  async ngOnInit() {
    this.key = await this.storage.get('key');
  }
 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = "my-token-string-from-server";

        return from(this.storage.get('key'))
        .pipe(
            switchMap(token => {
              if (token) {
                request = request.clone({
                  setHeaders: {
                    'Authorization': `Bearer ${token}`
                  }
                });
              }
          
              if (!request.headers.has('Content-Type')) {
                request = request.clone({
                  setHeaders: {
                    // 'content-type': 'application/json'
                  }
                });
              }
          
              request = request.clone({
                headers: request.headers.set('Accept', 'application/json')
              });
          
              return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                  if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                  }
                  return event;
                }),
                catchError((error: HttpErrorResponse) => {
                  console.error(error);
                  return throwError(error);
                }));
            

            })
        );


    //Authentication by setting header with token value
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': token
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      }));
  


    // YOU CAN ALSO DO THIS
    // const token = this.authenticationService.getToke()

    
    // return from(this.storage.get('key'))
    //     .pipe(
    //         switchMap(token => {
              
    //             if (token) {
    //                 request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    //             }

    //             if (!request.headers.has('Content-Type')) {
    //                 request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    //             }

    //             // if (this.debug) {
    //             //     request = request.clone({ url: this.url + request.url + '?XDEBUG_SESSION_START=1'});
    //             // }

    //             return next.handle(request).pipe(
    //                 map((event: HttpEvent<any>) => {
    //                     if (event instanceof HttpResponse) {
    //                         // do nothing for now
    //                     }
    //                     return event;
    //                 }),
    //                 catchError((error: HttpErrorResponse) => {
    //                     const status =  error.status;
    //                     const reason = error && error.error.reason ? error.error.reason : '';

    //                     // this.presentAlert(status, reason);
    //                     return throwError(error);
    //                 })
    //             );
    //         })
    //     );


}
}
