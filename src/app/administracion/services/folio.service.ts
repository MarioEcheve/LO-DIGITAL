import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IFolio } from "../TO/folio.model";

type EntityResponseType = HttpResponse<IFolio>;
type EntityArrayResponseType = HttpResponse<IFolio[]>;

@Injectable({ providedIn: "root" })
export class FolioService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/folios";
  public resourceUrlBuscarFolioPorLibro =
    this.SERVER_API_URL + "api/buscarFolioPorLibro";
  public resourceUrlCorrelativoFolio =
    this.SERVER_API_URL + "api/correlativoFolio";

  constructor(protected http: HttpClient) {}

  create(folio: IFolio): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(folio);
    return this.http
      .post<IFolio>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(folio: IFolio): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(folio);
    return this.http
      .put<IFolio>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFolio>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFolio[]>(this.resourceUrl, { params: options, observe: "response" })
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

  buscarFolioPorLibro(id: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<IFolio[]>(`${this.resourceUrlBuscarFolioPorLibro}/${id}`, {
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }
  correlativoFolio(id: number): Observable<EntityResponseType> {
    return this.http
      .get<any>(`${this.resourceUrlCorrelativoFolio}/${id}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(folio: IFolio): IFolio {
    const copy: IFolio = Object.assign({}, folio, {
      fechaRequerida:
        folio.fechaRequerida && folio.fechaRequerida.isValid()
          ? folio.fechaRequerida.toJSON()
          : undefined,
      fechaCreacion:
        folio.fechaCreacion && folio.fechaCreacion.isValid()
          ? folio.fechaCreacion.toJSON()
          : undefined,
      fechaModificacion:
        folio.fechaModificacion && folio.fechaModificacion.isValid()
          ? folio.fechaModificacion.toJSON()
          : undefined,
      fechaFirma:
        folio.fechaFirma && folio.fechaFirma.isValid()
          ? folio.fechaFirma.toJSON()
          : undefined,
      fechaLectura:
        folio.fechaLectura && folio.fechaLectura.isValid()
          ? folio.fechaLectura.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaRequerida = res.body.fechaRequerida
        ? moment(res.body.fechaRequerida)
        : undefined;
      res.body.fechaCreacion = res.body.fechaCreacion
        ? moment(res.body.fechaCreacion)
        : undefined;
      res.body.fechaModificacion = res.body.fechaModificacion
        ? moment(res.body.fechaModificacion)
        : undefined;
      res.body.fechaFirma = res.body.fechaFirma
        ? moment(res.body.fechaFirma)
        : undefined;
      res.body.fechaLectura = res.body.fechaLectura
        ? moment(res.body.fechaLectura)
        : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(
    res: EntityArrayResponseType
  ): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((folio: IFolio) => {
        folio.fechaRequerida = folio.fechaRequerida
          ? moment(folio.fechaRequerida)
          : undefined;
        folio.fechaCreacion = folio.fechaCreacion
          ? moment(folio.fechaCreacion)
          : undefined;
        folio.fechaModificacion = folio.fechaModificacion
          ? moment(folio.fechaModificacion)
          : undefined;
        folio.fechaFirma = folio.fechaFirma
          ? moment(folio.fechaFirma)
          : undefined;
        folio.fechaLectura = folio.fechaLectura
          ? moment(folio.fechaLectura)
          : undefined;
      });
    }
    return res;
  }
}
