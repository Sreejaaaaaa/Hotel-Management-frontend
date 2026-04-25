// import { Routes } from '@angular/router';

// import { authGuard } from './guard/auth.guard';
// import { LoginComponent } from './login/login';
// import { DashboardComponent } from './dashboard/dashboard';
// import { RoomsComponent } from './rooms/rooms';
// import { BookingComponent } from './booking/booking';

// export const routes: Routes = [

//   { path: '', redirectTo: 'login', pathMatch: 'full' },

//   { path: 'login', component: LoginComponent },

//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//     canActivate: [authGuard]
//   },

//   {
//     path: 'rooms',
//     component: RoomsComponent,
//     canActivate: [authGuard]   
//   },

//   {
//     path: 'booking',
//     component: BookingComponent,
//     canActivate: [authGuard]
//   }

// ];


import { Routes } from '@angular/router';

import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { RoomsComponent } from './rooms/rooms';
import { BookingComponent } from './booking/booking';

// 👉 YOU will add these
// import { PaymentComponent } from './payment/payment';
// import { ConfirmationComponent } from './confirmation/confirmation';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'rooms',
    component: RoomsComponent,
    canActivate: [authGuard]   
  },

  // ✅ FIXED (important)
  {
    path: 'booking/:roomId',
    component: BookingComponent,
    canActivate: [authGuard]
  },

  // ✅ YOUR PART
  // {
  //   path: 'payment/:bookingId',
  //   component: PaymentComponent,
  //   canActivate: [authGuard]
  // },

  // // ✅ FINAL STEP
  // {
  //   path: 'confirmation',
  //   component: ConfirmationComponent,
  //   canActivate: [authGuard]
  // }

];