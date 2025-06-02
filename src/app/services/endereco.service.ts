import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Endereco } from '../model/endereco.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private readonly enderecosEndpoint = `${environment.apiUrl}/enderecos`;
  
  private usuarioEditado!: number;

  constructor(private http: HttpClient) {}

  public getEnderecos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.enderecosEndpoint);
  }

  public save(usuarioId: number, endereco: Partial<Endereco>): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.enderecosEndpoint}/${usuarioId}`, endereco);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.enderecosEndpoint}/${id}`);
  }

  public getUsuarioEditado(): number {
    return this.usuarioEditado;
  }

  public setUsuarioEditado(usuarioId: number): void {
    this.usuarioEditado = usuarioId;
  }

}
