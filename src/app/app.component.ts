import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'usuaddr-front';

  constructor (private spinnerService: SpinnerService) {}

  public getRodando(): boolean {
    return this.spinnerService.getRodando();
  }

}
