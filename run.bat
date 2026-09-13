@echo off
title TripG - Vadodara Tour & Route Navigator
color 0D

echo ========================================================
echo          TripG -- Vadodara Tour Navigator (Next.js)
echo    Aesthetics: 3D Cyber-Pink Glassmorphism (Mobile-First)
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if node_modules missing
if not exist "node_modules\" (
    echo [INFO] Installing project dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed!
        pause
        exit /b 1
    )
)

echo [INFO] Starting Next.js Turbopack development server...
echo [INFO] Local App: http://localhost:3000
echo.

call npm run dev -- --turbopack -H 0.0.0.0 -p 3000
pause
