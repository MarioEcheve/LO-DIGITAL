import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IUsuarioLibroPerfil } from "../TO/usuario-libro-perfil.model";

type EntityResponseType = HttpResponse<IUsuarioLibroPerfil>;
type EntityArrayResponseType = HttpResponse<IUsuarioLibroPerfil[]>;

@Injectable({ providedIn: "root" })
export class UsuarioLibroPerfilService {
  SERVER_API_URL = "http://localhost:8080/";
  public resourceUrl = this.SERVER_API_URL + "api/usuario-libro-perfils";

  constructor(protected http: HttpClient) {}

  create(
    usuarioLibroPerfil: IUsuarioLibroPerfil
  ): Observable<EntityResponseType> {
    return this.http.post<IUsuarioLibroPerfil>(
      this.resourceUrl,
      usuarioLibroPerfil,
      { observe: "response" }
    );
  }

  update(
    usuarioLibroPerfil: IUsuarioLibroPerfil
  ): Observable<EntityResponseType> {
    return this.http.put<IUsuarioLibroPerfil>(
      this.resourceUrl,
      usuarioLibroPerfil,
      { observe: "response" }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUsuarioLibroPerfil>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsuarioLibroPerfil[]>(this.resourceUrl, {
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
