
import React, { useState } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { useCalendar } from '@/contexts/CalendarContext';
import { getEventsForDay } from '@/lib/calendarUtils';
import { ChevronLeft, ChevronRight, Plus, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/types';
import { ShareModal } from './ShareModal';

export const DayView: React.FC = () => {
  const { state, setSelectedDate } = useCalendar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | undefined>(undefined);
  const [shareEvent, setShareEvent] = useState<Event | undefined>(undefined);
  
  const selectedDate = state.selectedDate;
  const dayEvents = getEventsForDay(state.events, selectedDate);
  
  const nextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };
  
  const prevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };
  
  const handleAddEvent = () => {
    setEditEvent(undefined);
    setDialogOpen(true);
  };
  
  const handleEventClick = (event: Event) => {
    setEditEvent(event);
    setDialogOpen(true);
  };

  const handleShareEvent = (event: Event) => {
    setShareEvent(event);
    setShareDialogOpen(true);
  };
  
  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={prevDay}
          className="opacity-70 hover:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <h2 className={cn(
          "text-2xl font-medium",
          isToday && "text-primary"
        )}>
          {format(selectedDate, 'EEEE, MMMM d')}
          {isToday && <span className="ml-2 text-sm bg-primary/20 px-2 py-1 rounded">Today</span>}
        </h2>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextDay}
          className="opacity-70 hover:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-auto">
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <p>No events scheduled for today</p>
            <Button
              onClick={handleAddEvent}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        ) : (
          dayEvents.map(event => (
            <div 
              key={event.id}
              className="flex items-center justify-between p-3 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{event.emoji || '📝'}</div>
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(event.date), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareEvent(event);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <Button 
          onClick={handleAddEvent} 
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>
      
      {/* Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <EventForm
            event={editEvent}
            selectedDate={selectedDate}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {shareEvent && (
            <ShareModal 
              event={shareEvent} 
              onClose={() => setShareDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
