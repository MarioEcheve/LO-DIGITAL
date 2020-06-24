import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IDependencia } from "../TO/dependencia.model";

type EntityResponseType = HttpResponse<IDependencia>;
type EntityArrayResponseType = HttpResponse<IDependencia[]>;

@Injectable({ providedIn: "root" })
export class DependenciaService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/dependencias";
  public resourceUrlBuscaDependenciaPorEntidad =
    this.SERVER_API_URL + "api/buscaDependenciaPorEntidad";
  public resourceUrlBuscaUsuarioDependencia =
    this.SERVER_API_URL + "api/buscaUsuariosDependencia";
  constructor(protected http: HttpClient) {}

  create(dependencia: IDependencia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dependencia);
    return this.http
      .post<IDependencia>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(dependencia: IDependencia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dependencia);
    return this.http
      .put<IDependencia>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDependencia>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDependencia[]>(this.resourceUrl, {
        params: options,
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }
  buscaDependenciaPorEntidad(
    idEntidad: number
  ): Observable<EntityArrayResponseType> {
    return this.http
      .get<IDependencia[]>(
        `${this.resourceUrlBuscaDependenciaPorEntidad}/${idEntidad}`,
        {
          observe: "response",
        }
      )
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }
  buscaUsuariosDependencia(
    idDependencia: number
  ): Observable<EntityArrayResponseType> {
    return this.http
      .get<any[]>(
        `${this.resourceUrlBuscaUsuarioDependencia}/${idDependencia}`,
        {
          observe: "response",
        }
      )
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }

  protected convertDateFromClient(dependencia: IDependencia): IDependencia {
    const copy: IDependencia = Object.assign({}, dependencia, {
      fechaCreacion:
        dependencia.fechaCreacion && dependencia.fechaCreacion.isValid()
          ? dependencia.fechaCreacion.toJSON()
          : undefined,
      fechaModificacion:
        dependencia.fechaModificacion && dependencia.fechaModificacion.isValid()
          ? dependencia.fechaModificacion.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaCreacion = res.body.fechaCreacion
        ? moment(res.body.fechaCreacion)
        : undefined;
      res.body.fechaModificacion = res.body.fechaModificacion
        ? moment(res.body.fechaModificacion)
        : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(
    res: EntityArrayResponseType
  ): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((dependencia: IDependencia) => {
        dependencia.fechaCreacion = dependencia.fechaCreacion
          ? moment(dependencia.fechaCreacion)
          : undefined;
        dependencia.fechaModificacion = dependencia.fechaModificacion
          ? moment(dependencia.fechaModificacion)
          : undefined;
      });
    }
    return res;
  }
}
