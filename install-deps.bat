@echo off
chcp 65001 >nul
cd /d "D:\TODO\el cobrador\app"

echo ==========================================
echo  Instalando dependencias...
echo ==========================================
echo.

echo Paso 1: npm install
call npm install
if errorlevel 1 (
    echo Error en npm install
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Verificando instalacion...
echo ==========================================
echo.

call npm list react @mui/material @supabase/supabase-js qrcode --depth=0

echo.
echo ==========================================
echo  Instalacion completada!
echo ==========================================
echo.
pause
