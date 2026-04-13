import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FeatureFlags {
  adminPanel: boolean;
  portfolioManagement: boolean;
  servicesManagement: boolean;
  teamManagement: boolean;
  testimonialManagement: boolean;
  blogManagement: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  private platformId = inject(PLATFORM_ID);

  private defaultFlags: FeatureFlags = {
    adminPanel: true,
    portfolioManagement: true,
    servicesManagement: true,
    teamManagement: true,
    testimonialManagement: true,
    blogManagement: true,
  };

  private flagsSubject = new BehaviorSubject<FeatureFlags>(this.getStoredFlags());
  public flags$: Observable<FeatureFlags> = this.flagsSubject.asObservable();

  constructor() {}

  private getStoredFlags(): FeatureFlags {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('featureFlags');
      return stored ? JSON.parse(stored) : this.defaultFlags;
    }
    return this.defaultFlags;
  }

  getFlags(): FeatureFlags {
    return this.flagsSubject.value;
  }

  isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
    return this.flagsSubject.value[featureName];
  }

  enableFeature(featureName: keyof FeatureFlags): void {
    const current = this.flagsSubject.value;
    const updated = { ...current, [featureName]: true };
    this.flagsSubject.next(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('featureFlags', JSON.stringify(updated));
    }
  }

  disableFeature(featureName: keyof FeatureFlags): void {
    const current = this.flagsSubject.value;
    const updated = { ...current, [featureName]: false };
    this.flagsSubject.next(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('featureFlags', JSON.stringify(updated));
    }
  }

  toggleFeature(featureName: keyof FeatureFlags): void {
    const current = this.flagsSubject.value;
    const updated = { ...current, [featureName]: !current[featureName] };
    this.flagsSubject.next(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('featureFlags', JSON.stringify(updated));
    }
  }

  resetToDefaults(): void {
    this.flagsSubject.next(this.defaultFlags);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('featureFlags', JSON.stringify(this.defaultFlags));
    }
  }
}
