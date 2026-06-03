import dns from 'node:dns';
import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);

    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB bağlantısı başarılı');
      return;
    }

    const user = encodeURIComponent(process.env.MONGODB_USER);
    const pwd = encodeURIComponent(process.env.MONGODB_PASSWORD);
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    if (!user || !pwd || !url || !db) {
      throw new Error(
        'MongoDB bağlantı bilgileri eksik. .env dosyasını kontrol edin.',
      );
    }

    const uri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantısı sırasında hata oluştu:', error);
    process.exit(1);
  }
};
