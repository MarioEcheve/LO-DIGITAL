import { IContrato } from "../TO/contrato.model";

export interface ITipoContrato {
  id?: number;
  nombre?: string;
  contratoes?: IContrato[];
}

export class TipoContrato implements ITipoContrato {
  constructor(
    public id?: number,
    public nombre?: string,
    public contratoes?: IContrato[]
  ) {}
}
