import { Moment } from "moment";
import { ILibro } from "../TO/libro.model";
import { IDependencia } from "../TO/dependencia.model";
import { IRegion } from "../TO/region.model";
import { ITipoContrato } from "../TO/tipo-contrato.model";
import { IModalidad } from "../TO/modalidad.model";
import { IComuna } from "../TO/comuna.model";
import { ITipoMoneda } from "../TO/tipo-moneda.model";
import { ITipoMonto } from "../TO/tipo-monto.model";
import { IEstadoServicio } from "../TO/estado-servicio.model";

export interface IContrato {
  id?: number;
  fechaInicioServicio?: Moment;
  fechaTerminoServicio?: Moment;
  fechaTerminoAcceso?: Moment;
  observacionesServicio?: string;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  tipoOtro?: string;
  modalidadOtra?: string;
  direccion?: string;
  monto?: number;
  fechaInicio?: Moment;
  fechaTermino?: Moment;
  observaciones?: string;
  nombreContacto?: string;
  telefonoContacto?: string;
  emailContacto?: string;
  idDependenciaContratista?: number;
  libros?: ILibro[];
  dependenciaMandante?: IDependencia;
  region?: IRegion;
  tipoContrato?: ITipoContrato;
  modalidad?: IModalidad;
  comuna?: IComuna;
  tipoMoneda?: ITipoMoneda;
  tipoMonto?: ITipoMonto;
  estadoServicio?: IEstadoServicio;
}

export class Contrato implements IContrato {
  constructor(
    public id?: number,
    public fechaInicioServicio?: Moment,
    public fechaTerminoServicio?: Moment,
    public fechaTerminoAcceso?: Moment,
    public observacionesServicio?: string,
    public codigo?: string,
    public nombre?: string,
    public descripcion?: string,
    public tipoOtro?: string,
    public modalidadOtra?: string,
    public direccion?: string,
    public monto?: number,
    public fechaInicio?: Moment,
    public fechaTermino?: Moment,
    public observaciones?: string,
    public nombreContacto?: string,
    public telefonoContacto?: string,
    public emailContacto?: string,
    public idDependenciaContratista?: number,
    public libros?: ILibro[],
    public dependenciaMandante?: IDependencia,
    public region?: IRegion,
    public tipoContrato?: ITipoContrato,
    public modalidad?: IModalidad,
    public comuna?: IComuna,
    public tipoMoneda?: ITipoMoneda,
    public tipoMonto?: ITipoMonto,
    public estadoServicio?: IEstadoServicio
  ) {}
}
