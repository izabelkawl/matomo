import { Injectable, computed, signal } from '@angular/core';
import { ConsentState, DEFAULT_CONSENT_STATE } from '../../models/consent.model';

const CONSENT_STORAGE_KEY = 'matomo-demo-consent';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private readonly stateSignal = signal<ConsentState>(this.readStoredState());

  readonly state = this.stateSignal.asReadonly();
  readonly canTrack = computed(
    () => this.stateSignal().status === 'accepted' && this.stateSignal().preferences.analytics,
  );

  acceptAll(): void {
    this.updateState({
      status: 'accepted',
      preferences: { analytics: true },
    });
  }

  rejectAll(): void {
    this.updateState({
      status: 'rejected',
      preferences: { analytics: false },
    });
  }

  savePreferences(analyticsEnabled: boolean): void {
    this.updateState({
      status: analyticsEnabled ? 'accepted' : 'rejected',
      preferences: { analytics: analyticsEnabled },
    });
  }

  private updateState(nextState: ConsentState): void {
    this.stateSignal.set(nextState);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(nextState));
  }

  private readStoredState(): ConsentState {
    try {
      const rawState = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!rawState) {
        return DEFAULT_CONSENT_STATE;
      }

      const parsed = JSON.parse(rawState) as ConsentState;
      if (
        typeof parsed.preferences?.analytics === 'boolean' &&
        (parsed.status === 'pending' ||
          parsed.status === 'accepted' ||
          parsed.status === 'rejected')
      ) {
        return parsed;
      }

      return DEFAULT_CONSENT_STATE;
    } catch {
      return DEFAULT_CONSENT_STATE;
    }
  }
}
