import { Moment } from "moment";
import { IFolio } from "../TO/folio.model";
import { IUsuarioLibro } from "../TO/usuario-libro.model";

export interface IGesNota {
  id?: number;
  nota?: string;
  fechaCreacion?: Moment;
  fechaModificacion?: Moment;
  folio?: IFolio;
  usuarioLibro?: IUsuarioLibro;
}

export class GesNota implements IGesNota {
  constructor(
    public id?: number,
    public nota?: string,
    public fechaCreacion?: Moment,
    public fechaModificacion?: Moment,
    public folio?: IFolio,
    public usuarioLibro?: IUsuarioLibro
  ) {}
}
