import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

type BootstrapModal = {
  show(): void;
  hide(): void;
  dispose(): void;
};

declare const bootstrap: {
  Modal: new (element: HTMLElement, options?: { backdrop?: boolean | 'static'; keyboard?: boolean }) => BootstrapModal;
};

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialogComponent implements AfterViewInit, OnDestroy {

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('confirmModal') private confirmModalRef?: ElementRef<HTMLElement>;
  private modal: BootstrapModal | null = null;
  private viewReady = false;
  private hiddenHandler?: () => void;

  private _open = false;
  @Input()
  set open(value: boolean) {
    this._open = value;
    this.syncOpenState();
  }
  get open(): boolean {
    return this._open;
  }

  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure?';

  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';

  @Input() loading = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.viewReady = true;

    if (!this.isBrowser || !this.confirmModalRef) {
      return;
    }

    this.modal = new bootstrap.Modal(this.confirmModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
    });

    // Keep parent state in sync when user dismisses via backdrop or Esc.
    this.hiddenHandler = () => {
      if (this._open) {
        this.cancelled.emit();
      }
    };

    this.confirmModalRef.nativeElement.addEventListener('hidden.bs.modal', this.hiddenHandler);
    this.syncOpenState();
  }

  private syncOpenState(): void {
    if (!this.isBrowser || !this.viewReady || !this.modal) {
      return;
    }

    if (this._open) {
      this.modal.show();
    } else {
      this.modal.hide();
    }
  }

  confirm(): void {
    this.modal?.hide();
    this.confirmed.emit();
  }

  cancel(): void {
    this.modal?.hide();
    this.cancelled.emit();
  }

  ngOnDestroy(): void {
    if (this.confirmModalRef && this.hiddenHandler) {
      this.confirmModalRef.nativeElement.removeEventListener('hidden.bs.modal', this.hiddenHandler);
    }

    this.modal?.dispose();
    this.modal = null;
  }
}