import { IFolio } from "../TO/folio.model";

export interface IArchivo {
  id?: number;
  archivoContentType?: string;
  archivo?: any;
  descripcion?: string;
  size?: string;
  nombre?: string;
  urlArchivo?: string;
  status?: boolean;
  folio?: IFolio;
  value? : number;
}

export class Archivo implements IArchivo {
  constructor(
    public id?: number,
    public archivoContentType?: string,
    public archivo?: any,
    public descripcion?: string,
    public size?: string,
    public nombre?: string,
    public urlArchivo?: string,
    public status?: boolean,
    public folio?: IFolio,
    public value?: number
  ) {
    this.status = this.status || false;
    this.value = 0;
  }
}
