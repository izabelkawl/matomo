export type AnalyticsCategory =
  | 'Landing'
  | 'FAQ'
  | 'Form'
  | 'Scroll'
  | 'Consent'
  | 'Scenario'
  | 'Video';

export type AnalyticsAction =
  | 'click'
  | 'open'
  | 'start'
  | 'submit'
  | 'select'
  | 'depth'
  | 'accept_all'
  | 'reject_all'
  | 'manage_preferences'
  | 'play';

export interface AnalyticsEvent {
  category: AnalyticsCategory;
  action: AnalyticsAction;
  name: string;
  value?: number;
}

export interface TrackedEvent extends AnalyticsEvent {
  timestamp: number;
  sentToMatomo: boolean;
}
