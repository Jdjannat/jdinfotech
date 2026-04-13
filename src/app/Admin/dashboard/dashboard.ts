import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
    const user = localStorage.getItem('auth_user');
    this.currentUser = user || 'User';
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
    localStorage.removeItem('auth_user');
    this.router.navigate(['/admin']);
  }

  getAdminTab(): 'portfolio' | 'services' | 'team' | 'testimonials' | 'blog' | 'settings' {
    if (this.activePanel === 'dashboard') {
      return 'portfolio';
    }
    return this.activePanel as any;
  }
}
