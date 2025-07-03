#!/bin/bash

# Deploy all Edge Functions without JWT verification
echo "Deploying Edge Functions with JWT verification disabled..."

echo "Deploying create-checkout function..."
supabase functions deploy create-checkout --no-verify-jwt

echo "Deploying payments-webhook function..."
supabase functions deploy payments-webhook --no-verify-jwt

echo "Deploying diagnostic function..."
supabase functions deploy diagnostic --no-verify-jwt

echo "Deploying test-connection function..."
supabase functions deploy test-connection --no-verify-jwt

echo "Deploying test-checkout function..."
supabase functions deploy test-checkout --no-verify-jwt

echo "Deploying test-stripe-connection function..."
supabase functions deploy test-stripe-connection --no-verify-jwt

echo "Deploying test-new-stripe function..."
supabase functions deploy test-new-stripe --no-verify-jwt

echo "All Edge Functions deployed successfully!"
