@echo off
echo ========================================
echo  Sahithyotsav Backend Setup Script
echo ========================================
echo.

echo Step 1: Setting up environment...
cd /d "%~dp0"
if not exist ".env" (
    echo ERROR: .env file not found! Please create it first.
    echo Copy .env.example to .env and configure your database settings.
    pause
    exit /b 1
)

echo Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo Step 3: Initializing database...
call npm run init-db
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize database
    echo Please check your DATABASE_URL in .env file
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start the server: npm start
echo 2. Open your browser to http://localhost:3000
echo 3. Test the API at http://localhost:3000/api/health
echo.
echo Default admin login:
echo Email: admin@sahityotsav.com
echo Password: admin123
echo.
echo IMPORTANT: Change the admin password after first login!
echo.
pause