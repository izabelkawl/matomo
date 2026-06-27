import { Injectable, computed, inject, signal } from '@angular/core';
import { AnalyticsEvent, TrackedEvent } from '../../models/analytics-event.model';
import { AnalyticsSnapshot, EMPTY_COUNTERS } from '../../models/analytics-preview.model';
import { ConsentService } from './consent.service';
import { MatomoService } from './matomo.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly maxRecentEvents = 30;
  private readonly eventsSignal = signal<TrackedEvent[]>([]);

  readonly events = this.eventsSignal.asReadonly();
  readonly snapshot = computed<AnalyticsSnapshot>(() => {
    const events = this.eventsSignal();
    const counters = events.reduce(
      (acc, event) => {
        if (event.category === 'Landing' && event.action === 'click') {
          acc.ctaClicks += 1;
        }

        if (event.category === 'FAQ' && event.action === 'open') {
          acc.faqOpens += 1;
        }

        if (event.category === 'Form' && event.action === 'start') {
          acc.formStarts += 1;
        }

        if (event.category === 'Form' && event.action === 'submit') {
          acc.formSubmits += 1;
        }

        if (event.category === 'Scenario' && event.action === 'select') {
          acc.scenarioSelections += 1;
        }

        if (event.category === 'Scroll' && event.action === 'depth' && event.value === 50) {
          acc.scroll50 += 1;
        }

        if (event.category === 'Scroll' && event.action === 'depth' && event.value === 75) {
          acc.scroll75 += 1;
        }

        return acc;
      },
      { ...EMPTY_COUNTERS },
    );

    return {
      counters,
      recentEvents: events.slice(0, 8),
    };
  });

  private readonly consentService = inject(ConsentService);
  private readonly matomoService = inject(MatomoService);

  track(event: AnalyticsEvent): void {
    if (!this.consentService.canTrack()) {
      return;
    }

    const sentToMatomo = this.matomoService.trackEvent(event);
    const trackedEvent: TrackedEvent = {
      ...event,
      timestamp: Date.now(),
      sentToMatomo,
    };

    this.eventsSignal.update((events) => [
      trackedEvent,
      ...events.slice(0, this.maxRecentEvents - 1),
    ]);
  }

  resetPreview(): void {
    this.eventsSignal.set([]);
  }
}
