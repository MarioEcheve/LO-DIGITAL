import { IFolio } from "../TO/folio.model";

export interface IArchivo {
  id?: number;
  archivoContentType?: string;
  archivo?: any;
  descripcion?: string;
  size?: string;
  folio?: IFolio;
}

export class Archivo implements IArchivo {
  constructor(
    public id?: number,
    public archivoContentType?: string,
    public archivo?: any,
    public descripcion?: string,
    public size?: string,
    public folio?: IFolio
  ) {}
}
