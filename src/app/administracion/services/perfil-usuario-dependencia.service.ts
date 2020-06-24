import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IPerfilUsuarioDependencia } from "../TO/perfil-usuario-dependencia.model";

type EntityResponseType = HttpResponse<IPerfilUsuarioDependencia>;
type EntityArrayResponseType = HttpResponse<IPerfilUsuarioDependencia[]>;

@Injectable({ providedIn: "root" })
export class PerfilUsuarioDependenciaService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/perfil-usuario-dependencias";
  private perfil = new BehaviorSubject<IPerfilUsuarioDependencia>({});
  perfilActual = this.perfil.asObservable();
  constructor(protected http: HttpClient) {}
  changePerfilUsuarioDependencia(list: any) {
    this.perfil.next(list);
  }
  create(
    perfilUsuarioDependencia: IPerfilUsuarioDependencia
  ): Observable<EntityResponseType> {
    return this.http.post<IPerfilUsuarioDependencia>(
      this.resourceUrl,
      perfilUsuarioDependencia,
      { observe: "response" }
    );
  }

  update(
    perfilUsuarioDependencia: IPerfilUsuarioDependencia
  ): Observable<EntityResponseType> {
    return this.http.put<IPerfilUsuarioDependencia>(
      this.resourceUrl,
      perfilUsuarioDependencia,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPerfilUsuarioDependencia>(
      `${this.resourceUrl}/${id}`,
      { observe: "response" }
    );
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPerfilUsuarioDependencia[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }
}
