import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loading = false;
  error: string | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

  }

  submit(): void {
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Credenciais inválidas: ' + JSON.stringify(error);
      }
    });
  }
}