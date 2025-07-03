import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase client not available" },
        { status: 500 }
      );
    }

    // Test the create-checkout function
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        ...body,
        test_mode: true
      },
    });

    if (error) {
      return NextResponse.json(
        { 
          error: "Checkout test failed", 
          details: error.message,
          status: "failed"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Checkout test successful",
      data: data,
      status: "working"
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: "Checkout test error", 
        details: error instanceof Error ? error.message : "Unknown error",
        status: "error"
      },
      { status: 500 }
    );
  }
} 