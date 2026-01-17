@echo off
REM Lead Management Dashboard - Git Initialization Script (Windows)
REM This script prepares the project for GitHub

echo 🚀 Lead Management Dashboard - Git Setup Script
echo ================================================
echo.

REM Check if git is installed
where git >nul 2>nul
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    echo Visit: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Initialize git repo if not already initialized
if exist .git (
    echo ⚠️  Git repository already initialized
) else (
    echo 📦 Initializing git repository...
    git init
    echo ✅ Git repository initialized
)

echo.
echo 📝 Configuring git...

REM Add all files except node_modules and .env
echo 🔍 Adding files to git...
git add .

REM Show what will be committed
echo.
echo 📋 Files to be committed:
git status --short

echo.
echo Next steps:
echo.
echo 1. Create a new repository on GitHub:
echo    - Go to https://github.com/new
echo    - Name it: lead-management-dashboard
echo    - Don't initialize with README (we have one)
echo    - Click 'Create repository'
echo.
echo 2. Connect your local repository to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/lead-management-dashboard.git
echo.
echo 3. Commit your changes:
echo    git commit -m "Initial commit: Full-stack Lead Management Dashboard"
echo.
echo 4. Push to GitHub:
echo    git branch -M main
echo    git push -u origin main
echo.
echo 5. Verify on GitHub that all files are there
echo.
echo ✨ Your project will be ready for deployment!
echo.
pause
