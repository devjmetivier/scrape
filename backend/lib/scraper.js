import axios from 'axios';
import cheerio from 'cheerio';
import { initDB } from './db';

const igSharedDataRegex = /window._sharedData = (\{.+\})/im;

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function getTwitterFollowers(html) {
  const $ = cheerio.load(html);
  const span = $('[data-nav="followers"] .ProfileNav-value');
  return span.data('count');
}

async function getInstagramFollowers(html) {
  const $ = cheerio.load(html);
  const data = $('span#react-root + script').html();
  const matches = data.match(igSharedDataRegex);
  const obj = JSON.parse(matches[1]);

  // Instagram data structure for followers:
  // obj.entry_data.ProfilePage[0].graphql.user.edge_followed_by
  const { count } = obj.entry_data.ProfilePage[0].graphql.user.edge_followed_by;

  return count;
}

export { getHTML, getTwitterFollowers, getInstagramFollowers };

export async function getTwitterCount() {
  const html = await getHTML('https://twitter.com/devjmetivier');
  const twCount = await getTwitterFollowers(html);
  return twCount;
}

export async function getInstagramCount() {
  const html = await getHTML('https://www.instagram.com/devinmetivier/');
  const igCount = await getInstagramFollowers(html);
  return igCount;
}

export async function runCron() {
  const [igCount, twCount] = await Promise.all([
    getInstagramCount(),
    getTwitterCount(),
  ]);

  initDB().then(db => {
    db.get('twitter')
      .push({ date: Date.now(), count: twCount })
      .write();

    db.get('instagram')
      .push({ date: Date.now(), count: igCount })
      .write();
  });
}
