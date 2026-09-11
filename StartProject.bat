@echo off
title StockFlow Launcher
color 0A

echo =======================================================
echo          Starting StockFlow Inventory System
echo =======================================================
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

:: Check for Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)

:: Check for Node.js / NPM
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    echo Please install Node.js and add it to PATH.
    pause
    exit /b 1
)

:: Check if frontend node_modules exist
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd /d "%FRONTEND_DIR%"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies!
        pause
        exit /b 1
    )
)

echo [1/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "StockFlow - Backend Server" cmd /k "cd /d "%BACKEND_DIR%" && title StockFlow Backend && echo Running Backend on http://127.0.0.1:8000 ... && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo [2/3] Launching React Frontend on http://localhost:5173 ...
start "StockFlow - Frontend Server" cmd /k "cd /d "%FRONTEND_DIR%" && title StockFlow Frontend && echo Running Frontend on http://localhost:5173 ... && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo =======================================================
echo   StockFlow is now running!
echo =======================================================
echo   Frontend UI : http://localhost:5173
echo   Backend API : http://127.0.0.1:8000
echo   API Docs    : http://127.0.0.1:8000/docs
echo.
echo   Default Credentials:
echo     Email    : admin@stockflow.com
echo     Password : admin123
echo =======================================================
echo.
echo You can close this window at any time.
echo To stop the servers, close the individual server windows.
echo.
pause

