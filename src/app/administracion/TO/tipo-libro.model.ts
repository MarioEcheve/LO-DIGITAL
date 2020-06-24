import { ILibro } from "../TO/libro.model";

export interface ITipoLibro {
  id?: number;
  descripcion?: string;
  libros?: ILibro[];
}

export class TipoLibro implements ITipoLibro {
  constructor(
    public id?: number,
    public descripcion?: string,
    public libros?: ILibro[]
  ) {}
}
