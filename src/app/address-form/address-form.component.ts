import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EnderecoService } from '../services/endereco.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-form.component.html'
})
export class AddressFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private enderecoService: EnderecoService, private router: Router) {

    this.form = this.fb.group({
      id: [null],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      cep: ['', Validators.required]
    });

  }

  save(): void {
    this.enderecoService.save(this.enderecoService.getUsuarioEditado(), this.form.value).subscribe(() => this.router.navigateByUrl('/'));
  }

  backToRoot() {
    this.router.navigateByUrl('/');
  }
}