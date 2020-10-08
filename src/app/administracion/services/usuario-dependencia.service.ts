import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as moment from "moment";

//import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from "../util/request-util";
import { IUsuarioDependencia } from "../TO/usuario-dependencia.model";
import { environment } from './../../../environments/environment';

type EntityResponseType = HttpResponse<IUsuarioDependencia>;
type EntityArrayResponseType = HttpResponse<IUsuarioDependencia[]>;

@Injectable({ providedIn: "root" })
export class UsuarioDependenciaService {
  SERVER_API_URL = environment.apiUrl;
  public resourceUrl = this.SERVER_API_URL + "api/usuario-dependencias";
  public resourceUrlFindUserByUsuarioDependencia = this.SERVER_API_URL + "api/findUserByUsuarioDependencia";
  public resourceUrlFindUserByUsuarioDependencia2 = this.SERVER_API_URL + "api/findUserByUsuarioDependencia2";

  public resourceUrlFindUserByUsuarioDependenciaRolUser = this.SERVER_API_URL + "api/findUserByUsuarioDependenciaRolUser";
  public resourceUrlFindContratosByDependencia= this.SERVER_API_URL + "api/findContratosByDependencia";
  public resourceUrlFindContratosByUsuarioNormal= this.SERVER_API_URL + "api/findContratosByUsuarioNormal";
  public resourceUrlValidaClave= this.SERVER_API_URL + "api/validaClave";

  
  constructor(protected http: HttpClient) {}

  create(
    usuarioDependencia: IUsuarioDependencia
  ): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuarioDependencia);
    return this.http
      .post<IUsuarioDependencia>(this.resourceUrl, copy, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(
    usuarioDependencia: IUsuarioDependencia
  ): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(usuarioDependencia);
    return this.http
      .put<IUsuarioDependencia>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findUserByUsuarioDependencia(idUsuario: number): Observable<EntityResponseType> {
    return this.http
      .get<IUsuarioDependencia>(`${this.resourceUrlFindUserByUsuarioDependencia}/${idUsuario}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findUserByUsuarioDependencia2(idUsuario: number): Observable<EntityResponseType> {
    return this.http
      .get<IUsuarioDependencia>(`${this.resourceUrlFindUserByUsuarioDependencia2}/${idUsuario}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findUserByUsuarioDependenciaRolUser(idUsuario: number): Observable<EntityResponseType> {
    return this.http
      .get<IUsuarioDependencia>(`${this.resourceUrlFindUserByUsuarioDependenciaRolUser}/${idUsuario}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findContratosByDependencia(idDependencia?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption();
    return this.http
      .get<IUsuarioDependencia[]>(`${this.resourceUrlFindContratosByDependencia}/${idDependencia}`, {
        params: options,
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }
  findContratosByUsuarioNormal(idUsuario? : number): Observable<EntityArrayResponseType> {
    const options = createRequestOption();
    return this.http
      .get<IUsuarioDependencia[]>(`${this.resourceUrlFindContratosByUsuarioNormal}/${idUsuario}`, {
        params: options,
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }
  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUsuarioDependencia>(`${this.resourceUrl}/${id}`, {
        observe: "response",
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUsuarioDependencia[]>(this.resourceUrl, {
        params: options,
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res) 
        )
      );
  }
  validateClave(clave : number , idUsuario : number) : Observable<any> {
    return this.http
      .get<any>(`${this.resourceUrlValidaClave}/${clave}/${idUsuario}`, {
        observe: "response",
      })
      .pipe(map((res) =>res));
  }
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  protected convertDateFromClient(
    usuarioDependencia: IUsuarioDependencia
  ): IUsuarioDependencia {
    const copy: IUsuarioDependencia = Object.assign({}, usuarioDependencia, {
      fechaCreacion:
        usuarioDependencia.fechaCreacion &&
        usuarioDependencia.fechaCreacion.isValid()
          ? usuarioDependencia.fechaCreacion.toJSON()
          : undefined,
      fechaModificacion:
        usuarioDependencia.fechaModificacion &&
        usuarioDependencia.fechaModificacion.isValid()
          ? usuarioDependencia.fechaModificacion.toJSON()
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
      res.body.forEach((usuarioDependencia: IUsuarioDependencia) => {
        usuarioDependencia.fechaCreacion = usuarioDependencia.fechaCreacion
          ? moment(usuarioDependencia.fechaCreacion)
          : undefined;
        usuarioDependencia.fechaModificacion = usuarioDependencia.fechaModificacion
          ? moment(usuarioDependencia.fechaModificacion)
          : undefined;
      });
    }
    return res;
  }
}
