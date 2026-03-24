const fs = require('fs');
const path = require('path');

const convertToLF = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Only rewrite if it actually contains CRLF to avoid changing modification times unnecessarily
        if (content.includes('\r\n')) {
            const lfContent = content.replace(/\r\n/g, '\n');
            fs.writeFileSync(filePath, lfContent);
            console.log(`✅ Converted to LF: ${filePath}`);
            return true;
        }
    } catch (err) {
        console.error(`❌ Failed to read or write ${filePath}: ${err.message}`);
    }
    return false;
};

const walkSync = (dir, filelist = []) => {
    // Exclude node_modules and .git
    if (dir.includes('node_modules') || dir.includes('.git')) return filelist;

    try {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const filepath = path.join(dir, file);
            if (fs.statSync(filepath).isDirectory()) {
                filelist = walkSync(filepath, filelist);
            } else {
                if (filepath.endsWith('.sh') || filepath.endsWith('.conf')) {
                    filelist.push(filepath);
                }
            }
        });
    } catch (e) {
        console.warn('Could not read directory:', dir);
    }
    return filelist;
};

const targetFiles = walkSync(__dirname);
console.log(`Found ${targetFiles.length} files to check.`);
let changedCount = 0;

targetFiles.forEach(file => {
    if (convertToLF(file)) {
        changedCount++;
    }
});

console.log(`\nDone! Converted ${changedCount} file(s) to LF line endings.`);
