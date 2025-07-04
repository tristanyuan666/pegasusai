"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PegasusLogo from "@/components/pegasus-logo";
import LoadingSpinner from "@/components/loading-spinner";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const [supabaseAvailable, setSupabaseAvailable] = useState<boolean | null>(null);
  const [checkingSupabase, setCheckingSupabase] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSupabaseAvailability = async () => {
      try {
        const client = createClient();
        if (client) {
          // Try a simple health check
          const { data, error } = await client.from('users').select('count', { count: 'exact', head: true }).limit(1);
          setSupabase(client);
          setSupabaseAvailable(true);
        } else {
          setSupabaseAvailable(false);
        }
      } catch (error) {
        console.error("Supabase health check failed:", error);
        setSupabaseAvailable(false);
      } finally {
        setCheckingSupabase(false);
      }
    };

    checkSupabaseAvailability();
  }, []);

  const retrySupabaseCheck = async () => {
    setCheckingSupabase(true);
    setSupabaseAvailable(null);
    setError(null);
    
    try {
      const client = createClient();
      if (client) {
        const { data, error } = await client.from('users').select('count', { count: 'exact', head: true }).limit(1);
        setSupabase(client);
        setSupabaseAvailable(true);
      } else {
        setSupabaseAvailable(false);
      }
    } catch (error) {
      console.error("Supabase health check failed:", error);
      setSupabaseAvailable(false);
    } finally {
      setCheckingSupabase(false);
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!supabaseAvailable) {
      setError("Authentication service is not available. Please check your connection and try again. If the problem persists, contact support.");
      return;
    }

    if (!supabase) {
      setError("Authentication service is not available. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentDomain = "https://epic-raman6-4uxp6.view-3.tempo-dev.app";

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${currentDomain}/auth/callback?redirect_to=/pricing`,
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);

        if (signUpError.message.includes("User already registered")) {
          setError(
            "An account with this email already exists. Please sign in instead.",
          );
        } else if (
          signUpError.message.includes("Password should be at least")
        ) {
          setError("Password is too weak. Please choose a stronger password.");
        } else if (signUpError.message.includes("Invalid email")) {
          setError("Please enter a valid email address.");
        } else {
          setError(
            signUpError.message ||
              "An error occurred during sign up. Please try again.",
          );
        }
        return;
      }

      if (data.user) {
        console.log("Sign up successful:", data.user.id);
        setSuccess(true);

        // Show success message for a few seconds then redirect
        setTimeout(() => {
          router.push(
            "/sign-in?message=Please check your email and click the verification link to complete your registration.",
          );
        }, 3000);
      }
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking Supabase
  if (checkingSupabase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-md max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Checking authentication service...</p>
        </Card>
      </div>
    );
  }

  // Show error state if Supabase is not available
  if (supabaseAvailable === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 hover-target interactive-element link"
            data-interactive="true"
            data-link="true"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <PegasusLogo size="lg" variant="full" />
            </div>

            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                <strong>Authentication Service Unavailable</strong>
                <br />
                We're experiencing technical difficulties with our authentication service. This is likely due to a configuration issue.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-600">
                Please try again in a few moments, or contact support if the problem persists.
              </p>
              
              <Button 
                onClick={retrySupabaseCheck}
                disabled={checkingSupabase}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${checkingSupabase ? 'animate-spin' : ''}`} />
                {checkingSupabase ? 'Checking...' : 'Retry Connection'}
              </Button>
              
              <div className="text-xs text-gray-500">
                <p>If you continue to see this error, please:</p>
                <ul className="mt-2 space-y-1 text-left">
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{email}</strong>. Please
            click the link in your email to complete your registration.
          </p>
          <LoadingSpinner text="Redirecting to sign in..." />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 hover-target interactive-element link"
          data-interactive="true"
          data-link="true"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <PegasusLogo size="lg" variant="full" />
            <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join thousands of creators building their influence
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover-target interactive-element input"
                  data-interactive="true"
                  data-input="true"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover-target interactive-element input"
                  data-interactive="true"
                  data-input="true"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover-target interactive-element input"
                  data-interactive="true"
                  data-input="true"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover-target interactive-element"
                  data-interactive="true"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover-target interactive-element input"
                  data-interactive="true"
                  data-input="true"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover-target interactive-element"
                  data-interactive="true"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="hover-target interactive-element"
                data-interactive="true"
                disabled={isLoading}
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-700 cursor-pointer hover-target interactive-element"
                data-interactive="true"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:underline hover-target interactive-element"
                  data-interactive="true"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:underline hover-target interactive-element"
                  data-interactive="true"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors hover-target interactive-element"
              data-interactive="true"
              data-auth-button="true"
              data-signup-button="true"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:underline font-medium hover-target interactive-element"
                  data-interactive="true"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
