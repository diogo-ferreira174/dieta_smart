@echo off
echo Copiando src\public para docs (usar a partir da raiz do repositório)...
robocopy "src\public" "docs" /MIR /NFL /NDL /NJH /NJS
set RC=%ERRORLEVEL%
if %RC% GEQ 8 (
  echo Erro na copia. Código de retorno %RC%.
  exit /b %RC%
)
echo Copia concluida com sucesso.
pause
