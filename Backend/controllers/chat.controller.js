const Document = require('../models/Document');
const ProblematicClause = require('../models/ProblematicClause');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const doc = await Document.findById(id);
        const clauses = await ProblematicClause.find({ documentId: id });

        if (!doc) return res.status(404).json({ message: "Document not found" });

        const context = `
            You are a legal assistant. 
            Document Title: ${doc.title}
            Full Content: ${doc.content}
            Identified Issues: ${clauses.map(c => c.explanation).join(", ")}
            User Question: ${message}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(context);
        const response = await result.response;
        
        res.status(200).json({ reply: response.text() });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};