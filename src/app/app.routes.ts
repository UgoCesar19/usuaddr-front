import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { AuthGuard } from './auth/guard/auth.guard';
import { UserFormComponent } from './componentes/user-form/user-form.component';
import { AddressFormComponent } from './componentes/address-form/address-form.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'usuarios/form', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'enderecos/form', component: AddressFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
