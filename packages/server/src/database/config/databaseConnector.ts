import mongoose from 'mongoose';
import logger from '../../util/logger';

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    logger.info('Connected with the database.');
  } catch (err) {
    if (err) throw err;
  }
}
