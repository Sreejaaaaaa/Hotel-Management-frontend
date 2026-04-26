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

import { PaymentSuccess } from './payment-success/payment-success';
import { PaymentFailed } from './payment-failed/payment-failed';
import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { RoomsComponent } from './rooms/rooms';
import { BookingComponent } from './booking/booking';
import { Payment } from './payment/payment';
import { StaffManagement } from './staff-management/staff-management';
import { BookingListComponent } from './booking-list/booking-list';

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

  {
    path: 'booking/:roomId',
    component: BookingComponent,
    canActivate: [authGuard]
  },

  {
    path: 'payment-success',
    component: PaymentSuccess
  },
  {
    path: 'payment-failed',
    component: PaymentFailed
  },

  {
    path: 'payment/:bookingId',
    component: Payment,
    canActivate: [authGuard]
  },
  {
  path: 'booking-list',
  component: BookingListComponent,
  canActivate: [authGuard]
  },
  {
  path: 'staff',
  component: StaffManagement,
  canActivate: [authGuard]
},

  {
    path: '**',
    redirectTo: 'dashboard'
  }
  
  

];