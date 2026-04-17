import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CareerManagementService } from '../../../services/career-management.service';

@Component({
  selector: 'app-career-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './career-form.html',
  styleUrl: './career-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly careerService = inject(CareerManagementService);

  private readonly careerId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = computed(() => this.careerId !== null);
  readonly pageTitle = computed(() => this.isEditMode() ? 'Edit Career Opening' : 'Add Career Opening');
  readonly submitLabel = computed(() => this.isEditMode() ? 'Update Career' : 'Create Career');
  readonly errorMessage = signal('');
  readonly isSaving = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    department: ['', [Validators.required]],
    location: ['', [Validators.required]],
    type: ['', [Validators.required]],
    status: ['Open', [Validators.required]],
    openings: [1, [Validators.required, Validators.min(1)]],
    experience: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]],
  });

  constructor() {
    if (!this.isEditMode()) {
      return;
    }

    this.careerService.getCareerById(this.careerId!).subscribe({
      next: (career) => {
        if (!career || !career.id) {
          this.errorMessage.set('Career opening not found.');
          return;
        }

        this.form.patchValue({
          title: (career['jobTitle'] as string) ?? career.title,
          department: career.department,
          location: career.location,
          type: (career['employmentType'] as string) ?? career.employmentType,
          status: career.status,
          openings: career.openings,
          experience: career.experience,
          description: (career['fullDescription'] as string) ?? career.description,
        });
      },
      error: () => {
        this.errorMessage.set('Unable to load career opening.');
      },
    });
  }

  saveCareer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.form.getRawValue();
    const payload = {
      ...formValue,
      jobTitle: formValue.title,
      employmentType: formValue.type,
      fullDescription: formValue.description,
    };

    if (this.isEditMode()) {
      this.careerService.updateCareer(this.careerId!, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          void this.router.navigate(['/admin/career']);
        },
        error: () => {
          this.errorMessage.set('Unable to update career opening.');
          this.isSaving.set(false);
        },
      });
    } else {
      this.careerService.addCareer(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          void this.router.navigate(['/admin/career']);
        },
        error: () => {
          this.errorMessage.set('Unable to create career opening.');
          this.isSaving.set(false);
        },
      });
    }
  }

  cancel(): void {
    void this.router.navigate(['/admin/career']);
  }
}
