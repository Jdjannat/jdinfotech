import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      username: string;
      email: string;
    };
  };
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  emailOrUsername: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  private returnUrl = '/admin/dashboard';
  private readonly apiBase = environment.apiBaseUrl;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  constructor() {
    const requestedReturnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (requestedReturnUrl && requestedReturnUrl.startsWith('/')) {
      this.returnUrl = requestedReturnUrl;
    }
  }

  login(): void {
    this.errorMessage = '';

    // Validation
    if (!this.emailOrUsername.trim()) {
      this.errorMessage = 'Please enter email or username';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Please enter password';
      return;
    }

    this.isLoading = true;

    this.http
      .post<LoginResponse>(`${this.apiBase}/auth/login`, {
        emailOrUsername: this.emailOrUsername,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          if (response.success && response.data?.token) {
            localStorage.setItem('auth_user', response.data.user.username || this.emailOrUsername);
            localStorage.setItem('auth_token', response.data.token);
            this.router.navigateByUrl(this.returnUrl);
            return;
          }

          this.errorMessage = response.message || 'Login failed';
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to login. Please try again.';
          this.isLoading = false;
        },
      });
  }

  // Allow login on Enter key
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
