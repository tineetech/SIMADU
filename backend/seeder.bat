@echo off
@REM cd /d C:\Project\Sikuy1\backend

start cmd /k "cd migration/user_service && npx knex seed:run"
timeout /t 5 /nobreak > nul

start cmd /k "cd migration/laporan_service && npx knex seed:run"
timeout /t 5 /nobreak > nul

start cmd /k "cd migration/postingan_service && npx knex seed:run"
timeout /t 5 /nobreak > nul

start cmd /k "cd migration/notification_service && npx knex seed:run"