import { Routes } from '@angular/router';

import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { RoomsComponent } from './rooms/rooms';
import { BookingComponent } from './booking/booking';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  {
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
,
  { path: 'rooms', component: RoomsComponent },
  { path: 'booking', component: BookingComponent }
];