import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentManagementService, Testimonial } from '../../services/content-management.service';

@Component({
  selector: 'app-testimonials-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './testimonials-component.html',
  styleUrl: './testimonials-component.scss',
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  showForm = false;
  formData: Partial<Testimonial> = {};

  constructor(private contentService: ContentManagementService) {}

  ngOnInit(): void {
    this.contentService.testimonials$.subscribe((testimonials) => {
      this.testimonials = testimonials;
    });
  }

  addTestimonial(): void {
    if (this.formData.clientName && this.formData.comment) {
      this.contentService.addTestimonial({
        clientName: this.formData.clientName,
        company: this.formData.company || '',
        comment: this.formData.comment,
        rating: this.formData.rating || 5,
        imageUrl: this.formData.imageUrl || 'https://via.placeholder.com/100x100',
      });
      this.resetForm();
    }
  }

  editTestimonial(testimonial: Testimonial): void {
    this.formData = { ...testimonial };
    this.showForm = true;
  }

  saveTestimonial(): void {
    if (this.formData.id) {
      this.contentService.updateTestimonial(this.formData.id, this.formData);
      this.resetForm();
    }
  }

  deleteTestimonial(id: number): void {
    if (confirm('Delete this testimonial?')) {
      this.contentService.deleteTestimonial(id);
    }
  }

  resetForm(): void {
    this.formData = {};
    this.showForm = false;
  }
}
