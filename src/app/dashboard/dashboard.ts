import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  role: string = '';
  users: any[] = [];
  bookings: any[] = [];
  constructor(
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef   
  ) {}

  ngOnInit() {
    this.getUserRole();
    this.loadUsers();
    this.loadRoomStats();
    this.http.get<any[]>(
  'http://localhost:8080/booking-service/booking/all'
).subscribe({
  next: (data) => {
    this.bookings = data;
  },
  error: (err) => {
    console.error(err);
  }
});
  }

  getUserRole() {
    const token = sessionStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.role = payload.role;
      console.log("User Role:", this.role);
    }
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/user-service/users')
      .subscribe({
        next: (data) => {
          console.log("Users:", data);

          this.users = data;

          this.cd.detectChanges(); 
        },
        error: (err) => console.log("Error:", err)
      });
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goToRooms() {
  this.router.navigate(['/rooms']);
}

goToUsers() {
  this.router.navigate(['/staff']);
}

goToBookings() {
  this.router.navigate(['/booking-list']); 
}
goToDashboard() {
  this.router.navigate(['/dashboard']);
}

totalRooms = 0;
availableRooms = 0;
bookedRooms = 0;

loadRoomStats() {
  this.http.get<any[]>('http://localhost:8080/room-service/rooms')
    .subscribe(data => {
      //console.log("ROOM STATS DATA:", data); 
      this.totalRooms = data.length;
      this.availableRooms = data.filter(r => r.available).length;
      this.bookedRooms = data.filter(r => !r.available).length;
    });
}


}