import { Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { OktaAuth } from '@okta/okta-auth-js';

export interface BeforeLeavingComponent {
  formNotSaved(): boolean;
  confirmMessage(): string;
}

// route guard to confirm with user before leaving an unsaved form
export const formGuard: CanDeactivateFn<BeforeLeavingComponent> = (
  component: BeforeLeavingComponent,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot
) => {
  if (component.formNotSaved()) {
    return confirm(component.confirmMessage());
  } else {
    return true;
  }
};

// route guard to navigate user to login page when accessing protected resources and not logged in
export function authGuard(oktaAuth: OktaAuth, injector: Injector) {
  const router = injector.get(Router);
  router.navigate(['/login']);
}
