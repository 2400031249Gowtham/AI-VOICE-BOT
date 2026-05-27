const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let fixed = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (
    !content.trim().startsWith('"use client"') &&
    !content.trim().startsWith("'use client'")
  ) {
    if (
      content.includes('useState') ||
      content.includes('useEffect') ||
      content.includes('createContext') ||
      content.includes('useRef') ||
      content.includes('useReducer') ||
      content.includes('framer-motion')
    ) {
      fs.writeFileSync(file, '"use client";\n\n' + content, 'utf8');
      console.log('Fixed:', file);
      fixed++;
    }
  }
});

console.log('Total fixed:', fixed);
