import { Component } from '@angular/core';

interface FeatureCard {
  title: string;
  description: string;
  metric: string;
}

@Component({
  selector: 'app-features-section',
  standalone: true,
  template: `
    <section class="features" aria-label="Karty funkcji">
      <h2>Zaprojektowane do frontendowych demo analityki</h2>
      <div class="cards-grid">
        @for (feature of features; track feature.title) {
          <article class="feature-card" tabindex="0">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <strong>{{ feature.metric }}</strong>
          </article>
        }
      </div>
    </section>
  `,
})
export class FeaturesSectionComponent {
  protected readonly features: FeatureCard[] = [
    {
      title: 'Taksonomia eventow',
      description:
        'Ustrukturyzowany schemat category/action/name/value gotowy do wysylki do Matomo.',
      metric: '6 monitorowanych punktow styku',
    },
    {
      title: 'Consent-first pipeline',
      description: 'Tracking uruchamia sie dopiero po swiadomej decyzji uzytkownika.',
      metric: '100% telemetry gated',
    },
    {
      title: 'Podglad analityki na zywo',
      description: 'Liczniki oparte o Signals pozwalaja pokazac demo nawet bez backendu.',
      metric: 'Aktualizacja w czasie rzeczywistym',
    },
  ];
}
