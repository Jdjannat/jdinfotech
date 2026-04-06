import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  brand = 'JD Infotech';

  // NOTE: This just shows a success message (no backend).
  // You can connect EmailJS/Formspree later.
  sent = false;
  private fb = inject(FormBuilder);


  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });


  submit() {
    this.sent = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // simulate sending
    this.sent = true;
    this.form.reset();
  }

  ctrl(name: string) {
    return this.form.get(name);
  }
  

}