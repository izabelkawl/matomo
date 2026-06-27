import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-consent-banner',
  standalone: true,
  template: `
    @if (visible) {
      <section class="consent-banner" role="region" aria-label="Banner zgody na cookies">
        <div>
          <h2>Ustawienia prywatnosci</h2>
          <p>
            Uzywamy analityki Matomo, aby zrozumiec sposob korzystania z tego demo. Tracking
            pozostaje wylaczony do momentu wyrazenia zgody.
          </p>
        </div>

        <div class="consent-actions">
          <button
            type="button"
            class="btn btn-primary"
            aria-label="Zaakceptuj wszystkie cookies analityczne"
            (click)="acceptAll.emit()"
          >
            Zaakceptuj wszystkie
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            aria-label="Odrzuc wszystkie cookies analityczne"
            (click)="rejectAll.emit()"
          >
            Odrzuc wszystkie
          </button>
          <button
            type="button"
            class="btn btn-tertiary"
            aria-label="Zarzadzaj preferencjami cookies"
            (click)="manage.emit()"
          >
            Zarzadzaj preferencjami
          </button>
        </div>
      </section>
    }
  `,
})
export class ConsentBannerComponent {
  @Input({ required: true }) visible = false;

  @Output() acceptAll = new EventEmitter<void>();
  @Output() rejectAll = new EventEmitter<void>();
  @Output() manage = new EventEmitter<void>();
}
