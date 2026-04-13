const { GoogleGenerativeAI } = require("@google/genai");
const { GoogleAIFileManager } = require("@google/genai");
const Document = require("../model/Document");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

const analyzeDocument = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Document file is required" });
    }

    const userId = req.user && req.user._id ? req.user._id : "000000000000000000000000";

    const documentRecord = await Document.create({
      filename: file.originalname,
      userId: userId,
      status: 'PROCESSING'
    });

    const uploadResult = await fileManager.uploadFile(file.path, {
      mimeType: file.mimetype,
      displayName: file.originalname,
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a legal document analyzer.
      Analyze the following legal text and identify all problematic clauses for a simple person.
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

      Legal Text:
      ${document.textContent}
    `;

    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType
        }
      }
    ]);

    const responseText = result.response.text();
    documentRecord.status = 'COMPLETED';
    await documentRecord.save();

    res.json(JSON.parse(responseText));

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Analysis failed", details: error.message });
  }
};

module.exports = { analyzeDocument };