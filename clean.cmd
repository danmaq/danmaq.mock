@echo off

setlocal
set CONTAINER_N=nginx
set CONTAINER_S=sass

set SASS_BASE=/var/sass
set SASS_DST=%SASS_BASE%/assets/css/style.css

docker exec %CONTAINER_S% rm -rf %SASS_DST%
docker rm -f %CONTAINER_S%
docker rm -f %CONTAINER_N%
endlocal

exit /b 0
