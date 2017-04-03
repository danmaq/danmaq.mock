@echo off

setlocal
set CONTAINER_N=nginx
set CONTAINER_S=sass

set SASS_BASE=/var/sass
set SASS_SRC=%SASS_BASE%/assets/sass/style.scss
set SASS_DST=%SASS_BASE%/assets/css/style.css

set VOL_S=%~dp0:%SASS_BASE%
set VOL_N=%~dp0:/usr/share/nginx/html:ro
set CMD_S=sass --watch %SASS_SRC%:%SASS_DST%

docker run --rm -v %VOL_S% alpine:edge test -f %SASS_SRC%
echo %ERRORLEVEL%
rem exit /b 0


docker run -d -v %VOL_S% --name %CONTAINER_S% danmaq/ruby-sass %CMD_S%
docker run -d -p 4000:80 -v %VOL_N% --name %CONTAINER_N% nginx:alpine
endlocal

exit /b 0
