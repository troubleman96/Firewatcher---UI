import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { IncidentCard } from '@/components/IncidentCard';
import { useAuth } from '@/contexts/AuthContext';
import { useIncidents } from '@/contexts/IncidentContext';
import { Plus, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function MyIncidents() {
  const { user, isAuthenticated } = useAuth();
  const { getUserIncidents } = useIncidents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const userIncidents = user ? getUserIncidents(user.id) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">My Incidents</h1>
            <p className="text-muted-foreground">Track the status of your reported emergencies</p>
          </div>
          <Link to="/report">
            <Button variant="emergency">
              <Plus className="h-4 w-4 mr-2" />
              Report New
            </Button>
          </Link>
        </div>

        {userIncidents.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No incidents reported</h2>
            <p className="text-muted-foreground mb-6">
              You haven't reported any fire emergencies yet.
            </p>
            <Link to="/report">
              <Button variant="emergency">
                <Plus className="h-4 w-4 mr-2" />
                Report Emergency
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userIncidents.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
