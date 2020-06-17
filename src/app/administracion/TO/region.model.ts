import { IEntidad } from "../TO/entidad.model";
import { IDependencia } from "../TO/dependencia.model";
import { IContrato } from "../TO/contrato.model";

export interface IRegion {
  id?: number;
  nombre?: string;
  entidads?: IEntidad[];
  dependencias?: IDependencia[];
  contratoes?: IContrato[];
}

export class Region implements IRegion {
  constructor(
    public id?: number,
    public nombre?: string,
    public entidads?: IEntidad[],
    public dependencias?: IDependencia[],
    public contratoes?: IContrato[]
  ) {}
}
