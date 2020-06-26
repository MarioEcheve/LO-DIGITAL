import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IUsuarioLibro } from "../TO/usuario-libro.model";

type EntityResponseType = HttpResponse<IUsuarioLibro>;
type EntityArrayResponseType = HttpResponse<IUsuarioLibro[]>;

@Injectable({ providedIn: "root" })
export class UsuarioLibroService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/usuario-libros";

  constructor(protected http: HttpClient) {}

  create(usuarioLibro: IUsuarioLibro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuarioLibro);
    return this.http
      .post<IUsuarioLibro>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(usuarioLibro: IUsuarioLibro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuarioLibro);
    return this.http
      .put<IUsuarioLibro>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUsuarioLibro>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUsuarioLibro[]>(this.resourceUrl, {
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

  protected convertDateFromClient(usuarioLibro: IUsuarioLibro): IUsuarioLibro {
    const copy: IUsuarioLibro = Object.assign({}, usuarioLibro, {
      fechaCreacion:
        usuarioLibro.fechaCreacion && usuarioLibro.fechaCreacion.isValid()
          ? usuarioLibro.fechaCreacion.toJSON()
          : undefined,
      fechaModificacion:
        usuarioLibro.fechaModificacion &&
        usuarioLibro.fechaModificacion.isValid()
          ? usuarioLibro.fechaModificacion.toJSON()
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
      res.body.forEach((usuarioLibro: IUsuarioLibro) => {
        usuarioLibro.fechaCreacion = usuarioLibro.fechaCreacion
          ? moment(usuarioLibro.fechaCreacion)
          : undefined;
        usuarioLibro.fechaModificacion = usuarioLibro.fechaModificacion
          ? moment(usuarioLibro.fechaModificacion)
          : undefined;
      });
    }
    return res;
  }
}
