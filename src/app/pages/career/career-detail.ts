import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CareerManagementService } from '../../services/career-management.service';
import { environment } from '../../../environments/environment';

interface CareerApplyPayload {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  message?: string;
  attachment?: File;
}

@Component({
  selector: 'app-career-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './career-detail.html',
  styleUrl: './career-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerDetailComponent {
  private readonly careerService = inject(CareerManagementService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBaseUrl;

  private readonly careerId = this.route.snapshot.paramMap.get('id');
  
  readonly career = signal<any>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly fileError = signal('');
  readonly maxAttachmentSizeBytes = 5 * 1024 * 1024;

  private readonly globalPhoneValidator = (control: any) => {
    const value = String(control.value ?? '').trim();
    const normalized = value.replace(/[\s().-]/g, '');
    const isGlobalPhone = /^\+?[1-9]\d{6,14}$/.test(normalized);
    return isGlobalPhone ? null : { invalidPhone: true };
  };

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, this.globalPhoneValidator]],
    message: ['', [Validators.minLength(10)]],
  });

  readonly jobTitle = computed(() => this.career()?.title || '');

  constructor() {
    this.loadCareerDetails();
  }

  private loadCareerDetails(): void {
    if (!this.careerId) {
      this.errorMessage.set('Career ID not found');
      this.isLoading.set(false);
      return;
    }

    this.careerService.getCareerById(this.careerId).subscribe({
      next: (career) => {
        if (!career || !career.id) {
          this.errorMessage.set('Career opening not found');
          this.isLoading.set(false);
          return;
        }
        this.career.set(career);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load career details');
        this.isLoading.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.fileError.set('');

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    if (file.size > this.maxAttachmentSizeBytes) {
      this.selectedFile.set(null);
      this.fileError.set('Resume must be 5MB or smaller.');
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
  }

  submitApplication(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid || this.fileError()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.getRawValue();
    const payload = new FormData();

    payload.append('name', String(formValue.name ?? '').trim());
    payload.append('email', String(formValue.email ?? '').trim());
    payload.append('phone', String(formValue.phone ?? '').trim());
    payload.append('requirement', this.jobTitle());
    payload.append('message', String(formValue.message ?? '').trim() || `Applied for ${this.jobTitle()} position`);

    const file = this.selectedFile();
    if (file) {
      payload.append('attachment', file, file.name);
    }

    this.http.post<any>(`${this.apiBase}/contact`, payload).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.successMessage.set('Application submitted successfully! We will review your resume and get back to you soon.');
        this.form.reset();
        this.selectedFile.set(null);
        
        setTimeout(() => {
          void this.router.navigate(['/careers']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error?.error?.message || 'Unable to submit application. Please try again.',
        );
      },
    });
  }

  goBack(): void {
    void this.router.navigate(['/careers']);
  }
}
