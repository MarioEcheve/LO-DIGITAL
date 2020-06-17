import { IFolio } from "../TO/folio.model";

export interface IArchivo {
  id?: number;
  archivoContentType?: string;
  archivo?: any;
  descripcion?: string;
  size?: number;
  folio?: IFolio;
}

export class Archivo implements IArchivo {
  constructor(
    public id?: number,
    public archivoContentType?: string,
    public archivo?: any,
    public descripcion?: string,
    public size?: number,
    public folio?: IFolio
  ) {}
}
