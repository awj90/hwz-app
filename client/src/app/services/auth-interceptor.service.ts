import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    // array of API endpoints that the auth interceptor will need to modify the http requests to
    const securedEndPoints = ['http://localhost:8080/api/orders'];

    // if request's url is applicable, get an access token from auth server
    if (securedEndPoints.some((url) => req.urlWithParams.includes(url))) {
      const accessToken = this.oktaAuth.getAccessToken();

      // clone another request that includes the access token as the original request is immutable
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }
    return await lastValueFrom(next.handle(req));
  }
}
