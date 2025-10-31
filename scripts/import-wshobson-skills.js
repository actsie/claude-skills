#!/usr/bin/env node

/**
 * Import Skills from wshobson/agents Repository
 *
 * This script fetches all skills from the wshobson/agents GitHub repository
 * and converts them to the skilltree format.
 *
 * Usage: node scripts/import-wshobson-skills.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const GITHUB_REPO = 'wshobson/agents';
const GITHUB_API = 'https://api.github.com';
const RAW_GITHUB = 'https://raw.githubusercontent.com';
const OUTPUT_DIR = path.join(process.cwd(), 'content/skills');

// Category mapping from plugin names to skilltree categories
const CATEGORY_MAP = {
  'python-development': ['development', 'python'],
  'javascript-typescript': ['development', 'javascript', 'typescript'],
  'kubernetes-operations': ['devops', 'kubernetes'],
  'cloud-infrastructure': ['devops', 'cloud'],
  'backend-development': ['development', 'backend'],
  'frontend-mobile-development': ['development', 'frontend', 'mobile'],
  'llm-applications': ['ai', 'llm'],
  'llm-application-dev': ['ai', 'llm'],
  'blockchain-web3': ['blockchain', 'web3'],
  'blockchain-development': ['blockchain', 'web3'],
  'database-design': ['database', 'development'],
  'database-migrations': ['database', 'devops'],
  'data-engineering': ['data', 'engineering'],
  'machine-learning-ops': ['ai', 'ml', 'devops'],
  'ci-cd-integration': ['devops', 'ci-cd'],
  'cicd-automation': ['devops', 'ci-cd'],
  'api-testing-observability': ['testing', 'api', 'devops'],
  'security-compliance': ['security', 'compliance'],
  'security-scanning': ['security', 'devops'],
  'backend-api-security': ['security', 'backend', 'api'],
  'frontend-mobile-security': ['security', 'frontend', 'mobile'],
  'performance-testing-review': ['testing', 'performance'],
  'unit-testing': ['testing', 'development'],
  'tdd-workflows': ['testing', 'development'],
  'code-review-ai': ['development', 'ai', 'code-quality'],
  'debugging-toolkit': ['development', 'debugging'],
  'error-debugging': ['development', 'debugging'],
  'error-diagnostics': ['development', 'debugging'],
  'deployment-strategies': ['devops', 'deployment'],
  'deployment-validation': ['devops', 'deployment'],
  'seo-content-creation': ['marketing', 'seo', 'content'],
  'content-marketing': ['marketing', 'content'],
  'business-analytics': ['analytics', 'business'],
  'payment-processing': ['development', 'payments'],
  'hr-legal-compliance': ['compliance', 'hr', 'legal'],
  'customer-sales-automation': ['automation', 'sales', 'business'],
  'shell-scripting': ['development', 'scripting', 'shell'],
  'systems-programming': ['development', 'systems'],
  'functional-programming': ['development', 'functional'],
  'web-scripting': ['development', 'web', 'scripting'],
  'jvm-languages': ['development', 'jvm', 'java'],
  'accessibility-compliance': ['development', 'accessibility', 'compliance'],
  'data-validation-suite': ['data', 'validation', 'testing'],
  'database-cloud-optimization': ['database', 'cloud', 'optimization'],
  'quantitative-trading': ['finance', 'trading', 'ai'],
};

// Helper function to convert string to Title Case
function toTitleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to extract keywords from text
function extractTags(description, content, maxTags = 10) {
  const text = `${description} ${content}`.toLowerCase();

  // Common technical keywords to look for
  const keywords = [
    'python', 'javascript', 'typescript', 'react', 'node', 'api', 'async', 'kubernetes',
    'docker', 'cloud', 'aws', 'azure', 'gcp', 'database', 'sql', 'nosql', 'testing',
    'security', 'performance', 'deployment', 'ci-cd', 'devops', 'frontend', 'backend',
    'ml', 'ai', 'llm', 'blockchain', 'web3', 'automation', 'monitoring', 'observability',
    'microservices', 'serverless', 'containers', 'helm', 'terraform', 'ansible',
    'fastapi', 'django', 'flask', 'express', 'nextjs', 'vue', 'angular', 'graphql',
    'rest', 'grpc', 'websocket', 'redis', 'postgres', 'mongodb', 'elasticsearch',
    'kafka', 'rabbitmq', 'git', 'github', 'gitlab', 'jenkins', 'prometheus', 'grafana',
  ];

  const foundTags = keywords.filter(keyword => text.includes(keyword));
  return foundTags.slice(0, maxTags);
}

// Fetch data from GitHub API with error handling
async function fetchGitHub(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'skilltree-import-script'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

// Fetch raw file content
async function fetchRawFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching raw file ${url}:`, error.message);
    return null;
  }
}

// Get list of all plugins in the repository
async function getPlugins() {
  console.log('📦 Fetching plugin list...');
  const url = `${GITHUB_API}/repos/${GITHUB_REPO}/contents/plugins`;
  const contents = await fetchGitHub(url);

  if (!contents || !Array.isArray(contents)) {
    throw new Error('Failed to fetch plugins directory');
  }

  const plugins = contents.filter(item => item.type === 'dir').map(item => item.name);
  console.log(`   Found ${plugins.length} plugins`);
  return plugins;
}

// Get skills for a specific plugin
async function getPluginSkills(pluginName) {
  const url = `${GITHUB_API}/repos/${GITHUB_REPO}/contents/plugins/${pluginName}/skills`;
  const contents = await fetchGitHub(url);

  if (!contents || !Array.isArray(contents)) {
    return [];
  }

  // Skills are directories containing SKILL.md files
  const skillDirs = contents.filter(item => item.type === 'dir').map(item => item.name);
  return skillDirs;
}

// Fetch and parse a skill file
async function fetchSkill(pluginName, skillDirName) {
  const rawUrl = `${RAW_GITHUB}/${GITHUB_REPO}/main/plugins/${pluginName}/skills/${skillDirName}/SKILL.md`;
  const content = await fetchRawFile(rawUrl);

  if (!content) {
    return null;
  }

  try {
    const { data, content: body } = matter(content);

    if (!data.name || !data.description) {
      console.warn(`   ⚠️  Skipping ${skillDirName}: missing required fields`);
      return null;
    }

    return {
      pluginName,
      skillDirName,
      frontmatter: data,
      body
    };
  } catch (error) {
    console.error(`   ❌ Error parsing ${skillDirName}:`, error.message);
    return null;
  }
}

// Convert wshobson skill to skilltree format
function convertToSkilltreeFormat(skill) {
  const { pluginName, skillDirName, frontmatter, body } = skill;

  const slug = frontmatter.name || skillDirName;
  const title = toTitleCase(frontmatter.name || skillDirName);
  const description = frontmatter.description || '';
  const categories = CATEGORY_MAP[pluginName] || ['development'];
  const tags = extractTags(description, body);
  const repoUrl = `https://github.com/${GITHUB_REPO}/tree/main/plugins/${pluginName}/skills/${skillDirName}`;

  // Create skilltree frontmatter
  const skilltreeFrontmatter = {
    title,
    slug,
    description,
    categories,
    tags,
    author: 'wshobson',
    repoUrl,
    mcp: true,
    date: new Date().toISOString().split('T')[0],
    featured: false,
  };

  // Add source attribution to content
  const attribution = `> **Source:** [wshobson/agents](https://github.com/${GITHUB_REPO})\n> **Original Plugin:** ${pluginName}\n\n`;
  const skilltreeBody = attribution + body;

  return {
    frontmatter: skilltreeFrontmatter,
    body: skilltreeBody,
    slug
  };
}

// Generate markdown file
function generateMarkdownFile(skill) {
  const { frontmatter, body, slug } = skill;

  // Create frontmatter string
  const frontmatterLines = Object.entries(frontmatter).map(([key, value]) => {
    if (Array.isArray(value)) {
      const items = value.map(v => `"${v}"`).join(', ');
      return `${key}: [${items}]`;
    } else if (typeof value === 'string') {
      return `${key}: "${value}"`;
    } else {
      return `${key}: ${value}`;
    }
  });

  const markdown = `---\n${frontmatterLines.join('\n')}\n---\n\n${body}`;

  return {
    filename: `${slug}.md`,
    content: markdown
  };
}

// Save skill to file
function saveSkill(filename, content) {
  const filePath = path.join(OUTPUT_DIR, filename);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`   ⏭️  Skipping ${filename} (already exists)`);
    return false;
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ Saved ${filename}`);
  return true;
}

// Main import function
async function importSkills() {
  console.log('🚀 Starting wshobson/agents skill import...\n');

  const stats = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: 0
  };

  try {
    // Get all plugins
    const plugins = await getPlugins();

    // Process each plugin
    for (const pluginName of plugins) {
      console.log(`\n📂 Processing plugin: ${pluginName}`);

      const skillDirs = await getPluginSkills(pluginName);

      if (skillDirs.length === 0) {
        console.log(`   No skills found`);
        continue;
      }

      console.log(`   Found ${skillDirs.length} skill(s)`);

      // Process each skill
      for (const skillDirName of skillDirs) {
        stats.total++;

        const skill = await fetchSkill(pluginName, skillDirName);

        if (!skill) {
          stats.errors++;
          continue;
        }

        const converted = convertToSkilltreeFormat(skill);
        const { filename, content } = generateMarkdownFile(converted);

        const saved = saveSkill(filename, content);

        if (saved) {
          stats.imported++;
        } else {
          stats.skipped++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Import Summary:');
    console.log('='.repeat(60));
    console.log(`Total skills found:    ${stats.total}`);
    console.log(`✅ Successfully imported: ${stats.imported}`);
    console.log(`⏭️  Skipped (existing):   ${stats.skipped}`);
    console.log(`❌ Errors:                ${stats.errors}`);
    console.log('='.repeat(60));

    if (stats.imported > 0) {
      console.log(`\n✨ All skills saved to: ${OUTPUT_DIR}`);
      console.log('💡 Tip: Run "npm run generate-index" to update the search index');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the import
if (require.main === module) {
  importSkills();
}

module.exports = { importSkills };
