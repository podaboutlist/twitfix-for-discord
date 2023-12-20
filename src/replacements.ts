// import dotenv from "dotenv";
// dotenv.config();

function logReplacement(fName: string, original: string, replacement: string) {
  if (!process.env.LINKFIX_LOGGING) {
    return;
  }

  console.log(`> [${fName}()] replacing ${original} -> ${replacement}`);
}

// NOTE: regexp must have the 'g' flag or else `matchAll` will throw
function getUrls(content: string, regexp: RegExp): Array<string> {
  const urls: Array<string> = [];
  for (const matches of content.matchAll(regexp)) {
    const url = matches[0];
    urls.push(url);
  }
  return urls;
}

function fixYTShortsURL(content: string): string {
  let c = content.replace(/(www\.)?(youtube.com\/shorts\/)/, "youtu.be/");
  c = c.replace(/\?.*/, "");

  logReplacement("fixYTShortsURL", content, c);

  return c;
}

function fixTwitterURL(content: string): string {
  let c = content.replace(
    /\/\/(x|twitter).com\//,
    `//${process.env.FXTWITTER_URL}/`,
  );
  // TODO: Configure a more robust way of stripping all the tracking crap off
  //       of YouTube URLS (currently `(?|&)si=<trackingid>`)
  c = c.replace(/\?.*/, "");

  logReplacement("fixTwitterURL", content, c);

  return c;
}

function fixInstagramURL(content: string): string {
  let c = content.replace(/(www\.)?(instagram.com\/)/, "ddinstagram.com/");

  logReplacement("fixInstagramURL", content, c);

  return c;
}

function fixTikTokURL(content: string): string {
  let c = content.replace(/(tiktok.com\/)/, "vxtiktok.com/");

  logReplacement("fixTikTokURL", content, c);

  return c;
}

export const replacements: {
  [identifier: string]: (content: string) => string | null;
} = {
  "x.com/": (content) => {
    const urls = getUrls(
      content,
      /https?:\/\/x\.com\/(\w){1,15}\/status\/[^\s]+/g,
    );
    if (urls.length > 0) {
      return urls.map((url) => fixTwitterURL(url)).join("\n");
    } else {
      return null;
    }
  },
  "twitter.com/": (content) => {
    const urls = getUrls(
      content,
      /https?:\/\/twitter\.com\/(\w){1,15}\/status\/[^\s]+/g,
    );
    if (urls.length > 0) {
      return urls.map((url) => fixTwitterURL(url)).join("\n");
    } else {
      return null;
    }
  },
  "youtube.com/shorts/": (content) => {
    const urls = getUrls(content, /https?:\/\/(www\.)?youtube\.com\/[^\s]+/g);
    if (urls.length > 0) {
      return urls.map((url) => fixYTShortsURL(url)).join("\n");
    } else {
      return null;
    }
  },
  "instagram.com/": (content) => {
    const urls = getUrls(content, /https?:\/\/(www\.)?instagram\.com\/[^\s]+/g);
    if (urls.length > 0) {
      return urls.map((url) => fixInstagramURL(url)).join("\n");
    } else {
      return null;
    }
  },
  "tiktok.com/": (content) => {
    const urls = getUrls(
      content,
      /https?:\/\/((www|vm)\.)?tiktok\.com\/[^\s]+/g,
    );
    if (urls.length > 0) {
      return urls.map((url) => fixTikTokURL(url)).join("\n");
    } else {
      return null;
    }
  },
};
