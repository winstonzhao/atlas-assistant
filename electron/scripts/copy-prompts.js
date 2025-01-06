const fs = require('fs');
const path = require('path');

// Create the prompts directory in dist-electron if it doesn't exist
const sourceDir = path.join(__dirname, '..', 'prompts');
const targetDir = path.join(__dirname, '..', '..', 'dist-electron', 'prompts');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all files from prompts directory
fs.readdirSync(sourceDir).forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${sourcePath} to ${targetPath}`);
});
