import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment {

  bookingId: number | null = null;
  amount: number = 0;
  orderId: string = '';

  isPaying = false;

  baseAmount: number = 0;
  tax: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));
    this.amount = Number(this.route.snapshot.queryParamMap.get('amount'));
    this.orderId = this.route.snapshot.queryParamMap.get('orderId') || '';

    if (!this.bookingId || !this.amount || !this.orderId) {
      this.router.navigate(['/rooms']);
      return;
    }

    this.baseAmount = Math.round(this.amount / 1.1);
    this.tax = this.amount - this.baseAmount;
  }

  
  payNow() {

  if (this.isPaying) return;

  this.isPaying = true;

  const options = {
    key: 'rzp_test_SfFKhRVFXwNZQB',
    amount: this.amount * 100,
    currency: 'INR',
    order_id: this.orderId,

    handler: (response: any) => {

      this.http.post('http://localhost:8080/payment-service/payments/verify', {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      }).subscribe({

        next: (res: any) => {
          this.isPaying = false;

          if (res.status === 'success') {
            this.router.navigate(['/payment-success'], {
              queryParams: {
                bookingId: this.bookingId,
                amount: this.amount
              }
            });
          } else {
            this.router.navigate(['/payment-failed']);
          }
        },

        error: () => {
          this.isPaying = false;
          this.router.navigate(['/payment-failed']);
        }

      });
    }
  };

  const rzp = new (window as any).Razorpay(options);

  rzp.on('payment.failed', () => {
    this.isPaying = false;
    this.router.navigate(['/payment-failed']);
  });

  rzp.open();
}
}