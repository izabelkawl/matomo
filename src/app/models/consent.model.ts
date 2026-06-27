export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export interface ConsentPreferences {
  analytics: boolean;
}

export interface ConsentState {
  status: ConsentStatus;
  preferences: ConsentPreferences;
}

export const DEFAULT_CONSENT_STATE: ConsentState = {
  status: 'pending',
  preferences: {
    analytics: false,
  },
};
