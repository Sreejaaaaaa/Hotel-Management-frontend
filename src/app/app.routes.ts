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

// 🔥 ADD THIS
import { BookingDetail } from './booking-detail/booking-detail';

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
    canActivate: [authGuard],
    data: { roles: ['OWNER', 'MANAGER'] }
  },

  // ✅ BOOKING CREATION (roomId)
  {
    path: 'booking/create/:roomId',
    component: BookingComponent,
    canActivate: [authGuard],
    data: { roles: ['OWNER', 'MANAGER', 'RECEPTIONIST'] }
  },

  // 🔥 NEW: BOOKING DETAILS (IMPORTANT)
  {
    path: 'booking/:bookingId',
    component: BookingDetail,
    canActivate: [authGuard],
    data: { roles: ['OWNER', 'MANAGER', 'RECEPTIONIST'] }
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
    canActivate: [authGuard],
    data: { roles: ['OWNER', 'MANAGER', 'RECEPTIONIST'] }
  },

  {
    path: 'staff',
    component: StaffManagement,
    canActivate: [authGuard],
    data: { roles: ['OWNER'] }
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];