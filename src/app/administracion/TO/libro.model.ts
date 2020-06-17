import { Moment } from "moment";
import { IFolio } from "../TO/folio.model";
import { IUsuarioLibro } from "../TO/usuario-libro.model";
import { IContrato } from "../TO/contrato.model";
import { ITipoLibro } from "../TO/tipo-libro.model";
import { ITipoFirma } from "../TO/tipo-firma.model";
import { IEstadoLibro } from "../TO/estado-libro.model";

export interface ILibro {
  id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  fechaCreacion?: Moment;
  fechaApertura?: Moment;
  fechaCierre?: Moment;
  aperturaMandante?: boolean;
  aperturaContratista?: boolean;
  escrituraMandante?: boolean;
  escrituraContratista?: boolean;
  cierreMandante?: boolean;
  cierreContratista?: boolean;
  lecturaMandante?: boolean;
  lecturaContratista?: boolean;
  folios?: IFolio[];
  usuarioLibros?: IUsuarioLibro[];
  contrato?: IContrato;
  tipoLibro?: ITipoLibro;
  tipoFirma?: ITipoFirma;
  estadoLibro?: IEstadoLibro;
}

export class Libro implements ILibro {
  constructor(
    public id?: number,
    public codigo?: string,
    public nombre?: string,
    public descripcion?: string,
    public fechaCreacion?: Moment,
    public fechaApertura?: Moment,
    public fechaCierre?: Moment,
    public aperturaMandante?: boolean,
    public aperturaContratista?: boolean,
    public escrituraMandante?: boolean,
    public escrituraContratista?: boolean,
    public cierreMandante?: boolean,
    public cierreContratista?: boolean,
    public lecturaMandante?: boolean,
    public lecturaContratista?: boolean,
    public folios?: IFolio[],
    public usuarioLibros?: IUsuarioLibro[],
    public contrato?: IContrato,
    public tipoLibro?: ITipoLibro,
    public tipoFirma?: ITipoFirma,
    public estadoLibro?: IEstadoLibro
  ) {
    this.aperturaMandante = this.aperturaMandante || false;
    this.aperturaContratista = this.aperturaContratista || false;
    this.escrituraMandante = this.escrituraMandante || false;
    this.escrituraContratista = this.escrituraContratista || false;
    this.cierreMandante = this.cierreMandante || false;
    this.cierreContratista = this.cierreContratista || false;
    this.lecturaMandante = this.lecturaMandante || false;
    this.lecturaContratista = this.lecturaContratista || false;
  }
}
