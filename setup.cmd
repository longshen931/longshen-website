@echo off
setlocal
cd /d "%~dp0"
where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed. Install Git for Windows first.
  pause
  exit /b 1
)
set "WORK_DIR=%~dp0..\longshen-website-local"
if exist "%WORK_DIR%" (
  echo The working folder already exists: %WORK_DIR%
  echo Open it and use publish.cmd for future updates.
  pause
  exit /b 0
)
git clone https://github.com/longshen931/longshen-website.git "%WORK_DIR%"
if errorlevel 1 (
  echo Clone failed. Check your Internet connection and Git installation.
  pause
  exit /b 1
)
echo.
echo Your editable copy is here: %WORK_DIR%
echo Edit files in its site folder, then double-click publish.cmd there.
pause
