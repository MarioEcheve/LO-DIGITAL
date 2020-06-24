import { IEntidad } from "../TO/entidad.model";

export interface ITipoEntidad {
  id?: number;
  nombre?: string;
  entidads?: IEntidad[];
}

export class TipoEntidad implements ITipoEntidad {
  constructor(
    public id?: number,
    public nombre?: string,
    public entidads?: IEntidad[]
  ) {}
}
