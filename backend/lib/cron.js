import cron from 'node-cron';
import { runCron } from './scraper';

cron.schedule('* * * * *', () => {
  console.log('running cron');
  runCron().catch(err => console.log(err));
});
