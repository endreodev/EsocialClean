// Como usar:
// Execute este script após gerar as pastas dist/chrome e dist/firefox.
// No terminal, rode: node copy-assets.js
// Isso irá copiar background.js e icon.png da pasta app para cada pasta de build, substituindo os existentes.
// 
// Para gerar o zip, compacte manualmente o conteúdo da pasta build/{target}.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targets = ['chrome', 'firefox'];
const filesToCopy = ['background.js', 'icon.png'];

targets.forEach(target => {
  const destDir = path.join(__dirname, 'build', target);
  if (!fs.existsSync(destDir)) {
    console.warn(`Pasta de destino não encontrada: ${destDir}. Pule este destino.`);
    return;
  }
  filesToCopy.forEach(file => {
    const src = path.join(__dirname, 'app', file);
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

// Copia o conteúdo de cada dist/{target} para build/{target}
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

targets.forEach(target => {
  const srcDir = path.join(__dirname, 'build', target);
  const destDir = path.join(buildDir, target);
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, destDir);
    console.log(`Conteúdo copiado para: ${destDir}`);
  }
});

// Compacta o conteúdo de cada pasta build/{target} em build/compilados/{target}.zip
const compiladosDir = path.join(buildDir, 'zip-compilados');
if (!fs.existsSync(compiladosDir)) {
  fs.mkdirSync(compiladosDir, { recursive: true });
}

targets.forEach(target => {
  const srcDir = path.join(buildDir, target);
  const zipPath = path.join(compiladosDir, `${target}.zip`);
  if (fs.existsSync(srcDir)) {
    try {
      // Remove o zip antigo se existir
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
      // Compacta usando o utilitário zip do sistema operacional
      // No Windows, o comando tar pode ser usado a partir do Windows 10
      // No Linux/Mac, o comando zip é comum
      // Aqui usamos tar para maior compatibilidade
      execSync(`tar -a -c -f "${zipPath}" -C "${srcDir}" .`);
      console.log(`Compactado: ${zipPath}`);
    } catch (err) {
      console.error(`Erro ao compactar ${srcDir}:`, err);
    }
  }
});

console.log('Cópia de arquivos e compactação concluídas. Os arquivos zip estão em build/compilados.');

