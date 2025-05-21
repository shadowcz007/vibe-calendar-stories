
import React from 'react';
import { Button } from '@/components/ui/button';
import { useCalendar } from '@/contexts/CalendarContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';
import type { Theme } from '@/lib/types';
import { cn } from '@/lib/utils';

export const ThemeSwitcher: React.FC = () => {
  const { state, setTheme } = useCalendar();
  
  const themes: { id: Theme, label: string }[] = [
    { id: 'minimal', label: 'Minimal' },
    { id: 'pastel', label: 'Pastel' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'dark', label: 'Dark' },
  ];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-3">
        <h3 className="font-medium mb-2">Themes</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant="outline"
              className={cn(
                "h-auto justify-start py-2 px-3",
                state.theme === theme.id && "border-primary"
              )}
              onClick={() => setTheme(theme.id)}
            >
              <div className={cn(
                "mr-2 h-4 w-4 rounded-full",
                `theme-${theme.id}-preview`
              )} />
              {theme.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
