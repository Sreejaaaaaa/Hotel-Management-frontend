// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-rooms',
//   standalone: true,
//   imports: [CommonModule, FormsModule],  // ✅ REQUIRED
//   templateUrl: './rooms.html',
//   styleUrls: ['./rooms.css']
// })
// export class RoomsComponent {

//   rooms: any[] = [];
//   successMessage: string = '';
//   newRoom = {
//     type: '',
//     price: 0
//   };

//   role: string = '';

//   constructor(private http: HttpClient, private router: Router) {
//   this.getUserRole();
//   this.loadRooms();
// }

//   // ✅ Get role from token
//   getUserRole() {
//     const token = sessionStorage.getItem('token');

//     if (token) {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       this.role = payload.role;
//     }
//   }

//   // ✅ Load rooms
//   loadRooms() {
//     this.http.get<any[]>('http://localhost:8080/room-service/rooms')
//       .subscribe({
//         next: (data) => {
//           console.log("Rooms:", data);
//           this.rooms = data;
//         },
//         error: (err) => console.log(err)
//       });
//   }

//   // ✅ Add room (OWNER + MANAGER)
//   isSubmitting = false;  

// addRoom() {
//   console.log("ADD ROOM CLICKED");
//   if (this.isSubmitting) return;  
//   this.isSubmitting = true;

//   const price = Number(this.newRoom.price);

//   if (!this.newRoom.type || price <= 0) {
//     alert("Please enter valid room type and price");
//     this.isSubmitting = false;
//     return;
//   }

//   this.http.post('http://localhost:8080/room-service/rooms', {
//     ...this.newRoom,
//     price: price
//   }).subscribe(() => {
//     this.successMessage = "Room added successfully ";
//     this.newRoom = { type: '', price: 0 };
//     this.loadRooms();
//     this.isSubmitting = false; 
//   });
// }

//   // ✅ Delete room (OWNER only)
//  deleteRoom(id: number) {
//   this.http.delete(`http://localhost:8080/room-service/rooms/${id}`)
//     .subscribe({
//       next: () => {
//         this.loadRooms();
//       },
//       error: (err) => {
//         console.log(err);
//         alert("Delete failed - unauthorized or server error");
//       }
//     });
// }


// goToBooking(room: any) {
//   console.log("Clicked room:", room);

//   this.router.navigate(['/booking', room.id], {
//     queryParams: {
//       price: room.price
//     }
//   });
// }


// }


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

  // ✅ FILTER STATE
  filterType: string = 'ALL';

  constructor(private http: HttpClient, private router: Router) {
    this.getUserRole();
    this.loadRooms();
  }

  // GET ROLE
  getUserRole() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.role = payload.role;
    }
  }

  // LOAD ROOMS
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

  // ✅ FILTER LOGIC
  get filteredRooms() {
    if (this.filterType === 'ALL') {
      return this.rooms;
    }

    return this.rooms.filter(
      room => room.type === this.filterType
    );
  }

  // ADD ROOM
  addRoom() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const price = Number(this.newRoom.price);

    if (!this.newRoom.type || price <= 0) {
      alert("Enter valid details");
      this.isSubmitting = false;
      return;
    }

    this.http.post('http://localhost:8080/room-service/rooms', {
      type: this.newRoom.type.toUpperCase().trim(),
      price: price
    }).subscribe(() => {
      this.newRoom = { type: '', price: 0 };
      this.loadRooms();
      this.isSubmitting = false;
    });
  }

  // DELETE
  deleteRoom(id: number) {
    this.http.delete(`http://localhost:8080/room-service/rooms/${id}`)
      .subscribe({
        next: () => this.loadRooms(),
        error: () => alert("Delete failed")
      });
  }

  // NAVIGATION
  goToBooking(room: any) {
    this.router.navigate(['/booking', room.id], {
      queryParams: { price: room.price }
    });
  }
}