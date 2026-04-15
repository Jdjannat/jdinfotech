import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  brand = 'JD Infotech';

  sent = false;
  submitError = '';
  isSubmitting = false;
  private readonly apiBase = environment.apiBaseUrl;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);


  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    requirement: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });


  submit() {
    this.sent = false;
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.http
      .post<ContactResponse>(`${this.apiBase}/contact`, this.form.getRawValue())
      .subscribe({
        next: (response) => {
          this.sent = response.success;
          this.submitError = response.success ? '' : response.message;
          this.isSubmitting = false;

          if (response.success) {
            this.form.reset();
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