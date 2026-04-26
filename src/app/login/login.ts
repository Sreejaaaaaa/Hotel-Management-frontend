// import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit{

  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  // onLogin() {
  //   const loginData = {
  //     email: this.username,
  //     password: this.password
  //   };

  //   console.log("Sending:", loginData);

  //   this.http.post('http://localhost:8080/auth-service/auth/login', loginData)
  //     .subscribe({
  //       next: (res: any) => {
  //         console.log('Login success', res);
  //         sessionStorage.setItem('token', res.token); //store token in session storage
  //         this.router.navigate(['/dashboard']);
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         this.errorMessage = 'Invalid credentials';
  //       }
  //     });
  // }
  onLogin() {
  const loginData = {
    email: this.username,
    password: this.password
  };

  console.log("Sending:", loginData);

  this.http.post('http://localhost:8080/auth-service/auth/login', loginData)
    .subscribe({
      next: (res: any) => {
        console.log('Login success', res);

        // ✅ store token
        sessionStorage.setItem('token', res.token);

        // ✅ navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Invalid credentials';
      }
    });
}

ngOnInit() {
  const token = sessionStorage.getItem('token');
  if (token) {
    this.router.navigate(['/dashboard']);
  }
}

}