@echo off
title TripG - Vadodara Tour Dev Server
color 0A

echo.
echo  ████████╗██████╗ ██╗██████╗  ██████╗ 
echo     ██╔══╝██╔══██╗██║██╔══██╗██╔════╝ 
echo     ██║   ██████╔╝██║██████╔╝██║  ███╗
echo     ██║   ██╔══██╗██║██╔═══╝ ██║   ██║
echo     ██║   ██║  ██║██║██║     ╚██████╔╝
echo     ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝ 
echo.
echo  TripG - Vadodara Tour & Route Navigator
echo  ==========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo  [!] Installing dependencies with npm install...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo  [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo  [!] .env file not found. Creating from .env.example...
    copy ".env.example" ".env" >nul
    echo.
    echo  =============================================
    echo  [IMPORTANT] Please set your MONGODB_URI in .env!
    echo  =============================================
    echo.
    notepad .env
    pause
    exit /b 0
)

echo  [1/2] Starting Backend API Server (port 3001)...
echo.
start "TripG - API Server" cmd /k "color 0B && echo  TripG API Server - port 3001 && echo  ========================== && node --env-file=.env server.js"

REM Wait 2 seconds for API to start
timeout /t 2 /nobreak >nul

echo  [2/2] Starting Frontend Vite Server (port 5173)...
echo.
start "TripG - Frontend" cmd /k "color 0E && echo  TripG Frontend - Vite Dev Server && echo  ================================= && npm run dev"

REM Wait for Vite to start
timeout /t 3 /nobreak >nul

echo.
echo  ==========================================
echo   TripG is running!
echo  ==========================================
echo.
echo   Local:    http://localhost:5173
echo   Network:  http://192.168.1.3:5173
echo   API:      http://localhost:3001/api/destinations
echo.
echo   Open on your mobile phone via the Network URL.
echo.
echo  ==========================================
echo.

REM Open browser
echo  Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo  To stop servers, close the two opened terminal windows.
echo.
pause
