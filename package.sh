#!/bin/bash
# 打包扩展为 zip，用于上传到 Edge Add-ons
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_ZIP="$ROOT_DIR/../browser-screenshot-extension.zip"
cd "$ROOT_DIR"
rm -f "$OUT_ZIP"
zip -r "$OUT_ZIP" . -x "*.DS_Store" "*/.git/*"
echo "Created $OUT_ZIP"
