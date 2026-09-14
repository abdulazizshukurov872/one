@echo off
title SmartKutubxona
echo ===================================================
echo   SmartKutubxona — Zamonaviy Onlayn Kutubxona
echo ===================================================
echo.

:: 1. Agar Python mavjud bo'lsa, Python orqali ishga tushirish
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python aniqlandi. Server ishga tushirilmoqda...
    start "" "http://localhost:5500"
    python -m http.server 5500
    goto end
)

:: 2. Agar Python bo'lmasa, Windows o'rnatilgan PowerShell serveri orqali ishga tushirish
echo [INFO] Python topilmadi. Windows o'rnatilgan tizimi orqali ishga tushirilmoqda...
where powershell >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] PowerShell orqali server ishga tushirilmoqda (Python kerak emas)...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
    goto end
)

:: 3. Agar hech biri bo'lmasa, to'g'ridan-to'g'ri brauzerda ochish
echo [OK] Brauzerda to'g'ridan-to'g'ri ochilmoqda...
start "" "%~dp0index.html"

:end
