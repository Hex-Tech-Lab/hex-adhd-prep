#!/bin/bash
# Vercel Environment Setup for hex-adhd-prep
# Run: bash scripts/setup-vercel-env.sh

set -e

echo "🚀 Setting up Vercel environment variables..."
echo ""

# Vercel token (passed as arg or env var)
VERCEL_TOKEN=${1:-${VERCEL_TOKEN:-""}}
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN not provided"
  echo "Usage: VERCEL_TOKEN=xxx bash scripts/setup-vercel-env.sh"
  exit 1
fi

echo "✅ Using Vercel token"

# Set environment variables for PRODUCTION
echo ""
echo "📦 Setting PRODUCTION environment variables..."

# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "https://[YOUR-PROJECT].supabase.co" || true

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "[YOUR-ANON-KEY]" || true

vercel env add SUPABASE_SERVICE_ROLE_KEY \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "[YOUR-SERVICE-ROLE-KEY]" || true

# Anthropic Claude API
vercel env add ANTHROPIC_API_KEY \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "sk-[YOUR-KEY]" || true

# Upstash Redis
vercel env add UPSTASH_REDIS_REST_URL \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "https://[YOUR-PROJECT].upstash.io" || true

vercel env add UPSTASH_REDIS_REST_TOKEN \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "[YOUR-TOKEN]" || true

# Application
vercel env add NEXT_PUBLIC_APP_URL \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "https://adhd-prep.vercel.app" || true

vercel env add NODE_ENV \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "production" || true

vercel env add LOG_LEVEL \
  --token "$VERCEL_TOKEN" \
  --prod \
  <<< "info" || true

# Preview (development)
echo ""
echo "📦 Setting PREVIEW environment variables..."

vercel env add NEXT_PUBLIC_SUPABASE_URL \
  --token "$VERCEL_TOKEN" \
  <<< "https://[YOUR-PROJECT].supabase.co" || true

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --token "$VERCEL_TOKEN" \
  <<< "[YOUR-ANON-KEY]" || true

vercel env add SUPABASE_SERVICE_ROLE_KEY \
  --token "$VERCEL_TOKEN" \
  <<< "[YOUR-SERVICE-ROLE-KEY]" || true

vercel env add ANTHROPIC_API_KEY \
  --token "$VERCEL_TOKEN" \
  <<< "sk-[YOUR-KEY]" || true

vercel env add UPSTASH_REDIS_REST_URL \
  --token "$VERCEL_TOKEN" \
  <<< "https://[YOUR-PROJECT].upstash.io" || true

vercel env add UPSTASH_REDIS_REST_TOKEN \
  --token "$VERCEL_TOKEN" \
  <<< "[YOUR-TOKEN]" || true

vercel env add NEXT_PUBLIC_APP_URL \
  --token "$VERCEL_TOKEN" \
  <<< "http://localhost:3000" || true

vercel env add NODE_ENV \
  --token "$VERCEL_TOKEN" \
  <<< "development" || true

vercel env add LOG_LEVEL \
  --token "$VERCEL_TOKEN" \
  <<< "debug" || true

echo ""
echo "✅ Vercel environment variables configured!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Update .env.local with your actual credentials"
echo "2. Run: vercel env pull (to pull from Vercel)"
echo "3. Run: pnpm dev (to test locally)"
echo ""
