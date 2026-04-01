@echo off
setlocal
cd /d "%~dp0"
echo ===================================================
echo        PORTFOLIO CONTENT GENERATOR
echo ===================================================
echo.
echo Current Directory: %CD%
echo Scanning portfolio folders...
node tools\generate-content.js
echo.
echo ===================================================
echo UPDATE COMPLETE! 
echo ===================================================
echo Go back to your browser and refresh your Live Server window to see the changes.
echo.
pause
endlocal
