import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IUser } from "./user.model";
import { HttpClient, HttpResponse } from "@angular/common/http";

//import { SERVER_API_URL } from 'app/app.constants';
import {
  createRequestOption,
  Pagination,
} from "../../administracion/util/request-util";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/users";
  public resourceUrlByLogin = this.SERVER_API_URL + "api/BuscarUsuarioPorLogin";
  private usuario = new BehaviorSubject<IUser>({});
  usuarioActual = this.usuario.asObservable();

  constructor(private http: HttpClient) {}

  changeUsuarioActual(list: any) {
    this.usuario.next(list);
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
  buscarUsuarioPorLogin(valor: string) {
    return this.http.get<IUser>(this.resourceUrlByLogin + "/" + valor);
  }
}
