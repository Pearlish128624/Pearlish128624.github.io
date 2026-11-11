@echo off
chcp 65001 >nul
REM 本機預覽：雙擊執行，然後打開 http://localhost:4000
REM 停止預覽：在這個視窗按 Ctrl+C
cd /d "%~dp0"
docker info >nul 2>&1 || (echo 請先打開 Docker Desktop，等它顯示 running 再執行一次。 & pause & exit /b 1)
echo 第一次執行要下載套件，大約需要幾分鐘...
docker run --rm -it --name greenhouse-preview ^
  -p 4000:4000 -p 35729:35729 ^
  -v "%cd%:/srv/site" -v greenhouse-gems:/usr/local/bundle -w /srv/site ^
  ruby:3.3 sh -c "bundle install --quiet && bundle exec jekyll serve --host 0.0.0.0 --livereload --force_polling"
pause
