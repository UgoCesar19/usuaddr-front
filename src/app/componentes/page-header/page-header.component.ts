import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private usuarioService: UsuarioService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public getUsuarioNome(): string {
    return this.usuarioService.getUsuarioLogado().nome;
  }
}