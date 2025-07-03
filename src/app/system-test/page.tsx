"use client";

import { createClient } from "../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";

export default function SystemTestPage() {
  const [testResults, setTestResults] = useState<{
    [key: string]: { status: "pending" | "success" | "error"; message: string; details?: any };
  }>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const supabase = createClient();

  const updateTestResult = (
    testName: string,
    status: "pending" | "success" | "error",
    message: string,
    details?: any
  ) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status, message, details }
    }));
  };

  const runEdgeFunctionTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    if (!supabase) {
      updateTestResult("Edge Function Basic", "error", "Supabase client not available");
      setIsRunningTests(false);
      return;
    }

    try {
      // Test 1: Basic Edge Function connectivity
      updateTestResult("Edge Function Basic", "pending", "Testing basic connectivity...");
      
      const { data: basicData, error: basicError } = await supabase.functions.invoke("test-connection", {
        body: { test: true }
      });

      if (basicError) {
        updateTestResult("Edge Function Basic", "error", `Connection failed: ${basicError.message}`);
      } else if (basicData?.success) {
        updateTestResult("Edge Function Basic", "success", "Basic connectivity confirmed");
      } else {
        updateTestResult("Edge Function Basic", "error", "Unexpected response from Edge Function");
      }

      // Test 2: Diagnostic function
      updateTestResult("Edge Function Diagnostic", "pending", "Testing diagnostic function...");
      
      const { data: diagnosticData, error: diagnosticError } = await supabase.functions.invoke("diagnostic", {
        body: { test: true }
      });

      if (diagnosticError) {
        updateTestResult("Edge Function Diagnostic", "error", `Diagnostic failed: ${diagnosticError.message}`);
      } else if (diagnosticData?.success) {
        updateTestResult("Edge Function Diagnostic", "success", "Diagnostic function working");
      } else {
        updateTestResult("Edge Function Diagnostic", "error", "Diagnostic function returned unexpected response");
      }

      // Test 3: Checkout function in test mode
      updateTestResult("Checkout Function Test", "pending", "Testing checkout function in test mode...");
      
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke("create-checkout", {
        body: {
          test_mode: true,
          price_id: "test",
          user_id: "test",
          timestamp: new Date().toISOString()
        }
      });

      if (checkoutError) {
        updateTestResult("Checkout Function Test", "error", `Checkout test failed: ${checkoutError.message}`);
      } else if (checkoutData?.success && checkoutData?.test_mode) {
        updateTestResult("Checkout Function Test", "success", "Checkout function working in test mode");
      } else {
        updateTestResult("Checkout Function Test", "error", "Checkout function test failed");
      }

    } catch (error) {
      console.error("Edge Function test suite error:", error);
      updateTestResult("Test Suite", "error", `Test suite failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const getStatusIcon = (status: "pending" | "success" | "error") => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edge Function Test Suite</h1>
          <p className="text-gray-600">
            Test the connectivity and functionality of Supabase Edge Functions
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edge Function Tests</CardTitle>
            <CardDescription>
              Run comprehensive tests to verify Edge Function connectivity and functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runEdgeFunctionTests} 
              disabled={isRunningTests}
              className="mb-4"
            >
              {isRunningTests ? "Running Tests..." : "Run Edge Function Tests"}
            </Button>

            <div className="space-y-4">
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium">{testName}</div>
                    <div className={`text-sm ${
                      result.status === "error" ? "text-red-600" : 
                      result.status === "success" ? "text-green-600" : 
                      "text-yellow-600"
                    }`}>
                      {result.message}
                    </div>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
