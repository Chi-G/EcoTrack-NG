#!/bin/bash
set -e

echo "🚀 Starting Deployment for EcoTrack-NG..."

# 1. Maintenance Mode
php artisan down || true

# 2. Update Code
git pull origin main

# 3. Backend Dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader

# 4. Database Migrations
php artisan migrate --force

# 5. Frontend Build
npm install
npm run build

# 6. Optimization
php artisan optimize:clear
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Queue Restart
php artisan queue:restart

# 8. Service Worker Management (PWA)
# Ensure public folder permissions are correct for PWA assets
chmod -R 755 public/build

# 9. Up and running
php artisan up

echo "✅ Deployment Successful!"
