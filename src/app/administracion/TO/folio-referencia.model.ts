import { IFolio } from './folio.model';

export interface IFolioReferencia {
  id?: number;
  asunto?: string;
  idFolioOrigen?: number;
  idFolioReferencia?: number;
  folios?: IFolio[];
}

export class FolioReferencia implements IFolioReferencia {
  constructor(
    public id?: number,
    public asunto?: string,
    public idFolioOrigen?: number,
    public idFolioReferencia?: number,
    public folios?: IFolio[]
  ) {}
}
