import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment';

interface ContactResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  sent = false;
  submitError = '';
  isSubmitting = false;
  selectedFile: File | null = null;
  fileError = '';

  private readonly apiBase = environment.apiBaseUrl;
  private readonly maxAttachmentSizeBytes = 5 * 1024 * 1024;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  private readonly globalPhoneValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    const normalized = value.replace(/[\s().-]/g, '');
    const isGlobalPhone = /^\+?[1-9]\d{6,14}$/.test(normalized);

    return isGlobalPhone ? null : { invalidPhone: true };
  };

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, this.globalPhoneValidator]],
    requirement: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.fileError = '';

    if (!file) {
      this.selectedFile = null;
      return;
    }

    if (file.size > this.maxAttachmentSizeBytes) {
      this.selectedFile = null;
      this.fileError = 'Attachment must be 5MB or smaller.';
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }


  submit() {
    this.sent = false;
    this.submitError = '';

    if (this.form.invalid || this.fileError) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.form.getRawValue();
    const payload = new FormData();

    payload.append('name', String(formValue.name ?? '').trim());
    payload.append('email', String(formValue.email ?? '').trim());
    payload.append('phone', String(formValue.phone ?? '').trim());
    payload.append('requirement', String(formValue.requirement ?? '').trim());
    payload.append('message', String(formValue.message ?? '').trim());

    if (this.selectedFile) {
      payload.append('attachment', this.selectedFile, this.selectedFile.name);
    }

    this.http
      .post<ContactResponse>(`${this.apiBase}/contact`, payload)
      .subscribe({
        next: (response) => {
          this.sent = response.success;
          this.submitError = response.success ? '' : response.message;
          this.isSubmitting = false;

          if (response.success) {
            this.form.reset();
            this.selectedFile = null;
            this.fileError = '';
          }
        },
        error: (error) => {
          this.submitError =
            error?.error?.message || 'Unable to send message. Please try again.';
          this.isSubmitting = false;
        },
      });
  }

  ctrl(name: string) {
    return this.form.get(name);
  }
  

}