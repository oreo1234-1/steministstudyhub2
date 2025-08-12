import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { AlertCircle, Heart, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      const hasCompletedOnboarding = user.portfolioData && 
        typeof user.portfolioData === 'object' && 
        'onboarding_completed' in user.portfolioData ? 
        (user.portfolioData as any).onboarding_completed : false;
      navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await signIn(email);
      setMessage('Welcome back to STEMinist Study Hub!');
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await signIn(email); // For simplicity, use same sign-in method
      setMessage('Welcome to STEMinist Study Hub!');
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setError('OAuth signin is not available in this demo version. Please use email signin.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-ivory to-pale-beige flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-accent" />
            <h1 className="font-playfair text-3xl font-bold text-primary">STEMinist Study Hub</h1>
          </div>
          <p className="text-muted-foreground">
            Join our community of amazing STEM sisters! 🌟
          </p>
        </div>

        <Card className="shadow-elegant border-2 border-accent/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-playfair text-2xl text-primary flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to access your STEM journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {message && (
                <Alert className="mb-4 border-accent bg-accent/10">
                  <Heart className="h-4 w-4 text-accent" />
                  <AlertDescription className="text-accent">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In ✨'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent/90 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Join STEMinist Community 💖'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-accent/20 hover:border-accent/40"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={loading}
                >
                  <span className="mr-2">🔍</span>
                  Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-accent/20 hover:border-accent/40"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={loading}
                >
                  <span className="mr-2">⚡</span>
                  GitHub
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-accent/20 hover:border-accent/40"
                  onClick={() => handleOAuthSignIn('discord')}
                  disabled={loading}
                >
                  <span className="mr-2">🎮</span>
                  Discord
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-accent/20 hover:border-accent/40"
                  onClick={() => handleOAuthSignIn('apple')}
                  disabled={loading}
                >
                  <span className="mr-2">🍎</span>
                  Apple
                </Button>
              </div>
            </div>

            <div className="text-center mt-6 text-sm text-muted-foreground">
              <p>
                By joining, you agree to empower girls in STEM and create an inclusive community! 💪
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;