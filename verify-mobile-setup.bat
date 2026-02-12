@echo off
echo.
echo 🌍 LingoPad APK Build Verification
echo ================================
echo.

echo ✅ Checking if mobile build is ready...
if exist "android\app\src\main\assets\public" (
    echo ✅ Android platform is configured
) else (
    echo ❌ Android platform not found - run: npm run mobile:build
    pause
    exit
)

echo.
echo ✅ Checking if server can start...
cd server
if exist "server.js" (
    echo ✅ Server files found
) else (
    echo ❌ Server files not found
    pause
    exit
)

echo.
echo ✅ Current Configuration:
echo    - App Name: LingoPad
echo    - Package ID: com.lingopad.app
echo    - Server IP: 192.168.31.14:3001
echo    - Build Output: android\app\build\outputs\apk\debug\

echo.
echo 🎯 NEXT STEPS:
echo    1. Download Android Studio: https://developer.android.com/studio
echo    2. Run: npm run mobile:open
echo    3. Build APK in Android Studio
echo.

echo Press any key to open the download page...
pause >nul
start https://developer.android.com/studio
