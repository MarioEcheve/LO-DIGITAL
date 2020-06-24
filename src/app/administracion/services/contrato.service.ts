import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IContrato } from "../TO/contrato.model";

type EntityResponseType = HttpResponse<IContrato>;
type EntityArrayResponseType = HttpResponse<IContrato[]>;

@Injectable({ providedIn: "root" })
export class ContratoService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/contratoes";

  constructor(protected http: HttpClient) {}

  create(contrato: IContrato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contrato);
    return this.http
      .post<IContrato>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(contrato: IContrato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contrato);
    return this.http
      .put<IContrato>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IContrato>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IContrato[]>(this.resourceUrl, {
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

  protected convertDateFromClient(contrato: IContrato): IContrato {
    const copy: IContrato = Object.assign({}, contrato, {
      fechaInicioServicio:
        contrato.fechaInicioServicio && contrato.fechaInicioServicio.isValid()
          ? contrato.fechaInicioServicio.toJSON()
          : undefined,
      fechaTerminoServicio:
        contrato.fechaTerminoServicio && contrato.fechaTerminoServicio.isValid()
          ? contrato.fechaTerminoServicio.toJSON()
          : undefined,
      fechaTerminoAcceso:
        contrato.fechaTerminoAcceso && contrato.fechaTerminoAcceso.isValid()
          ? contrato.fechaTerminoAcceso.toJSON()
          : undefined,
      fechaInicio:
        contrato.fechaInicio && contrato.fechaInicio.isValid()
          ? contrato.fechaInicio.toJSON()
          : undefined,
      fechaTermino:
        contrato.fechaTermino && contrato.fechaTermino.isValid()
          ? contrato.fechaTermino.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaInicioServicio = res.body.fechaInicioServicio
        ? moment(res.body.fechaInicioServicio)
        : undefined;
      res.body.fechaTerminoServicio = res.body.fechaTerminoServicio
        ? moment(res.body.fechaTerminoServicio)
        : undefined;
      res.body.fechaTerminoAcceso = res.body.fechaTerminoAcceso
        ? moment(res.body.fechaTerminoAcceso)
        : undefined;
      res.body.fechaInicio = res.body.fechaInicio
        ? moment(res.body.fechaInicio)
        : undefined;
      res.body.fechaTermino = res.body.fechaTermino
        ? moment(res.body.fechaTermino)
        : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(
    res: EntityArrayResponseType
  ): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((contrato: IContrato) => {
        contrato.fechaInicioServicio = contrato.fechaInicioServicio
          ? moment(contrato.fechaInicioServicio)
          : undefined;
        contrato.fechaTerminoServicio = contrato.fechaTerminoServicio
          ? moment(contrato.fechaTerminoServicio)
          : undefined;
        contrato.fechaTerminoAcceso = contrato.fechaTerminoAcceso
          ? moment(contrato.fechaTerminoAcceso)
          : undefined;
        contrato.fechaInicio = contrato.fechaInicio
          ? moment(contrato.fechaInicio)
          : undefined;
        contrato.fechaTermino = contrato.fechaTermino
          ? moment(contrato.fechaTermino)
          : undefined;
      });
    }
    return res;
  }
}
