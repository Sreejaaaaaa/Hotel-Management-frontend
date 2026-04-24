import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  role: string = '';
  users: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private cd: ChangeDetectorRef   // 👈 IMPORTANT
  ) {}

  // ✅ Runs after component initializes
  ngOnInit() {
    this.getUserRole();
    this.loadUsers();
  }

  // ✅ Decode role from JWT
  getUserRole() {
    const token = sessionStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.role = payload.role;
      console.log("User Role:", this.role);
    }
  }

  // ✅ Fetch users from backend
  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/user-service/users')
      .subscribe({
        next: (data) => {
          console.log("Users:", data);

          this.users = data;

          this.cd.detectChanges(); // 🔥 FORCE UI UPDATE
        },
        error: (err) => console.log("Error:", err)
      });
  }

  // ✅ Logout
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}