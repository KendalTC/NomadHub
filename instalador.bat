@echo off
echo ================================================
echo         NomadHub - Instalador Windows
echo ================================================
echo.

echo [1/6] Creando entorno virtual...
python -m venv venv
call venv\Scripts\activate

echo [2/6] Instalando dependencias de Python...
pip install -r requirements.txt

echo [3/6] Verificando archivo .env...
if not exist .env (
    echo ADVERTENCIA: No se encontro el archivo .env
    echo Crea el archivo .env con las variables necesarias antes de continuar.
    echo Ejemplo:
    echo   SECRET_KEY=django-insecure-cambiar
    echo   DEBUG=True
    echo   DB_NAME=nomadhub
    echo   DB_USER=root
    echo   DB_PASSWORD=
    echo   DB_HOST=localhost
    echo   DB_PORT=3306
    echo   AVIATION_KEY=tu_api_key
    pause
    exit /b 1
)

echo [4/6] Ejecutando migraciones...
python manage.py migrate

echo [5/6] Instalando dependencias del frontend...
cd frontend
npm install
cd ..

echo [6/6] Instalacion completada.
echo.
echo ================================================
echo  Para correr el proyecto:
echo  Terminal 1: venv\Scripts\activate y python manage.py runserver
echo  Terminal 2: cd frontend y npm run dev
echo  Luego abre: http://localhost:5173
echo ================================================
echo.
pause