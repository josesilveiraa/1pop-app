import cron from 'node-cron';
import logger from '../../util/logger';

import Key from '../model/Key';

class Scheduler {
  schedule = () => {
    // Minutes, hours, day of month, month, day of week

    cron.schedule('* * 1 * *', async () => {
      logger.info('Running expired gifts deletion cron job...');
      const keys = await Key.find();
      const now = new Date();

      keys.forEach(async (key) => {
        const { expirationDate } = key;

        if (now > expirationDate) {
          await key.deleteOne();
        }
      });
    });
  };
}

export default new Scheduler();
