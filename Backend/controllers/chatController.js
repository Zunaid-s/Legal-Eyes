import Document from '../model/Document.js';
import ProblematicClause from '../model/ProblematicClause.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const doc = await Document.findById(id);
        const clauses = await ProblematicClause.find({ documentId: id });

        if (!doc) return res.status(404).json({ message: "Document not found" });

        if (!req.session.chatHistory) {
            req.session.chatHistory = [];
        }
        req.session.chatHistory.push(`User: ${message}`);

        const context = `
            You are a legal assistant. 
            Document Filename: ${doc.filename}
            Identified Issues: ${clauses.map(c => `Clause: "${c.originalClause}" - Issue: ${c.issueDescription}`).join(" | ")}
            Previous conversations: ${req.session.chatHistory.slice(-10).join(" | ")}
            User Question: ${message}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(context);
        const response = await result.response;

        res.status(200).json({ reply: response.text() });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};