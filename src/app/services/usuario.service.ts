import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../model/usuario.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly usuariosEndpoint = `${environment.apiUrl}/usuarios`;

  private usuarioEditado: Usuario | undefined;

  private usuarioLogado!: Usuario;

  constructor(private http: HttpClient) {}

  public getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.usuariosEndpoint);
  }

  public save(usuario: Partial<Usuario>): Observable<Usuario> {
    if (usuario.id) {
      return this.http.put<Usuario>(this.usuariosEndpoint, usuario);
    } else {
      return this.http.post<Usuario>(this.usuariosEndpoint, usuario);
    }
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usuariosEndpoint}/${id}`);
  }

  public getUsuarioEditado(): Usuario | undefined {
    return this.usuarioEditado;
  }

  public setUsuarioEditado(usuario: Usuario | undefined): void {
    this.usuarioEditado = usuario;
  }

  public getUsuarioLogado(): Usuario {
    return this.usuarioLogado;
  }

  public setUsuarioLogado(usuario: Usuario): void {
    this.usuarioLogado = usuario;
  }

}
