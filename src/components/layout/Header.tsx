import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Flame, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">FireAlert</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {user?.userType === 'public' && (
                <>
                  <Link to="/report" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Report Incident
                  </Link>
                  <Link to="/my-incidents" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    My Incidents
                  </Link>
                </>
              )}
              {user?.userType === 'fire_team' && (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/incidents" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    All Incidents
                  </Link>
                </>
              )}
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => void handleLogout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="default">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 animate-slide-up">
          <nav className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                {user?.userType === 'public' && (
                  <>
                    <Link to="/report" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Report Incident
                    </Link>
                    <Link to="/my-incidents" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      My Incidents
                    </Link>
                  </>
                )}
                {user?.userType === 'fire_team' && (
                  <>
                    <Link to="/dashboard" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/incidents" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      All Incidents
                    </Link>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => void handleLogout()} className="justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
