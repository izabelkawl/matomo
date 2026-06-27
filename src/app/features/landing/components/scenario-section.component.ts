import { Component, EventEmitter, Output, signal } from '@angular/core';

interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  signal: string;
}

@Component({
  selector: 'app-scenario-section',
  standalone: true,
  template: `
    <section class="scenario-section" aria-label="Scenariusze wdrozenia">
      <div class="section-heading">
        <p class="eyebrow">Sygnaly intencji</p>
        <h2>Jaki scenariusz wdrozenia interesuje Twoj zespol?</h2>
        <p class="muted">
          Wybory w tej sekcji daja bardziej wartosciowy sygnal niz sam klik CTA, bo pokazuja realny
          kierunek zainteresowania.
        </p>
      </div>

      <div class="scenario-grid" role="list" aria-label="Lista scenariuszy wdrozenia">
        @for (scenario of scenarios; track scenario.id) {
          <button
            type="button"
            class="scenario-card"
            [class.active]="selectedScenarioId() === scenario.id"
            (click)="selectScenario(scenario)"
          >
            <span class="scenario-signal">{{ scenario.signal }}</span>
            <strong>{{ scenario.label }}</strong>
            <span>{{ scenario.description }}</span>
          </button>
        }
      </div>

      @if (selectedScenario()) {
        <div class="scenario-summary" role="status" aria-live="polite">
          <strong>Wybrany scenariusz:</strong>
          <span>{{ selectedScenario()?.label }} - {{ selectedScenario()?.description }}</span>
        </div>
      }
    </section>
  `,
})
export class ScenarioSectionComponent {
  @Output() scenarioSelected = new EventEmitter<string>();

  protected readonly selectedScenarioId = signal<string>('');
  protected readonly scenarios: ScenarioOption[] = [
    {
      id: 'saas-growth',
      label: 'SaaS growth dashboard',
      description: 'Priorytetem jest szybkie mierzenie lejka CTA, scrolla i formularza.',
      signal: 'Lejek',
    },
    {
      id: 'consent-rollout',
      label: 'Consent rollout',
      description: 'Zespol chce pokazac, gdzie i kiedy zgoda blokuje wysylke eventow.',
      signal: 'Consent',
    },
    {
      id: 'stakeholder-demo',
      label: 'Demo dla stakeholderow',
      description: 'Liczy sie czytelny dashboard i latwe tlumaczenie zachowan uzytkownika.',
      signal: 'Insight',
    },
  ];

  protected readonly selectedScenario = signal<ScenarioOption | null>(null);

  protected selectScenario(scenario: ScenarioOption): void {
    this.selectedScenarioId.set(scenario.id);
    this.selectedScenario.set(scenario);
    this.scenarioSelected.emit(scenario.label);
  }
}
