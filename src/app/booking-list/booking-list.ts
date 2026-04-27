import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  errorMessage: string = '';
  successMessage: string = '';

  activeTab: string = 'ALL';

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router 
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;

    this.http.get<any[]>(
      'http://localhost:8080/booking-service/booking/all'
    ).subscribe({
      next: (data) => {
        this.bookings = data || [];
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = "Failed to load bookings";
        this.isLoading = false;
      }
    });
  }

  // FILTER LOGIC
  get filteredBookings() {
    if (this.activeTab === 'ACTIVE') {
      return this.bookings.filter(b =>
        b.status === 'CONFIRMED' || b.status === 'PENDING'
      );
    }

    if (this.activeTab === 'CANCELLED') {
      return this.bookings.filter(b => b.status === 'CANCELLED');
    }

    if (this.activeTab === 'FAILED') {
      return this.bookings.filter(b => b.status === 'FAILED');
    }

    return this.bookings;
  }

  openBooking(id: number) {
    this.router.navigate(['/booking', id]);
  }
}