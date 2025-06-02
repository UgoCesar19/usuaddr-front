import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  loading = false;
  error: string | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      nome: ['', Validators.required]
    });

  }

  submit(): void {
    this.loading = true;
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.loading = false;
        this.error = 'Erro ao registrar';
      }
    });
  }
}