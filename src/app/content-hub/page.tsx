import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function ContentHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user subscription status
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  const hasActiveSubscription = !!subscription;
  const subscriptionTier = subscription?.plan_name || "free";

  return (
    <>
      <DashboardNavbar />
      <ContentCreationHub 
        user={user}
        hasActiveSubscription={hasActiveSubscription}
        subscriptionTier={subscriptionTier}
      />
    </>
  );
}
