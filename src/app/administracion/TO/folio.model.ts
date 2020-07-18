import { Moment } from "moment";
import { IArchivo } from "../TO/archivo.model";
import { IGesAlerta } from "../TO/ges-alerta.model";
import { IGesNota } from "../TO/ges-nota.model";
import { IGesFavorito } from "../TO/ges-favorito.model";
import { ILibro } from "../TO/libro.model";
import { ITipoFolio } from "../TO/tipo-folio.model";
import { IEstadoRespuesta } from "../TO/estado-respuesta.model";

export interface IFolio {
  id?: number;
  idUsuarioCreador?: number;
  idUsuarioFirma?: number;
  idUsuarioLectura?: number;
  numeroFolio?: number;
  requiereRespuesta?: boolean;
  fechaRequerida?: Moment;
  estadoLectura?: boolean;
  estadoFolio?: boolean;
  entidadCreacion?: boolean;
  fechaCreacion?: Moment;
  idlibroRelacionado?: number;
  idFolioRelacionado?: number;
  idFolioRespuesta?: number;
  fechaModificacion?: Moment;
  fechaFirma?: Moment;
  fechaLectura?: Moment;
  asunto?: string;
  anotacion?: string;
  pdfFirmadoContentType?: string;
  pdfFirmado?: any;
  pdfLecturaContentType?: string;
  pdfLectura?: any;
  archivos?: IArchivo[];
  gesAlertas?: IGesAlerta[];
  gesNotas?: IGesNota[];
  gesFavoritos?: IGesFavorito[];
  libro?: ILibro;
  tipoFolio?: ITipoFolio;
  estadoRespuesta?: IEstadoRespuesta;
  emisor: string;
  color : string;
}

export class Folio implements IFolio {
  constructor(
    public id?: number,
    public idUsuarioCreador?: number,
    public idUsuarioFirma?: number,
    public idUsuarioLectura?: number,
    public numeroFolio?: number,
    public requiereRespuesta?: boolean,
    public fechaRequerida?: Moment,
    public estadoLectura?: boolean,
    public estadoFolio?: boolean,
    public entidadCreacion?: boolean,
    public idlibroRelacionado?: number,
    public idFolioRelacionado?: number,
    public idFolioRespuesta?: number,
    public fechaCreacion?: Moment,
    public fechaModificacion?: Moment,
    public fechaFirma?: Moment,
    public fechaLectura?: Moment,
    public asunto?: string,
    public anotacion?: string,
    public pdfFirmadoContentType?: string,
    public pdfFirmado?: any,
    public pdfLecturaContentType?: string,
    public pdfLectura?: any,
    public archivos?: IArchivo[],
    public gesAlertas?: IGesAlerta[],
    public gesNotas?: IGesNota[],
    public gesFavoritos?: IGesFavorito[],
    public libro?: ILibro,
    public tipoFolio?: ITipoFolio,
    public estadoRespuesta?: IEstadoRespuesta,
    public emisor = "",
    public color = ""
  ) {
    this.requiereRespuesta = this.requiereRespuesta || false;
    this.estadoLectura = this.estadoLectura || false;
    this.estadoFolio = this.estadoFolio || false;
    this.entidadCreacion = this.entidadCreacion || false;
    this.emisor = this.emisor;
    this.color = color;
  }
}
