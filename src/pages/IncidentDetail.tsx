import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusTimeline } from '@/components/StatusTimeline';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useAuth } from '@/contexts/AuthContext';
import { useIncidents } from '@/contexts/IncidentContext';
import { useToast } from '@/hooks/use-toast';
import { IncidentStatus, STATUS_ORDER, STATUS_LABELS } from '@/types';
import { 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getIncidentById, getStatusUpdates, updateIncidentStatus, fetchIncidentById } = useIncidents();
  const { toast } = useToast();

  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingIncident, setIsLoadingIncident] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  const incident = getIncidentById(id || '');
  const statusUpdates = getStatusUpdates(id || '');

  useEffect(() => {
    if (!id) {
      setIsLoadingIncident(false);
      setLoadFailed(true);
      return;
    }

    let isMounted = true;
    setIsLoadingIncident(true);
    setLoadFailed(false);

    fetchIncidentById(id)
      .catch(() => {
        if (isMounted) {
          setLoadFailed(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingIncident(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoadingIncident && !incident) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">Loading incident...</h1>
          <p className="text-muted-foreground">Fetching latest incident details from the server.</p>
        </main>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Incident Not Found</h1>
          {loadFailed && (
            <p className="text-muted-foreground mb-4">
              The incident could not be loaded from the API.
            </p>
          )}
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </main>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(incident.status);
  const nextStatus = STATUS_ORDER[currentStatusIndex + 1];

  const handleStatusUpdate = async () => {
    if (!nextStatus || !user) return;
    
    setIsUpdating(true);
    try {
      await updateIncidentStatus(incident.id, nextStatus, user.id, user.name, notes || undefined);
      toast({
        title: 'Status Updated',
        description: `Incident status changed to "${STATUS_LABELS[nextStatus]}"`,
      });
      setNotes('');
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update incident status.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge status={incident.status} size="lg" />
                      <span className="text-sm text-muted-foreground">
                        Incident #{incident.id}
                      </span>
                    </div>
                    <CardTitle className="font-display text-xl">{incident.address}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{incident.description}</p>
                
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reported by</p>
                      <p className="font-medium text-sm">{incident.reporterName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="font-medium text-sm">{incident.reporterPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reported</p>
                      <p className="font-medium text-sm">
                        {format(incident.createdAt, 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coordinates</p>
                      <p className="font-medium text-sm">
                        {incident.locationLat.toFixed(4)}, {incident.locationLng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <MapPlaceholder
                  center={{ lat: incident.locationLat, lng: incident.locationLng }}
                  showMarker
                  height="h-[300px]"
                />
              </CardContent>
            </Card>

            {/* Status Update (Fire Team Only) */}
            {user?.userType === 'fire_team' && nextStatus && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <StatusBadge status={incident.status} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <StatusBadge status={nextStatus} />
                  </div>
                  
                  <Textarea
                    placeholder="Add notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                  
                  <Button 
                    onClick={handleStatusUpdate} 
                    className="w-full"
                    disabled={isUpdating}
                  >
                    Update to "{STATUS_LABELS[nextStatus]}"
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline updates={statusUpdates} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
