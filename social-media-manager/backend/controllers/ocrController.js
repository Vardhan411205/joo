const { createWorker } = require('tesseract.js');

const extractText = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(req.file.buffer);
    await worker.terminate();

    res.json({ text });
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ message: 'Failed to extract text' });
  }
};

module.exports = {
  extractText
}; 