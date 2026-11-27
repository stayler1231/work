@echo off
where py >nul 2>nul
if errorlevel 1 (
    python "%~dp0boot_log.py"
) else (
    py -3 "%~dp0boot_log.py"
)
if errorlevel 1 pause
