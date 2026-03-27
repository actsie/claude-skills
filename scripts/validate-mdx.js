const { compile } = require('@mdx-js/mdx');
const fs = require('fs');
const path = require('path');

async function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Strip frontmatter before compiling
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '');
  try {
    await compile(withoutFrontmatter);
    return { valid: true, file: filePath };
  } catch (err) {
    return { valid: false, file: filePath, error: err.message };
  }
}

async function main() {
  const target = process.argv[2];
  const files = target
    ? [target]
    : fs.readdirSync('/Users/mantisclaw/claude-skills/content/skills/')
        .filter(f => f.endsWith('.md'))
        .map(f => path.join('/Users/mantisclaw/claude-skills/content/skills/', f));
  
  let failed = 0;
  for (const file of files) {
    const result = await validateFile(file);
    if (!result.valid) {
      console.error(`❌ ${path.basename(file)}: ${result.error}`);
      failed++;
    }
  }
  if (failed === 0) console.log(`✅ All ${files.length} files valid`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
