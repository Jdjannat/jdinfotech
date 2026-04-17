import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagService } from '../../services/feature-flag.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  currentTime: string = '';
  currentDate: string = '';
  showAdminPanel = false;
  activePanel: 'dashboard' | 'portfolio' | 'services' | 'team' | 'testimonials' | 'blog' | 'settings' = 'dashboard';

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit(): void {
    this.updateDateTime();
    this.checkAdminPanelAccess();
    setInterval(() => this.updateDateTime(), 1000);
  }

  checkAdminPanelAccess(): void {
    this.showAdminPanel = this.featureFlagService.isFeatureEnabled('adminPanel');
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

  getAdminTab(): 'portfolio' | 'services' | 'team' | 'testimonials' | 'blog' | 'settings' {
    if (this.activePanel === 'dashboard') {
      return 'portfolio';
    }
    return this.activePanel as any;
  }
}
