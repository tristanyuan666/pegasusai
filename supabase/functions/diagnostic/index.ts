import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  console.log("=== DIAGNOSTIC FUNCTION CALLED ===");
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const response = {
      success: true,
      message: "Diagnostic function is working!",
      timestamp: new Date().toISOString(),
      environment: {
        STRIPE_SECRET_KEY: !!Deno.env.get("STRIPE_SECRET_KEY"),
        SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
        SUPABASE_SERVICE_KEY: !!Deno.env.get("SUPABASE_SERVICE_KEY"),
        STRIPE_WEBHOOK_SECRET: !!Deno.env.get("STRIPE_WEBHOOK_SECRET"),
      },
      function_info: {
        name: "diagnostic",
        version: "1.0.0",
        runtime: "Deno",
        deno_version: Deno.version.deno,
      },
      request_info: {
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers.entries()),
      },
    };

    console.log("Sending diagnostic response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("=== DIAGNOSTIC ERROR ===");
    console.error("Error:", error);

    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      function_info: {
        name: "diagnostic",
        error_type: typeof error,
      },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
