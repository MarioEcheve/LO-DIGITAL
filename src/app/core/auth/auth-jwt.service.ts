import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { environment } from './../../../environments/environment';
import { Login } from "../login/login";

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: "root" })
export class AuthServerProvider {
  SERVER_API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService
  ) {}

  getToken(): string {
    return (
      this.$localStorage.retrieve("authenticationToken") ||
      this.$sessionStorage.retrieve("authenticationToken") ||
      ""
    );
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(this.SERVER_API_URL + "api/authenticate", credentials)
      .pipe(
        map((response) =>
          this.authenticateSuccess(response, credentials.rememberMe)
        )
      );
  }

  logout(): Observable<void> {
    return new Observable((observer) => {
      this.$localStorage.clear("authenticationToken");
      this.$sessionStorage.clear("authenticationToken");
      localStorage.setItem("user", "");
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      this.$localStorage.store("authenticationToken", jwt);
    } else {
      this.$sessionStorage.store("authenticationToken", jwt);
    }
  }
}
