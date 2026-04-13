import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  // Static credentials for testing
  private staticCredentials = [
    { emailOrUsername: 'admin@jdinfotech.com', password: 'admin123' },
    { emailOrUsername: 'admin', password: 'admin123' },
    { emailOrUsername: 'user@jdinfotech.com', password: 'user123' },
  ];

  constructor(private router: Router) {}

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

    // Simulate loading
    this.isLoading = true;

    // Verify static credentials
    setTimeout(() => {
      const user = this.staticCredentials.find(
        (cred) =>
          cred.emailOrUsername === this.emailOrUsername &&
          cred.password === this.password
      );

      if (user) {
        // Store user info in localStorage (optional)
        localStorage.setItem('auth_user', this.emailOrUsername);
        // Redirect to dashboard
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorMessage = 'Invalid email/username or password';
        this.isLoading = false;
      }
    }, 500);
  }

  // Allow login on Enter key
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.login();
    }
  }
}
