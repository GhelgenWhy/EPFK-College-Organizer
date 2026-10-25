@echo off
setlocal EnableExtensions EnableDelayedExpansion

rem ---------------------------------------------------------------------------
rem  EPFK College Organizer - one-click local stack launcher
rem  Starts PostgreSQL (Docker), applies Prisma migrations, then opens the
rem  backend and frontend each in its own window.
rem  Optional flags:  /fresh     - drop the local database volume and recreate it
rem                    /noinstall - never run "npm ci" automatically
rem ---------------------------------------------------------------------------

set "ROOT=%~dp0"
set "COMPOSE_FILE=%ROOT%infrastructure\db\docker-compose.yml"
set "FRESH="
set "NOINSTALL="

:parse_args
if "%~1"=="" goto args_done
if /i "%~1"=="/fresh" set "FRESH=1"
if /i "%~1"=="/noinstall" set "NOINSTALL=1"
shift
goto parse_args
:args_done

echo ============================================================
echo   EPFK College Organizer - local startup
echo ============================================================
echo.

rem --- 1. required tools -----------------------------------------------------
where docker >nul 2>nul
if errorlevel 1 goto no_docker
where node >nul 2>nul
if errorlevel 1 goto no_node

echo [1/6] Checking Docker engine...
docker info >nul 2>nul
if errorlevel 1 goto start_docker_gui
goto docker_is_ready

:start_docker_gui
echo       Docker Desktop is not running, starting it...
if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
set /a WAIT=0
:wait_docker
timeout /t 5 /nobreak >nul
docker info >nul 2>nul
if not errorlevel 1 goto docker_is_ready
set /a WAIT+=5
if !WAIT! LSS 180 goto wait_docker
echo [ERROR] Docker did not start within 3 minutes. Start Docker Desktop manually.
goto fail

:docker_is_ready
echo       Docker engine is ready.

rem --- 2. env files ----------------------------------------------------------
echo [2/6] Checking .env files...
if exist "%ROOT%backend\.env" goto backend_env_ok
if not exist "%ROOT%backend\.env.example" goto no_backend_example
copy /y "%ROOT%backend\.env.example" "%ROOT%backend\.env" >nul
echo       Created backend\.env from .env.example - fill in your Clerk keys.
:backend_env_ok
if exist "%ROOT%frontend\.env" goto frontend_env_ok
if not exist "%ROOT%frontend\.env.example" goto no_frontend_example
copy /y "%ROOT%frontend\.env.example" "%ROOT%frontend\.env" >nul
echo       Created frontend\.env from .env.example - fill in your Clerk key.
:frontend_env_ok

rem --- 3. database -----------------------------------------------------------
if not defined FRESH goto db_start
echo [3/6] Recreating the local database volume...
docker compose -f "%COMPOSE_FILE%" down -v
if errorlevel 1 goto fail
:db_start
echo [3/6] Starting PostgreSQL container...
docker compose -f "%COMPOSE_FILE%" up -d --wait
if errorlevel 1 goto db_failed

rem --- 4. backend dependencies and migrations --------------------------------
pushd "%ROOT%backend"
if exist "node_modules" goto backend_deps_ok
if defined NOINSTALL goto backend_deps_ok
echo [4/6] Installing backend dependencies...
call npm ci
if errorlevel 1 goto backend_step_failed
:backend_deps_ok
if not exist "node_modules" goto backend_deps_missing
echo [4/6] Applying Prisma migrations...
call npm run prisma:generate >nul
if errorlevel 1 goto backend_step_failed
call npm run prisma:deploy
if errorlevel 1 goto backend_step_failed
popd

rem --- 5. frontend dependencies ----------------------------------------------
pushd "%ROOT%frontend"
if exist "node_modules" goto frontend_deps_ok
if defined NOINSTALL goto frontend_deps_ok
echo [5/6] Installing frontend dependencies...
call npm ci
if errorlevel 1 goto frontend_step_failed
:frontend_deps_ok
if not exist "node_modules" goto frontend_deps_missing
popd

rem --- 6. start dev servers --------------------------------------------------
echo [6/6] Starting backend and frontend...
start "EPFK backend" cmd /k "cd /d "%ROOT%backend" && npm run start:dev"
timeout /t 3 /nobreak >nul
start "EPFK frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo Done. Frontend: http://localhost:5173  Backend: http://localhost:3000
echo Close the two opened windows to stop the servers; the database keeps running.
echo To stop the database: docker compose -f infrastructure\db\docker-compose.yml down
endlocal
exit /b 0

:backend_step_failed
popd
goto fail
:frontend_step_failed
popd
goto fail
:backend_deps_missing
echo [ERROR] backend\node_modules is missing and installation was skipped.
popd
goto fail
:frontend_deps_missing
echo [ERROR] frontend\node_modules is missing and installation was skipped.
popd
goto fail

:no_docker
echo [ERROR] Docker was not found in PATH. Install Docker Desktop first.
goto fail
:no_node
echo [ERROR] Node.js was not found in PATH. Install Node.js first.
goto fail
:no_backend_example
echo [ERROR] backend\.env is missing and there is no .env.example to copy.
goto fail
:no_frontend_example
echo [ERROR] frontend\.env is missing and there is no .env.example to copy.
goto fail
:db_failed
echo [ERROR] PostgreSQL container failed to start. Is port 5432 already in use?
goto fail

:fail
echo.
echo Startup aborted. Fix the problem above and run start-all.bat again.
pause
endlocal
exit /b 1
