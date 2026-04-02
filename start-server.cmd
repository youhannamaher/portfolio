@echo off
cd /d %~dp0

echo Starting server...
start cmd /k npx serve . -l 3000

timeout /t 3 > nul

echo Opening browser...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://localhost:3000