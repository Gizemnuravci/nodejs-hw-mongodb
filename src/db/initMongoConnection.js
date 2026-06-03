import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    const uri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantısı sırasında hata oluştu:', error);
    process.exit(1);
  }
};
