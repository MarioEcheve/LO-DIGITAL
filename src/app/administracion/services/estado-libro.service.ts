import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from './../../../environments/environment';

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IEstadoLibro } from "../TO/estado-libro.model";

type EntityResponseType = HttpResponse<IEstadoLibro>;
type EntityArrayResponseType = HttpResponse<IEstadoLibro[]>;

@Injectable({ providedIn: "root" })
export class EstadoLibroService {
  SERVER_API_URL = environment.apiUrl;
  public resourceUrl = this.SERVER_API_URL + "api/estado-libros";

  constructor(protected http: HttpClient) {}

  create(estadoLibro: IEstadoLibro): Observable<EntityResponseType> {
    return this.http.post<IEstadoLibro>(this.resourceUrl, estadoLibro, {
      observe: "response",
    });
  }

  update(estadoLibro: IEstadoLibro): Observable<EntityResponseType> {
    return this.http.put<IEstadoLibro>(this.resourceUrl, estadoLibro, {
      observe: "response",
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstadoLibro>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstadoLibro[]>(this.resourceUrl, {
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
