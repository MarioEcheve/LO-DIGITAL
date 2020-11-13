import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from '../util/request-util';
import { IArchivo } from '../TO/archivo.model';
import { environment } from './../../../environments/environment';

type EntityResponseType = HttpResponse<IArchivo>;
type EntityArrayResponseType = HttpResponse<IArchivo[]>;

@Injectable({ providedIn: 'root' })
export class ArchivoService {
  SERVER_API_URL = environment.apiUrl;
  SERVER_API_URL_NODE = environment.apiUrlNode;
  public resourceUrl = this.SERVER_API_URL + 'api/archivos';
  public resourceaAchivosPorFolio = this.SERVER_API_URL + 'api/archivosPorFolio'

  constructor(protected http: HttpClient) {}

  create(archivo: any): Observable<EntityResponseType> {
    return this.http.post<any>(this.resourceUrl, archivo, { observe: 'response' });
  }
  createGCP(archivo: any): Observable<any> {
    return this.http.post<any>(`${this.SERVER_API_URL_NODE}save`, archivo, {reportProgress : true ,observe: 'events' });
  }
  update(archivo: IArchivo): Observable<EntityResponseType> {
    return this.http.put<IArchivo>(this.resourceUrl, archivo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArchivo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArchivo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  deleteGCP(path: any): Observable<any> {
    return this.http.post<any>(`${this.SERVER_API_URL_NODE}delete`, path, { observe: 'response' });
  }
  dowloadGCP(path: any): Observable<any> {
    return this.http.post<any>(`${this.SERVER_API_URL_NODE}download`, path, { observe: 'response' });
  }
  AchivosPorFolio(idFolio?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption();
    return this.http.get<IArchivo[]>(`${this.resourceaAchivosPorFolio}/${idFolio}`, { params: options, observe: 'response' });
  }
}
