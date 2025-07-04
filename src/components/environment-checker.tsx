"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface EnvironmentCheckerProps {
  showDetails?: boolean;
  className?: string;
}

export function EnvironmentChecker({ showDetails = false, className = "" }: EnvironmentCheckerProps) {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasSiteUrl = !!process.env.NEXT_PUBLIC_SITE_URL;
  
  const allRequired = hasSupabaseUrl && hasSupabaseKey;
  const isProduction = process.env.NODE_ENV === "production";

  if (!showDetails) {
    return (
      <div className={`flex items-center ${className}`}>
        {allRequired ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-green-600">Environment configured</span>
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-600">Missing environment variables</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Alert className={allRequired ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
        {allRequired ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription className={allRequired ? "text-green-700" : "text-red-700"}>
          <strong>Environment Variables Status</strong>
          <br />
          {allRequired 
            ? "All required environment variables are configured." 
            : "Some required environment variables are missing."
          }
        </AlertDescription>
      </Alert>

      <div className="text-xs space-y-1">
        <div className="flex items-center">
          {hasSupabaseUrl ? (
            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-3 w-3 text-red-500 mr-2" />
          )}
          <span>NEXT_PUBLIC_SUPABASE_URL: {hasSupabaseUrl ? "✓" : "✗"}</span>
        </div>
        
        <div className="flex items-center">
          {hasSupabaseKey ? (
            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-3 w-3 text-red-500 mr-2" />
          )}
          <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {hasSupabaseKey ? "✓" : "✗"}</span>
        </div>
        
        <div className="flex items-center">
          {hasSiteUrl ? (
            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-3 w-3 text-yellow-500 mr-2" />
          )}
          <span>NEXT_PUBLIC_SITE_URL: {hasSiteUrl ? "✓" : "⚠ (optional)"}</span>
        </div>
        
        <div className="flex items-center">
          <span className="mr-2">Environment:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            isProduction 
              ? "bg-blue-100 text-blue-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {process.env.NODE_ENV || "development"}
          </span>
        </div>
      </div>

      {!allRequired && (
        <div className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-200">
          <strong>To fix this issue:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>Add NEXT_PUBLIC_SUPABASE_URL to your environment variables</li>
            <li>Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables</li>
            <li>If deploying to Vercel, add these in your project settings</li>
          </ul>
        </div>
      )}
    </div>
  );
} 