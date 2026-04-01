@echo off
setlocal
cd /d "%~dp0"

:: Configuration: Path to the Git executable from GitHub Desktop
set "GIT_EXE=C:\Users\youha_bcdqcy2\AppData\Local\GitHubDesktop\app-3.5.7\resources\app\git\mingw64\bin\git.exe"

echo ===================================================
echo        PORTFOLIO CONTENT GENERATOR & SYNC
echo ===================================================
echo.
echo [1/3] Scanning portfolio folders...
node tools\generate-content.js

echo.
echo [2/3] Committing changes...
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Automated portfolio update: %DATE% %TIME%"

echo.
echo [3/3] Pushing to GitHub...
"%GIT_EXE%" push

echo.
echo ===================================================
echo UPDATE & SYNC COMPLETE! 
echo ===================================================
echo Your changes are now live on GitHub.
echo.
pause
endlocal
