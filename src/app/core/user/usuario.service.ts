import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuario = new BehaviorSubject<IUser>({});
  usuarioActual = this.usuario.asObservable();

  constructor() {}

  changeUsuarioActual(list: any) {
    this.usuario.next(list);
  }
}
