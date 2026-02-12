@echo off
echo Setting up PostgreSQL database...
echo.

REM Set password environment variable
set PGPASSWORD=12345678

echo Creating database (if not exists)...
psql -U postgres -c "CREATE DATABASE student_management;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Database created successfully
) else (
    echo Database already exists or error occurred
)

echo.
echo Running schema script...
psql -U postgres -d student_management -f database_schema.sql

echo.
echo Database setup complete!
pause
