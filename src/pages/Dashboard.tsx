import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { IncidentCard } from '@/components/IncidentCard';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useAuth } from '@/contexts/AuthContext';
import { useIncidents } from '@/contexts/IncidentContext';
import { 
  AlertCircle, 
  Truck, 
  Flame, 
  CheckCircle,
  ArrowRight,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { incidents, dashboardStats } = useIncidents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'fire_team') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Calculate stats
  const derivedStats = {
    new: incidents.filter(i => i.status === 'new').length,
    active: incidents.filter(i => ['enroute', 'arrived', 'fighting'].includes(i.status)).length,
    resolved: incidents.filter(i => ['extinguished', 'closed'].includes(i.status)).length,
    total: incidents.length,
  };
  const stats = dashboardStats || derivedStats;

  // Get active incidents (not closed)
  const activeIncidents = incidents
    .filter(i => i.status !== 'closed')
    .sort((a, b) => {
      // Priority: new > fighting > arrived > enroute > extinguished
      const priority = { new: 0, fighting: 1, arrived: 2, enroute: 3, extinguished: 4, closed: 5 };
      return priority[a.status] - priority[b.status];
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Fire Team Dashboard • {user?.fireStation}
          </p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Reports</p>
                  <p className="text-3xl font-bold">{stats.new}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Response</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Truck className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                  <p className="text-3xl font-bold">{stats.resolved}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Incidents</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg">
                  <Activity className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map View */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Live Incident Map</CardTitle>
              <Link to="/incidents">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <MapPlaceholder incidents={activeIncidents} height="h-[350px]" />
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Active Incidents
              </CardTitle>
              <Link to="/incidents">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeIncidents.slice(0, 3).map(incident => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
              {activeIncidents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
                  <p className="font-medium">All clear!</p>
                  <p className="text-sm">No active incidents at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
