import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512
};

// Usar rutas absolutas
const sourceImage = path.resolve(__dirname, '..', 'public', 'Isotipo Hawkview (2).png');
const outputDir = path.resolve(__dirname, '..', 'public');

console.log('Source image path:', sourceImage);
console.log('Output directory:', outputDir);

async function generateFavicons() {
  try {
    // Verificar que el archivo fuente existe
    if (!fs.existsSync(sourceImage)) {
      throw new Error(`Source image not found at: ${sourceImage}`);
    }

    // Asegurarse de que el directorio de salida existe
    if (!fs.existsSync(outputDir)) {
      console.log('Creating output directory:', outputDir);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generar cada tamaño
    for (const [filename, size] of Object.entries(sizes)) {
      const outputPath = path.join(outputDir, filename);
      console.log(`Generating ${filename} (${size}x${size})...`);
      
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(outputPath);
      
      console.log(`✅ Generated ${filename} at ${outputPath}`);
    }

    // Generar favicon.ico
    const icoPath = path.join(outputDir, 'favicon.ico');
    console.log('Generating favicon.ico...');
    
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(icoPath);

    console.log(`✅ Generated favicon.ico at ${icoPath}`);
    console.log('🎉 All favicons generated successfully!');

  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons(); 