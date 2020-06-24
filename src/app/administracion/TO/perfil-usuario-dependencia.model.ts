import { IUsuarioDependencia } from "../TO/usuario-dependencia.model";

export interface IPerfilUsuarioDependencia {
  id?: number;
  nombre?: string;
  usuarioDependencias?: IUsuarioDependencia[];
}

export class PerfilUsuarioDependencia implements IPerfilUsuarioDependencia {
  constructor(
    public id?: number,
    public nombre?: string,
    public usuarioDependencias?: IUsuarioDependencia[]
  ) {}
}
