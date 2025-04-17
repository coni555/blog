@echo off
echo === 清理旧的node_modules ===
if exist node_modules (
  rmdir /s /q node_modules
)
if exist package-lock.json (
  del package-lock.json
)

echo === 安装依赖 ===
call npm install --legacy-peer-deps

echo === 生成图标 ===
call node scripts/generate-icons.js

echo === 构建项目 ===
call npm run build

echo === 部署到GitHub Pages ===
call npm run deploy:github

echo === 完成! === 