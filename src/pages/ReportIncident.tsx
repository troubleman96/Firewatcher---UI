import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useAuth } from '@/contexts/AuthContext';
import { useIncidents } from '@/contexts/IncidentContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Camera, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ReportIncident() {
  const { user, isAuthenticated } = useAuth();
  const { addIncident } = useIncidents();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLocating, setIsLocating] = useState(true);
  const [location, setLocation] = useState({ lat: -6.7924, lng: 39.2083 });
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simulate GPS detection
    const timer = setTimeout(() => {
      setLocation({ lat: -6.7924, lng: 39.2083 });
      setAddress('Detected Location: Near Samora Avenue, Dar es Salaam');
      setIsLocating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setAddress(`Custom Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast({
        title: 'Description required',
        description: 'Please describe the fire incident.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const incident = await addIncident({
        reporterId: user?.id || '',
        reporterName: user?.name || '',
        reporterPhone: user?.phone || '',
        locationLat: location.lat,
        locationLng: location.lng,
        address: address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        description,
        photos: [],
        status: 'new',
      });

      toast({
        title: 'Emergency Reported!',
        description: `Incident #${incident.id} has been submitted. Fire teams have been alerted.`,
      });

      navigate(`/incident/${incident.id}`);
    } catch (error) {
      toast({
        title: 'Failed to submit',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Alert Banner */}
          <div className="flex items-center gap-3 p-4 mb-6 bg-primary/10 border border-primary/20 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0" />
            <p className="text-sm">
              <strong>Emergency Report:</strong> Your location will be shared with emergency responders.
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-display text-2xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Report Fire Emergency
              </CardTitle>
              <CardDescription>
                Provide details about the fire incident. Help is on the way!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Location</Label>
                    {isLocating ? (
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Detecting location...
                      </span>
                    ) : (
                      <span className="text-sm text-success flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Location detected
                      </span>
                    )}
                  </div>
                  
                  <MapPlaceholder
                    center={location}
                    showMarker
                    height="h-[250px]"
                    interactive
                    onLocationSelect={handleLocationSelect}
                  />
                  
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter or confirm address"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Click on the map to adjust your location if needed
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Incident Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the fire incident: What's burning? How big is the fire? Are there people in danger?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Photo Upload (UI only) */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Photos (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Tap to take or upload photos
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Photos help responders assess the situation
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="xl" 
                  variant="emergency" 
                  className="w-full"
                  disabled={isSubmitting || isLocating}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Submit Emergency Report
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you confirm this is a real emergency. 
                  False reports may result in legal action.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
