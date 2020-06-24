import { IFolio } from "../TO/folio.model";

export interface ITipoFolio {
  id?: number;
  nombre?: string;
  visibleMaestro?: boolean;
  visibleAuxliar?: boolean;
  visibleMandante?: boolean;
  visibleContratista?: boolean;
  folios?: IFolio[];
}

export class TipoFolio implements ITipoFolio {
  constructor(
    public id?: number,
    public nombre?: string,
    public visibleMaestro?: boolean,
    public visibleAuxliar?: boolean,
    public visibleMandante?: boolean,
    public visibleContratista?: boolean,
    public folios?: IFolio[]
  ) {
    this.visibleMaestro = this.visibleMaestro || false;
    this.visibleAuxliar = this.visibleAuxliar || false;
    this.visibleMandante = this.visibleMandante || false;
    this.visibleContratista = this.visibleContratista || false;
  }
}
