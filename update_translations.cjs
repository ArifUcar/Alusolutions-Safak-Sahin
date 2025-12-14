const fs = require('fs');
const path = require('path');

const nlPath = path.join(__dirname, 'src/i18n/locales/nl.json');
const nl = JSON.parse(fs.readFileSync(nlPath, 'utf8'));

function copyStructure(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const languages = ['en', 'tr', 'de', 'fr', 'it'];

languages.forEach(lang => {
  const targetPath = path.join(__dirname, `src/i18n/locales/${lang}.json`);
  const copy = copyStructure(nl);
  fs.writeFileSync(targetPath, JSON.stringify(copy, null, 2), 'utf8');
  console.log(`✓ Updated ${lang}.json`);
});

console.log('\n✅ All translation files updated!');
