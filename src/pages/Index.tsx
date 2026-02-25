import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { 
  FireExtinguisher,
  Flame, 
  MapPin, 
  Bell, 
  Clock, 
  Shield, 
  Users, 
  ArrowRight,
  Phone,
  CheckCircle
} from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        {/* Animated circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        <div className="container relative py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              <FireExtinguisher className="h-4 w-4" />
              Emergency Response System
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-slide-up">
              Report Fire Emergencies
              <span className="block text-gradient">In Seconds</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Quick, reliable fire emergency reporting with real-time GPS location tracking. 
              Get immediate response from your local fire department.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/register">
                <Button size="xl" variant="emergency" className="w-full sm:w-auto">
                  <Phone className="h-5 w-5 mr-2" />
                  Report Emergency
                </Button>
              </Link>
              <Link to="/login">
                <Button size="xl" variant="hero" className="w-full sm:w-auto">
                  Fire Team Login
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '< 3s', label: 'Response Time' },
              { value: '99.5%', label: 'System Uptime' },
              { value: '24/7', label: 'Available' },
              { value: '500+', label: 'Concurrent Users' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-secondary-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-secondary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and effective emergency reporting for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Auto Location Detection',
                description: 'GPS automatically detects your location. Adjust manually if needed for precise reporting.',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: Bell,
                title: 'Instant Alerts',
                description: 'Fire teams receive immediate notifications with all incident details and location.',
                color: 'bg-warning/10 text-warning',
              },
              {
                icon: Clock,
                title: 'Real-Time Updates',
                description: 'Track response status from "On Our Way" to "Fire Extinguished" with live updates.',
                color: 'bg-success/10 text-success',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Citizens & Fire Teams */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Citizens */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">For Citizens</h3>
              <ul className="space-y-3">
                {[
                  'Report fire emergencies instantly',
                  'Automatic GPS location detection',
                  'Upload photos for better assessment',
                  'Track response status in real-time',
                  'View complete incident history',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="inline-block mt-6">
                <Button>
                  Register as Citizen
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* For Fire Teams */}
            <div className="p-8 rounded-2xl bg-secondary text-secondary-foreground">
              <div className="inline-flex p-3 rounded-xl bg-primary/20 text-primary-foreground mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">For Fire Teams</h3>
              <ul className="space-y-3">
                {[
                  'Real-time incident dashboard',
                  'Map view of all emergencies',
                  'Update incident status on-the-go',
                  'Coordinate team responses',
                  'Access complete incident history',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-secondary-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register?type=fire_team" className="inline-block mt-6">
                <Button variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                  Register as Fire Team
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Every Second Counts in an Emergency
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Join thousands of citizens and emergency responders using FireAlert 
                to save lives and protect property.
              </p>
              <Link to="/register">
                <Button size="xl" variant="hero" className="bg-background text-foreground hover:bg-background/90">
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
                <FireExtinguisher className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">FireAlert</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FireAlert. Emergency Response System for Tanzania.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
