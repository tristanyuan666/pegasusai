# Edge Function Deployment Guide

## Issue
The payment checkout is failing with the error: "Failed to start checkout process: Failed to send a request to the Edge Function"

## Root Cause
The Edge Functions are not properly deployed to Supabase, causing the frontend to fail when trying to invoke them.

## Solution

### 1. Install Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Or using Homebrew on macOS
brew install supabase/tap/supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Deploy Edge Functions
```bash
# Make the deployment script executable
chmod +x deploy-webhooks.sh

# Run the deployment script
./deploy-webhooks.sh
```

### 5. Verify Deployment
After deployment, test the Edge Functions using the test page:
- Navigate to `/system-test` in your application
- Click "Run Edge Function Tests"
- Verify all tests pass

### 6. Manual Deployment (if script fails)
If the deployment script fails, deploy functions manually:

```bash
# Deploy each function individually
supabase functions deploy create-checkout --no-verify-jwt
supabase functions deploy payments-webhook --no-verify-jwt
supabase functions deploy diagnostic --no-verify-jwt
supabase functions deploy test-connection --no-verify-jwt
supabase functions deploy test-checkout --no-verify-jwt
supabase functions deploy test-stripe-connection --no-verify-jwt
supabase functions deploy test-new-stripe --no-verify-jwt
supabase functions deploy create-portal-session --no-verify-jwt
supabase functions deploy cancel-subscription --no-verify-jwt
```

## Environment Variables
Ensure these environment variables are set in your Supabase project:
- `STRIPE_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Testing
1. Use the debug mode in the pricing cards (development only)
2. Visit `/system-test` to run comprehensive tests
3. Check the browser console for detailed error messages

## Troubleshooting
- If functions return 404, they're not deployed
- If functions return 500, check environment variables
- If functions return CORS errors, check the CORS configuration
- Check Supabase dashboard > Edge Functions for deployment status 