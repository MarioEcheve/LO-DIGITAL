import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { ITipoContrato } from "../TO/tipo-contrato.model";

type EntityResponseType = HttpResponse<ITipoContrato>;
type EntityArrayResponseType = HttpResponse<ITipoContrato[]>;

@Injectable({ providedIn: "root" })
export class TipoContratoService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/tipo-contratoes";

  constructor(protected http: HttpClient) {}

  create(tipoContrato: ITipoContrato): Observable<EntityResponseType> {
    return this.http.post<ITipoContrato>(this.resourceUrl, tipoContrato, {
      observe: "response",
    });
  }

  update(tipoContrato: ITipoContrato): Observable<EntityResponseType> {
    return this.http.put<ITipoContrato>(this.resourceUrl, tipoContrato, {
      observe: "response",
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITipoContrato>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoContrato[]>(this.resourceUrl, {
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
