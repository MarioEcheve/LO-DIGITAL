import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IUsuarioDependencia } from "../TO/usuario-dependencia.model";

type EntityResponseType = HttpResponse<IUsuarioDependencia>;
type EntityArrayResponseType = HttpResponse<IUsuarioDependencia[]>;

@Injectable({ providedIn: "root" })
export class UsuarioDependenciaService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/usuario-dependencias";

  constructor(protected http: HttpClient) {}

  create(
    usuarioDependencia: IUsuarioDependencia
  ): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuarioDependencia);
    return this.http
      .post<IUsuarioDependencia>(this.resourceUrl, copy, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(
    usuarioDependencia: IUsuarioDependencia
  ): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuarioDependencia);
    return this.http
      .put<IUsuarioDependencia>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUsuarioDependencia>(`${this.resourceUrl}/${id}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUsuarioDependencia[]>(this.resourceUrl, {
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

  protected convertDateFromClient(
    usuarioDependencia: IUsuarioDependencia
  ): IUsuarioDependencia {
    const copy: IUsuarioDependencia = Object.assign({}, usuarioDependencia, {
      fechaCreacion:
        usuarioDependencia.fechaCreacion &&
        usuarioDependencia.fechaCreacion.isValid()
          ? usuarioDependencia.fechaCreacion.toJSON()
          : undefined,
      fechaModificacion:
        usuarioDependencia.fechaModificacion &&
        usuarioDependencia.fechaModificacion.isValid()
          ? usuarioDependencia.fechaModificacion.toJSON()
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
      res.body.forEach((usuarioDependencia: IUsuarioDependencia) => {
        usuarioDependencia.fechaCreacion = usuarioDependencia.fechaCreacion
          ? moment(usuarioDependencia.fechaCreacion)
          : undefined;
        usuarioDependencia.fechaModificacion = usuarioDependencia.fechaModificacion
          ? moment(usuarioDependencia.fechaModificacion)
          : undefined;
      });
    }
    return res;
  }
}
