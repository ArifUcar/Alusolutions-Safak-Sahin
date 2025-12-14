const fs = require('fs');

const translations = {
  tr: {
    step2: {
      title: "Oluk tipi",
      rechteGoot: "Düz oluk",
      halfrondeGoot: "Yarım yuvarlak oluk"
    },
    step3: {
      title: "Renk",
      wit: "Beyaz",
      cremeWit: "Krem beyaz",
      antraciet: "Antrasit",
      zwart: "Siyah"
    }
  },
  en: {
    step2: {
      title: "Gutter type",
      rechteGoot: "Straight gutter",
      halfrondeGoot: "Half-round gutter"
    },
    step3: {
      title: "Color",
      wit: "White",
      cremeWit: "Cream white",
      antraciet: "Anthracite",
      zwart: "Black"
    }
  },
  de: {
    step2: {
      title: "Dachrinnentyp",
      rechteGoot: "Gerade Dachrinne",
      halfrondeGoot: "Halbrunde Dachrinne"
    },
    step3: {
      title: "Farbe",
      wit: "Weiß",
      cremeWit: "Cremeweiß",
      antraciet: "Anthrazit",
      zwart: "Schwarz"
    }
  },
  fr: {
    step2: {
      title: "Type de gouttière",
      rechteGoot: "Gouttière droite",
      halfrondeGoot: "Gouttière demi-ronde"
    },
    step3: {
      title: "Couleur",
      wit: "Blanc",
      cremeWit: "Blanc crème",
      antraciet: "Anthracite",
      zwart: "Noir"
    }
  },
  it: {
    step2: {
      title: "Tipo di grondaia",
      rechteGoot: "Grondaia dritta",
      halfrondeGoot: "Grondaia semicircolare"
    },
    step3: {
      title: "Colore",
      wit: "Bianco",
      cremeWit: "Bianco crema",
      antraciet: "Antracite",
      zwart: "Nero"
    }
  }
};

Object.keys(translations).forEach(lang => {
  const filePath = `./src/i18n/locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (data.offerte) {
    data.offerte.step2 = translations[lang].step2;
    data.offerte.step3 = translations[lang].step3;
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});
