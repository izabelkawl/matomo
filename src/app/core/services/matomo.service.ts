import { Injectable, signal } from '@angular/core';
import { AnalyticsEvent } from '../../models/analytics-event.model';

type PaqCommand =
  | ['trackEvent', string, string, string, number?]
  | ['setTrackerUrl', string]
  | ['setSiteId', string]
  | ['enableLinkTracking']
  | ['trackPageView'];

@Injectable({
  providedIn: 'root',
})
export class MatomoService {
  private readonly trackerUrl = 'https://izaw.matomo.coud/matomo.php';
  private readonly siteId = '1';
  private configured = false;
  private readonly mockMode = signal(false);

  private get paq(): Array<PaqCommand> | undefined {
    const trackedWindow = globalThis.window as Window & {
      _paq?: Array<PaqCommand>;
    };
    return trackedWindow?._paq;
  }

  isAvailable(): boolean {
    return Array.isArray(this.paq);
  }

  configure(): void {
    if (!this.isAvailable() || this.configured) {
      return;
    }

    this.paq?.push(
      ['setTrackerUrl', this.trackerUrl],
      ['setSiteId', this.siteId],
      ['enableLinkTracking'],
      ['trackPageView'],
    );

    this.configured = true;
  }

  trackEvent(event: AnalyticsEvent): boolean {
    if (!this.isAvailable() || this.mockMode()) {
      return false;
    }

    this.configure();
    this.paq?.push(['trackEvent', event.category, event.action, event.name, event.value]);

    return true;
  }

  setMockMode(enabled: boolean): void {
    this.mockMode.set(enabled);
  }
}
