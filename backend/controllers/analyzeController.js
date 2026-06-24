import { scrapeDocumentation } from '../services/scraperService.js';
import { analyzeApiDocs } from '../services/analysisService.js';

export const analyzeDocs = async (req, res) => {
  const { url, useCase } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const scrapedContent = await scrapeDocumentation(url);
    
    if (!scrapedContent || scrapedContent.length < 50) {
      return res.status(400).json({ error: 'Failed to extract meaningful content from the URL.' });
    }

    const analysisData = await analyzeApiDocs(scrapedContent, url, useCase);

    res.json({ data: analysisData });

  } catch (error) {
    console.error('Analyze Controller Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during analysis.' });
  }
};
