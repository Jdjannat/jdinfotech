import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CareerManagementService, CareerOpening } from '../../services/career-management.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';

type BootstrapModal = {
  show(): void;
  hide(): void;
};

declare const bootstrap: {
  Modal: new (el: HTMLElement) => BootstrapModal;
};

@Component({
  selector: 'app-career',
  imports: [CommonModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './career.html',
  styleUrl: './career.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Career implements OnDestroy {
  private readonly careerService = inject(CareerManagementService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('careerViewModal') private modalRef!: ElementRef<HTMLElement>;
  private viewModal: BootstrapModal | null = null;

  readonly careers = this.careerService.careers;
  readonly selectedCareer = signal<CareerOpening | null>(null);
  readonly pendingDeleteId = signal<string | number | null>(null);
  readonly isDeleting = signal(false);
  readonly totalCareers = computed(() => this.careers().length);

  private getModal(): BootstrapModal | null {
    if (!this.isBrowser) {
      return null;
    }

    if (!this.viewModal) {
      this.viewModal = new bootstrap.Modal(this.modalRef.nativeElement);
    }

    return this.viewModal;
  }

  viewCareer(career: CareerOpening): void {
    this.selectedCareer.set(career);
    this.getModal()?.show();
  }

  closeCareerView(): void {
    this.getModal()?.hide();
    this.selectedCareer.set(null);
  }

  requestDelete(id: string | number): void {
    this.pendingDeleteId.set(id);
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id === null) {
      return;
    }

    this.isDeleting.set(true);
    this.careerService.deleteCareer(id).subscribe({
      next: () => {
        this.pendingDeleteId.set(null);
        this.isDeleting.set(false);

        if (this.selectedCareer()?.id === id) {
          this.closeCareerView();
        }
      },
      error: () => {
        this.isDeleting.set(false);
      },
    });
  }

  trackByCareer(_index: number, career: CareerOpening): string | number {
    return career.id;
  }

  ngOnDestroy(): void {
    this.getModal()?.hide();
  }
}
