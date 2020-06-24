import { Moment } from "moment";
import { IUsuarioDependencia } from "../TO/usuario-dependencia.model";
import { IContrato } from "../TO/contrato.model";
import { IEntidad } from "../TO/entidad.model";
import { IRegion } from "../TO/region.model";
import { IComuna } from "../TO/comuna.model";

export interface IDependencia {
  id?: number;
  nombre?: string;
  direccion?: string;
  descripcion?: string;
  fechaCreacion?: Moment;
  fechaModificacion?: Moment;
  usuarioDependencias?: IUsuarioDependencia[];
  contratoes?: IContrato[];
  entidad?: IEntidad;
  region?: IRegion;
  comuna?: IComuna;
}

export class Dependencia implements IDependencia {
  constructor(
    public id?: number,
    public nombre?: string,
    public direccion?: string,
    public descripcion?: string,
    public fechaCreacion?: Moment,
    public fechaModificacion?: Moment,
    public usuarioDependencias?: IUsuarioDependencia[],
    public contratoes?: IContrato[],
    public entidad?: IEntidad,
    public region?: IRegion,
    public comuna?: IComuna
  ) {}
}
