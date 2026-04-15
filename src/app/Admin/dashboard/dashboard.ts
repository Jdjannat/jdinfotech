import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { FeatureFlagService } from '../../services/feature-flag.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  currentUser: string = '';
  currentTime: string = '';
  currentDate: string = '';
  showAdminPanel = false;
  activePanel: 'dashboard' | 'portfolio' | 'services' | 'team' | 'testimonials' | 'blog' | 'settings' = 'dashboard';
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router, private featureFlagService: FeatureFlagService) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.updateDateTime();
    this.checkAdminPanelAccess();
    setInterval(() => this.updateDateTime(), 1000);
  }

  checkAdminPanelAccess(): void {
    this.showAdminPanel = this.featureFlagService.isFeatureEnabled('adminPanel');
  }

  loadUserInfo(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('auth_user');
      this.currentUser = user || 'User';
      return;
    }

    this.currentUser = 'User';
  }

  updateDateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    }
    this.router.navigate(['/']);
  }

  getAdminTab(): 'portfolio' | 'services' | 'team' | 'testimonials' | 'blog' | 'settings' {
    if (this.activePanel === 'dashboard') {
      return 'portfolio';
    }
    return this.activePanel as any;
  }
}
