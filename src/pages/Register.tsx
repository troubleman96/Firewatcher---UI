import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Flame, User, Shield, Loader2 } from 'lucide-react';
import { UserType } from '@/types';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as UserType) || 'public';
  
  const [userType, setUserType] = useState<UserType>(initialType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    badgeNumber: '',
    fireStation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType,
        ...(userType === 'fire_team' && {
          badgeNumber: formData.badgeNumber,
          fireStation: formData.fireStation,
        }),
      });
      
      if (success) {
        toast({
          title: 'Registration successful!',
          description: 'Your account has been created.',
        });
        navigate(userType === 'fire_team' ? '/dashboard' : '/report');
      }
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero shadow-fire">
            <Flame className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold">FireAlert</span>
        </Link>

        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Create Account</CardTitle>
            <CardDescription>Register to report or respond to emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={(v) => setUserType(v as UserType)} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="public" className="gap-2">
                  <User className="h-4 w-4" />
                  Citizen
                </TabsTrigger>
                <TabsTrigger value="fire_team" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Fire Team
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+255 7XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {userType === 'fire_team' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="badgeNumber">Badge Number</Label>
                    <Input
                      id="badgeNumber"
                      name="badgeNumber"
                      placeholder="FT-2024-XXX"
                      value={formData.badgeNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fireStation">Fire Station</Label>
                    <Input
                      id="fireStation"
                      name="fireStation"
                      placeholder="Enter your fire station"
                      value={formData.fireStation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
