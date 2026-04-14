import { GoogleGenerativeAI } from '@google/generative-ai';
import Document from '../model/Document.js';
import ProblematicClause from '../model/ProblematicClause.js';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Gemini quota and downtime guard
const geminiGuard = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    const msg = error?.message?.toLowerCase() || '';
    const status = error?.status;
    const timestamp = new Date().toISOString();

    if (status === 429 || msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource_exhausted')) {
      console.error(`[${timestamp}] ⚠️ Gemini QUOTA exceeded:`, error.message);
      throw { type: 'QUOTA_EXCEEDED', status: 429, message: 'Gemini API quota exceeded. Please try again later.' };
    }
    if (status === 503 || status === 500 || msg.includes('unavailable') || msg.includes('overloaded')) {
      console.error(`[${timestamp}] 🔴 Gemini SERVICE DOWN:`, error.message);
      throw { type: 'SERVICE_UNAVAILABLE', status: 503, message: 'Gemini is currently unavailable. Please try again shortly.' };
    }

    console.error(`[${timestamp}] ❌ Gemini unknown error:`, error.message);
    throw error;
  }
};

const analyzeDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Document file is required' });

    const userId = req.user?.id || req.user?._id || '000000000000000000000000';

    const documentRecord = await Document.create({
      filename: file.originalname,
      userId,
      status: 'PROCESSING'
    });

    // Read file as base64
    const fileData = fs.readFileSync(file.path);
    const base64Data = fileData.toString('base64');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
      You are a legal document analyzer.
      Analyze the following legal document and identify all problematic clauses for a common person.
      Return response strictly in this JSON format:
      {
        "problematicClauses": [
          {
            "originalClause": "exact text from document",
            "issueDescription": "why this clause is problematic",
            "suggestion": "recommended fix",
            "severity": "HIGH" or "MEDIUM" or "LOW"
          }
        ]
      }
      Rules:
      - severity must be exactly HIGH, MEDIUM, or LOW
      - Return empty array if no problematic clauses found
      - No extra fields allowed
    `;

    const result = await geminiGuard(() =>
      model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.mimetype
          }
        }
      ])
    );

    const parsed = JSON.parse(result.response.text());
    const clauses = parsed.problematicClauses;

    if (!Array.isArray(clauses)) throw new Error('Invalid response from Gemini');

    const savedClauses = await Promise.all(
      clauses.map(clause =>
        ProblematicClause.create({
          documentId: documentRecord._id,
          originalClause: clause.originalClause,
          issueDescription: clause.issueDescription,
          suggestion: clause.suggestion,
          severity: clause.severity,
        })
      )
    );

    documentRecord.status = 'COMPLETED';
    documentRecord.problematicClauses = savedClauses.map(c => c._id);
    await documentRecord.save();

    return res.status(200).json({
      message: 'Analysis complete',
      documentId: documentRecord._id,
      status: 'COMPLETED',
      totalClauses: savedClauses.length,
      problematicClauses: savedClauses,
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    if (error.type === 'QUOTA_EXCEEDED') return res.status(429).json({ error: error.message });
    if (error.type === 'SERVICE_UNAVAILABLE') return res.status(503).json({ error: error.message });
    return res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
};

export default { analyzeDocument };