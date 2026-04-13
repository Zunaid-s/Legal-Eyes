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
      Legal Text:
      ${document.textContent}
    `;

    const result = await geminiModel.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    const clauses = parsed.problematicClauses;

    if (!Array.isArray(clauses)) {
      throw new Error("Invalid response from Gemini");
    }

    const clauseRecords = clauses.map((clause) => ({
      documentId: document._id,
      originalClause: clause.originalClause,
      issueDescription: clause.issueDescription,
      suggestion: clause.suggestion,
      severity: clause.severity || "MEDIUM",
    }));

    // B3: Load the Gemini array securely into Mongoose
    const savedClauses = await ProblematicClause.insertMany(clauseRecords);
    const clauseIds = savedClauses.map(c => c._id);
    await Document.findByIdAndUpdate(documentId, { 
      status: "COMPLETED",
      $push: { problematicClauses: { $each: clauseIds } } 
    });

    return res.status(200).json({
      message: "Analysis complete and mapped",
      documentId: document._id,
      status: "COMPLETED",
      totalClauses: savedClauses.length,
      problematicClauses: savedClauses,
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    await Document.findByIdAndUpdate(documentId, { status: "FAILED" });
    return res.status(500).json({ error: "Analysis failed", documentId, status: "FAILED" });
  }
};

const createAndMapClause = async (req, res) => {
    try {
        const { docId, text, reason, severity, suggestion } = req.body;
        const newClause = await ProblematicClause.create({
            originalClause: text,
            issueDescription: reason,
            suggestion: suggestion || "No suggestion provided",
            severity: severity || "MEDIUM",
            documentId: docId 
        });
        await Document.findByIdAndUpdate(docId, {
            $push: { problematicClauses: newClause._id }
        });

        res.status(201).json({ message: "Clause created and linked successfully!", data: newClause });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDocumentAnalysis = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        
        // B2: Grab the Problematic clauses mapped to the requested document
        const clauses = await ProblematicClause.find({ documentId: id });
        return res.status(200).json({ document, clauses });
    } catch (error) {
        console.error("Polling Error:", error);
        return res.status(500).json({ error: "Failed to retrieve analysis", details: error.message });
    }
};

export default { analyzeDocument, createAndMapClause, getDocumentAnalysis };