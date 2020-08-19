import { Moment } from "moment";
import { IGesAlerta } from "../TO/ges-alerta.model";
import { IGesNota } from "../TO/ges-nota.model";
import { IGesFavorito } from "../TO/ges-favorito.model";
import { ILibro } from "../TO/libro.model";
import { IUsuarioDependencia } from "../TO/usuario-dependencia.model";
import { IUsuarioLibroPerfil } from "../TO/usuario-libro-perfil.model";

export interface IUsuarioLibro {
  id?: number;
  nombre?: string;
  estado?: boolean;
  cargoFuncion?: string;
  fechaCreacion?: Moment;
  fechaModificacion?: Moment;
  gesAlertas?: IGesAlerta[];
  gesNotas?: IGesNota[];
  gesFavoritos?: IGesFavorito[];
  libro?: ILibro;
  usuarioDependencia?: IUsuarioDependencia;
  perfilUsuarioLibro?: IUsuarioLibroPerfil;
  idUsuarioDependencia?: number;
  nombreEstado? : string;
}

export class UsuarioLibro implements IUsuarioLibro {
  constructor(
    public id?: number,
    public nombre?: string,
    public estado?: boolean,
    public cargoFuncion?: string,
    public fechaCreacion?: Moment,
    public fechaModificacion?: Moment,
    public gesAlertas?: IGesAlerta[],
    public gesNotas?: IGesNota[],
    public gesFavoritos?: IGesFavorito[],
    public libro?: ILibro,
    public usuarioDependencia?: IUsuarioDependencia,
    public perfilUsuarioLibro?: IUsuarioLibroPerfil,
    public idUsuarioDependencia?: number,
    public nombreEstado?: string,
  ) {
    this.estado = this.estado || false;
  }
}
