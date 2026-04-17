import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CareerOpening {
  id: string | number;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  openings: number;
  experience: string;
  shortDescription: string;
  description: string;
  postedAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

interface CareerApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root',
})
export class CareerManagementService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBaseUrl;

  readonly careers = signal<CareerOpening[]>([]);

  private getAuthHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
      return new HttpHeaders();
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  constructor() {
    this.loadCareersFromApi();
  }

  private normalizeCareer(career: Partial<CareerOpening> & Record<string, unknown>): CareerOpening {
    return {
      id: (career.id as string | number) ?? '',
      title: (career['jobTitle'] as string) ?? career.title ?? '',
      department: career.department ?? '',
      location: career.location ?? '',
      employmentType: (career['employmentType'] as string) ?? (career['type'] as string) ?? '',
      status: career.status ?? 'Open',
      openings: Number(career.openings ?? 1),
      experience: career.experience ?? '',
      shortDescription: (career['shortDescription'] as string) ?? '',
      description: (career['fullDescription'] as string) ?? (career['description'] as string) ?? '',
      postedAt: (career['postedAt'] as string) ?? (career['createdAt'] as string) ?? '',
      updatedAt: (career['updatedAt'] as string) ?? undefined,
      ...career,
    };
  }

  private loadCareersFromApi(): void {
    this.getCareers().subscribe({
      next: (careers) => {
        this.careers.set(careers);
      },
      error: () => {
        this.careers.set([]);
      },
    });
  }

  getCareers(): Observable<CareerOpening[]> {
    return this.http
      .get<CareerApiResponse<CareerOpening[]> | CareerOpening[]>(`${this.apiBase}/careers`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          const payload = Array.isArray(response) ? response : response.data;
          const careers = Array.isArray(payload) ? payload : [];
          return careers.map((career) => this.normalizeCareer(career as Record<string, unknown>));
        }),
      );
  }

  getCareerById(id: string | number): Observable<CareerOpening> {
    return this.http
      .get<CareerApiResponse<CareerOpening> | CareerOpening>(`${this.apiBase}/careers/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if ('data' in (response as CareerApiResponse<CareerOpening>)) {
            const data = (response as CareerApiResponse<CareerOpening>).data;
            return this.normalizeCareer((data ?? {}) as Record<string, unknown>);
          }

          return this.normalizeCareer(response as Record<string, unknown>);
        }),
      );
  }

  addCareer(career: Omit<CareerOpening, 'id' | 'postedAt' | 'updatedAt'>): Observable<CareerOpening> {
    return this.http
      .post<CareerApiResponse<CareerOpening> | CareerOpening>(`${this.apiBase}/careers`, career, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          const created = 'data' in (response as CareerApiResponse<CareerOpening>)
            ? (response as CareerApiResponse<CareerOpening>).data
            : (response as CareerOpening);
          const newCareer = this.normalizeCareer((created ?? {}) as Record<string, unknown>);

          if (!newCareer.id) {
            throw new Error('Invalid create career API response');
          }

          const updatedCareers = [newCareer, ...this.careers()];
          this.careers.set(updatedCareers);
          return newCareer;
        }),
      );
  }

  updateCareer(id: string | number, career: Omit<CareerOpening, 'id' | 'postedAt' | 'updatedAt'>): Observable<CareerOpening> {
    return this.http
      .put<CareerApiResponse<CareerOpening> | CareerOpening>(`${this.apiBase}/careers/${id}`, career, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          const updated = 'data' in (response as CareerApiResponse<CareerOpening>)
            ? (response as CareerApiResponse<CareerOpening>).data
            : (response as CareerOpening);
          const updatedCareer = this.normalizeCareer((updated ?? {}) as Record<string, unknown>);

          if (!updatedCareer.id) {
            throw new Error('Invalid update career API response');
          }

          const updatedCareers = this.careers().map((item) =>
            item.id === id ? updatedCareer : item,
          );
          this.careers.set(updatedCareers);
          return updatedCareer;
        }),
      );
  }

  deleteCareer(id: string | number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiBase}/careers/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map(() => {
          const updatedCareers = this.careers().filter((career) => career.id !== id);
          this.careers.set(updatedCareers);
        }),
      );
  }
}
