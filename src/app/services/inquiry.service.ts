import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Inquiry {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  requirement?: string;
  message?: string;
  status?: string;
  company?: string;
  attachment?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface InquiryListResult {
  items: Inquiry[];
  total: number;
  page: number;
  limit: number;
}

interface InquiryApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  items?: Inquiry[];
  total?: number;
  page?: number;
  limit?: number;
  pagination?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBaseUrl;

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

  getInquiries(params: { page: number; limit: number; search: string }): Observable<InquiryListResult> {
    const requestParams = new HttpParams()
      .set('page', params.page)
      .set('limit', params.limit)
      .set('search', params.search || '');

    return this.http
      .get<InquiryApiResponse<unknown>>(`${this.apiBase}/inquiries`, {
        headers: this.getAuthHeaders(),
        params: requestParams,
      })
      .pipe(
        map((response) => {
          const data = response.data as
            | { items?: Inquiry[]; total?: number; page?: number; limit?: number; pagination?: { total?: number; page?: number; limit?: number } }
            | Inquiry[]
            | undefined;

          const items = Array.isArray(data)
            ? data
            : data?.items ?? response.items ?? [];

          const total =
            (typeof data === 'object' && data && !Array.isArray(data) ? data.total : undefined) ??
            (typeof data === 'object' && data && !Array.isArray(data) ? data.pagination?.total : undefined) ??
            response.total ??
            response.pagination?.total ??
            items.length;

          const page =
            (typeof data === 'object' && data && !Array.isArray(data) ? data.page : undefined) ??
            (typeof data === 'object' && data && !Array.isArray(data) ? data.pagination?.page : undefined) ??
            response.page ??
            response.pagination?.page ??
            params.page;

          const limit =
            (typeof data === 'object' && data && !Array.isArray(data) ? data.limit : undefined) ??
            (typeof data === 'object' && data && !Array.isArray(data) ? data.pagination?.limit : undefined) ??
            response.limit ??
            response.pagination?.limit ??
            params.limit;

          return {
            items,
            total,
            page,
            limit,
          };
        }),
      );
  }

  getInquiryById(id: string | number): Observable<Inquiry> {
    return this.http
      .get<InquiryApiResponse<Inquiry>>(`${this.apiBase}/inquiries/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.data ?? ({} as Inquiry)));
  }

  updateInquiry(id: string | number, payload: Partial<Inquiry>): Observable<Inquiry> {
    return this.http
      .put<InquiryApiResponse<Inquiry>>(`${this.apiBase}/inquiries/${id}`, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.data ?? ({ id, ...payload } as Inquiry)));
  }

  deleteInquiry(id: string | number): Observable<void> {
    return this.http
      .delete<InquiryApiResponse<unknown>>(`${this.apiBase}/inquiries/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(() => void 0));
  }
}
