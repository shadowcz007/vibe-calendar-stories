
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formatDateToISO } from '@/lib/calendarUtils';
import { CalendarState, Event, Theme } from '@/lib/types';
import { useToast } from "@/components/ui/use-toast";

type CalendarAction = 
  | { type: 'ADD_EVENT', payload: Event }
  | { type: 'UPDATE_EVENT', payload: Event }
  | { type: 'DELETE_EVENT', payload: string }
  | { type: 'SET_SELECTED_DATE', payload: Date }
  | { type: 'SET_CURRENT_VIEW', payload: 'month' | 'day' }
  | { type: 'SET_THEME', payload: Theme };

interface CalendarContextType {
  state: CalendarState;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: Date) => void;
  setCurrentView: (view: 'month' | 'day') => void;
  setTheme: (theme: Theme) => void;
}

const initialState: CalendarState = {
  events: [],
  selectedDate: new Date(),
  currentView: 'month',
  theme: 'gradient',
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event => 
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        selectedDate: action.payload,
      };
    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    const savedTheme = localStorage.getItem('calendarTheme');
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        parsedEvents.forEach((event: Event) => {
          dispatch({ type: 'ADD_EVENT', payload: event });
        });
      } catch (error) {
        console.error('Failed to parse saved events:', error);
      }
    }
    
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme as Theme });
      document.documentElement.classList.add(`theme-${savedTheme}`);
    } else {
      document.documentElement.classList.add(`theme-${state.theme}`);
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(state.events));
  }, [state.events]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calendarTheme', state.theme);
    
    // Update document class for theme
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${state.theme}`);
  }, [state.theme]);

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent = {
      ...eventData,
      id: Math.random().toString(36).substring(2, 11),
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    toast({
      title: "Event Added",
      description: `${eventData.emoji || ''} ${eventData.title}`,
    });
  };

  const updateEvent = (event: Event) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event });
    toast({
      title: "Event Updated",
      description: `${event.emoji || ''} ${event.title}`,
    });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
    toast({
      title: "Event Deleted",
      description: "Event has been removed from your calendar",
    });
  };

  const setSelectedDate = (date: Date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  };

  const setCurrentView = (view: 'month' | 'day') => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    toast({
      title: "Theme Changed",
      description: `Theme set to ${theme}`,
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        state,
        addEvent,
        updateEvent,
        deleteEvent,
        setSelectedDate,
        setCurrentView,
        setTheme,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
