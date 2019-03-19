import express from 'express';
import bodParser from 'body-parser';
import { getInstagramCount, getTwitterCount } from './lib/scraper';
import { initDB } from './lib/db';
import './lib/cron';

const app = express();
app.use(bodParser.json());

initDB().then(async db => {
  app.get('/scrape', async (req, res, next) => {
    console.log('Scraping!');
    const [igCount, twCount] = await Promise.all([
      getInstagramCount(),
      getTwitterCount(),
    ]);

    db.get('twitter')
      .push({ date: Date.now(), count: twCount })
      .write();

    db.get('instagram')
      .push({ date: Date.now(), count: igCount })
      .write();

    res.json({ igCount, twCount });
  });
});

const server = app.listen(2093, () =>
  console.log(`Example app running on port: ${server.address().port}`)
);
