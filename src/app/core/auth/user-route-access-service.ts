import { Injectable, isDevMode } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AccountService } from "../auth/account.service";

import { StateStorageService } from "../../core/auth/state-storage.service";
import { User } from "../user/user.model";

@Injectable({ providedIn: "root" })
export class UserRouteAccessService implements CanActivate {
  constructor(
    private router: Router,
    //private loginModalService: LoginModalService,
    private accountService: AccountService,
    private stateStorageService: StateStorageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let usuario = JSON.parse(localStorage.getItem('user'));
    const authorities = usuario.authorities;
    // We need to call the checkLogin / and so the accountService.identity() function, to ensure,
    // that the client has a principal too, if they already logged in by the server.
    // This could happen on a page refresh.
    return this.checkLogin(authorities, state.url);
  }

  checkLogin(authorities: string[], url: string): Observable<boolean> {
    return this.accountService.identity().pipe(
      map((account) => {
        if (!authorities || authorities.length === 0) {
          return true;
        }

        if (account) {
          const hasAnyAuthority = this.accountService.hasAnyAuthority(
            authorities
          );
          if (hasAnyAuthority) {
            return true;
          }
          if (isDevMode()) {
            console.error(
              "User has not any of required authorities: ",
              authorities
            );
          }
          this.router.navigate(["accessdenied"]);
          return false;
        }

        this.stateStorageService.storeUrl(url);
        this.router.navigate([""]);
        //this.loginModalService.open();
        return false;
      })
    );
  }
}
