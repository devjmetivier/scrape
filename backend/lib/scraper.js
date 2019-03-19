import axios from 'axios';
import cheerio from 'cheerio';

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
  const reg = /window._sharedData = (\{.+\})/im;
  const json = data.match(reg);
  const obj = JSON.parse(json[1]);

  // Instagram data structure for followers:
  // obj.entry_data.ProfilePage[0].graphql.user.edge_followed_by
  const { count } = obj.entry_data.ProfilePage[0].graphql.user.edge_followed_by;

  return count;
}

export { getHTML, getTwitterFollowers, getInstagramFollowers };
