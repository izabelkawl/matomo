import { Injectable, signal } from '@angular/core';
import { AnalyticsEvent } from '../../models/analytics-event.model';

@Injectable({
  providedIn: 'root',
})
export class MatomoService {
  private readonly mockMode = signal(false);

//   isAvailable(): boolean {
//     return Array.isArray(window._paq);
//   }

  trackEvent(event: AnalyticsEvent): boolean {
    // if (!this.isAvailable() || this.mockMode()) {
    //   return false;
    // }

    // @ts-ignore
    _paq?.push(['trackEvent', event.category, event.action, event.name, event.value]);

    return true;
  }

  setMockMode(enabled: boolean): void {
    this.mockMode.set(enabled);
  }
}
