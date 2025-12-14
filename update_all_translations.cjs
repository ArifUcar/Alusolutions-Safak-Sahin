const fs = require('fs');
const path = require('path');

// Read the latest nl.json
const nlPath = path.join(__dirname, 'src/i18n/locales/nl.json');
const nl = JSON.parse(fs.readFileSync(nlPath, 'utf8'));

// Copy to all other languages
const languages = ['en', 'tr', 'de', 'fr', 'it'];

languages.forEach(lang => {
  const targetPath = path.join(__dirname, `src/i18n/locales/${lang}.json`);
  // Write the exact same structure as nl.json
  fs.writeFileSync(targetPath, JSON.stringify(nl, null, 2), 'utf8');
  console.log(`✓ Updated ${lang}.json with ALL keys from nl.json`);
});

console.log('\n✅ All translation files now have identical structure to nl.json!');
