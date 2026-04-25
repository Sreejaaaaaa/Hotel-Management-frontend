import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ✅ REQUIRED
  templateUrl: './rooms.html',
  styleUrls: ['./rooms.css']
})
export class RoomsComponent {

  rooms: any[] = [];
  successMessage: string = '';
  newRoom = {
    type: '',
    price: 0
  };

  role: string = '';

  constructor(private http: HttpClient) {
    this.getUserRole();
    this.loadRooms();
  }

  // ✅ Get role from token
  getUserRole() {
    const token = sessionStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.role = payload.role;
    }
  }

  // ✅ Load rooms
  loadRooms() {
    this.http.get<any[]>('http://localhost:8080/room-service/rooms')
      .subscribe({
        next: (data) => {
          console.log("Rooms:", data);
          this.rooms = data;
        },
        error: (err) => console.log(err)
      });
  }

  // ✅ Add room (OWNER + MANAGER)
  isSubmitting = false;  

addRoom() {
  console.log("ADD ROOM CLICKED");
  if (this.isSubmitting) return;  
  this.isSubmitting = true;

  const price = Number(this.newRoom.price);

  if (!this.newRoom.type || price <= 0) {
    alert("Please enter valid room type and price");
    this.isSubmitting = false;
    return;
  }

  this.http.post('http://localhost:8080/room-service/rooms', {
    ...this.newRoom,
    price: price
  }).subscribe(() => {
    this.successMessage = "Room added successfully ";
    this.newRoom = { type: '', price: 0 };
    this.loadRooms();
    this.isSubmitting = false; 
  });
}

  // ✅ Delete room (OWNER only)
 deleteRoom(id: number) {
  this.http.delete(`http://localhost:8080/room-service/rooms/${id}`)
    .subscribe({
      next: () => {
        this.loadRooms();
      },
      error: (err) => {
        console.log(err);
        alert("Delete failed - unauthorized or server error");
      }
    });
}
}