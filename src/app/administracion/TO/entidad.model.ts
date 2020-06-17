import { Moment } from "moment";
import { IDependencia } from "../TO/dependencia.model";
import { IRegion } from "../TO/region.model";
import { ITipoEntidad } from "../TO/tipo-entidad.model";
import { IActividadRubro } from "../TO/actividad-rubro.model";
import { IComuna } from "../TO/comuna.model";

export interface IEntidad {
  id?: number;
  rut?: string;
  nombre?: string;
  direccion?: string;
  fechaCreacion?: Moment;
  fechaModificacion?: Moment;
  dependencias?: IDependencia[];
  region?: IRegion;
  tipoEntidad?: ITipoEntidad;
  actividadRubro?: IActividadRubro;
  comuna?: IComuna;
}

export class Entidad implements IEntidad {
  constructor(
    public id?: number,
    public rut?: string,
    public nombre?: string,
    public direccion?: string,
    public fechaCreacion?: Moment,
    public fechaModificacion?: Moment,
    public dependencias?: IDependencia[],
    public region?: IRegion,
    public tipoEntidad?: ITipoEntidad,
    public actividadRubro?: IActividadRubro,
    public comuna?: IComuna
  ) {}
}
