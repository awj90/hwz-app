import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';

export interface BeforeLeavingComponent {
  formNotSaved(): boolean;
  confirmMessage(): string;
}

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
