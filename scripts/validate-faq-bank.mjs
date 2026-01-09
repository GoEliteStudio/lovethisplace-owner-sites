#!/usr/bin/env node
/**
 * FAQ Bank Validation Script
 * 
 * Run modes:
 *   npm run validate:faq              # Dev mode (warnings only)
 *   npm run validate:faq -- --strict  # CI mode (fail on warnings)
 *   npm run validate:faq -- --report  # Generate baseline report
 * 
 * Exit codes:
 *   0 = success
 *   1 = validation errors (build should fail)
 */

import {
  runFullValidation,
  getUndeclaredTokenUsage,
  getAllUsedTokens,
  validatePropertyFeatures,
  TOKEN_DEFINITIONS,
  PROPERTY_FEATURES,
  masterFaqBank,
  getCoreFaqs,
} from '../src/data/faq/masterFaqBank.js';

// ════════════════════════════════════════════════════════════════════════
// CLI ARGS
// ════════════════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
const strictMode = args.includes('--strict');
const generateReport = args.includes('--report');
const coreFaqsOnly = args.includes('--core-only');

// ════════════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════════════

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ════════════════════════════════════════════════════════════════════════
// MAIN VALIDATION
// ════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(60));
log('cyan', '🔍 FAQ Bank Validation');
console.log('═'.repeat(60) + '\n');

// Stats
const totalFaqs = masterFaqBank.length;
const coreFaqs = getCoreFaqs().length;
const tokenCount = Object.keys(TOKEN_DEFINITIONS).length;
const featureCount = Object.keys(PROPERTY_FEATURES).length;

log('blue', `📊 Bank Statistics:`);
console.log(`   Total FAQs: ${totalFaqs}`);
console.log(`   Core FAQs: ${coreFaqs}`);
console.log(`   Defined Tokens: ${tokenCount}`);
console.log(`   Property Features: ${featureCount}\n`);

// Run validation
const result = runFullValidation({ strictMode, coreFaqsOnly });

// Property feature validation
const featureErrors = validatePropertyFeatures();
if (featureErrors.length > 0) {
  log('red', `❌ Property Feature Errors (${featureErrors.length}):`);
  featureErrors.forEach(({ faqId, invalidFeatures }) => {
    console.log(`   ${faqId}: ${invalidFeatures.join(', ')}`);
  });
  console.log('');
}

// Undeclared token usage
const undeclared = getUndeclaredTokenUsage();
if (undeclared.length > 0) {
  const label = strictMode ? '❌ Undeclared Token Usage' : '⚠️  Undeclared Token Usage';
  log(strictMode ? 'red' : 'yellow', `${label} (${undeclared.length} FAQs):`);
  undeclared.forEach(({ faqId, undeclaredTokens }) => {
    console.log(`   ${faqId}: ${undeclaredTokens.join(', ')}`);
  });
  console.log('');
}

// Token usage report
const allTokens = getAllUsedTokens();
const usedTokens = Array.from(allTokens.keys());
const definedTokens = Object.keys(TOKEN_DEFINITIONS);
const undefinedTokens = usedTokens.filter(t => !TOKEN_DEFINITIONS[t]);
const unusedDefinedTokens = definedTokens.filter(t => !allTokens.has(t));

if (undefinedTokens.length > 0) {
  log('yellow', `⚠️  Tokens used but not defined (${undefinedTokens.length}):`);
  undefinedTokens.forEach(t => console.log(`   {{${t}}}`));
  console.log('');
}

if (unusedDefinedTokens.length > 0) {
  log('dim', `ℹ️  Tokens defined but not used (${unusedDefinedTokens.length}):`);
  unusedDefinedTokens.slice(0, 10).forEach(t => console.log(`   ${t}`));
  if (unusedDefinedTokens.length > 10) {
    console.log(`   ... and ${unusedDefinedTokens.length - 10} more`);
  }
  console.log('');
}

// ════════════════════════════════════════════════════════════════════════
// REPORT GENERATION
// ════════════════════════════════════════════════════════════════════════

if (generateReport) {
  console.log('─'.repeat(60));
  log('cyan', '📋 Generating Baseline Report...\n');
  
  const report = {
    generatedAt: new Date().toISOString(),
    stats: {
      totalFaqs,
      coreFaqs,
      tokenCount,
      featureCount,
    },
    undeclaredTokenUsage: undeclared,
    undefinedTokens,
    unusedDefinedTokens,
    featureErrors,
    tokensByCategory: {},
    faqsByCategory: {},
  };
  
  // Group tokens by category
  for (const [key, def] of Object.entries(TOKEN_DEFINITIONS)) {
    if (!report.tokensByCategory[def.category]) {
      report.tokensByCategory[def.category] = [];
    }
    report.tokensByCategory[def.category].push(key);
  }
  
  // Group FAQs by category
  for (const faq of masterFaqBank) {
    report.faqsByCategory[faq.category] = (report.faqsByCategory[faq.category] || 0) + 1;
  }
  
  console.log(JSON.stringify(report, null, 2));
  console.log('');
}

// ════════════════════════════════════════════════════════════════════════
// FINAL RESULT
// ════════════════════════════════════════════════════════════════════════

console.log('─'.repeat(60));

if (result.errors.length > 0) {
  log('red', `\n❌ VALIDATION FAILED (${result.errors.length} errors)\n`);
  result.errors.forEach(e => console.log(`   • ${e}`));
  console.log('');
  process.exit(1);
}

if (result.warnings.length > 0) {
  log('yellow', `\n⚠️  VALIDATION PASSED with ${result.warnings.length} warnings\n`);
  if (!strictMode) {
    log('dim', '   Run with --strict to fail on warnings');
  }
} else {
  log('green', '\n✅ VALIDATION PASSED — No issues found!\n');
}

process.exit(0);
