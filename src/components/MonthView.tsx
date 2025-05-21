
import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths,
  isSameDay
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { useCalendar } from '@/contexts/CalendarContext';
import { 
  getCalendarDays, 
  isToday, 
  isCurrentMonth, 
  getEventsForDay,
  formatDateToISO
} from '@/lib/calendarUtils';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Event } from '@/lib/types';

export const MonthView: React.FC = () => {
  const { state, setSelectedDate } = useCalendar();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | undefined>(undefined);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(undefined);
  
  const calendarDays = getCalendarDays(currentMonth);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setTempSelectedDate(date);
    setEditEvent(undefined);
    setDialogOpen(true);
  };
  
  const handleEventClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setEditEvent(event);
    setDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevMonth} 
          className="opacity-70 hover:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <h2 className="text-2xl font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="opacity-70 hover:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 bg-muted/30 rounded-t-md">
        {daysOfWeek.map(day => (
          <div 
            key={day} 
            className="p-2 text-center font-medium text-sm"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map((day, i) => {
          const dayEvents = getEventsForDay(state.events, day);
          const isCurrentMonthDay = isCurrentMonth(day, currentMonth);
          const isTodayDay = isToday(day);
          const isSelectedDay = state.selectedDate ? isSameDay(day, state.selectedDate) : false;
          
          return (
            <div
              key={i}
              className={cn(
                'calendar-day',
                !isCurrentMonthDay && 'other-month',
                isTodayDay && 'today',
                isSelectedDay && 'active'
              )}
              onClick={() => handleDayClick(day)}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs">{format(day, 'd')}</span>
                {isCurrentMonthDay && dayEvents.length === 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-4 w-4 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDayClick(day);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-[65px] overflow-hidden">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className="day-event drag-handle"
                    onClick={(e) => handleEventClick(e, event)}
                  >
                    {event.emoji && (
                      <span className="mr-1">{event.emoji}</span>
                    )}
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <EventForm
            event={editEvent}
            selectedDate={tempSelectedDate}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add the 'cn' helper from utils
import { cn } from "@/lib/utils";
