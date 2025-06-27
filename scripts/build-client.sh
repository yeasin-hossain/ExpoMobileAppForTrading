#!/bin/bash

# White Label Build Script
# Usage: ./build-client.sh <client-id> <platform>
# Example: ./build-client.sh client-a android

set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <client-id> <platform>"
    echo "Example: $0 client-a android"
    echo "Available platforms: android, ios, both"
    exit 1
fi

CLIENT_ID=$1
PLATFORM=$2

echo "🚀 Building white-label app for client: $CLIENT_ID on platform: $PLATFORM"

# Set environment variables
export EXPO_PUBLIC_CLIENT_ID=$CLIENT_ID

# Load client configuration
case $CLIENT_ID in
    "client-a")
        export APP_NAME="CryptoTrader Pro"
        export BUNDLE_ID="com.clienta.cryptotrader"
        export APP_VERSION="1.0.0"
        ;;
    "client-b")
        export APP_NAME="InvestMate"
        export BUNDLE_ID="com.clientb.investmate"
        export APP_VERSION="1.0.0"
        ;;
    *)
        echo "❌ Unknown client: $CLIENT_ID"
        exit 1
        ;;
esac

echo "📱 App Name: $APP_NAME"
echo "📦 Bundle ID: $BUNDLE_ID"
echo "🔢 Version: $APP_VERSION"

# Update app.json with client-specific configuration
node scripts/update-app-config.js $CLIENT_ID

# Copy client-specific assets
echo "🎨 Copying client assets..."
if [ -d "assets/clients/$CLIENT_ID" ]; then
    cp -r assets/clients/$CLIENT_ID/* assets/
    echo "✅ Client assets copied"
else
    echo "⚠️  No client-specific assets found for $CLIENT_ID"
fi

# Build the app
case $PLATFORM in
    "android")
        echo "🤖 Building Android APK..."
        cd android
        ./gradlew assembleRelease
        echo "✅ Android build completed"
        echo "📁 APK location: android/app/build/outputs/apk/release/"
        ;;
    "ios")
        echo "🍎 Building iOS..."
        npx expo run:ios --configuration Release
        echo "✅ iOS build completed"
        ;;
    "both")
        echo "🤖 Building Android..."
        cd android
        ./gradlew assembleRelease
        cd ..
        
        echo "🍎 Building iOS..."
        npx expo run:ios --configuration Release
        echo "✅ Both builds completed"
        ;;
    *)
        echo "❌ Unknown platform: $PLATFORM"
        exit 1
        ;;
esac

# Create build artifact directory
BUILD_DIR="builds/$CLIENT_ID/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BUILD_DIR

# Copy build artifacts
if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "both" ]; then
    cp android/app/build/outputs/apk/release/*.apk $BUILD_DIR/
fi

echo "✅ Build completed successfully!"
echo "📁 Build artifacts saved to: $BUILD_DIR"
