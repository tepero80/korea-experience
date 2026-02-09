const fs = require('fs');
const matter = require('gray-matter');

const filePath = 'C:\\kc\\korea-experience\\content\\deep-dive\\convenience-store-must-buys-gs25-vs-cu-2026.md';
const fileContents = fs.readFileSync(filePath, 'utf8');

console.log('File length:', fileContents.length);
console.log('First 500 chars:', fileContents.slice(0, 500));
console.log('\nHas null byte:', fileContents.includes('\x00'));

if (fileContents.includes('\x00')) {
    const nullPos = fileContents.indexOf('\x00');
    console.log('Null byte at position:', nullPos);
    console.log('Around null byte:', JSON.stringify(fileContents.slice(nullPos-20, nullPos+20)));
}

try {
    const { data, content } = matter(fileContents);
    console.log('\n✅ Parsed successfully');
    console.log('Title:', data.title);
} catch (e) {
    console.log('\n❌ Parse error:', e.message);
}
