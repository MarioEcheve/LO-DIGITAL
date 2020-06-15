import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AccountService } from "./core/auth/account.service";

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AccountService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["pages/login"], {
        queryParams: { returnUrl: state.url },
      });
    }
    return true;
  }
}
