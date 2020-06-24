import { IContrato } from "../TO/contrato.model";
import { IEntidad } from "../TO/entidad.model";
import { IDependencia } from "../TO/dependencia.model";

export interface IComuna {
  id?: number;
  nombre?: string;
  contratoes?: IContrato[];
  entidads?: IEntidad[];
  dependencias?: IDependencia[];
}

export class Comuna implements IComuna {
  constructor(
    public id?: number,
    public nombre?: string,
    public contratoes?: IContrato[],
    public entidads?: IEntidad[],
    public dependencias?: IDependencia[]
  ) {}
}
