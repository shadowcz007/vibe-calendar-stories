
import React from 'react';
import { useCalendar } from '@/contexts/CalendarContext';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Calendar as CalendarIcon } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, setCurrentView } = useCalendar();
  
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Z-Calendar</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg overflow-hidden border">
          <Button
            variant={state.currentView === 'month' ? 'default' : 'ghost'}
            className="rounded-none"
            onClick={() => setCurrentView('month')}
          >
            Month
          </Button>
          <Button
            variant={state.currentView === 'day' ? 'default' : 'ghost'}
            className="rounded-none"
            onClick={() => setCurrentView('day')}
          >
            Day
          </Button>
        </div>
        
        <ThemeSwitcher />
      </div>
    </header>
  );
};
