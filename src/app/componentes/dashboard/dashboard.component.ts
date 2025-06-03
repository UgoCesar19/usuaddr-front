import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { EnderecoService } from '../../services/endereco.service';
import { Usuario } from '../../model/usuario.model';
import { Endereco } from '../../model/endereco.model';
import { Router } from '@angular/router';
import { HeaderComponent } from '../page-header/page-header.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  usuarios!: Usuario[];
  enderecos!: Endereco[];

  constructor(
    private usuarioService: UsuarioService,
    private enderecoService: EnderecoService,
    private authService: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.getUsers();
    this.getAddress();
  }

  public getUsers(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data.content;
        
        let usuario: Usuario = this.usuarios.filter((u: Usuario) => {
          return u.email == this.authService.getUsuarioLogadoEmail();
        })[0];

        this.usuarioService.setUsuarioLogado(usuario);
      }
    });
  }

  public addUser() {
    this.router.navigate(["usuarios/form"]);
  }

  public addAddress(usuarioId: number) {
    this.enderecoService.setUsuarioEditado(usuarioId);
    this.router.navigate(["enderecos/form"]);
  }

  private getAddress(): void {
    this.enderecoService.getEnderecos().subscribe({
      next: (data: any) => {
        this.enderecos = data.content;
      }
    });
  }

  public editUser(user: Usuario): void {
    this.usuarioService.setUsuarioEditado(user);
    this.router.navigate(["usuarios/form"]);
  }

  public editAddress(address: Endereco): void {
    this.enderecoService.setEnderecoEditado(address);
    this.router.navigate(["enderecos/form"]);
  }

  public deleteUser(id: number): void {
    this.usuarioService.delete(id).subscribe({
      next: () => {
        this.getUsers();
        this.getAddress();
      }
    });
  }

  public deleteAddress(id: number): void {
    this.enderecoService.delete(id).subscribe({
      next: (retorno: any) => {
        this.getAddress();
      }
    });
  }

  public habilitaOpcao(usuarioId: number): boolean {
    if (this.usuarioService.getUsuarioLogado().perfis[0].authority == "ROLE_ADMIN")
      return true;
    if (usuarioId == this.usuarioService.getUsuarioLogado().id)
      return true;
    return false;
  }

}