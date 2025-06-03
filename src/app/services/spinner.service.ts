import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private rodando: boolean = false;

  constructor() { }

  public getRodando(): boolean {
    return this.rodando;
  }

  public setRodando(rodando: boolean) {
    this.rodando = rodando;
  }
  
}
