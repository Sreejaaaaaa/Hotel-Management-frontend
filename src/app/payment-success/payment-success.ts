import { Component } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess {

  bookingId: any;
  amount: number = 0;

  baseAmount: number = 0;
  tax: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'];
      this.amount = Number(params['amount']);

      // 💰 breakdown
      this.baseAmount = Math.round(this.amount / 1.1);
      this.tax = this.amount - this.baseAmount;
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToRooms() {
    this.router.navigate(['/rooms']);
  }
}
