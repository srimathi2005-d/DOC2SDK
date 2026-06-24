import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeDocumentation(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    $('script, style, noscript, nav, header, footer, iframe, svg, img').remove();

    let content = '';
    const mainSelectors = ['main', 'article', '.content', '#content', '.main', '.documentation', '.docs'];
    
    for (const selector of mainSelectors) {
      if ($(selector).length > 0) {
        content = $(selector).text();
        break;
      }
    }

    if (!content) {
      content = $('body').text();
    }

    content = content.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
    return content.substring(0, 30000); // 30k char limit for prompt safety

  } catch (error) {
    console.error(`Scraping failed for ${url}:`, error.message);
    throw new Error(`Could not scrape documentation URL: ${error.message}`);
  }
}
