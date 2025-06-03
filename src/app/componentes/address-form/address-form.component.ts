import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EnderecoService } from '../../services/endereco.service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Endereco } from '../../model/endereco.model';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-form.component.html'
})
export class AddressFormComponent implements OnInit {
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

  public ngOnInit(): void {
    let endereco: Endereco | undefined = this.enderecoService.getEnderecoEditado();
    if (endereco) {
      this.enderecoService.setUsuarioEditado(endereco.usuario.id);
      this.form.patchValue(endereco);
    }
  }

  save(): void {
    let usuarioId: number | undefined = this.enderecoService.getUsuarioEditado();
    if (usuarioId) {
      this.enderecoService.save(usuarioId, this.form.value).subscribe(() => {
        this.backToRoot();
      });
    }
  }

  backToRoot() {
    this.enderecoService.setEnderecoEditado(undefined);
    this.enderecoService.setUsuarioEditado(undefined);
    this.router.navigateByUrl('/');
  }
}