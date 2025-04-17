const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否安装了sharp
try {
  require.resolve('sharp');
} catch (e) {
  console.log('正在安装sharp依赖...');
  execSync('npm install sharp --save-dev');
}

const sharp = require('sharp');

// 图标尺寸
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// 源文件和目标目录
const svgPath = path.join(__dirname, '../public/icons/icon-base.svg');
const outputDir = path.join(__dirname, '../public/icons');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('开始生成图标...');
  
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    // 为每个尺寸生成图标
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ 已生成 ${size}x${size} 图标`);
    }
    
    // 同时生成favicon.ico（标准16x16尺寸）
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat('ico')
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('✅ 已生成 favicon.ico');
    console.log('🎉 所有图标生成完成！');
  } catch (error) {
    console.error('生成图标时出错:', error);
  }
}

generateIcons(); 