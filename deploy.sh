#!/usr/bin/env bash
set -euo pipefail

echo "👉 Pull code từ branch main..."
git fetch origin main
git reset --hard origin/main

echo "👉 Dọn cache lỗi ENOTEMPTY..."
rm -rf node_modules/.cache || true

echo "👉 Cài dependencies (để build CRA cần devDependencies)..."
npm install

echo "👉 Build project..."
npm run build

echo "👉 Reload PM2..."
pm2 reload kidoedu-fe --update-env || pm2 start npm --name kidoedu-fe -- run start

echo "✅ Deploy thành công!"
