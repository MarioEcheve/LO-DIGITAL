import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from '../util/request-util';
import { IFolioReferencia } from '../TO/folio-referencia.model';

type EntityResponseType = HttpResponse<IFolioReferencia>;
type EntityArrayResponseType = HttpResponse<IFolioReferencia[]>;

@Injectable({ providedIn: 'root' })
export class FolioReferenciaService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + 'api/folio-referencias';

  constructor(protected http: HttpClient) {}

  create(folioReferencia: IFolioReferencia): Observable<EntityResponseType> {
    return this.http.post<IFolioReferencia>(this.resourceUrl, folioReferencia, { observe: 'response' });
  }

  update(folioReferencia: IFolioReferencia): Observable<EntityResponseType> {
    return this.http.put<IFolioReferencia>(this.resourceUrl, folioReferencia, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFolioReferencia>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFolioReferencia[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
