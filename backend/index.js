import {
  getHTML,
  getTwitterFollowers,
  getInstagramFollowers,
} from './lib/scraper';

async function go() {
  const twPromise = getHTML('https://twitter.com/devjmetivier');
  const iGPromise = getHTML('https://www.instagram.com/devinmetivier/');

  const [twHTML, igHTML] = await Promise.all([twPromise, iGPromise]);

  const twCount = await getTwitterFollowers(twHTML);
  const igCount = await getInstagramFollowers(igHTML);
  console.log({ twCount, igCount });
  // console.log(
  //   `You have ${igCount} Instagram followers, and ${twCount} Twitter followers.`
  // );
}

go();
