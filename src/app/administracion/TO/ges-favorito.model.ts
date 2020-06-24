import { Moment } from "moment";
import { IFolio } from "../TO/folio.model";
import { IUsuarioLibro } from "../TO/usuario-libro.model";

export interface IGesFavorito {
  id?: number;
  nota?: string;
  fechaCreacion?: Moment;
  fechaModificacion?: Moment;
  favorito?: boolean;
  folio?: IFolio;
  usuarioLibro?: IUsuarioLibro;
}

export class GesFavorito implements IGesFavorito {
  constructor(
    public id?: number,
    public nota?: string,
    public fechaCreacion?: Moment,
    public fechaModificacion?: Moment,
    public favorito?: boolean,
    public folio?: IFolio,
    public usuarioLibro?: IUsuarioLibro
  ) {
    this.favorito = this.favorito || false;
  }
}
