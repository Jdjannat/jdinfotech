import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private http = inject(HttpClient);
  private readonly apiBase = environment.apiBaseUrl;

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

  constructor() {
    this.loadFlagsFromApi();
  }

  private loadFlagsFromApi(): void {
    this.http
      .get<{ success: boolean; data: FeatureFlags }>(`${this.apiBase}/feature-flags`)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.flagsSubject.next(response.data);

            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('featureFlags', JSON.stringify(response.data));
            }
          }
        },
        error: () => {
          // Local storage fallback remains active when API is unavailable.
        },
      });
  }

  private syncFlagsToApi(flags: FeatureFlags): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }

    this.http
      .put(
        `${this.apiBase}/feature-flags`,
        flags,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        }
      )
      .subscribe({
        error: () => {
          // Keep local state unchanged if API update fails.
        },
      });
  }

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
    this.syncFlagsToApi(updated);
  }

  disableFeature(featureName: keyof FeatureFlags): void {
    const current = this.flagsSubject.value;
    const updated = { ...current, [featureName]: false };
    this.flagsSubject.next(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('featureFlags', JSON.stringify(updated));
    }
    this.syncFlagsToApi(updated);
  }

  toggleFeature(featureName: keyof FeatureFlags): void {
    const current = this.flagsSubject.value;
    const updated = { ...current, [featureName]: !current[featureName] };
    this.flagsSubject.next(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('featureFlags', JSON.stringify(updated));
    }
    this.syncFlagsToApi(updated);
  }

  resetToDefaults(): void {
    this.flagsSubject.next(this.defaultFlags);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('featureFlags', JSON.stringify(this.defaultFlags));
    }
    this.syncFlagsToApi(this.defaultFlags);
  }
}
