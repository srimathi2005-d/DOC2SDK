import { generateWrapperCode } from '../services/codeGeneratorService.js';
import { saveGeneratedCode } from '../utils/fileDownloader.js';

export const generateSDK = async (req, res) => {
  const { apiData, language, useCase } = req.body;

  if (!apiData || !language) {
    return res.status(400).json({ error: 'apiData and language are required' });
  }

  try {
    const generationData = await generateWrapperCode(apiData, language, useCase);
    
    // Save to the generated folder
    const filename = generationData.filename || `client.${language === 'python' ? 'py' : language === 'java' ? 'java' : 'js'}`;
    const filePath = saveGeneratedCode(language, filename, generationData.wrapperCode);

    res.json({ 
      data: generationData,
      downloadPath: filePath
    });

  } catch (error) {
    console.error('Generate Controller Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during generation.' });
  }
};
