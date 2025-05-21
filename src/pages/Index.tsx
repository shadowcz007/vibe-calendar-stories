
import React from 'react';
import { Header } from '@/components/Header';
import { Calendar } from '@/components/Calendar';
import { CalendarProvider } from '@/contexts/CalendarContext';

const Index: React.FC = () => {
  return (
    <CalendarProvider>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Calendar />
        </main>
      </div>
    </CalendarProvider>
  );
};

export default Index;
