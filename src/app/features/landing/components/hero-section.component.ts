import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  template: `
    <section class="hero" aria-label="Sekcja hero">
      <p class="eyebrow">Platforma demo Matomo</p>
      <h1>Sledz interakcje produktowe z pelna kontrola zgody uzytkownika.</h1>
      <p class="subtitle">
        Nowoczesny landing do prezentacji eventow, zarzadzania zgoda i podgladu danych analitycznych
        w czasie rzeczywistym w Angularze.
      </p>
      <div class="hero-actions">
        <button
          type="button"
          class="btn btn-primary"
          aria-label="Uruchom demo analityki"
          (click)="ctaPrimary.emit()"
        >
          Uruchom demo
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          aria-label="Przejdz do podgladu analityki"
          (click)="ctaSecondary.emit()"
        >
          Zobacz podglad analityki
        </button>
      </div>
    </section>
  `,
})
export class HeroSectionComponent {
  @Output() ctaPrimary = new EventEmitter<void>();
  @Output() ctaSecondary = new EventEmitter<void>();
}
