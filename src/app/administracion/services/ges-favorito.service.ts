import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from './../../../environments/environment';

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from '../util/request-util';
import { IGesFavorito } from '../TO/ges-favorito.model';

type EntityResponseType = HttpResponse<IGesFavorito>;
type EntityArrayResponseType = HttpResponse<IGesFavorito[]>;

@Injectable({ providedIn: 'root' })
export class GesFavoritoService {
  SERVER_API_URL = environment.apiUrl;
  public resourceUrl = this.SERVER_API_URL + 'api/ges-favoritos';
  public resourceUrlBuscarFavoritoByFolio = this.SERVER_API_URL + 'api/BuscarFavoritoByFolio';
  public resourceUrlBuscarFavoritoByUsuario= this.SERVER_API_URL + 'api/BuscarFavoritoByUsuario';
  constructor(protected http: HttpClient) {}

  create(gesFavorito: IGesFavorito): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gesFavorito);
    return this.http
      .post<IGesFavorito>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(gesFavorito: IGesFavorito): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gesFavorito);
    return this.http
      .put<IGesFavorito>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGesFavorito>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGesFavorito[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  BuscarFavoritoByFolio(idFolio?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(idFolio);
    return this.http
      .get<IGesFavorito[]>(`${this.resourceUrlBuscarFavoritoByFolio}/${idFolio}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  BuscarFavoritoByUsuario(idUsuario?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(idUsuario);
    return this.http
      .get<IGesFavorito[]>(`${this.resourceUrlBuscarFavoritoByUsuario}/${idUsuario}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  protected convertDateFromClient(gesFavorito: IGesFavorito): IGesFavorito {
    const copy: IGesFavorito = Object.assign({}, gesFavorito, {
      fechaCreacion: gesFavorito.fechaCreacion && gesFavorito.fechaCreacion.isValid() ? gesFavorito.fechaCreacion.toJSON() : undefined,
      fechaModificacion:
        gesFavorito.fechaModificacion && gesFavorito.fechaModificacion.isValid() ? gesFavorito.fechaModificacion.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaCreacion = res.body.fechaCreacion ? moment(res.body.fechaCreacion) : undefined;
      res.body.fechaModificacion = res.body.fechaModificacion ? moment(res.body.fechaModificacion) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((gesFavorito: IGesFavorito) => {
        gesFavorito.fechaCreacion = gesFavorito.fechaCreacion ? moment(gesFavorito.fechaCreacion) : undefined;
        gesFavorito.fechaModificacion = gesFavorito.fechaModificacion ? moment(gesFavorito.fechaModificacion) : undefined;
      });
    }
    return res;
  }
}
