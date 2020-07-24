import { IFolio } from '../TO/folio.model';

export interface IFolioRelacionados {
  id?: number;
  idFolioOrigen?: number;
  idFolioReferencia?: IFolio;
  asunto? :string;
}

export class FolioRelacionados implements IFolioRelacionados {
  constructor(
      public id?: number, 
      public idFolioOrigen?: number, 
      public idFolioReferencia?: IFolio,
      public asunto?: string,
      ) {}
}
