import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule,  RouterModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.scss',
})
export class AdminPanelComponent  {
  currentUser = 'User';
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = localStorage.getItem('auth_user') || 'User';
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    }

    this.router.navigate(['/login']);
  }
}
