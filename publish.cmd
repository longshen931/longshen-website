@echo off
setlocal
cd /d "%~dp0"
where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed. Install Git for Windows first.
  pause
  exit /b 1
)
if not exist ".git" (
  echo Run setup.cmd first, or clone the GitHub repository here.
  pause
  exit /b 1
)
git add site || goto :failed
git diff --cached --quiet
if not errorlevel 1 (
  echo No new website edits. Checking whether an earlier commit needs pushing.
) else (
  git commit -m "Update academic website" || goto :failed
)
git push origin main || goto :failed
echo.
echo Upload succeeded. Check the repository Actions tab for publication status.
pause
exit /b 0
:failed
echo Publishing stopped. Check the message above and retry after fixing it.
pause
exit /b 1
