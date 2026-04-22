import Document from '../model/Document.js';
import ProblematicClause from '../model/ProblematicClause.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, history } = req.body;
        const doc = await Document.findById(id);
        const clauses = await ProblematicClause.find({ documentId: id });

        if (!doc) return res.status(404).json({ message: "Document not found" });

        const context = `
            You are a legal assistant. Keep the responses small as if you are chatting with a naive user who doesn't understand the legal jargon and is trying to talk about the legal issues at the point of time. There is no need of highlighting the text with bold letters, you just have to hold a conversation and reply to answers which the user asks just like if someone is chatting in a chat. If the user changes their language, slowly adapt to the user's language.
            Document Filename: ${doc.filename}
            Identified Issues: ${clauses.map(c => `Clause: "${c.originalClause}" - Issue: ${c.issueDescription}`).join(" | ")}
            Previous conversations: ${history && history.length > 0 ? history.map(h => `${h.role}: ${h.text}`).join("\n") : 'None'}
            User Question: ${message}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            throw new Error("Empty response from AI");
        }

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};