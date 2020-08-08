import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, EMPTY } from "rxjs";
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
  public resourceUrlFolioReferencias =
    this.SERVER_API_URL + "api/folioReferencias";
  public resourceUrlFiltroFolioPersonalizado=
    this.SERVER_API_URL + "api/filtroFolioPersonalizado";
    
  //private folioReferencia = new BehaviorSubject<any>({});
  //folioReferenciaActuales = this.folioReferencia.asObservable();
  private folioRelacionadoSubject = new BehaviorSubject([]);
  private folioRelacionado: IFolio[];

  private listafolioRelacionadoSubject = new BehaviorSubject([]);
  private listafolioRelacionado: IFolio[] = [];

  private navBarSubject = new BehaviorSubject(0);
  private valorNavBar: any="";

  constructor(protected http: HttpClient) {
    
  }
  navBarChange(valor: any) {
    /**
    * Evitar hacer this.folio.push() pues estaríamos modificando los valores directamente,
    * se debe generar un nuevo array !!!!.
    */
    this.valorNavBar = valor;
    this.refreshNavBar();
  }

  ChangeNavBarSubject(): Observable<any> {
    return this.navBarSubject.asObservable();
  }


  getFolioRelacionadoSubject(): Observable<IFolio[]> {
    return this.folioRelacionadoSubject.asObservable();
  }

  getListaFolioRelacionadoSubject(): Observable<IFolio[]> {
    return this.listafolioRelacionadoSubject.asObservable();
  }

  private refresh() {
    // Emitir los nuevos valores para que todos los que dependan se actualicen.
    this.folioRelacionadoSubject.next(this.folioRelacionado);
  }

  private refreshNavBar() {
    // Emitir los nuevos valores para que todos los que dependan se actualicen.
    this.navBarSubject.next(this.valorNavBar);
  }

   clear() {
    // Emitir los nuevos valores para que todos los que dependan se actualicen.
    this.listafolioRelacionadoSubject.next([]);
    this.refresh();
  }


  public refreshLista() {
    // Emitir los nuevos valores para que todos los que dependan se actualicen.
    console.log(this.listafolioRelacionado);
    this.listafolioRelacionadoSubject.next(this.listafolioRelacionado);
  }

  createNewColeccionFolioReferencia(folio: IFolio[]) {
    /**
    * Evitar hacer this.folio.push() pues estaríamos modificando los valores directamente,
    * se debe generar un nuevo array !!!!.
    */
    this.folioRelacionado = folio;
    this.refresh();
  }

  createNewListaColeccionFolioReferencia(folio: any, setValue?:Boolean, listaFolio?:any) {
    /**
    * Evitar hacer this.folio.push() pues estaríamos modificando los valores directamente,
    * se debe generar un nuevo array !!!!.
    */
   let valor = [];
   valor = listaFolio;
   if(setValue){
    this.listafolioRelacionado = valor;
    this.refreshLista();
   }else{
    this.listafolioRelacionado.push(folio);
    this.refreshLista();
   }
  }
  removeFolioReferencia(folio : IFolio, contador? : Boolean){
    const index = this.listafolioRelacionado.indexOf(folio);
    //console.log('imprimiendo en el servicio');
    //console.log(this.listafolioRelacionado);
    if(contador===false){
      this.listafolioRelacionado = [];
      this.refreshLista();
    }else{
        if(this.listafolioRelacionado.length === 1){
          this.listafolioRelacionado.splice(index, 1);
          this.listafolioRelacionado = [];
          //this.listafolioRelacionado.splice(index, 1);
          this.refreshLista();
          this.clear();
          console.log(this.listafolioRelacionado);
        } else{
          this.listafolioRelacionado.splice(index, 1);
          this.refreshLista();
        }
        
    }
    
  }

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
  }s

  FiltroFolioPersonalizado(idlibro :number , emisor : string , receptor : string , asunto: string,): Observable<EntityArrayResponseType> {
    if(emisor === ""){
      emisor = "null"
    }
    if(receptor ===""){
      receptor = "null";
    }
    if(asunto === ""){
      asunto = "null"
    }
    const options = createRequestOption();
    return this.http
      .get<IFolio[]>(`${this.resourceUrlFiltroFolioPersonalizado}/${idlibro}/${emisor}/${receptor}/${asunto}`, { params: options, observe: "response" })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
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

  foliosReferencias(id?: any): Observable<any> {
    const options = createRequestOption(id);
    return this.http
      .get<any>(`${this.resourceUrlFolioReferencias}/${id}`, { params: options, observe: "response" });
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
