import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  console.log("=== TEST CONNECTION FUNCTION CALLED ===");
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
      message: "Edge Function connection test successful!",
      timestamp: new Date().toISOString(),
      function_info: {
        name: "test-connection",
        version: "1.0.0",
        runtime: "Deno",
        deno_version: Deno.version.deno,
      },
      request_info: {
        method: req.method,
        url: req.url,
        user_agent: req.headers.get("user-agent"),
      },
    };

    console.log("Sending test connection response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("=== TEST CONNECTION ERROR ===");
    console.error("Error:", error);

    const errorResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      function_info: {
        name: "test-connection",
        error_type: typeof error,
      },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
