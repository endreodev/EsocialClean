// Como usar:
// Execute este script após gerar as pastas dist/chrome e dist/firefox.
// No terminal, rode: node copy-assets.js
// Isso irá copiar background.js e icon.png para cada pasta de build, substituindo os existentes.

const fs = require('fs');
const path = require('path');

const targets = ['Chrome', 'Firefox'];
const filesToCopy = ['background.js', 'icon.png'];

targets.forEach(target => {
  const destDir = path.join(__dirname, './', target);
  if (!fs.existsSync(destDir)) {
    console.warn(`Pasta de destino não encontrada: ${destDir}. Pule este destino.`);
    return;
  }
  filesToCopy.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(destDir, file);
    if (!fs.existsSync(src)) {
      console.warn(`Arquivo fonte não encontrado: ${src}. Pule este arquivo.`);
      return;
    }
    try {
      fs.copyFileSync(src, dest);
      console.log(`Copiado ${file} para ${destDir}`);
    } catch (err) {
      console.error(`Erro ao copiar ${file} para ${destDir}:`, err);
    }
  });
});

console.log('Cópia de arquivos concluída.');