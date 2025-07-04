"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, CheckCircle } from "lucide-react";

interface SupabaseHealthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showRetry?: boolean;
  className?: string;
}

export function SupabaseHealthCheck({ 
  children, 
  fallback,
  showRetry = true,
  className = ""
}: SupabaseHealthCheckProps) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const supabase = createClient();
      if (!supabase) {
        setIsHealthy(false);
        setError("Authentication service is not available");
        return;
      }

      // Try a simple health check query
      const { data, error: healthError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true })
        .limit(1);

      if (healthError) {
        console.error("Supabase health check failed:", healthError);
        setIsHealthy(false);
        setError("Unable to connect to authentication service");
      } else {
        setIsHealthy(true);
      }
    } catch (err) {
      console.error("Supabase health check error:", err);
      setIsHealthy(false);
      setError("Authentication service is temporarily unavailable");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // Show loading state
  if (isChecking) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
        <span className="text-sm text-gray-600">Checking service availability...</span>
      </div>
    );
  }

  // Show error state
  if (isHealthy === false) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={`p-4 ${className}`}>
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>Service Unavailable</strong>
            <br />
            {error || "Authentication service is not available. Please try again later."}
          </AlertDescription>
        </Alert>
        
        {showRetry && (
          <div className="mt-4 text-center">
            <Button 
              onClick={checkHealth}
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking...' : 'Retry Connection'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show success state (optional)
  if (isHealthy === true) {
    return <>{children}</>;
  }

  // Fallback for unknown state
  return (
    <div className={`p-4 ${className}`}>
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-700">
          Unable to verify service status. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Hook for checking Supabase health
export function useSupabaseHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const supabase = createClient();
      if (!supabase) {
        setIsHealthy(false);
        setError("Authentication service is not available");
        return;
      }

      const { data, error: healthError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true })
        .limit(1);

      if (healthError) {
        console.error("Supabase health check failed:", healthError);
        setIsHealthy(false);
        setError("Unable to connect to authentication service");
      } else {
        setIsHealthy(true);
      }
    } catch (err) {
      console.error("Supabase health check error:", err);
      setIsHealthy(false);
      setError("Authentication service is temporarily unavailable");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return {
    isHealthy,
    isChecking,
    error,
    checkHealth
  };
}

// Simple health status indicator
export function SupabaseHealthIndicator({ className = "" }: { className?: string }) {
  const { isHealthy, isChecking } = useSupabaseHealth();

  if (isChecking) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
        <span className="text-xs text-gray-500">Checking...</span>
      </div>
    );
  }

  if (isHealthy === true) {
    return (
      <div className={`flex items-center ${className}`}>
        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
        <span className="text-xs text-green-600">Connected</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <AlertCircle className="h-3 w-3 text-red-500 mr-2" />
      <span className="text-xs text-red-600">Disconnected</span>
    </div>
  );
} 