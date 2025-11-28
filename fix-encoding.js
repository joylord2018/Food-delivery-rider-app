import fs from 'fs';
import path from 'path';

// 修复文件编码问题
function fixFileEncoding(filePath) {
  try {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    // 写入文件，确保使用UTF-8编码
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed encoding for ${filePath}`);
  } catch (error) {
    console.error(`Error fixing encoding for ${filePath}:`, error.message);
  }
}

// 修改<style>标签为<style lang="scss">
function updateStyleTags(filePath) {
  try {
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    // 修改<style>标签
    content = content.replace(/<style scoped>/g, '<style lang="scss" scoped>');
    // 写入文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated style tags for ${filePath}`);
  } catch (error) {
    console.error(`Error updating style tags for ${filePath}:`, error.message);
  }
}

// 递归遍历目录
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 递归处理子目录
      processDirectory(filePath);
    } else if (file.endsWith('.vue')) {
      // 修复Vue文件的编码和<style>标签
      fixFileEncoding(filePath);
      updateStyleTags(filePath);
    }
  }
}

// 开始处理
console.log('Starting to fix file encoding and update style tags...');
processDirectory('./src');
console.log('Done!');