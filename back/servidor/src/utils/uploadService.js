import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const usarCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (usarCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('☁️  Modo de Upload: Cloudinary (Nuvem Ativa)');
} else {
  console.log('📂 Modo de Upload: Local (Pasta /uploads)');
}

export const uploadImagem = async (base64String, pastaCloudinary = 'agri_rslab') => {
  if (!base64String || !base64String.startsWith('data:image')) {
    return base64String; // Retorna o que veio se não for base64 válido
  }

  if (usarCloudinary) {
    const resultado = await cloudinary.uploader.upload(base64String, {
      folder: pastaCloudinary,
      transformation: [{ width: 800, height: 600, crop: 'limit' }]
    });
    return resultado.secure_url;
  } else {
    const base64Data = base64String.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    const uploadDir = path.join(process.cwd(), '..', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filename = `imagem-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    return `/uploads/${filename}`;
  }
};

export const deletarImagem = async (urlImagem, pastaCloudinary = 'agri_rslab') => {
  if (!urlImagem) return;

  if (usarCloudinary && urlImagem.includes('cloudinary')) {
    const publicId = urlImagem.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`${pastaCloudinary}/${publicId}`).catch(() => {});
  } else if (urlImagem.startsWith('/uploads/') || urlImagem.includes('/uploads/')) {
    const filename = urlImagem.split('/').pop();
    const filepath = path.join(process.cwd(), '..', 'uploads', filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
};