import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AnalyticsService } from '../../core/services/analytics.service';
import { getScrollDepth } from '../../shared/utils/scroll-depth.util';
import { FaqSectionComponent } from './components/faq-section.component';
import { FeaturesSectionComponent } from './components/features-section.component';
import { HeroSectionComponent } from './components/hero-section.component';
import { RequestDemoFormComponent } from './components/request-demo-form.component';
import { ScenarioSectionComponent } from './components/scenario-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    HeroSectionComponent,
    FeaturesSectionComponent,
    ScenarioSectionComponent,
    FaqSectionComponent,
    RequestDemoFormComponent,
  ],
  template: `
    <main class="landing">
      <app-hero-section (ctaPrimary)="onPrimaryCta()" (ctaSecondary)="goToAnalyticsPreview()" />

      <app-features-section />

      <app-scenario-section (scenarioSelected)="onScenarioSelected($event)" />

      <app-faq-section (faqOpened)="onFaqOpen($event)" />

      <app-request-demo-form (formStarted)="onFormStart()" (formSubmitted)="onFormSubmit()" />

      @if (showScrollHint()) {
        <p class="scroll-hint" role="status">
          Przewin strone, aby wyzwolic eventy glebokosci 50% i 75%.
        </p>
      }
    </main>
  `,
})
export class LandingPageComponent implements OnInit {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private sent50 = false;
  private sent75 = false;

  protected readonly showScrollHint = signal(true);

  ngOnInit(): void {
    fromEvent(globalThis, 'scroll')
      .pipe(debounceTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const depth = getScrollDepth();

        if (!this.sent50 && depth >= 50) {
          this.sent50 = true;
          this.analyticsService.track({
            category: 'Scroll',
            action: 'depth',
            name: 'Scroll strony glownej 50%',
            value: 50,
          });
        }

        if (!this.sent75 && depth >= 75) {
          this.sent75 = true;
          this.showScrollHint.set(false);
          this.analyticsService.track({
            category: 'Scroll',
            action: 'depth',
            name: 'Scroll strony glownej 75%',
            value: 75,
          });
        }
      });
  }

  protected onPrimaryCta(): void {
    this.analyticsService.track({
      category: 'Landing',
      action: 'click',
      name: 'Hero CTA Uruchom demo',
    });

    void this.router.navigate(['/analytics']);
  }

  protected goToAnalyticsPreview(): void {
    this.analyticsService.track({
      category: 'Landing',
      action: 'click',
      name: 'Hero CTA Zobacz podglad analityki',
    });

    void this.router.navigate(['/analytics']);
  }

  protected onFaqOpen(question: string): void {
    this.analyticsService.track({
      category: 'FAQ',
      action: 'open',
      name: question,
    });
  }

  protected onScenarioSelected(scenarioLabel: string): void {
    this.analyticsService.track({
      category: 'Scenario',
      action: 'select',
      name: scenarioLabel,
    });
  }

  protected onFormStart(): void {
    this.analyticsService.track({
      category: 'Form',
      action: 'start',
      name: 'Rozpoczecie formularza demo',
    });
  }

  protected onFormSubmit(): void {
    this.analyticsService.track({
      category: 'Form',
      action: 'submit',
      name: 'Wyslanie formularza demo',
    });
  }
}
