import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';
import { EnderecoService } from '../services/endereco.service';
import { Usuario } from '../model/usuario.model';
import { Endereco } from '../model/endereco.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  usuarios!: Usuario[];
  enderecos!: Endereco[];

  constructor(
    private usuarioService: UsuarioService,
    private enderecoService: EnderecoService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data.content;
      }
    });

    this.enderecoService.getEnderecos().subscribe({
      next: (data: any) => {
        this.enderecos = data.content;
      }
    });

  }

  addUser() {
    this.router.navigate(["usuarios/form"]);
  }

  addAddress(usuarioId: number) {
    this.enderecoService.setUsuarioEditado(usuarioId);
    this.router.navigate(["enderecos/form"]);
  }

}