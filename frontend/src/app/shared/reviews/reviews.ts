import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { Review } from '../../core/models/catalog.model';
import { Icon } from '../icon/icon';
import { ResponsiveImg } from '../responsive-img';

/** Customer review cards. Each links to its original WhatsApp screenshot in a lightbox. */
@Component({
  selector: 'app-reviews',
  imports: [Icon, ResponsiveImg],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reviews {
  readonly reviews = input.required<Review[]>();

  protected readonly active = signal<Review | null>(null);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected open(review: Review) {
    this.active.set(review);
    this.dialog().nativeElement.showModal();
  }

  protected close() {
    this.dialog().nativeElement.close();
  }

  /** Close when the dimmed backdrop (the dialog element itself) is clicked. */
  protected onDialogClick(event: MouseEvent) {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
