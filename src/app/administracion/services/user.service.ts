import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

//import { SERVER_API_URL } from "app/app.constants";
import { createRequestOption, Pagination } from "../util/request-util";
import { IUser } from "../TO/user.model";
import { environment } from './../../../environments/environment';

@Injectable({ providedIn: "root" })
export class UserService {
  SERVER_API_URL = environment.apiUrl;
  public resourceUrl = this.SERVER_API_URL + "api/users";

  constructor(private http: HttpClient) {}

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.resourceUrl, user);
  }

  find(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(
      this.SERVER_API_URL + "api/users/authorities"
    );
  }
}
