import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../model/auth-response.model';
import { Usuario } from '../model/usuario.model';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiBasePath = environment.apiUrl;

  private authResponse: AuthResponse | undefined;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: any): void {
    this.http.post<AuthResponse>(`${this.apiBasePath}/autenticar`, credentials).subscribe({
      next: (response: AuthResponse) => {
        this.authResponse = response;
        this.router.navigateByUrl('/');
      }
    });
  }

  getTokens(): AuthResponse | undefined {
    return this.authResponse;
  }

  setTokens(response: AuthResponse): void {
    this.authResponse = response;
  }

  public getUsuarioLogadoEmail(): string | undefined {
    if (this.authResponse?.tokenAcesso)
      return jwtDecode<JwtPayload>(this.authResponse?.tokenAcesso).sub;
    return undefined;
  }

  logout(): void {
    this.authResponse = undefined;
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return !!this.getTokens()?.tokenAcesso;
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiBasePath}/registrar`, userData);
  }
  
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBasePath}/atualizar-autenticacao`, this.authResponse?.refreshToken);
  }

}