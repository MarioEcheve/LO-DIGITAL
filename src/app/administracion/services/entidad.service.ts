import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IEntidad } from "../TO/entidad.model";

type EntityResponseType = HttpResponse<IEntidad>;
type EntityArrayResponseType = HttpResponse<IEntidad[]>;

@Injectable({ providedIn: "root" })
export class EntidadService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/entidads";
  public resourceUrlBuscarEntidadPorUsuario =
    this.SERVER_API_URL + "api/buscaEntidadPorUsuario";

  constructor(protected http: HttpClient) {}

  create(entidad: IEntidad): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entidad);
    return this.http
      .post<IEntidad>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(entidad: IEntidad): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entidad);
    return this.http
      .put<IEntidad>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEntidad>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEntidad[]>(this.resourceUrl, {
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
  buscarEntidadPorUsuario(
    idUsuario: number
  ): Observable<EntityArrayResponseType> {
    return this.http
      .get<IEntidad[]>(
        `${this.resourceUrlBuscarEntidadPorUsuario}/${idUsuario}`,
        { observe: "response" }
      )
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }
  protected convertDateFromClient(entidad: IEntidad): IEntidad {
    const copy: IEntidad = Object.assign({}, entidad, {
      fechaCreacion:
        entidad.fechaCreacion && entidad.fechaCreacion.isValid()
          ? entidad.fechaCreacion.toJSON()
          : undefined,
      fechaModificacion:
        entidad.fechaModificacion && entidad.fechaModificacion.isValid()
          ? entidad.fechaModificacion.toJSON()
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
      res.body.forEach((entidad: IEntidad) => {
        entidad.fechaCreacion = entidad.fechaCreacion
          ? moment(entidad.fechaCreacion)
          : undefined;
        entidad.fechaModificacion = entidad.fechaModificacion
          ? moment(entidad.fechaModificacion)
          : undefined;
      });
    }
    return res;
  }
}
