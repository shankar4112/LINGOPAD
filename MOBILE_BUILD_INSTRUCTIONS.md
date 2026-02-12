# Mobile APK Setup Instructions

## Option 1: Capacitor (Recommended - Already Set Up)

### Prerequisites:
1. **Android Studio** - Download from https://developer.android.com/studio
2. **Java Development Kit (JDK)** - Android Studio includes this
3. **Android SDK** - Included with Android Studio

### Steps to Build APK:

1. **Configure Server IP for Mobile:**
   Edit `src/config.js` and change the API_BASE_URL to your computer's IP address:
   ```javascript
   API_BASE_URL: 'http://192.168.1.100:3001' // Replace with your actual IP
   ```

2. **Find Your Computer's IP:**
   ```bash
   # On Windows
   ipconfig
   # Look for your IPv4 Address (usually 192.168.x.x)
   ```

3. **Build and Sync:**
   ```bash
   npm run build
   npx cap sync android
   ```

4. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

5. **Build APK in Android Studio:**
   - Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be generated in `android/app/build/outputs/apk/debug/`

### Quick Commands:
```bash
# Full build process
npm run build
npx cap sync android
npx cap open android
```

## Option 2: Cordova (Alternative)

If you prefer Cordova, run these commands:

```bash
npm install -g cordova
cordova create lingopad-mobile com.lingopad.app LingoPad
cd lingopad-mobile
cordova platform add android
# Copy your built files to www/ folder
cordova build android
```

## Option 3: React Native (Complete Rewrite)

For a fully native experience, consider rewriting in React Native:

```bash
npx react-native init LingoPadNative
# Then migrate your components
```

## Current Status:
✅ Capacitor is configured and ready
✅ Android platform added
✅ Build directory set to 'dist'
✅ App configured with proper branding

## Next Steps:
1. Install Android Studio
2. Update your IP address in src/config.js
3. Build and sync the project
4. Generate APK in Android Studio
