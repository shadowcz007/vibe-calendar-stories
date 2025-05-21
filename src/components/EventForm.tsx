
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import type { Event, EventFormData } from '@/lib/types';
import { useCalendar } from '@/contexts/CalendarContext';

interface EventFormProps {
  event?: Event;
  selectedDate?: Date;
  onClose: () => void;
}

const EMOJI_OPTIONS = [
  '🎉', '🎂', '🎯', '📚', '🎮', '🏋️', '🧘', '🚗', '✈️', '🏠', 
  '💼', '🍔', '🍕', '☕', '🍷', '💰', '💻', '📱', '🎵', '🎬'
];

export const EventForm: React.FC<EventFormProps> = ({ event, selectedDate, onClose }) => {
  const { addEvent, updateEvent, deleteEvent } = useCalendar();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: event ? {
      title: event.title,
      emoji: event.emoji || '',
      date: event.date,
      color: event.color,
    } : {
      title: '',
      emoji: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const selectedEmoji = watch('emoji');
  const watchDate = watch('date');
  const parsedDate = watchDate ? new Date(watchDate) : (selectedDate || new Date());

  const onSubmit = (data: EventFormData) => {
    if (event) {
      updateEvent({
        ...data,
        id: event.id,
      });
    } else {
      addEvent(data);
    }
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      deleteEvent(event.id);
      onClose();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setValue('emoji', emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-12 h-12 text-2xl"
              >
                {selectedEmoji || '😀'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-5 gap-2">
                {EMOJI_OPTIONS.map(emoji => (
                  <Button 
                    key={emoji}
                    type="button"
                    variant="ghost" 
                    className="text-xl"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex-1">
            <Label htmlFor="title" className="block mb-1">Event Title</Label>
            <Input
              id="title"
              placeholder="Add event title"
              {...register('title', { required: true })}
              className={cn(errors.title && "border-red-500")}
            />
            {errors.title && (
              <span className="text-xs text-red-500">Title is required</span>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="date" className="block mb-1">Date</Label>
        <div className="flex gap-2">
          <Input 
            id="date" 
            type="date"
            {...register('date', { required: true })} 
            className={cn("flex-1", errors.date && "border-red-500")}
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={parsedDate}
                onSelect={(date) => date && setValue('date', format(date, 'yyyy-MM-dd'))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        {errors.date && (
          <span className="text-xs text-red-500">Date is required</span>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {event && (
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
        <Button 
          type="button" 
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">
          {event ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
