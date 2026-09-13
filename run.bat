@echo off
title TripG - Local Dev Server
color 0A

echo.
echo  ████████╗██████╗ ██╗██████╗  ██████╗ 
echo     ██╔══╝██╔══██╗██║██╔══██╗██╔════╝ 
echo     ██║   ██████╔╝██║██████╔╝██║  ███╗
echo     ██║   ██╔══██╗██║██╔═══╝ ██║   ██║
echo     ██║   ██║  ██║██║██║     ╚██████╔╝
echo     ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝ 
echo.
echo  আপনার ট্যুর গাইড - Local Dev Mode
echo  ==========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo  [!] node_modules নেই। npm install করা হচ্ছে...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo  [ERROR] npm install ব্যর্থ হয়েছে!
        pause
        exit /b 1
    )
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo  [!] .env ফাইল পাওয়া যায়নি!
    echo.
    echo  .env.example থেকে .env তৈরি করা হচ্ছে...
    copy ".env.example" ".env" >nul
    echo.
    echo  =============================================
    echo  [IMPORTANT] .env ফাইলে MONGODB_URI বসান!
    echo  =============================================
    echo.
    echo  ফাইল খুলে MONGODB_URI সেট করুন:
    echo  notepad .env
    echo.
    echo  তারপর run.bat আবার চালান।
    echo.
    notepad .env
    pause
    exit /b 0
)

echo  [1/2] Backend API server শুরু হচ্ছে (port 3001)...
echo.
start "TripG - API Server" cmd /k "color 0B && echo  TripG API Server - port 3001 && echo  ========================== && node --env-file=.env server.js"

REM Wait 2 seconds for API to start
timeout /t 2 /nobreak >nul

echo  [2/2] Frontend (Vite) শুরু হচ্ছে (port 5173)...
echo.
start "TripG - Frontend" cmd /k "color 0E && echo  TripG Frontend - Vite Dev Server && echo  ================================= && npm run dev"

REM Wait for Vite to start
timeout /t 3 /nobreak >nul

echo.
echo  ==========================================
echo   ✅ TripG চালু হয়েছে!
echo  ==========================================
echo.
echo   Frontend:  http://localhost:5173
echo   API:       http://localhost:3001/api/destinations
echo.
echo   মোবাইলে দেখতে চাইলে নেটওয়ার্ক IP দিয়ে যান।
echo.
echo  ==========================================
echo.

REM Open browser
echo  Browser খুলছি...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo  সার্ভার বন্ধ করতে উপরের দুটো window বন্ধ করুন।
echo.
pause
