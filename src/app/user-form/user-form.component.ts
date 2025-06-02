import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { OnInit } from '../../../node_modules/@angular/core/index';
import { Usuario } from '../model/usuario.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.form = this.fb.group({
      id: [null],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      nome: ['', Validators.required]
    });
  }

  public ngOnInit(): void {
    let usuario: Usuario | undefined = this.usuarioService.getUsuarioEditado();
    if (usuario) {
      this.usuarioService.setUsuarioEditado(usuario);
      this.form.patchValue(usuario);
    }
  }

  save(): void {
    this.usuarioService.save(this.form.value).subscribe(() => {
      this.backToRoot();
    });
  }

  backToRoot() {
    this.usuarioService.setUsuarioEditado(undefined);
    this.router.navigateByUrl('/');
  }

}