import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatureFlagService } from '../../services/feature-flag.service';
import { ContentManagementService } from '../../services/content-management.service';

@Component({
  selector: 'app-settings-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-component.html',
  styleUrl: './settings-component.scss',
})
export class SettingsComponent implements OnInit {
  featureFlags: any = {};
  portfolioCount = 0;
  servicesCount = 0;
  teamCount = 0;
  testimonialsCount = 0;
  blogCount = 0;

  constructor(
    private featureFlagService: FeatureFlagService,
    private contentService: ContentManagementService
  ) {}

  ngOnInit(): void {
    this.featureFlags = this.featureFlagService.getFlags();
    this.contentService.portfolioItems$.subscribe((items) => {
      this.portfolioCount = items.length;
    });
    this.contentService.services$.subscribe((services) => {
      this.servicesCount = services.length;
    });
    this.contentService.teamMembers$.subscribe((members) => {
      this.teamCount = members.length;
    });
    this.contentService.testimonials$.subscribe((testimonials) => {
      this.testimonialsCount = testimonials.length;
    });
    this.contentService.blogPosts$.subscribe((posts) => {
      this.blogCount = posts.length;
    });
  }

  toggleFeature(flag: string): void {
    this.featureFlagService.toggleFeature(flag as any);
    this.featureFlags = this.featureFlagService.getFlags();
  }
}
