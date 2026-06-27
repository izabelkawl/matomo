import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';

@Component({
  selector: 'app-consent-preferences',
  standalone: true,
  template: `
    @if (open) {
      <div class="preferences-backdrop" (click)="panelClosed.emit()" aria-hidden="true"></div>
      <section
        class="preferences-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Zarzadzaj preferencjami analitycznymi"
      >
        <h2>Zarzadzaj preferencjami</h2>
        <p>Wlacz cookies analityczne, aby zezwolic na tracking eventow Matomo.</p>

        <label class="checkbox-row" for="analytics-toggle">
          <input
            id="analytics-toggle"
            type="checkbox"
            [checked]="analyticsEnabled()"
            (change)="onToggle($event)"
          />
          <span>Tracking analityczny</span>
        </label>

        <div class="actions">
          <button type="button" class="btn btn-secondary" (click)="panelClosed.emit()">
            Anuluj
          </button>
          <button type="button" class="btn btn-primary" (click)="save.emit(analyticsEnabled())">
            Zapisz preferencje
          </button>
        </div>
      </section>
    }
  `,
})
export class ConsentPreferencesComponent implements OnChanges {
  @Input({ required: true }) open = false;
  @Input({ required: true }) analytics = false;

  @Output() panelClosed = new EventEmitter<void>();
  @Output() save = new EventEmitter<boolean>();

  protected readonly analyticsEnabled = signal(false);

  ngOnChanges(): void {
    this.analyticsEnabled.set(this.analytics);
  }

  protected onToggle(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.analyticsEnabled.set(target.checked);
  }
}
