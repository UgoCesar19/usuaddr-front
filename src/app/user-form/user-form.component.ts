import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: UsuarioService, private router: Router) {
    this.form = this.fb.group({
      id: [null],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      nome: ['', Validators.required]
    });
  }

  save(): void {
    this.service.save(this.form.value).subscribe(() => this.router.navigateByUrl('/'));
  }

  backToRoot() {
    this.router.navigateByUrl('/');
  }

}