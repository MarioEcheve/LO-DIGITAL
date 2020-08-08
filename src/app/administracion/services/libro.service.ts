import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { ILibro } from "../TO/libro.model";

type EntityResponseType = HttpResponse<ILibro>;
type EntityArrayResponseType = HttpResponse<ILibro[]>;

@Injectable({ providedIn: "root" })
export class LibroService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/libros";
  public resourceUrlBuscLibroPorContrato =
    this.SERVER_API_URL + "api/buscarlibroPorContrato";
  public resourceUrlGetMisLibros = this.SERVER_API_URL + "api/getMisLibros";

  constructor(protected http: HttpClient) {}

  create(libro: ILibro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(libro);
    return this.http
      .post<ILibro>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(libro: ILibro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(libro);
    return this.http
      .put<ILibro>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILibro>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILibro[]>(this.resourceUrl, { params: options, observe: "response" })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }

  getMisLibros(idUsuario?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption();
    return this.http
      .get<ILibro[]>(`${this.resourceUrlGetMisLibros}/${idUsuario}`, { params: options, observe: "response" })
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

  protected convertDateFromClient(libro: ILibro): ILibro {
    const copy: ILibro = Object.assign({}, libro, {
      fechaCreacion:
        libro.fechaCreacion && libro.fechaCreacion.isValid()
          ? libro.fechaCreacion.toJSON()
          : undefined,
      fechaApertura:
        libro.fechaApertura && libro.fechaApertura.isValid()
          ? libro.fechaApertura.toJSON()
          : undefined,
      fechaCierre:
        libro.fechaCierre && libro.fechaCierre.isValid()
          ? libro.fechaCierre.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaCreacion = res.body.fechaCreacion
        ? moment(res.body.fechaCreacion)
        : undefined;
      res.body.fechaApertura = res.body.fechaApertura
        ? moment(res.body.fechaApertura)
        : undefined;
      res.body.fechaCierre = res.body.fechaCierre
        ? moment(res.body.fechaCierre)
        : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(
    res: EntityArrayResponseType
  ): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((libro: ILibro) => {
        libro.fechaCreacion = libro.fechaCreacion
          ? moment(libro.fechaCreacion)
          : undefined;
        libro.fechaApertura = libro.fechaApertura
          ? moment(libro.fechaApertura)
          : undefined;
        libro.fechaCierre = libro.fechaCierre
          ? moment(libro.fechaCierre)
          : undefined;
      });
    }
    return res;
  }

  buscarlibroPorContrato(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<ILibro[]>(`${this.resourceUrlBuscLibroPorContrato}/${id}`, {
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }
}
