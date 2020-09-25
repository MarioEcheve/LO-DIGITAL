import { Moment } from "moment";
import { IUsuarioLibro } from "../TO/usuario-libro.model";
import { IUser } from "../TO/user.model";
import { IDependencia } from "../TO/dependencia.model";
import { IPerfilUsuarioDependencia } from "../TO/perfil-usuario-dependencia.model";

export interface IUsuarioDependencia {
  id?: number;
  nombre?: string;
  rut? : string;
  fechaCreacion?: Moment;
  fechaModificacion?: Moment;
  fechaActivacion?: Moment;
  fechaDesactivacion?: Moment;
  estado?: boolean;
  usuarioLibros?: IUsuarioLibro[];
  usuario?: IUser;
  dependencia?: IDependencia;
  perfilUsuarioDependencia?: IPerfilUsuarioDependencia;
  
}

export class UsuarioDependencia implements IUsuarioDependencia {
  constructor(
    public id?: number,
    public nombre?: string,
    public rut? : string,
    public fechaCreacion?: Moment,
    public fechaModificacion?: Moment,
    public fechaActivacion?: Moment,
    public fechaDesactivacion?: Moment,
    public estado?: boolean,
    public usuarioLibros?: IUsuarioLibro[],
    public usuario?: IUser,
    public dependencia?: IDependencia,
    public perfilUsuarioDependencia?: IPerfilUsuarioDependencia
  ) {
    this.estado = this.estado || false;
  }
}
