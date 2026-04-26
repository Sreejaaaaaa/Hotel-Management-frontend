import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent {

  roomId: any;

  bookingRequest = {
    guest: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gender: ''
    },
    booking: {
      roomId: '',
      status: 'CONFIRMED'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  price: any;
  ngOnInit() {
  this.roomId = this.route.snapshot.paramMap.get('roomId');

  this.price = this.route.snapshot.queryParamMap.get('price'); 

  this.bookingRequest.booking.roomId = this.roomId;

  console.log("Room ID:", this.roomId);
  console.log("Price:", this.price);
}
isLoading = false;
createBooking() {
  this.isLoading = true;

  this.http.post<any>(
    'http://localhost:8080/booking-service/booking',
    this.bookingRequest
  ).subscribe({
    next: (res) => {

      const bookingId = res?.booking?.id;

      if (!bookingId) {
        alert("Booking created but ID missing");
        this.isLoading = false;
        return;
      }

      //CALL PAYMENT SERVICE
      this.http.post<any>(
        'http://localhost:8080/payment-service/payments',
        {
          bookingId: bookingId,
          amount: this.price
        }
      ).subscribe({
        next: (paymentRes) => {
          this.isLoading = false;
          //OPEN RAZORPAY
          this.router.navigate(['/payment', bookingId], {
            queryParams: {
              amount: paymentRes.amount,
              orderId: paymentRes.orderId
            }
        });

        },
        error: (err) => {
          console.error(err);
          alert("Payment creation failed");
        }
      });

    },

    error: (error) => {
      this.isLoading = false;

      if (error.error?.message?.includes("Room not available")) {
        alert("This room is already booked!");
      } else {
        alert("Booking Failed. Try again.");
      }
    }
  });
}

openRazorpay(paymentData: any, bookingId: number) {

  const options = {
    key: 'rzp_test_SfFKhRVFXwNZQB',

    amount: paymentData.amount,
    currency: 'INR',

    order_id: paymentData.orderId,

    handler: (response: any) => {
      console.log("Payment Success:", response);

      //  VERIFY PAYMENT
      this.http.post('http://localhost:8080/payment-service/payments/verify', {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id
      }).subscribe({

        next: () => {

          //  UPDATE BOOKING STATUS
          this.http.put(
            `http://localhost:8080/booking-service/booking/update/${bookingId}`,
            {
              bookingId: bookingId,
              status: "CONFIRMED"
            }
          ).subscribe({

            next: () => {
              // REDIRECT TO SUCCESS PAGE
              this.router.navigate(['/payment-success'], {
                queryParams: {
                  bookingId: bookingId,
                  amount: paymentData.amount
                }
              });
            },

            error: (err) => {
              console.error("Booking update failed:", err);
              this.router.navigate(['/payment-failed']);
            }

          });

        },

        error: (err) => {
          console.error("Verification failed:", err);
          this.router.navigate(['/payment-failed']);
        }

      });
    },

    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new (window as any).Razorpay(options);

  //  HANDLE FAILURE
  rzp.on('payment.failed', (response: any) => {
    console.error("Payment Failed:", response);

    this.http.put(
      `http://localhost:8080/booking-service/booking/update/${bookingId}`,
      {
        bookingId: bookingId,
        status: "FAILED"
      }
    ).subscribe({
      next: () => {
        this.router.navigate(['/payment-failed'], {
          queryParams: { bookingId }
        });
      },
      error: () => {
        this.router.navigate(['/payment-failed']);
      }
    });

  });

  rzp.open();
}







}