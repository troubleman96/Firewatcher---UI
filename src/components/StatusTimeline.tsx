import React from 'react';
import { StatusUpdate, STATUS_LABELS, STATUS_ORDER } from '@/types';
import { format } from 'date-fns';
import { 
  AlertCircle, 
  Truck, 
  MapPin, 
  Flame, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

interface StatusTimelineProps {
  updates: StatusUpdate[];
}

const statusIcons = {
  new: AlertCircle,
  enroute: Truck,
  arrived: MapPin,
  fighting: Flame,
  extinguished: CheckCircle,
  closed: XCircle,
};

const statusColors = {
  new: 'bg-primary text-primary-foreground',
  enroute: 'bg-warning text-warning-foreground',
  arrived: 'bg-info text-info-foreground',
  fighting: 'bg-purple-500 text-white',
  extinguished: 'bg-success text-success-foreground',
  closed: 'bg-muted-foreground text-white',
};

export function StatusTimeline({ updates }: StatusTimelineProps) {
  return (
    <div className="relative">
      {updates.map((update, index) => {
        const Icon = statusIcons[update.status];
        const isLast = index === updates.length - 1;
        
        return (
          <div key={update.id} className="relative flex gap-4 pb-6">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 bg-border" />
            )}
            
            {/* Icon */}
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${statusColors[update.status]} shadow-md z-10`}>
              <Icon className="h-5 w-5" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{STATUS_LABELS[update.status]}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(update.timestamp, 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Updated by {update.updatedByName}
              </p>
              {update.notes && (
                <p className="text-sm mt-1 p-2 bg-muted rounded-md">
                  {update.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
