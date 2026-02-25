import React from 'react';
import { MapPin, Flame } from 'lucide-react';
import { Incident } from '@/types';

interface MapPlaceholderProps {
  incidents?: Incident[];
  center?: { lat: number; lng: number };
  showMarker?: boolean;
  height?: string;
  interactive?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
}

export function MapPlaceholder({
  incidents = [],
  center = { lat: -6.7924, lng: 39.2083 },
  showMarker = true,
  height = 'h-[400px]',
  interactive = false,
  onLocationSelect,
}: MapPlaceholderProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onLocationSelect) return;
    
    // Simulate clicking on map - in real app this would use actual map API
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to mock coordinates
    const lat = center.lat + (y - rect.height / 2) * 0.0001;
    const lng = center.lng + (x - rect.width / 2) * 0.0001;
    
    onLocationSelect(lat, lng);
  };

  return (
    <div 
      className={`relative ${height} w-full rounded-xl overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/40 border border-border ${interactive ? 'cursor-crosshair' : ''}`}
      onClick={handleClick}
    >
      {/* Grid pattern to simulate map */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Center marker */}
      {showMarker && incidents.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
            <div className="relative bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      {/* Incident markers */}
      {incidents.map((incident, index) => {
        // Simulate different positions for demo
        const positions = [
          { top: '30%', left: '40%' },
          { top: '50%', left: '60%' },
          { top: '70%', left: '35%' },
          { top: '25%', left: '70%' },
          { top: '60%', left: '25%' },
        ];
        const pos = positions[index % positions.length];
        
        return (
          <div
            key={incident.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="relative group cursor-pointer">
              {incident.status === 'new' && (
                <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
              )}
              <div className={`relative p-2 rounded-full shadow-lg ${
                incident.status === 'new' ? 'bg-primary' :
                incident.status === 'enroute' ? 'bg-warning' :
                incident.status === 'fighting' ? 'bg-purple-500' :
                incident.status === 'extinguished' ? 'bg-success' :
                'bg-secondary'
              } text-white`}>
                <Flame className="h-4 w-4" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {incident.address}
              </div>
            </div>
          </div>
        );
      })}

      {/* Map label */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-md text-xs font-medium">
        📍 Dar es Salaam, Tanzania
      </div>

      {/* Interactive hint */}
      {interactive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur px-4 py-2 rounded-md text-sm">
          Click to set location
        </div>
      )}

      {/* Legend */}
      {incidents.length > 0 && (
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur p-3 rounded-lg text-xs space-y-1.5">
          <div className="font-semibold mb-2">Incident Status</div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>New Report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span>En Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span>Fighting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span>Resolved</span>
          </div>
        </div>
      )}
    </div>
  );
}
