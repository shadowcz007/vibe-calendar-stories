
import React from 'react';
import { useCalendar } from '@/contexts/CalendarContext';
import { MonthView } from './MonthView';
import { DayView } from './DayView';

export const Calendar: React.FC = () => {
  const { state } = useCalendar();
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {state.currentView === 'month' ? (
        <MonthView />
      ) : (
        <DayView />
      )}
    </div>
  );
};
