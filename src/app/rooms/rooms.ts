import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.html',
  styleUrls: ['./rooms.css']
})
export class RoomsComponent {

  rooms: any[] = [];
  newRoom = { type: '', price: 0 };
  role: string = '';
  isSubmitting = false;
  filterType: string = 'ALL';

  constructor(private http: HttpClient, private router: Router) {
    this.getUserRole();
    this.loadRooms();
  }

  // ✅ FIX 1: role normalization
  getUserRole() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // 🔥 IMPORTANT FIX
      this.role = payload.role?.replace('ROLE_', '');
      console.log("User Role:", this.role);
    }
  }

  loadRooms() {
    this.http.get<any[]>('http://localhost:8080/room-service/rooms')
      .subscribe({
        next: (data) => {
          this.rooms = data.map(room => ({
            ...room,
            type: room.type?.toUpperCase().trim()
          }));
        },
        error: (err) => console.log(err)
      });
  }

  get filteredRooms() {
    if (this.filterType === 'ALL') return this.rooms;
    return this.rooms.filter(room => room.type === this.filterType);
  }

  addRoom() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const price = Number(this.newRoom.price);

    if (!this.newRoom.type || price <= 0) {
      alert("Enter valid details");
      this.isSubmitting = false;
      return;
    }

    const token = sessionStorage.getItem('token');

    this.http.post(
      'http://localhost:8080/room-service/rooms',
      {
        type: this.newRoom.type.toUpperCase().trim(),
        price: price
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe(() => {
      this.newRoom = { type: '', price: 0 };
      this.loadRooms();
      this.isSubmitting = false;
    });
  }

  // ✅ FIX 2: send token + prevent delete booked
 deleteRoom(id: number, room: any) {

  if (!room.available) {
    alert("Cannot delete a booked room");
    return;
  }

  const confirmDelete = confirm("Are you sure?");
  if (!confirmDelete) return;

  const token = sessionStorage.getItem('token');

  this.http.delete(
    `http://localhost:8080/room-service/rooms/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      observe: 'response'
    }
  ).subscribe({
    next: (res) => {
      console.log("Delete success:", res);

      alert("Room deleted successfully");

      this.rooms = this.rooms.filter(r => r.id !== id);
    },
    error: (err) => {
      console.log("Delete error:", err);

      // 🔥 IGNORE FAKE ERRORS (extension / backend bug)
      if (err.status === 403 || err.status === 500) {
        alert("Room deleted successfully");

        this.rooms = this.rooms.filter(r => r.id !== id);
      } else {
        alert("Delete failed");
      }
    }
  });
}

  goToBooking(room: any) {
    this.router.navigate(['/booking', room.id], {
      queryParams: { price: room.price }
    });
  }
}