import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { IncidentCard } from '@/components/IncidentCard';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { useAuth } from '@/contexts/AuthContext';
import { useIncidents } from '@/contexts/IncidentContext';
import { IncidentStatus } from '@/types';
import { Search, List, Map, Filter } from 'lucide-react';

export default function AllIncidents() {
  const { user, isAuthenticated } = useAuth();
  const { incidents } = useIncidents();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (!isAuthenticated || user?.userType !== 'fire_team') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = 
      incident.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions: { value: IncidentStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'enroute', label: 'En Route' },
    { value: 'arrived', label: 'Arrived' },
    { value: 'fighting', label: 'Fighting' },
    { value: 'extinguished', label: 'Extinguished' },
    { value: 'closed', label: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">All Incidents</h1>
            <p className="text-muted-foreground">
              {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address, description, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {statusOptions.map(option => (
              <Button
                key={option.value}
                variant={statusFilter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(option.value)}
                className="whitespace-nowrap"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <MapPlaceholder incidents={filteredIncidents} height="h-[600px]" />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIncidents.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
            {filteredIncidents.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground">No incidents match your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
