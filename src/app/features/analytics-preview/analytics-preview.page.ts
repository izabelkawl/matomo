import { Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/services/analytics.service';
import { MatomoService } from '../../core/services/matomo.service';
import {
    AnalyticsAction,
    AnalyticsCategory,
    TrackedEvent,
} from '../../models/analytics-event.model';

interface ChartBar {
  label: string;
  value: number;
  ratio: number;
}

@Component({
  selector: 'app-analytics-preview-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="analytics-preview" aria-label="Dashboard podgladu analityki">
      <header class="preview-header">
        <h1>Podglad analityki</h1>
        <p>Licznik zdarzen z frontendu aktualizowany po wyrazeniu zgody.</p>
        <div class="preview-actions">
          <a routerLink="/" class="btn btn-secondary" aria-label="Wroc na strone glowna">
            Wroc na strone glowna
          </a>
          <button
            type="button"
            class="btn btn-primary"
            aria-label="Zresetuj lokalne liczniki analityki"
            (click)="analyticsService.resetPreview()"
          >
            Resetuj liczniki
          </button>
        </div>
      </header>

      <section class="preview-grid" aria-label="Liczniki eventow">
        <article class="metric-card">
          <span>Klikniecia CTA</span>
          <strong>{{ snapshot().counters.ctaClicks }}</strong>
        </article>
        <article class="metric-card">
          <span>Otwarcia FAQ</span>
          <strong>{{ snapshot().counters.faqOpens }}</strong>
        </article>
        <article class="metric-card">
          <span>Rozpoczecia formularza</span>
          <strong>{{ snapshot().counters.formStarts }}</strong>
        </article>
        <article class="metric-card">
          <span>Wyslania formularza</span>
          <strong>{{ snapshot().counters.formSubmits }}</strong>
        </article>
        <article class="metric-card">
          <span>Wybory scenariusza</span>
          <strong>{{ snapshot().counters.scenarioSelections }}</strong>
        </article>
        <article class="metric-card">
          <span>Scroll 50%</span>
          <strong>{{ snapshot().counters.scroll50 }}</strong>
        </article>
        <article class="metric-card">
          <span>Scroll 75%</span>
          <strong>{{ snapshot().counters.scroll75 }}</strong>
        </article>
      </section>

      <section class="chart-panel" aria-label="Wykres aktywnosci eventow">
        <div class="chart-panel-header">
          <div>
            <h2>Wykres aktywnosci</h2>
            <p class="muted">Porownanie najwazniejszych sygnalow z landing page.</p>
          </div>
          <div class="chart-key-metric">
            <span>Najsilniejszy sygnal</span>
            <strong>{{ topMetricLabel() }}</strong>
          </div>
        </div>

        <div class="chart-bars" role="img" aria-label="Wykres slupkowy aktywnosci eventow">
          @for (bar of chartBars(); track bar.label) {
            <div class="chart-row">
              <div class="chart-row-meta">
                <span>{{ bar.label }}</span>
                <strong>{{ bar.value }}</strong>
              </div>
              <div class="chart-track">
                <div class="chart-fill" [style.--bar-scale]="bar.ratio"></div>
              </div>
            </div>
          }
        </div>
      </section>

      <section class="insights-grid" aria-label="Wnioski analityczne">
        <article class="insight-card">
          <h2>Konwersja formularza</h2>
          <strong>{{ formConversionLabel() }}</strong>
          <p class="muted">{{ formInsight() }}</p>
        </article>
        <article class="insight-card">
          <h2>Jakosc scrolla</h2>
          <strong>{{ scrollRetentionLabel() }}</strong>
          <p class="muted">{{ scrollInsight() }}</p>
        </article>
        <article class="insight-card">
          <h2>Intencja uzytkownikow</h2>
          <strong>{{ topScenarioLabel() }}</strong>
          <p class="muted">{{ scenarioInsight() }}</p>
        </article>
      </section>

      <section class="recent-events" aria-label="Ostatnio zarejestrowane eventy">
        <h2>Ostatnie eventy</h2>
        @if (recentEvents().length === 0) {
          <p class="muted">Brak eventow. Wejdz w interakcje ze strona po wyrazeniu zgody.</p>
        } @else {
          <table>
            <thead>
              <tr>
                <th>Kategoria</th>
                <th>Akcja</th>
                <th>Nazwa</th>
                <th>Wartosc</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (event of recentEvents(); track event.timestamp) {
                <tr>
                  <td>{{ getCategoryLabel(event.category) }}</td>
                  <td>{{ getActionLabel(event.action) }}</td>
                  <td>{{ event.name }}</td>
                  <td>{{ event.value ?? '-' }}</td>
                  <td>{{ event.sentToMatomo ? 'Matomo' : 'Lokalny fallback' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </section>
    </main>
  `,
})
export class AnalyticsPreviewPageComponent implements OnInit, OnDestroy {
  private readonly categoryLabels: Record<AnalyticsCategory, string> = {
    Landing: 'Landing',
    FAQ: 'FAQ',
    Form: 'Formularz',
    Scroll: 'Scroll',
    Consent: 'Zgoda',
    Scenario: 'Scenariusz',
    Video: 'Wideo',
  };

  private readonly actionLabels: Record<AnalyticsAction, string> = {
    click: 'Klikniecie',
    open: 'Otwarcie',
    start: 'Start',
    submit: 'Wyslanie',
    select: 'Wybor',
    depth: 'Glebokosc',
    accept_all: 'Akceptacja wszystkich',
    reject_all: 'Odrzucenie wszystkich',
    manage_preferences: 'Zarzadzanie preferencjami',
    play: 'Odtworzenie',
  };

  protected readonly analyticsService = inject(AnalyticsService);
  private readonly matomoService = inject(MatomoService);
  protected readonly snapshot = this.analyticsService.snapshot;
  protected readonly recentEvents = computed(() => this.snapshot().recentEvents);
  protected readonly chartBars = computed<ChartBar[]>(() => {
    const counters = this.snapshot().counters;
    const bars = [
      { label: 'CTA', value: counters.ctaClicks },
      { label: 'FAQ', value: counters.faqOpens },
      { label: 'Form start', value: counters.formStarts },
      { label: 'Form submit', value: counters.formSubmits },
      { label: 'Scenariusze', value: counters.scenarioSelections },
      { label: 'Scroll 75%', value: counters.scroll75 },
    ];
    const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

    return bars.map((bar) => ({
      ...bar,
      ratio: bar.value / maxValue,
    }));
  });
  protected readonly topMetricLabel = computed(() => {
    const topBar = this.chartBars().reduce<ChartBar>(
      (currentTop, bar) => (bar.value > currentTop.value ? bar : currentTop),
      { label: 'Brak danych', value: 0, ratio: 0 },
    );

    return topBar.value > 0 ? topBar.label : 'Brak danych';
  });
  protected readonly formConversionLabel = computed(() => {
    const { formStarts, formSubmits } = this.snapshot().counters;
    if (formStarts === 0) {
      return '0%';
    }

    return `${Math.round((formSubmits / formStarts) * 100)}%`;
  });
  protected readonly formInsight = computed(() => {
    const { formStarts, formSubmits } = this.snapshot().counters;
    if (formStarts === 0) {
      return 'Brak rozpoczec formularza. Dodaj wiecej ruchu do sekcji demo lub mocniejsze CTA.';
    }

    if (formSubmits === 0) {
      return 'Uzytkownicy zaczynaja formularz, ale nie koncza. To sygnal, ze warto uproscic formularz lub obietnice wartosci.';
    }

    return 'Formularz ma sygnal konwersji. Mozesz porownac go z kliknieciami CTA, by ocenic jakosc ruchu.';
  });
  protected readonly scrollRetentionLabel = computed(() => {
    const { scroll50, scroll75 } = this.snapshot().counters;
    if (scroll50 === 0) {
      return '0%';
    }

    return `${Math.round((scroll75 / scroll50) * 100)}%`;
  });
  protected readonly scrollInsight = computed(() => {
    const { scroll50, scroll75 } = this.snapshot().counters;
    if (scroll50 === 0) {
      return 'Brak danych o scrollu. Uzytkownicy nie zeszli jeszcze do srodka strony.';
    }

    if (scroll75 < scroll50) {
      return 'Widac odplyw miedzy 50% a 75% scrolla. To dobre miejsce do testowania krotszych sekcji lub mocniejszego contentu srodkowego.';
    }

    return 'Wiekszosc uzytkownikow dociera gleboko w strone, co sugeruje dobra jakosc tresci i kolejny moment na CTA.';
  });
  protected readonly topScenarioLabel = computed(() => {
    const topScenario = this.getTopScenario();
    return topScenario?.name ?? 'Brak wyborow';
  });
  protected readonly scenarioInsight = computed(() => {
    const topScenario = this.getTopScenario();
    if (!topScenario) {
      return 'Sekcja scenariuszy jeszcze nie byla uzywana, wiec nie ma sygnalu o intencji wdrozenia.';
    }

    return `Najczesciej wybierany scenariusz to "${topScenario.name}". To wskazuje, jaki use case najbardziej rezonuje w demo.`;
  });

  ngOnInit(): void {
    this.matomoService.setMockMode(true);
  }

  ngOnDestroy(): void {
    this.matomoService.setMockMode(false);
  }

  protected getCategoryLabel(category: TrackedEvent['category']): string {
    return this.categoryLabels[category];
  }

  protected getActionLabel(action: TrackedEvent['action']): string {
    return this.actionLabels[action];
  }

  private getTopScenario(): TrackedEvent | null {
    const scenarioEvents = this.analyticsService
      .events()
      .filter((event) => event.category === 'Scenario' && event.action === 'select');

    if (scenarioEvents.length === 0) {
      return null;
    }

    const counts = scenarioEvents.reduce<Record<string, number>>((acc, event) => {
      acc[event.name] = (acc[event.name] ?? 0) + 1;
      return acc;
    }, {});

    const [topScenarioName] = Object.entries(counts).sort((left, right) => right[1] - left[1])[0];
    return scenarioEvents.find((event) => event.name === topScenarioName) ?? null;
  }
}
