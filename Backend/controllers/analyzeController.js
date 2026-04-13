import { GoogleGenerativeAI } from "@google/generative-ai";
import Document from "../model/Document.js";
import ProblematicClause from "../model/ProblematicClause.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeDocument = async (req, res) => {
  const { documentId } = req.body;

  if (!documentId) {
    return res.status(400).json({ error: "documentId is required" });
  }

  let document;
  try {
    document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid documentId" });
  }
  if (!document.textContent) {
    return res.status(400).json({ error: "Document has no text content to analyze" });
  }

  await Document.findByIdAndUpdate(documentId, { status: "PROCESSING" });

  try {
   
    const geminiModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      You are a legal document analyzer.
      Analyze the following legal text and identify all problematic clauses.
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

    const result = await geminiModel.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    const clauses = parsed.problematicClauses;

    if (!Array.isArray(clauses)) {
      throw new Error("Invalid response from Gemini");
    }

    const savedClauses = await Promise.all(
      clauses.map((clause) =>
        ProblematicClause.create({
          documentId: document._id,
          originalClause: clause.originalClause,
          issueDescription: clause.issueDescription,
          suggestion: clause.suggestion,
          severity: clause.severity,
        })
      )
    );

    await Document.findByIdAndUpdate(documentId, { status: "COMPLETED" });

    return res.status(200).json({
      message: "Analysis complete",
      documentId: document._id,
      status: "COMPLETED",
      totalClauses: savedClauses.length,
      problematicClauses: savedClauses,
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    await Document.findByIdAndUpdate(documentId, { status: "FAILED" });

    return res.status(500).json({
      error: "Analysis failed",
      documentId,
      status: "FAILED",
    });
  }
};

export default { analyzeDocument };
