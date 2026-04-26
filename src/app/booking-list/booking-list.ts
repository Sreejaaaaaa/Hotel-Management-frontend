import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.css']
})
export class BookingListComponent {

  bookings: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    
    this.http.post<any[]>(
  'http://localhost:8080/booking-service/booking',
  {}
).subscribe({
  next: (data) => {
    console.log("Bookings:", data);
    this.bookings = data;
    this.isLoading = false;
  },
  error: (err) => {
    console.error(err);
    this.isLoading = false;
  }
});
  }

  
}