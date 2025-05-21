
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isSameDay, parseISO } from 'date-fns';
import type { Event } from './types';

// Get calendar days for a month view
export const getCalendarDays = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  
  const days: Date[] = [];
  let day = start;
  
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }
  
  return days;
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

// Check if a date is in the current month
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

// Format date to YYYY-MM-DD
export const formatDateToISO = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Get events for a specific day
export const getEventsForDay = (events: Event[], date: Date): Event[] => {
  const dateString = formatDateToISO(date);
  return events.filter(event => event.date === dateString);
};

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
