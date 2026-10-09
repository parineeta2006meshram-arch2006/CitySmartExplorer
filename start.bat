@echo off
title CitySmart Explorer - Running
echo ======================================================
echo   CitySmart Explorer - Explore Smarter. Travel Safer.
echo ======================================================
echo Starting local web server...

if exist "%LOCALAPPDATA%\Programs\antigravity\Antigravity.exe" (
  set "NODE_CMD=%APPDATA%\Antigravity\bin\agy-node.cmd"
) else (
  set "NODE_CMD=node"
)

echo Using Node runner: %NODE_CMD%
start http://localhost:3000
"%NODE_CMD%" "%~dp0server.js"
pause
