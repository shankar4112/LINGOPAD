#!/bin/bash
# LingoPad Mobile APK Builder
# Run this script after installing Android Studio

echo "🌍 LingoPad Mobile APK Builder"
echo "================================"

echo "1. Building React app for production..."
npm run build

echo "2. Syncing with Android platform..."
npx cap sync android

echo "3. Opening in Android Studio..."
npx cap open android

echo "✅ Ready! Follow these steps in Android Studio:"
echo "   1. Wait for Gradle sync to complete"
echo "   2. Go to Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "   3. Find your APK in: android/app/build/outputs/apk/debug/"

echo "🌐 Server IP: 192.168.31.14:3001"
echo "📱 Make sure your phone is on the same WiFi network!"
