import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-detail.html',
  styleUrls: ['./booking-detail.css']
})
export class BookingDetail {

  booking: any;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('bookingId');

    if (!id) {
      this.errorMessage = "Invalid booking ID";
      this.isLoading = false;
      return;
    }

    console.log("Loading booking ID:", id);
    this.loadBooking(id);
  }

  loadBooking(id: any) {
    this.isLoading = true;

    this.http.get(`http://localhost:8080/booking-service/booking/${id}`)
      .subscribe({
        next: (data: any) => {
          console.log("API RESPONSE:", data);

          this.booking = data;
          this.isLoading = false;

          this.cd.detectChanges(); // safe refresh
        },
        error: (err) => {
          console.log("Error:", err);

          this.errorMessage = "Failed to load booking";
          this.isLoading = false;

          this.cd.detectChanges();
        }
      });
  }

  cancelBooking() {
    const confirmCancel = confirm("Cancel this booking?");
    if (!confirmCancel) return;

    this.http.put(
      `http://localhost:8080/booking-service/booking/cancel/${this.booking.bookingId}`,
      {}
    ).subscribe({
      next: () => {
        alert("Cancelled successfully");

        // ✅ BEST: instant UI update (no reload needed)
        this.booking.status = 'CANCELLED';

        this.cd.detectChanges();
      },
      error: (err) => {
        console.log("Cancel error:", err);

        if (err.status === 403) {
          alert("You are not allowed to cancel this booking");
        } else {
          alert("Failed to cancel booking");
        }
      }
    });
  }
}