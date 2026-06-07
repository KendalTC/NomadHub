#!/bin/bash
echo "================================================"
echo "        NomadHub - Instalador Linux/Mac"
echo "================================================"
echo ""

echo "[1/6] Creando entorno virtual..."
python3 -m venv venv
source venv/bin/activate

echo "[2/6] Instalando dependencias de Python..."
pip install -r requirements.txt

echo "[3/6] Verificando archivo .env..."
if [ ! -f .env ]; then
    echo "ADVERTENCIA: No se encontro el archivo .env"
    echo "Crea el archivo .env con las variables necesarias."
    exit 1
fi

echo "[4/6] Ejecutando migraciones..."
python manage.py migrate

echo "[5/6] Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

echo "[6/6] Instalacion completada."
echo ""
echo "================================================"
echo " Para correr el proyecto:"
echo " Terminal 1: source venv/bin/activate && python manage.py runserver"
echo " Terminal 2: cd frontend && npm run dev"
echo " Luego abre: http://localhost:5173"
echo "================================================"