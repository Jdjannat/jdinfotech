import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Inquiry as InquiryRecord, InquiryService } from '../../services/inquiry.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';

declare const bootstrap: { Modal: new (el: HTMLElement) => { show(): void; hide(): void } };

@Component({
  selector: 'app-inquiry',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './inquiry.html',
  styleUrl: './inquiry.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inquiry implements OnDestroy {
  private readonly inquiryService = inject(InquiryService);
  private readonly fb = inject(FormBuilder);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('inquiryModal') private modalRef!: ElementRef<HTMLElement>;
  private bsModal: { show(): void; hide(): void } | null = null;

  private getModal() {
    if (!this.isBrowser) return null;
    if (!this.bsModal) {
      this.bsModal = new bootstrap.Modal(this.modalRef.nativeElement);
    }
    return this.bsModal;
  }

  readonly inquiries = signal<InquiryRecord[]>([]);
  readonly selectedInquiry = signal<InquiryRecord | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly isDeleting = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);
  readonly popupMode = signal<'view' | 'edit' | null>(null);
  readonly pendingDeleteId = signal<string | number | null>(null);

  readonly totalPages = computed(() => {
    const pages = Math.ceil(this.total() / this.limit());
    return pages > 0 ? pages : 1;
  });

  readonly form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email]],
    phone: [''],
    requirement: [''],
    message: ['', [Validators.required, Validators.minLength(5)]],
    status: ['new'],
  });

  readonly searchForm = this.fb.nonNullable.group({
    search: '',
  });

  constructor() {
    this.searchForm.controls.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.search.set(term.trim());
        this.page.set(1);
        this.loadInquiries();
      });

    this.loadInquiries();
  }

  loadInquiries(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.inquiryService
      .getInquiries({
        page: this.page(),
        limit: this.limit(),
        search: this.search(),
      })
      .subscribe({
        next: (result) => {
          this.inquiries.set(result.items);
          this.total.set(result.total);
          this.page.set(result.page);
          this.limit.set(result.limit);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message || 'Unable to load inquiries. Please try again.',
          );
          this.isLoading.set(false);
        },
      });
  }

  viewInquiry(id: string | number): void {
    this.fetchSingleInquiry(id, 'view');
  }

  editInquiry(id: string | number): void {
    this.fetchSingleInquiry(id, 'edit');
  }

  private fetchSingleInquiry(id: string | number, mode: 'view' | 'edit'): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.inquiryService.getInquiryById(id).subscribe({
      next: (inquiry) => {
        this.selectedInquiry.set(inquiry);
        this.popupMode.set(mode);
        this.form.patchValue({
          name: String(inquiry.name ?? ''),
          email: String(inquiry.email ?? ''),
          phone: String(inquiry.phone ?? ''),
          requirement: String(inquiry.requirement ?? ''),
          message: String(inquiry.message ?? ''),
          status: inquiry.status ?? 'new',
        });
        this.isLoading.set(false);
        this.getModal()?.show();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to load inquiry details. Please try again.',
        );
        this.isLoading.set(false);
      },
    });
  }

  saveInquiry(): void {
    const selected = this.selectedInquiry();
    if (!selected || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const formValue = this.form.getRawValue();
    const statusValue = String(formValue.status ?? '').trim() || 'new';
    const payload: Partial<InquiryRecord> = {
      name: formValue.name || undefined,
      email: formValue.email || undefined,
      phone: formValue.phone || undefined,
      requirement: formValue.requirement || undefined,
      message: formValue.message || undefined,
      status: statusValue,
    };

    this.inquiryService.updateInquiry(selected.id, payload).subscribe({
      next: (updatedInquiry) => {
        this.selectedInquiry.set(updatedInquiry);
        this.isSaving.set(false);
        this.popupMode.set('view');
        this.loadInquiries();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to update inquiry. Please try again.',
        );
        this.isSaving.set(false);
      },
    });
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

    this.pendingDeleteId.set(null);

    this.isDeleting.set(true);
    this.errorMessage.set('');

    this.inquiryService.deleteInquiry(id).subscribe({
      next: () => {
        if (this.selectedInquiry()?.id === id) {
          this.closeDetails();
        }

        const currentCount = this.inquiries().length;
        const currentPage = this.page();

        if (currentCount === 1 && currentPage > 1) {
          this.page.set(currentPage - 1);
        }

        this.isDeleting.set(false);
        this.loadInquiries();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to delete inquiry. Please try again.',
        );
        this.isDeleting.set(false);
      },
    });
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) {
      return;
    }

    this.page.set(page);
    this.loadInquiries();
  }

  closeDetails(): void {
    this.getModal()?.hide();
    this.selectedInquiry.set(null);
    this.popupMode.set(null);
    this.form.reset({
      name: '',
      email: '',
      phone: '',
      requirement: '',
      message: '',
      status: 'new',
    });
  }

  trackByInquiry(_index: number, inquiry: InquiryRecord): string | number {
    return inquiry.id;
  }

  showViewPopup(): boolean {
    return this.popupMode() === 'view' && this.selectedInquiry() !== null;
  }

  showEditPopup(): boolean {
    return this.popupMode() === 'edit' && this.selectedInquiry() !== null;
  }

  ngOnDestroy(): void {
    this.getModal()?.hide();
  }
}
