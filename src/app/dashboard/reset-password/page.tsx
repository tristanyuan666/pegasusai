"use client";

import React, { useState } from "react";
import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordProps {
  searchParams: Promise<Message>;
}

export default function ResetPassword({ searchParams }: ResetPasswordProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle URL parameters for success and error messages
  React.useEffect(() => {
    const getParams = async () => {
      const params = await searchParams;
      if ("error" in params || "success" in params || "message" in params) {
        setMessage(params);
      }
    };
    getParams();
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await resetPasswordAction(formData);
      if (result?.error) {
        setMessage({ error: result.error });
      } else if (result?.success) {
        setMessage({ success: result.success });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage({ error: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <form action={handleSubmit} className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
              <p className="text-sm text-muted-foreground">
                Please enter your new password below.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="New password"
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </div>

            <SubmitButton
              pendingText="Resetting password..."
              className="w-full"
              disabled={isLoading}
            >
              Reset password
            </SubmitButton>

            {message && <FormMessage message={message} />}
          </form>
        </div>
      </div>
    </>
  );
}
