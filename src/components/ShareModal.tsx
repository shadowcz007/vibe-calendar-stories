
import React, { useRef } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Event } from '@/lib/types';
import { useCalendar } from '@/contexts/CalendarContext';
import { Download, Share } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  event: Event;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ event, onClose }) => {
  const { state } = useCalendar();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const downloadImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${event.title}-calendar-event.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };
  
  const shareImage = async () => {
    if (!cardRef.current) return;
    
    if (navigator.share) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          try {
            const file = new File([blob], `${event.title}.png`, { type: 'image/png' });
            
            await navigator.share({
              title: event.title,
              text: `Check out my event: ${event.title}`,
              files: [file],
            });
          } catch (error) {
            console.error('Error sharing:', error);
            // Fallback to download if sharing fails
            downloadImage();
          }
        });
      } catch (error) {
        console.error('Error generating canvas:', error);
      }
    } else {
      // Fallback to download if Web Share API is not supported
      downloadImage();
    }
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-xl font-semibold">Share Event</h2>
      
      <div 
        ref={cardRef} 
        className={`p-6 rounded-xl shadow-lg overflow-hidden max-w-[350px] mx-auto theme-${state.theme}`}
        style={{
          background: state.theme === 'gradient' 
            ? 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)' 
            : undefined
        }}
      >
        <div className={`bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-sm ${state.theme === 'dark' ? 'border border-white/10' : 'border'}`}>
          <div className="text-4xl text-center mb-3">{event.emoji || '📅'}</div>
          <h3 className="text-xl font-bold text-center mb-2">{event.title}</h3>
          <p className="text-center text-foreground/80">
            {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
          </p>
          
          <div className="mt-4 text-xs text-center text-foreground/60">
            Created with Z-Calendar
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={downloadImage}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={shareImage}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
