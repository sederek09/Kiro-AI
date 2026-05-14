/**
 * Canva API Helper
 * Script untuk berinteraksi dengan Canva API
 * 
 * Penggunaan:
 * - Buat desain: node canva.js create "Judul Desain" 1920 1080
 * - List desain: node canva.js list
 * - Get desain: node canva.js get <design_id>
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load token dari .env
function loadToken() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/CANVA_TOKEN=(.+)/);
    if (match) return match[1].trim();
  }
  throw new Error('CANVA_TOKEN tidak ditemukan di file .env');
}

const CANVA_TOKEN = loadToken();
const API_BASE = 'https://api.canva.com/rest/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${CANVA_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Fungsi untuk membuat desain baru
async function createDesign(title, width = 1920, height = 1080) {
  try {
    const response = await api.post('/designs', {
      title,
      design_type: {
        type: 'custom',
        width: parseInt(width),
        height: parseInt(height)
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

// Fungsi untuk mendapatkan detail desain
async function getDesign(designId) {
  try {
    const response = await api.get(`/designs/${designId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

// Fungsi untuk list desain (via folders)
async function listDesigns() {
  try {
    const response = await api.get('/folders/root/items');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

// Fungsi untuk mendapatkan profil user
async function getProfile() {
  try {
    const response = await api.get('/users/me/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

// Export untuk digunakan oleh Kiro
module.exports = {
  createDesign,
  getDesign,
  listDesigns,
  getProfile,
  loadToken
};

// CLI handler
if (require.main === module) {
  const [,, command, ...args] = process.argv;
  
  async function main() {
    try {
      switch (command) {
        case 'create':
          const [title, width, height] = args;
          if (!title) {
            console.log('Usage: node canva.js create "Judul" [width] [height]');
            process.exit(1);
          }
          const design = await createDesign(title, width || 1920, height || 1080);
          console.log('✅ Desain berhasil dibuat!');
          console.log(JSON.stringify(design, null, 2));
          break;
          
        case 'get':
          const [designId] = args;
          if (!designId) {
            console.log('Usage: node canva.js get <design_id>');
            process.exit(1);
          }
          const detail = await getDesign(designId);
          console.log(JSON.stringify(detail, null, 2));
          break;
          
        case 'list':
          const designs = await listDesigns();
          console.log(JSON.stringify(designs, null, 2));
          break;
          
        case 'profile':
          const profile = await getProfile();
          console.log(JSON.stringify(profile, null, 2));
          break;
          
        default:
          console.log('Canva API Helper');
          console.log('================');
          console.log('Commands:');
          console.log('  create "Judul" [width] [height] - Buat desain baru');
          console.log('  get <design_id>                 - Lihat detail desain');
          console.log('  list                            - List semua desain');
          console.log('  profile                         - Lihat profil user');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }
  
  main();
}
