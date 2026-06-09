@echo off
title NomadHub - Instalador
set ROOT=%~dp0

echo ================================================
echo         NomadHub - Instalador Windows
echo ================================================
echo.

echo [1/4] Creando entorno virtual...
python -m venv "%ROOT%venv"

echo [2/4] Instalando dependencias Python...
"%ROOT%venv\Scripts\python.exe" -m pip install -r "%ROOT%requirements.txt"

echo [3/4] Ejecutando migraciones...
"%ROOT%venv\Scripts\python.exe" "%ROOT%manage.py" migrate

echo [4/4] Instalando dependencias frontend...
cd /d "%ROOT%frontend"
npm install
cd /d "%ROOT%"

echo.
echo Iniciando servidores...
start "Backend - Django" cmd /k ""%ROOT%venv\Scripts\python.exe" "%ROOT%manage.py" runserver"
timeout /t 8 /nobreak > nul
start "Frontend - React" cmd /k "cd /d "%ROOT%frontend" && npm run dev"
timeout /t 10 /nobreak > nul
start http://localhost:5173

echo.
echo ================================================
echo  NomadHub corriendo en http://localhost:5173
echo ================================================
pause