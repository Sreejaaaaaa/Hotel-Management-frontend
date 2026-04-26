import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.html',
  styleUrls: ['./staff-management.css']
})
export class StaffManagement {

  staff: any[] = [];
  isLoading = true;

  newStaff = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  isSubmitting = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStaff();
  }

  loadStaff() {
    this.http.get<any[]>('http://localhost:8080/user-service/users')
      .subscribe({
        next: (data) => {
          this.staff = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  addStaff() {
    if (this.isSubmitting) return;

    if (!this.newStaff.name || !this.newStaff.email || !this.newStaff.password || !this.newStaff.role) {
      alert("Fill all fields");
      return;
    }

    this.isSubmitting = true;

    this.http.post(
      'http://localhost:8080/user-service/users/staff',
      this.newStaff
    ).subscribe({
      next: (res: any) => {
        this.staff.push(res);

        this.newStaff = {
          name: '',
          email: '',
          password: '',
          role: ''
        };

        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        alert("Failed to add staff");
      }
    });
  }
}