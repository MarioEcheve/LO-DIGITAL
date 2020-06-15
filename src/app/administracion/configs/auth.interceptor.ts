import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

//import { SERVER_API_URL } from 'app/app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  SERVER_API_URL = 'http://localhost:8080/';

  constructor(private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor');
    if (
      !request ||
      !request.url ||
      (request.url.startsWith('http') && !(this.SERVER_API_URL && request.url.startsWith(this.SERVER_API_URL)))
    ) {
      return next.handle(request);
    }

    const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    }
    return next.handle(request);
  }
}
