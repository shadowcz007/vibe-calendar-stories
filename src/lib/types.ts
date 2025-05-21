
export type Theme = 'minimal' | 'pastel' | 'gradient' | 'dark';

export interface Event {
  id: string;
  title: string;
  emoji?: string;
  date: string; // ISO format YYYY-MM-DD
  color?: string;
}

export interface EventFormData {
  title: string;
  emoji: string;
  date: string;
  color?: string;
}

export interface CalendarState {
  events: Event[];
  selectedDate: Date;
  currentView: 'month' | 'day';
  theme: Theme;
}
