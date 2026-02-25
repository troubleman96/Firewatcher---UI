import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IncidentStatus, STATUS_LABELS } from '@/types';
import { 
  AlertCircle, 
  Truck, 
  MapPin, 
  Flame, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

interface StatusBadgeProps {
  status: IncidentStatus;
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const statusIcons: Record<IncidentStatus, React.ReactNode> = {
  new: <AlertCircle className="h-3 w-3" />,
  enroute: <Truck className="h-3 w-3" />,
  arrived: <MapPin className="h-3 w-3" />,
  fighting: <Flame className="h-3 w-3" />,
  extinguished: <CheckCircle className="h-3 w-3" />,
  closed: <XCircle className="h-3 w-3" />,
};

export function StatusBadge({ status, showIcon = true, size = 'default' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    default: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <Badge variant={status} className={`gap-1.5 ${sizeClasses[size]}`}>
      {showIcon && statusIcons[status]}
      {STATUS_LABELS[status]}
    </Badge>
  );
}
