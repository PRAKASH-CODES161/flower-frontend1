const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /lavender/g, replace: 'mint-light' },
  { regex: /soft-purple/g, replace: 'mint-primary' },
  { regex: /dark-purple/g, replace: 'mint-dark' },
  { regex: /purple-100/g, replace: 'emerald-100' },
  { regex: /purple-200/g, replace: 'emerald-200' },
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (['.jsx', '.js', '.css', '.html'].includes(path.extname(fullPath))) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
replaceInFile(path.join(__dirname, 'tailwind.config.js'));
