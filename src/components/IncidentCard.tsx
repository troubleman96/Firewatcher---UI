import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Incident } from '@/types';
import { MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface IncidentCardProps {
  incident: Incident;
  showActions?: boolean;
}

export function IncidentCard({ incident, showActions = true }: IncidentCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={incident.status} />
              <span className="text-xs text-muted-foreground">
                ID: #{incident.id}
              </span>
            </div>
            <h3 className="font-semibold text-base line-clamp-1">{incident.address}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {incident.description}
        </p>
        
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatDistanceToNow(incident.createdAt, { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {incident.reporterPhone}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {incident.locationLat.toFixed(4)}, {incident.locationLng.toFixed(4)}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Link to={`/incident/${incident.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
