import { TrackedEvent } from './analytics-event.model';

export interface AnalyticsCounters {
  ctaClicks: number;
  faqOpens: number;
  formStarts: number;
  formSubmits: number;
  scenarioSelections: number;
  scroll50: number;
  scroll75: number;
}

export interface AnalyticsSnapshot {
  counters: AnalyticsCounters;
  recentEvents: TrackedEvent[];
}

export const EMPTY_COUNTERS: AnalyticsCounters = {
  ctaClicks: 0,
  faqOpens: 0,
  formStarts: 0,
  formSubmits: 0,
  scenarioSelections: 0,
  scroll50: 0,
  scroll75: 0,
};
