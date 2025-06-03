import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../model/usuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  submit(): void {
    const formValues = this.registerForm.value;

    const usuario: any = {
      nome: formValues.name,
      email: formValues.email,
      senha: formValues.password
    };

    this.authService.register(usuario).subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }
}
